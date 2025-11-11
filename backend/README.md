# kitchen19 - backend

This document contains quick deployment guidance for the backend (Express + MongoDB + Socket.io).

Minimum requirements
- Node.js >= 18
- MongoDB (Atlas recommended)
- Environment variables (see `.env.example`)

Quick checklist before deploying
1. Set required environment variables in the target environment (DigitalOcean App Platform, Droplet, etc). Required:
   - MONGO_URI
   - JWT_SECRET
   - In production: CLERK_SECRET_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
2. Set `CORS_ORIGINS` and/or `SOCKET_ORIGINS` to a comma-separated list of allowed origins (example: `https://app.example.com,exp://192.168.1.2:19000`).
3. Decide upload strategy for large files:
   - For small files (<10MB) the server accepts in-memory uploads (default MAX_UPLOAD_SIZE=10MB).
   - For larger files, use direct-to-Cloudinary signed uploads from client, or implement server streaming.

Docker (recommended for App Platform or Droplet)

Build locally:
```bash
# from backend/
docker build -t kitchen19-backend:latest .
docker run -e MONGO_URI='<uri>' -e JWT_SECRET='secret' -p 4000:4000 kitchen19-backend:latest
```

Deploy to DigitalOcean App Platform (container)
1. Push your repo to GitHub.
2. Create an App on DO App Platform and choose "Container" or point it to the Dockerfile in this repo.
3. Set environment variables in the DO App settings using the values from `.env.example` (do NOT paste secrets into git).
4. Configure a scale plan: if you expect >1 instance, configure `REDIS_URL` and enable the socket.io Redis adapter (not included by default).

Deploy to a Droplet (PM2)
1. Provision a Droplet (Ubuntu) with Docker or Node installed.
2. Clone the repo and install dependencies: `npm ci` (or use the Dockerfile).
3. Use `ecosystem.config.js` with PM2: `pm2 start ecosystem.config.js --env production`.
4. Use Nginx as a reverse proxy (TLS via Let's Encrypt) to forward traffic to the app on port 4000.

Socket.io and scaling notes
- Socket.io works with a single instance. To scale horizontally, add a Redis adapter and set `REDIS_URL` in env.
- Ensure sticky sessions or the Redis adapter to propagate events across instances.

Health checks
- `GET /api/health` returns `{ status: 'ok' }`.
- Consider adding readiness/liveness endpoints in a later iteration.

Monitoring and logging
- Add Sentry and structured logging (pino/winston) for production; not configured by default.

Security
- Ensure `CORS_ORIGINS`/`SOCKET_ORIGINS` are set to production domains.
- Do not commit `.env`.

If you want, I can add:
- Streaming uploads to Cloudinary (to avoid memory buffering)
- Redis adapter wiring for socket.io
- Docker Compose for local development (Mongo + App)
- Example DigitalOcean App Platform configuration file
# Kitchen19 Backend

Minimal backend scaffold for the Kitchen19 app.

Quick start

1. Install dependencies

```powershell
cd C:\Users\ian\Desktop\kitchen19\backend
npm install
```

2. Set environment variables in `.env` (a sample is included).

3. Start in development (requires `nodemon` and `cross-env` installed via devDependencies):

```powershell
npm run dev
```

4. Health check:

```powershell
Invoke-RestMethod -Uri 'http://localhost:4000/api/health' -UseBasicParsing
```

Endpoints implemented (minimal stubs)
- POST /api/auth/oauth — minimal OAuth-like endpoint (send JSON { authProvider, authId, email, role? })
- POST /api/auth/upload-admission — protected; multipart form upload field `file` — parses admission letter (stub) and creates/updates student
- GET /api/auth/me — protected; returns user and student profile

OCR notes
- The backend now performs OCR using Tesseract. For PDFs we convert pages to images using `pdftoppm` (part of poppler) and run Tesseract per page.
- System dependencies required on the server/development machine:
	- Tesseract OCR binary (https://tesseract-ocr.github.io/) must be installed and available on PATH.
	- Poppler's `pdftoppm` (on Debian/Ubuntu: `apt install poppler-utils`; on macOS: `brew install poppler`; on Windows: install poppler and add to PATH).
- The OCR service uses `node-tesseract-ocr` and `pdftoppm` under the hood. If Tesseract or pdftoppm is missing, the service falls back to filename-based heuristics.

Clerk mobile -> backend flow (recommended)
- Mobile app uses Clerk SDK for authentication and obtains a Clerk session token after the user signs in.
- After sign-in, the mobile app POSTs the Clerk session token (or Clerk user id) to the backend endpoint, for example `POST /api/auth/clerk-login` or a dedicated verification endpoint.
- Backend options:
	1. Trust-and-create (fast): mobile posts Clerk-provided user info (clerkId, email, name). Backend creates/returns your app JWT. This is what `/api/auth/clerk-login` currently does, but it assumes the client only calls it after Clerk confirms the user.
	2. Server-side verification (recommended for security): mobile sends the Clerk session token to backend. Backend verifies the session token with Clerk's server API (requires Clerk API key) and fetches the verified user profile, then creates/returns your app JWT. I can add server-side Clerk verification if you provide Clerk API credentials in `.env` (CLERK_API_KEY).

Socket auth
- Socket namespaces require a valid app JWT at handshake (handshake.auth.token or query token). Example client usage:
	const socket = io('https://your-server/online-class', { auth: { token: '<JWT>' } });

Try it
- Ensure `tesseract` and `pdftoppm` are installed and on PATH before testing PDF OCR.

Sockets namespaces
- /online-class
- /chat
- /notifications
- /attendance

Notes
- This is a scaffold with minimal implementations. Replace the OCR, OAuth, and socket logic with production implementations as needed.
