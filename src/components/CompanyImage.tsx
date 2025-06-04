import React, { useState, useEffect } from 'react';

interface CompanyImageProps {
  companyName?: string;
  nameSlug?: string;
}

const CompanyImage: React.FC<CompanyImageProps> = ({ companyName, nameSlug }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageExists, setImageExists] = useState(true);

  // Function to transform name_slug to the expected image filename format
  // e.g., 'freedom-power' -> 'Freedom_Power'
  const transformSlugToImageName = (slug: string): string => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('_');
  };

  useEffect(() => {
    if (!nameSlug) {
      setImageExists(false);
      return;
    }

    const baseImageName = transformSlugToImageName(nameSlug);
    const extensions = ['jpg', 'webp', 'png']; // Prioritize jpg as per directory listing
    let foundImage = false;

    const checkImage = (index: number) => {
      if (index >= extensions.length) {
        setImageExists(false); // No image found after trying all extensions
        return;
      }

      const currentExtension = extensions[index];
      const potentialSrc = `/processed_screenshots/${baseImageName}.${currentExtension}`;
      
      const img = new Image();
      img.src = potentialSrc;
      img.onload = () => {
        setImageSrc(potentialSrc);
        setImageExists(true);
        foundImage = true;
      };
      img.onerror = () => {
        checkImage(index + 1); // Try next extension
      };
    };

    checkImage(0); // Start checking with the first extension

  }, [nameSlug]);

  if (!imageExists || !imageSrc) {
    return null; // Don't render anything if image doesn't exist or src is not set
  }

  return (
    <div className="my-6 flex justify-center">
      <img 
        src={imageSrc} 
        alt={`${companyName || nameSlug} business image`} 
        className="max-w-full md:max-w-lg h-auto rounded-lg shadow-md object-contain"
      />
    </div>
  );
};

export default CompanyImage;