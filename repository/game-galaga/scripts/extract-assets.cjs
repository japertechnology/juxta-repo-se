const fs = require('fs');
const path = require('path');

// Directory containing JSON asset descriptors
const assetsDir = path.join(__dirname, '..', 'assets');

fs.readdirSync(assetsDir).forEach((file) => {
  if (!file.endsWith('.json')) return;
  const jsonPath = path.join(assetsDir, file);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Only process image assets that contain base64 image data
  if (data.type !== 'image' || !data.image || !data.file) return;

  const base64 = data.image.replace(/^data:image\/png;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  const outPath = path.join(assetsDir, data.file);
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated ${data.file}`);
});
