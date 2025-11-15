# Kitchen 19

Kitchen 19 is a full-stack application featuring a Node.js/Express backend and a React Native (Expo) mobile frontend. The project provides a platform for managing kitchen, marketplace, and educational functionalities.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Mobile App Setup](#mobile-app-setup)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- User authentication and authorization
- Course, assignment, and attendance management
- Marketplace and document sharing
- Real-time notifications and chat
- Payment integration (Pesapal)
- Admin dashboard and reporting
- Mobile app for end-users

---

## Project Structure

```
backend/
  src/
    controllers/      # Route controllers for business logic
    middleware/       # Express middlewares
    models/           # Mongoose models
    routes/           # API route definitions
    services/         # Service layer for business logic
    utils/            # Utility functions
    config/           # Configuration files
    socket/           # Socket.io logic
  scripts/            # Utility scripts (e.g., seeding)
  uploads/            # File uploads
  Dockerfile          # Docker configuration
  ecosystem.config.js # PM2 process manager config
  package.json        # Backend dependencies

mobile/
  src/
    _layout.tsx       # App layout
    index.tsx         # App entry point
  assets/             # Images and other assets
  app.json            # Expo configuration
  package.json        # Mobile dependencies
  tsconfig.json       # TypeScript configuration
```

---

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment variables:**
   - Create a `.env` file in the `backend` directory with your configuration (database, API keys, etc.).

3. **Run the server:**
   ```bash
   npm start
   ```
   - For development with auto-reload: `npm run dev`
   - For production: use `pm2` with `ecosystem.config.js`

4. **Testing:**
   ```bash
   npm test
   ```

---

## Mobile App Setup

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Start the Expo server:**
   ```bash
   npx expo start
   ```

3. **Run on device:**
   - Use the Expo Go app on your phone, or an emulator.

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.
