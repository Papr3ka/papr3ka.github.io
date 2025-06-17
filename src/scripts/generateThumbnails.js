const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../assets/photos');
const outputDir = path.join(__dirname, '../assets/thumbnails');

/* Settings
 * resolutionFactor = 4
 * quality = 80
 * to webp
*/
const resolutionFactor = 4; // Reduce resolution by factor
const quality = 80 // Adjust quality as needed

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(inputDir).forEach(async (file) => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, `thumb_${path.parse(file).name}.webp`);

  try {
    // Get original image metadata (width/height)
    const metadata = await sharp(inputPath).metadata();
    const newWidth = Math.round(metadata.width / resolutionFactor);
    const newHeight = Math.round(metadata.height / resolutionFactor);

    // Resize and compress
    await sharp(inputPath)
      .resize(newWidth, newHeight) // Reduce resolution by factor
      .webp({ quality: quality }) 
      .toFile(outputPath);

    console.log(`Generated: ${outputPath} (${newWidth}x${newHeight})`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});