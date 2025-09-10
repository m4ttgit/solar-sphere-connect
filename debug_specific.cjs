// Debug specific company matching
const fs = require('fs');
const path = require('path');

// Import the slugify function (simplified version)
function slugify(str) {
  const strWithoutDiacritics = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return strWithoutDiacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Generate possible filenames function (same as in CompanyImage)
function generatePossibleFilenames(companyName, nameSlug) {
  const filenames = [];
  const extensions = ['jpg', 'webp', 'png'];

  // Clean and normalize the inputs
  const cleanName = companyName?.replace(/[^\w\s]/g, '').trim() || '';
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

  // 5. Extract domain from company name if it looks like a domain
  const domainMatch = companyName?.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
  const domain = domainMatch ? domainMatch[1] : null;

  // Generate all possible combinations
  const baseNames = [
    pascalCase,
    nameAsIs,
    nameUnderscore,
    nameHyphen,
    cleanSlug,
    domain
  ].filter(Boolean);

  // Add number prefixes for some variations (common pattern)
  baseNames.forEach(baseName => {
    // Without prefix
    extensions.forEach(ext => {
      filenames.push(`${baseName}.${ext}`);
    });

    // With number prefix (try 1-5 as they're common)
    for (let i = 1; i <= 5; i++) {
      extensions.forEach(ext => {
        filenames.push(`${i}_${baseName}.${ext}`);
      });
    }
  });

  // Remove duplicates and return
  return [...new Set(filenames)];
}

// Test the specific case
const companyName = '1 By 1 Roof Solar & Paint';
const expectedSlug = slugify(companyName);
console.log('Company Name:', companyName);
console.log('Expected Slug:', expectedSlug);

const possibleFilenames = generatePossibleFilenames(companyName, expectedSlug);
console.log('\nGenerated filenames:');
possibleFilenames.forEach(filename => console.log(`  - ${filename}`));

// Check if the expected file exists
const expectedFile = '1_By_1_Roof_Solar_&_Paint.jpg';
const screenshotsDir = path.join(__dirname, 'public', 'processed_screenshots');

try {
  const files = fs.readdirSync(screenshotsDir);
  const exists = files.includes(expectedFile);
  console.log(`\nExpected file "${expectedFile}" exists: ${exists ? 'YES' : 'NO'}`);

  if (exists) {
    console.log('✅ File found in directory');
  } else {
    console.log('❌ File not found in directory');
    console.log('Files containing "1" and "roof":');
    const matchingFiles = files.filter(file =>
      file.toLowerCase().includes('1') &&
      file.toLowerCase().includes('roof')
    );
    matchingFiles.forEach(file => console.log(`  - ${file}`));
  }
} catch (error) {
  console.error('Error reading directory:', error.message);
}