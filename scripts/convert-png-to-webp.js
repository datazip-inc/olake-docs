const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertPngToWebp(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      await convertPngToWebp(fullPath);
    } else if (file.name.endsWith('.png')) {
      const webpPath = fullPath.replace(/\.png$/, '.webp');
      
      try {
        await sharp(fullPath)
          .webp({ quality: 85 })
          .toFile(webpPath);
        
        console.log(`Converted: ${fullPath} -> ${webpPath}`);
        
        // Delete original PNG
        fs.unlinkSync(fullPath);
        console.log(`Deleted: ${fullPath}`);
      } catch (error) {
        console.error(`Error converting ${fullPath}:`, error.message);
      }
    }
  }
}

const customersDir = path.join(__dirname, '../static/img/customers');
convertPngToWebp(customersDir)
  .then(() => {
    console.log('Conversion complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Conversion failed:', error);
    process.exit(1);
  });
