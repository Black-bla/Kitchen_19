const multer = require('multer');
const os = require('os');
const path = require('path');
const Busboy = require('busboy');
const cloudinary = require('cloudinary').v2;

// Use disk storage to avoid buffering large files in memory. Files are written
// to the OS temp dir and can be removed after processing by callers.
const diskStorage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, os.tmpdir()),
	filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-z0-9.\-]/gi, '_')}`)
});

const allowedRegex = /jpeg|jpg|png|pdf|doc|docx/;
const fileFilter = (req, file, cb) => {
	const name = (file.originalname || '').toLowerCase();
	const mime = (file.mimetype || '').toLowerCase();
	const ok = allowedRegex.test(name) || allowedRegex.test(mime);
	if (ok) return cb(null, true);
	cb(new Error('Invalid file type. Allowed: images, PDFs, documents'));
};

// Default max upload size is 10MB
const maxUpload = parseInt(process.env.MAX_UPLOAD_SIZE || (10 * 1024 * 1024), 10);

const multerFallback = multer({ storage: diskStorage, limits: { fileSize: maxUpload }, fileFilter });

// Helper: upload field middleware that either streams directly to Cloudinary (if enabled)
// or falls back to multer disk upload. Usage: upload.single('file') in routes.
const useStream = (process.env.USE_STREAM_UPLOAD === 'true');

function single(fieldName) {
	if (!useStream) {
		return multerFallback.single(fieldName);
	}

	return (req, res, next) => {
		try {
			const bb = Busboy({ headers: req.headers, limits: { files: 1, fileSize: maxUpload } });

			let handled = false;
			let pendingUploads = 0;
			let bbDone = false;
			let finished = false;

			function tryFinish(err) {
				if (finished) return; // already finished
				if (err) {
					finished = true;
					return next(err);
				}
				if (bbDone && pendingUploads === 0) {
					finished = true;
					if (!handled) return next(new Error('No file uploaded'));
					return next();
				}
			}

			bb.on('file', (name, fileStream, info) => {
				const { filename, mimeType } = info;
				if (name !== fieldName) {
					// consume and ignore unexpected fields
					fileStream.resume();
					return;
				}

				// Basic validation
				const ok = allowedRegex.test((filename || '').toLowerCase()) || allowedRegex.test((mimeType || '').toLowerCase());
				if (!ok) {
					fileStream.resume();
					return tryFinish(new Error('Invalid file type. Allowed: images, PDFs, documents'));
				}

				handled = true;
				pendingUploads += 1;

				const options = { folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'uploads' };

				const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
					pendingUploads -= 1;
					if (err) return tryFinish(err);
					// Attach a minimal file object to req.file similar to multer
					req.file = {
						originalname: filename,
						mimetype: mimeType,
						url: result.secure_url,
						public_id: result.public_id,
						bytes: result.bytes,
						resource_type: result.resource_type
					};
					tryFinish();
				});

				// Propagate stream errors
				fileStream.on('error', (err) => tryFinish(err));
				uploadStream.on('error', (err) => tryFinish(err));

				// Pipe the incoming file stream to Cloudinary
				fileStream.pipe(uploadStream);
			});

			bb.on('finish', () => {
				bbDone = true;
				tryFinish();
			});

			bb.on('error', (err) => tryFinish(err));

			req.pipe(bb);
		} catch (err) {
			next(err);
		}
	};
}

module.exports = {
	single
};
