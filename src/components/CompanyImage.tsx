import React, { useState, useEffect } from 'react';

interface CompanyImageProps {
  companyName?: string;
  nameSlug?: string;
  imageName?: string;
}

const CompanyImage: React.FC<CompanyImageProps> = ({ companyName, nameSlug, imageName }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageExists, setImageExists] = useState(true);

  // Function to generate multiple possible filename variations
  const generatePossibleFilenames = (companyName: string, nameSlug: string): string[] => {
    const filenames: string[] = [];
    const extensions = ['jpg', 'webp', 'png'];

    // Clean and normalize the inputs, but preserve common special characters like &
    const cleanName = companyName?.replace(/[^\w\s&]/g, '').trim() || '';
    const cleanSlug = nameSlug?.replace(/[^\w-]/g, '') || '';

    // 1. Original slug transformation (current method)
    const pascalCase = cleanSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('_');

    // 2. Company name as-is (for domain-based names)
    const nameAsIs = cleanName.replace(/\s+/g, '');

    // 3. Company name with spaces replaced by underscores
    const nameUnderscore = cleanName.replace(/\s+/g, '_');

    // 4. Company name with spaces replaced by hyphens
    const nameHyphen = cleanName.replace(/\s+/g, '-');

    // 5. Original company name with minimal cleaning (preserve & and other common chars)
    const originalName = companyName?.replace(/[^\w\s&.-]/g, '').trim() || '';
    const originalUnderscore = originalName.replace(/\s+/g, '_');

    // 6. Extract domain from company name if it looks like a domain
    const domainMatch = companyName?.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
    const domain = domainMatch ? domainMatch[1] : null;

    // 7. Extract potential domain from nameSlug (for cases where slug contains domain)
    const slugDomainMatch = nameSlug?.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
    const slugDomain = slugDomainMatch ? slugDomainMatch[1] : null;

    // 8. Create domain variations without TLD for broader matching
    const domainBase = domain ? domain.split('.')[0] : null;
    const slugDomainBase = slugDomain ? slugDomain.split('.')[0] : null;

    // 9. Handle cases where company name might be a domain (like "peopleschoicesolar.com")
    const potentialDomainFromName = companyName?.match(/^([a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})?)$/)?.[1];

    // 10. Extract multiple domains if present (for complex company names)
    const allDomains = companyName?.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g) || [];
    const allDomainBases = allDomains.map(d => d.split('.')[0]);

    // Generate all possible combinations
    const baseNames = [
      pascalCase,
      nameAsIs,
      nameUnderscore,
      nameHyphen,
      cleanSlug,
      domain,
      slugDomain,
      domainBase,
      slugDomainBase,
      originalName,
      originalUnderscore,
      potentialDomainFromName,
      ...allDomains,
      ...allDomainBases
    ].filter(Boolean);

    // Add number prefixes for some variations (common pattern)
    baseNames.forEach(baseName => {
      // With number prefix first (try 1-5 as they're common) - this is often the primary pattern
      for (let i = 1; i <= 5; i++) {
        extensions.forEach(ext => {
          filenames.push(`${i}_${baseName}.${ext}`);
        });
      }

      // Without prefix (fallback)
      extensions.forEach(ext => {
        filenames.push(`${baseName}.${ext}`);
      });
    });

    // Special handling for domain-based names - try these patterns with higher priority
    if (domain || slugDomain || potentialDomainFromName || allDomains.length > 0) {
      const domainNames = [domain, slugDomain, potentialDomainFromName, ...allDomains].filter(Boolean);

      domainNames.forEach(domainName => {
        // Try domain with number prefix (most common pattern)
        for (let i = 1; i <= 5; i++) {
          extensions.forEach(ext => {
            filenames.unshift(`${i}_${domainName}.${ext}`); // Add to front for higher priority
          });
        }

        // Try domain without prefix
        extensions.forEach(ext => {
          filenames.unshift(`${domainName}.${ext}`); // Add to front for higher priority
        });

        // Try domain base (without TLD) with number prefix
        const domainBase = domainName.split('.')[0];
        for (let i = 1; i <= 5; i++) {
          extensions.forEach(ext => {
            filenames.unshift(`${i}_${domainBase}.${ext}`); // Add to front for higher priority
          });
        }

        // Try domain base without prefix
        extensions.forEach(ext => {
          filenames.unshift(`${domainBase}.${ext}`); // Add to front for higher priority
        });
      });
    }

    // Remove duplicates and return
    const uniqueFilenames = [...new Set(filenames)];
    console.log('CompanyImage: After deduplication:', uniqueFilenames.length, 'unique filenames');
    return uniqueFilenames;
  };

  useEffect(() => {
    setImageExists(true);

    if (imageName) {
      const localImagePath = `/processed_screenshots/${imageName}`;
      setImageSrc(localImagePath);
      setImageExists(true);
      return;
    }

    if (!nameSlug) {
      setImageExists(false);
      return;
    }

    const possibleFilenames = generatePossibleFilenames(companyName || '', nameSlug);

    let foundImage = false;
    for (const filename of possibleFilenames) {
      const localImagePath = `/processed_screenshots/${filename}`;
      setImageSrc(localImagePath);
      foundImage = true;
      break; // Use the first possible filename for now
    }

    if (!foundImage) {
      setImageExists(false);
    }

  }, [nameSlug]);

  if (!imageExists || !imageSrc) {
    console.log('CompanyImage: Returning placeholder - imageExists:', imageExists, 'imageSrc:', imageSrc);
    // Return a placeholder with a subtle border instead of null
    return (
      <div className="my-6 flex justify-center">
        <div className="max-w-full md:max-w-lg h-64 rounded-lg border-2 border-gray-200 border-dashed flex items-center justify-center bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Company screenshot not available</p>
            <p className="text-xs mt-1">{companyName || nameSlug}</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('CompanyImage: Rendering image with src:', imageSrc);
  return (
    <div className="my-6 flex justify-center">
      <img
        src={imageSrc}
        alt={`${companyName || nameSlug} business image`}
        className="max-w-full md:max-w-lg h-auto rounded-lg shadow-md object-contain"
        onLoad={() => console.log('CompanyImage: Image loaded successfully:', imageSrc)}
        onError={() => console.log('CompanyImage: Image failed to load:', imageSrc)}
      />
    </div>
  );
};

export default CompanyImage;