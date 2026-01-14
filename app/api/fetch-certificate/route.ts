/**
 * API Route: Fetch Certificate Metadata
 * Fetches certificate page and extracts metadata using platform-specific extractors
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseCertificateUrl } from '@/lib/certificate-parser';
import { extractCertificateMetadata, formatCertificateDate, CertificateMetadata } from '@/lib/certificate-metadata-extractor';

// Rate limiting - simple in-memory store (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  return true;
}

/**
 * Special handler for Credly - they provide a JSON API!
 */
async function fetchCredlyJson(badgeId: string): Promise<CertificateMetadata | null> {
  try {
    const jsonUrl = `https://www.credly.com/badges/${badgeId}.json`;
    const response = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ResumeBuilder/1.0)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    return {
      name: data.badge?.name || data.name,
      issuer: data.badge?.issuer?.name || data.issuer?.name,
      completionDate: data.issued_at,
      expirationDate: data.expires_at,
      description: data.badge?.description || data.description,
      skills: data.badge?.skills || data.skills,
      thumbnailUrl: data.badge?.image_url || data.image_url
    };
  } catch (error) {
    console.error('Error fetching Credly JSON:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { url } = body;
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request. URL is required.' },
        { status: 400 }
      );
    }
    
    // Parse the certificate URL
    const parsed = parseCertificateUrl(url);
    
    if (!parsed.isValid || !parsed.platform?.detected) {
      return NextResponse.json(
        { error: 'Unable to detect certificate platform from URL.' },
        { status: 400 }
      );
    }
    
    const { platform } = parsed;
    
    // Special handling for Credly - use their JSON API
    if (platform.name === 'Credly' && platform.credentialId) {
      const credlyData = await fetchCredlyJson(platform.credentialId);
      
      if (credlyData) {
        return NextResponse.json({
          success: true,
          platform: platform.name,
          metadata: {
            name: credlyData.name,
            issuer: credlyData.issuer,
            completionDate: formatCertificateDate(credlyData.completionDate),
            expirationDate: credlyData.expirationDate ? formatCertificateDate(credlyData.expirationDate) : undefined,
            description: credlyData.description,
            skills: credlyData.skills,
            thumbnailUrl: credlyData.thumbnailUrl
          }
        });
      }
      // If JSON fetch fails, fall through to HTML scraping
    }
    
    // For other platforms, fetch the HTML page
    let html: string;
    try {
      const response = await fetch(parsed.normalizedUrl || url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        // Timeout after 10 seconds
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch certificate page. Status: ${response.status}` },
          { status: 502 }
        );
      }
      
      html = await response.text();
      
    } catch (error) {
      console.error('Error fetching certificate page:', error);
      return NextResponse.json(
        { error: 'Failed to fetch certificate page. The website may be blocking requests or is unreachable.' },
        { status: 502 }
      );
    }
    
    // Extract metadata using platform-specific extractors
    const metadata = await extractCertificateMetadata(platform.name, url, html);
    
    // Format the date to YYYY-MM format
    const formattedDate = formatCertificateDate(metadata.completionDate);
    
    // Return the extracted metadata
    return NextResponse.json({
      success: true,
      platform: platform.name,
      metadata: {
        name: metadata.name,
        issuer: metadata.issuer,
        completionDate: formattedDate,
        expirationDate: metadata.expirationDate ? formatCertificateDate(metadata.expirationDate) : undefined,
        description: metadata.description,
        skills: metadata.skills,
        thumbnailUrl: metadata.thumbnailUrl
      }
    });
    
  } catch (error) {
    console.error('Error in fetch-certificate API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
