const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const customersDir = path.join(__dirname, '../static/img/customers');

function findSVGFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findSVGFiles(fullPath));
    } else if (item.endsWith('.svg')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function convertSVGToWebP(svgPath) {
  const webpPath = svgPath.replace('.svg', '.webp');
  
  try {
    await sharp(svgPath)
      .webp({ quality: 90 })
      .toFile(webpPath);
    
    console.log(`✓ Converted: ${path.relative(customersDir, svgPath)} → ${path.relative(customersDir, webpPath)}`);
    return webpPath;
  } catch (error) {
    console.error(`✗ Failed to convert ${svgPath}:`, error.message);
    return null;
  }
}

async function main() {
  const svgFiles = findSVGFiles(customersDir);
  
  if (svgFiles.length === 0) {
    console.log('No SVG files found in customers directory');
    return;
  }
  
  console.log(`Found ${svgFiles.length} SVG file(s) to convert...\n`);
  
  for (const svgFile of svgFiles) {
    await convertSVGToWebP(svgFile);
  }
  
  console.log(`\n✓ Conversion complete!`);
}

main().catch(console.error);


