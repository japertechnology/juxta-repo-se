const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputZipPath = path.join(distDir, `galaga-${timestamp}.zip`);

const output = fs.createWriteStream(outputZipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Created ${outputZipPath} (${archive.pointer()} total bytes)`);
});

archive.on('error', err => {
  throw err;
});

archive.pipe(output);
archive.glob('**/*', {
  cwd: path.join(__dirname, '..'),
  ignore: ['node_modules/**', 'dist/**', '.git/**'],
});
archive.finalize();
