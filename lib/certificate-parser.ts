/**
 * Certificate Parser Utility
 * Handles URL parsing and platform detection for various certificate providers
 */

export interface CertificatePlatform {
  name: string;
  detected: boolean;
  credentialId?: string;
  certificateType?: string;
  issuer?: string;
}

export interface ParsedCertificateUrl {
  isValid: boolean;
  platform?: CertificatePlatform;
  originalUrl: string;
  normalizedUrl?: string;
}

/**
 * Platform detection patterns
 */
const platformPatterns = [
  {
    name: 'Coursera',
    patterns: [
      /coursera\.org\/account\/accomplishments\/(certificate|specialization|professional-cert)\/([A-Z0-9]+)/i,
      /coursera\.org\/account\/accomplishments\/verify\/([A-Z0-9]+)/i,
      /coursera\.org\/verify\/([A-Z0-9]+)/i
    ],
    issuer: 'Coursera'
  },
  {
    name: 'Udemy',
    patterns: [
      /udemy\.com\/certificate\/(UC-[A-Z0-9-]+)/i,
      /ude\.my\/(UC-[A-Z0-9-]+)/i
    ],
    issuer: 'Udemy'
  },
  {
    name: 'Credly',
    patterns: [
      /credly\.com\/badges\/([a-z0-9-]+)/i
    ],
    issuer: 'Credly'
  },
  {
    name: 'edX',
    patterns: [
      /courses\.edx\.org\/certificates\/([a-z0-9]+)/i,
      /credentials\.edx\.org\/credentials\/([a-z0-9-]+)/i
    ],
    issuer: 'edX'
  },
  {
    name: 'LinkedIn Learning',
    patterns: [
      /linkedin\.com\/learning\/certificates\/([a-z0-9]+)/i
    ],
    issuer: 'LinkedIn Learning'
  },
  {
    name: 'Udacity',
    patterns: [
      /confirm\.udacity\.com\/([A-Z0-9]+)/i,
      /graduation\.udacity\.com\/confirm\/([A-Z0-9]+)/i
    ],
    issuer: 'Udacity'
  },
  {
    name: 'Google Cloud Skills Boost',
    patterns: [
      /cloudskillsboost\.google\/public_profiles\/[^\/]+\/badges\/([0-9]+)/i
    ],
    issuer: 'Google Cloud'
  },
  {
    name: 'HubSpot Academy',
    patterns: [
      /academy\.hubspot\.com\/certificates\/([a-z0-9]+)/i
    ],
    issuer: 'HubSpot Academy'
  },
  {
    name: 'Microsoft Learn',
    patterns: [
      /learn\.microsoft\.com\/.*\/credentials\/([a-z0-9-]+)/i
    ],
    issuer: 'Microsoft'
  },
  {
    name: 'AWS Certification',
    patterns: [
      /certmetrics\.com\/amazon\/public\/badge\.aspx.*ci=([A-Z0-9]+)/i,
      /credly\.com\/badges\/.*aws/i
    ],
    issuer: 'Amazon Web Services'
  }
];

/**
 * Parse a certificate URL and extract information
 */
export function parseCertificateUrl(url: string): ParsedCertificateUrl {
  if (!url || typeof url !== 'string') {
    return { isValid: false, originalUrl: url };
  }

  // Clean up the URL
  const trimmedUrl = url.trim();
  
  // Basic URL validation
  try {
    new URL(trimmedUrl);
  } catch {
    return { isValid: false, originalUrl: url };
  }

  // Try to match against known patterns
  for (const platform of platformPatterns) {
    for (const pattern of platform.patterns) {
      const match = trimmedUrl.match(pattern);
      
      if (match) {
        let credentialId = '';
        let certificateType = '';

        // Extract credential ID and type based on platform
        if (platform.name === 'Coursera') {
          if (match[2]) {
            // Pattern with type: /accomplishments/(type)/(id)
            certificateType = match[1]; // certificate, specialization, or professional-cert
            credentialId = match[2];
          } else if (match[1]) {
            // Pattern without type: /verify/(id) or /accomplishments/verify/(id)
            credentialId = match[1];
          }
        } else if (match[1]) {
          credentialId = match[1];
        }

        // Normalize URL (remove query params, trailing slashes)
        const normalizedUrl = trimmedUrl.split('?')[0].replace(/\/$/, '');

        return {
          isValid: true,
          originalUrl: url,
          normalizedUrl,
          platform: {
            name: platform.name,
            detected: true,
            credentialId,
            certificateType,
            issuer: platform.issuer
          }
        };
      }
    }
  }

  // URL is valid but platform not recognized
  return {
    isValid: true,
    originalUrl: url,
    normalizedUrl: trimmedUrl.split('?')[0].replace(/\/$/, ''),
    platform: {
      name: 'Unknown',
      detected: false
    }
  };
}

/**
 * Get a user-friendly display name for certificate types
 */
export function getCertificateTypeDisplay(type?: string): string {
  if (!type) return '';
  
  const typeMap: Record<string, string> = {
    'certificate': 'Certificate',
    'specialization': 'Specialization',
    'professional-cert': 'Professional Certificate',
    'professional-certificate': 'Professional Certificate'
  };

  return typeMap[type.toLowerCase()] || type;
}

/**
 * Check if a platform supports metadata fetching
 */
export function supportsMetadataFetching(platformName: string): boolean {
  const supportedPlatforms = [
    'Coursera',
    'Udemy',
    'Credly',
    'edX',
    'HubSpot Academy'
  ];
  
  return supportedPlatforms.includes(platformName);
}

/**
 * Get helpful message for platforms
 */
export function getPlatformHelpMessage(platformName: string): string {
  const messages: Record<string, string> = {
    'LinkedIn Learning': 'Note: LinkedIn Learning certificates may require authentication to fetch details.',
    'Udacity': 'Udacity certificates have limited metadata available.',
    'Google Cloud Skills Boost': 'Google Cloud badges may have limited metadata.',
    'Unknown': 'Platform not recognized. You can still enter details manually.'
  };

  return messages[platformName] || '';
}
