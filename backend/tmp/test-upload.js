const fs = require('fs');
const path = require('path');
const http = require('http');
const ocr = require('../src/services/ocr.service');

(async () => {
  try {
    const tmpDir = path.join(__dirname);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const samplePath = path.join(tmpDir, 'sample.pdf');
    fs.writeFileSync(samplePath, 'Test admission sample content');

    // Start a minimal static server to serve the file
    const server = http.createServer((req, res) => {
      if (req.url === '/sample.pdf') {
        const stat = fs.statSync(samplePath);
        res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Length': stat.size });
        fs.createReadStream(samplePath).pipe(res);
        return;
      }
      res.writeHead(404); res.end('Not found');
    }).listen(9000);

    console.log('Serving sample.pdf at http://localhost:9000/sample.pdf');

    // Give server a moment
    await new Promise(r => setTimeout(r, 200));

    // Run OCR on remote URL (this will use downloadToTemp internally)
    const url = 'http://localhost:9000/sample.pdf';
    console.log('Parsing remote URL via ocr.parseAdmissionLetter:', url);
    const parsed = await ocr.parseAdmissionLetter(url);
    console.log('Parsed result:', parsed);

    server.close();
    // cleanup
    try { fs.unlinkSync(samplePath); } catch (e) {}
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
})();