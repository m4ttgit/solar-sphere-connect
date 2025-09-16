import fs from 'fs';
import path from 'path';

// Read CSV file
const csvPath = 'd:/Projects/solar-sphere-connect/src/database/solarhub_db.csv';
const screenshotsDir = 'd:/Projects/solar-sphere-connect/public/processed_screenshots';

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }
  }
  return data;
}

function getAvailableImages() {
  const files = fs.readdirSync(screenshotsDir);
  return files.filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp'));
}

function generatePossibleFilenames(companyName, nameSlug, website) {
  const filenames = [];
  const extensions = ['jpg', 'webp', 'png'];
  
  // Clean inputs
  const cleanName = companyName?.replace(/[^\w\s&]/g, '').trim() || '';
  const cleanSlug = nameSlug?.replace(/[^\w-]/g, '') || '';
  
  // Generate variations
  const variations = [
    cleanSlug,
    cleanName.replace(/\s+/g, ''),
    cleanName.replace(/\s+/g, '_'),
    cleanName.replace(/\s+/g, '-'),
    website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  ].filter(Boolean);
  
  variations.forEach(variation => {
    extensions.forEach(ext => {
      filenames.push(`${variation}.${ext}`);
      // Try with number prefixes
      for (let i = 1; i <= 5; i++) {
        filenames.push(`${i}_${variation}.${ext}`);
      }
    });
  });
  
  return [...new Set(filenames)];
}

// Main execution
try {
  console.log('Reading CSV data...');
  const companies = parseCSV(csvPath);
  
  console.log('Getting available images...');
  const availableImages = getAvailableImages();
  
  console.log('Finding companies without images...');
  const companiesWithoutImages = [];
  
  companies.forEach(company => {
    const possibleFilenames = generatePossibleFilenames(
      company.name, 
      company.name_slug, 
      company.website
    );
    
    const hasImage = possibleFilenames.some(filename => 
      availableImages.includes(filename)
    );
    
    if (!hasImage) {
      companiesWithoutImages.push({
        name: company.name,
        name_slug: company.name_slug,
        website: company.website,
        url: `http://localhost:8080/directory/${company.name_slug}`
      });
    }
  });
  
  console.log(`\nFound ${companiesWithoutImages.length} companies without images:\n`);
  
  companiesWithoutImages.forEach((company, index) => {
    console.log(`${index + 1}. ${company.name}`);
    console.log(`   Slug: ${company.name_slug}`);
    console.log(`   URL: ${company.url}`);
    console.log(`   Website: ${company.website || 'N/A'}`);
    console.log('');
  });
  
  // Save to file
  const outputPath = 'd:/Projects/solar-sphere-connect/companies_without_images.json';
  fs.writeFileSync(outputPath, JSON.stringify(companiesWithoutImages, null, 2));
  console.log(`Results saved to: ${outputPath}`);
  
} catch (error) {
  console.error('Error:', error.message);
}