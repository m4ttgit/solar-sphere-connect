import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtjpbsfogcwqvgbllsqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Mzk3MjQsImV4cCI6MjA1ODIxNTcyNH0.5bU4C32vLSlHW-mmVcXIg1vMZb_o3_k-u5OIdpUxNLk';
const supabase = createClient(supabaseUrl, supabaseKey);

const screenshotsDir = 'd:/Projects/solar-sphere-connect/public/processed_screenshots';

function getAvailableImages() {
  const files = fs.readdirSync(screenshotsDir);
  return files.filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp'));
}

function generatePossibleFilenames(companyName, nameSlug, website) {
  const filenames = [];
  const extensions = ['jpg', 'webp', 'png'];
  
  const variations = [
    nameSlug,
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

async function findMissingImages() {
  try {
    console.log('Fetching companies from database...');
    
    const { data: companies, error } = await supabase
      .from('solarhub_db')
      .select('id, name, name_slug, website');
    
    if (error) throw error;
    
    console.log('Getting available images...');
    const availableImages = getAvailableImages();
    
    console.log('Finding companies without images...');
    const companiesWithoutImages = [];
    
    companies.forEach(company => {
      if (!company.name_slug) return; // Skip if no slug
      
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
    
    console.log(`\nFound ${companiesWithoutImages.length} companies without images out of ${companies.length} total companies\n`);
    
    // Show first 20 examples
    companiesWithoutImages.slice(0, 20).forEach((company, index) => {
      console.log(`${index + 1}. ${company.name}`);
      console.log(`   Slug: ${company.name_slug}`);
      console.log(`   URL: ${company.url}`);
      console.log(`   Website: ${company.website || 'N/A'}`);
      console.log('');
    });
    
    if (companiesWithoutImages.length > 20) {
      console.log(`... and ${companiesWithoutImages.length - 20} more companies`);
    }
    
    // Save to file
    const outputPath = 'd:/Projects/solar-sphere-connect/companies_without_images_clean.json';
    fs.writeFileSync(outputPath, JSON.stringify(companiesWithoutImages, null, 2));
    console.log(`\nComplete results saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findMissingImages();