/**
 * Certificate Metadata Extractor
 * Platform-specific logic to extract certificate metadata from HTML/JSON
 */

export interface CertificateMetadata {
  name?: string;
  issuer?: string;
  completionDate?: string;
  description?: string;
  skills?: string[];
  thumbnailUrl?: string;
  expirationDate?: string;
}

/**
 * Extract OpenGraph meta tags from HTML
 */
function extractOpenGraphTags(html: string): Record<string, string> {
  const ogTags: Record<string, string> = {};
  
  // Match OpenGraph meta tags - flexible pattern to handle any attributes before/after
  // Handles: <meta property="og:title" content="..."/>
  // And: <meta data-react-helmet="true" property="og:title" content="..."/>
  const ogPattern = /<meta[^>]*property=["']og:([^"']+)["'][^>]*content=["']([^"']+)["']/gi;
  let match;
  
  while ((match = ogPattern.exec(html)) !== null) {
    ogTags[match[1]] = match[2];
  }
  
  // Also check for reversed attribute order: content before property
  const ogPattern2 = /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:([^"']+)["']/gi;
  
  while ((match = ogPattern2.exec(html)) !== null) {
    ogTags[match[2]] = match[1];
  }
  
  return ogTags;
}

/**
 * Extract JSON-LD structured data from HTML
 */
function extractJsonLD(html: string): any[] {
  const jsonLDBlocks: any[] = [];
  const pattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  
  while ((match = pattern.exec(html)) !== null) {
    try {
      const jsonData = JSON.parse(match[1]);
      jsonLDBlocks.push(jsonData);
    } catch (e) {
      // Invalid JSON, skip
    }
  }
  
  return jsonLDBlocks;
}

/**
 * Extract metadata from Credly badges
 * Credly provides a clean JSON API!
 */
export async function extractCredlyMetadata(url: string, html: string): Promise<CertificateMetadata> {
  const metadata: CertificateMetadata = {};
  
  try {
    // Try to get badge ID and fetch JSON directly
    const badgeIdMatch = url.match(/badges\/([a-z0-9-]+)/i);
    if (badgeIdMatch) {
      const badgeId = badgeIdMatch[1];
      const jsonUrl = `https://www.credly.com/badges/${badgeId}.json`;
      
      // Note: This would be fetched in the API route, not client-side
      // For now, we'll extract from HTML as backup
    }
    
    // Extract from OpenGraph
    const ogTags = extractOpenGraphTags(html);
    if (ogTags.title) {
      metadata.name = ogTags.title;
    }
    if (ogTags.image) {
      metadata.thumbnailUrl = ogTags.image;
    }
    
    // Extract from JSON-LD (Credly uses OpenBadges spec)
    const jsonLDBlocks = extractJsonLD(html);
    for (const block of jsonLDBlocks) {
      if (block['@type'] === 'EducationalOccupationalCredential' || block.badge) {
        if (block.name) metadata.name = block.name;
        if (block.badge?.name) metadata.name = block.badge.name;
        
        if (block.issuer?.name) metadata.issuer = block.issuer.name;
        if (block.badge?.issuer?.name) metadata.issuer = block.badge.issuer.name;
        
        if (block.dateCreated) metadata.completionDate = block.dateCreated;
        if (block.issued_at) metadata.completionDate = block.issued_at;
        
        if (block.expires_at) metadata.expirationDate = block.expires_at;
        if (block.description) metadata.description = block.description;
        
        if (block.skills) metadata.skills = block.skills;
      }
    }
    
    // Look for badge data in script tags
    const badgeDataPattern = /window\.badgeData\s*=\s*(\{[\s\S]*?\});/i;
    const badgeMatch = html.match(badgeDataPattern);
    if (badgeMatch) {
      try {
        const badgeData = JSON.parse(badgeMatch[1]);
        if (badgeData.badge?.name) metadata.name = badgeData.badge.name;
        if (badgeData.badge?.issuer?.name) metadata.issuer = badgeData.badge.issuer.name;
        if (badgeData.issued_at) metadata.completionDate = badgeData.issued_at;
      } catch (e) {
        // Failed to parse badge data
      }
    }
    
  } catch (error) {
    console.error('Error extracting Credly metadata:', error);
  }
  
  return metadata;
}

/**
 * Extract metadata from Coursera certificates
 */
export async function extractCourseraMetadata(url: string, html: string): Promise<CertificateMetadata> {
  const metadata: CertificateMetadata = {};
  
  try {
    // Extract from OpenGraph
    const ogTags = extractOpenGraphTags(html);
    if (ogTags.title) {
      // Coursera OG titles often include "Completion Certificate for [Course Name]"
      // Clean it up to just show the course name
      let courseName = ogTags.title;
      courseName = courseName.replace(/^Completion Certificate for\s*/i, '');
      courseName = courseName.replace(/^Certificate for\s*/i, '');
      metadata.name = courseName;
    }
    if (ogTags.image) {
      metadata.thumbnailUrl = ogTags.image;
    }
    
    // Extract description which might have more info
    if (ogTags.description) {
      metadata.description = ogTags.description;
    }
    
    // Extract from JSON-LD
    const jsonLDBlocks = extractJsonLD(html);
    for (const block of jsonLDBlocks) {
      if (block['@type'] === 'EducationalOccupationalCredential') {
        if (block.name) metadata.name = block.name;
        if (block.educationalLevel) metadata.description = block.educationalLevel;
        
        if (block.recognizedBy?.name) {
          metadata.issuer = block.recognizedBy.name;
        } else if (block.issuedBy?.name) {
          metadata.issuer = block.issuedBy.name;
        }
        
        if (block.dateCreated) metadata.completionDate = block.dateCreated;
      }
    }
    
    // Look for course data in page
    const titlePattern = /<h1[^>]*>(.*?)<\/h1>/i;
    const titleMatch = html.match(titlePattern);
    if (titleMatch && !metadata.name) {
      metadata.name = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Extract issuer from URL or content
    if (!metadata.issuer) {
      metadata.issuer = 'Coursera';
    }
    
  } catch (error) {
    console.error('Error extracting Coursera metadata:', error);
  }
  
  return metadata;
}

/**
 * Extract metadata from Udemy certificates
 */
export async function extractUdemyMetadata(url: string, html: string): Promise<CertificateMetadata> {
  const metadata: CertificateMetadata = {};
  
  try {
    // Extract from OpenGraph
    const ogTags = extractOpenGraphTags(html);
    if (ogTags.title) {
      metadata.name = ogTags.title;
    }
    if (ogTags.image) {
      metadata.thumbnailUrl = ogTags.image;
    }
    
    // Udemy issuer is always Udemy
    metadata.issuer = 'Udemy';
    
    // Look for certificate details in HTML
    const datePattern = /Date\s*[:]?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i;
    const dateMatch = html.match(datePattern);
    if (dateMatch) {
      metadata.completionDate = dateMatch[1];
    }
    
    // Alternative date pattern
    const datePattern2 = /(\d{1,2}\/\d{1,2}\/\d{4})/;
    const dateMatch2 = html.match(datePattern2);
    if (dateMatch2 && !metadata.completionDate) {
      metadata.completionDate = dateMatch2[1];
    }
    
  } catch (error) {
    console.error('Error extracting Udemy metadata:', error);
  }
  
  return metadata;
}

/**
 * Extract metadata from edX certificates
 */
export async function extractEdxMetadata(url: string, html: string): Promise<CertificateMetadata> {
  const metadata: CertificateMetadata = {};
  
  try {
    // Extract from OpenGraph
    const ogTags = extractOpenGraphTags(html);
    if (ogTags.title) {
      metadata.name = ogTags.title;
    }
    if (ogTags.image) {
      metadata.thumbnailUrl = ogTags.image;
    }
    
    // Extract from JSON-LD (edX has excellent structured data)
    const jsonLDBlocks = extractJsonLD(html);
    for (const block of jsonLDBlocks) {
      if (block['@type'] === 'EducationalOccupationalCredential') {
        if (block.name) metadata.name = block.name;
        if (block.description) metadata.description = block.description;
        
        if (block.issuedBy?.name) {
          metadata.issuer = block.issuedBy.name;
        } else if (block.provider?.name) {
          metadata.issuer = block.provider.name;
        }
        
        if (block.dateCreated) {
          metadata.completionDate = block.dateCreated;
        } else if (block.dateIssued) {
          metadata.completionDate = block.dateIssued;
        }
      }
    }
    
    // Fallback issuer
    if (!metadata.issuer) {
      metadata.issuer = 'edX';
    }
    
  } catch (error) {
    console.error('Error extracting edX metadata:', error);
  }
  
  return metadata;
}

/**
 * Extract metadata from HubSpot Academy certificates
 */
export async function extractHubSpotMetadata(url: string, html: string): Promise<CertificateMetadata> {
  const metadata: CertificateMetadata = {};
  
  try {
    // Extract from OpenGraph
    const ogTags = extractOpenGraphTags(html);
    if (ogTags.title) {
      metadata.name = ogTags.title;
    }
    if (ogTags.image) {
      metadata.thumbnailUrl = ogTags.image;
    }
    
    metadata.issuer = 'HubSpot Academy';
    
    // Look for dates in HTML
    const datePattern = /(?:Issued|Earned|Completed)[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i;
    const dateMatch = html.match(datePattern);
    if (dateMatch) {
      metadata.completionDate = dateMatch[1];
    }
    
    // HubSpot certificates often have expiration dates
    const expiryPattern = /(?:Expires|Valid until)[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i;
    const expiryMatch = html.match(expiryPattern);
    if (expiryMatch) {
      metadata.expirationDate = expiryMatch[1];
    }
    
  } catch (error) {
    console.error('Error extracting HubSpot metadata:', error);
  }
  
  return metadata;
}

/**
 * Main extraction function - routes to platform-specific extractors
 */
export async function extractCertificateMetadata(
  platformName: string,
  url: string,
  html: string
): Promise<CertificateMetadata> {
  
  switch (platformName) {
    case 'Credly':
      return extractCredlyMetadata(url, html);
    
    case 'Coursera':
      return extractCourseraMetadata(url, html);
    
    case 'Udemy':
      return extractUdemyMetadata(url, html);
    
    case 'edX':
      return extractEdxMetadata(url, html);
    
    case 'HubSpot Academy':
      return extractHubSpotMetadata(url, html);
    
    default:
      // Generic extraction for unknown platforms
      const metadata: CertificateMetadata = {};
      const ogTags = extractOpenGraphTags(html);
      
      if (ogTags.title) metadata.name = ogTags.title;
      if (ogTags.image) metadata.thumbnailUrl = ogTags.image;
      if (ogTags.description) metadata.description = ogTags.description;
      
      return metadata;
  }
}

/**
 * Format date string to a consistent format (YYYY-MM)
 */
export function formatCertificateDate(dateString?: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try to parse common formats
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      
      for (let i = 0; i < monthNames.length; i++) {
        if (dateString.includes(monthNames[i])) {
          const year = dateString.match(/\d{4}/)?.[0];
          if (year) {
            return `${year}-${String(i + 1).padStart(2, '0')}`;
          }
        }
      }
      
      return dateString; // Return as-is if can't parse
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
    
  } catch (error) {
    return dateString;
  }
}
