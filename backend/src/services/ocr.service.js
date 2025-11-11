const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
let tesseract;
try {
  // node-tesseract-ocr is a lightweight wrapper around the tesseract binary
  tesseract = require('node-tesseract-ocr');
} catch (e) {
  tesseract = null;
}

// Download a remote URL to a temp file and return the path.
function downloadToTemp(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    try {
      if (redirects > 5) return reject(new Error('Too many redirects'));
      const parsed = new URL(url);
      const httpMod = parsed.protocol === 'https:' ? require('https') : require('http');
      const tmpExt = path.extname(parsed.pathname) || '.bin';
      const tmpPath = path.join(os.tmpdir(), `ocr-download-${Date.now()}${tmpExt}`);

      const req = httpMod.get(parsed, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Resolve relative redirects
          const loc = new URL(res.headers.location, parsed).toString();
          return resolve(downloadToTemp(loc, redirects + 1));
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to download file, status ${res.statusCode}`));
        }

        const fileStream = fs.createWriteStream(tmpPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(() => resolve(tmpPath));
        });
        fileStream.on('error', (err) => {
          try { fs.unlinkSync(tmpPath); } catch (e) {}
          reject(err);
        });
      });
      req.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

// Helper: simple concurrency-limited map
async function mapLimit(inputs, limit, iterator) {
  const results = [];
  let i = 0;
  const workers = new Array(limit).fill(null).map(async () => {
    while (i < inputs.length) {
      const idx = i++;
      try {
        results[idx] = await iterator(inputs[idx], idx);
      } catch (err) {
        results[idx] = Promise.reject(err);
      }
    }
  });
  await Promise.all(workers);
  return results;
}

// Convert PDF to images using pdftoppm (part of poppler). Returns array of image paths.
function pdfToImages(pdfPath, outDir) {
  const prefix = path.join(outDir, 'page');
  // pdftoppm -png input.pdf prefix -> generates prefix-1.png, prefix-2.png
  execFileSync('pdftoppm', ['-png', pdfPath, prefix]);
  const files = fs.readdirSync(outDir).filter(f => f.startsWith('page') && f.endsWith('.png'))
    .map(f => path.join(outDir, f))
    .sort();
  return files;
}

// OCR for a single image path
async function ocrImage(imagePath, options = {}) {
  if (!tesseract) throw new Error('Tesseract wrapper not installed');
  const config = {
    lang: options.lang || 'eng',
    oem: options.oem != null ? options.oem : 1,
    psm: options.psm != null ? options.psm : 3
  };
  return await tesseract.recognize(imagePath, config);
}

// Use tesseract OCR for PDFs/images or fallback to filename heuristics
module.exports = {
  parseAdmissionLetter: async (fileOrPath, opts = {}) => {
    const concurrency = opts.concurrency || 2;
    const lang = opts.lang || 'eng';
    const psm = opts.psm || 3;
    let downloadedTmp = null;
    let result = {};
    try {
      // Accept a remote URL string or an object with .url, or local path/file object
      let filePath = null;
      if (typeof fileOrPath === 'string') {
        if (/^https?:\/\//i.test(fileOrPath)) {
          filePath = await downloadToTemp(fileOrPath);
          downloadedTmp = filePath;
        } else {
          filePath = fileOrPath;
        }
      } else if (fileOrPath && typeof fileOrPath === 'object') {
        if (fileOrPath.url && /^https?:\/\//i.test(fileOrPath.url)) {
          filePath = await downloadToTemp(fileOrPath.url);
          downloadedTmp = filePath;
        } else {
          filePath = fileOrPath.path || fileOrPath;
        }
      }

      const filename = path.basename(filePath || '');

      // If PDF and pdftoppm is available, convert to images first
      let images = [];
      if (filePath && filename.toLowerCase().endsWith('.pdf')) {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ocr-'));
        try {
          images = pdfToImages(filePath, tmpDir);
        } catch (err) {
          console.warn('pdftoppm conversion failed (is poppler installed?):', err.message);
          images = [];
        }
      } else if (filePath) {
        images = [filePath];
      }

      if (tesseract && images.length > 0) {
        // Run OCR on images with limited concurrency
        const pageTexts = await mapLimit(images, concurrency, async (img) => {
          return await ocrImage(img, { lang, psm });
        });
        const fullText = pageTexts.join('\n\f\n');
        const joined = fullText.replace(/\s+/g, ' ');

        const studentIdMatch = joined.match(/S\d{4,}|\b\d{5,}\b/);
        const nameMatch = joined.match(/([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
        const yearMatch = joined.match(/year\s*(\d)/i);
        const phoneMatch = joined.match(/\+?\d{9,15}/);

        // Cleanup images if they are in a temp dir
        if (images[0] && images[0].includes(os.tmpdir())) {
          try {
            images.forEach(f => { try { fs.unlinkSync(f); } catch (e) {} });
            try { fs.rmdirSync(path.dirname(images[0])); } catch (e) {}
          } catch (e) {}
        }

        result = {
          firstName: nameMatch ? nameMatch[1] : filename.split(/[\s_\-\.]/)[0] || 'First',
          lastName: nameMatch ? nameMatch[2] : filename.split(/[\s_\-\.]/)[1] || 'Last',
          studentId: studentIdMatch ? studentIdMatch[0] : ('S' + Date.now().toString().slice(-6)),
          phoneNumber: phoneMatch ? phoneMatch[0] : '',
          institutionId: null,
          faculty: '',
          school: '',
          department: '',
          course: null,
          yearOfStudy: yearMatch ? parseInt(yearMatch[1], 10) : 1,
          rawText: fullText
        };
      } else {
        // Fallback stub parsing using filename tokens
        const tokens = filename.replace(/[-_.]/g, ' ').split(' ');
        const firstName = tokens[0] || 'First';
        const lastName = tokens[1] || 'Last';
        result = {
          firstName,
          lastName,
          studentId: 'S' + Date.now().toString().slice(-6),
          phoneNumber: '',
          institutionId: null,
          faculty: '',
          school: '',
          department: '',
          course: null,
          yearOfStudy: 1,
          rawText: ''
        };
      }
    } catch (err) {
      console.error('OCR parse error:', err);
      result = {};
    } finally {
      // Remove any downloaded temp file
      if (downloadedTmp) {
        try { fs.unlinkSync(downloadedTmp); } catch (e) {}
      }
    }
    return result;
  }
};
