const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../assets/photos');
const outputDir = path.join(__dirname, '../assets/thumbnails');

/* Settings
 * targetMegapixels = 2 (for ~2MP thumbnails)
 * quality = 80
 * to webp
*/
const targetMegapixels = 2; // Target resolution in megapixels
const quality = 80; // Adjust quality as needed

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(inputDir).forEach(async (file) => {
  const inputPath = path.join(inputDir, file);
  const outputFileName = `thumb_${path.parse(file).name}.webp`;
  const outputPath = path.join(outputDir, outputFileName);

  // Skip if the thumbnail already exists
  if (fs.existsSync(outputPath)) {
    console.log(`Skipping ${file} - thumbnail already exists`);
    return;
  }

  try {
    // Get original image metadata
    const metadata = await sharp(inputPath).metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;
    const originalMegapixels = (originalWidth * originalHeight) / 1000000;

    // Only resize if original is larger than target
    if (originalMegapixels <= targetMegapixels) {
      console.log(`Skipping resize for ${file}`);
      return;
    }

    // Calculate scaling factor to reach target megapixels
    const scaleFactor = Math.sqrt(targetMegapixels / originalMegapixels);
    const newWidth = Math.round(originalWidth * scaleFactor);
    const newHeight = Math.round(originalHeight * scaleFactor);

    // Resize and compress
    await sharp(inputPath)
      .resize(newWidth, newHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: quality }) 
      .toFile(outputPath);

    console.log(`Generated: ${outputPath} (${newWidth}x${newHeight})`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});