
# Kitchen 19

Kitchen 19 is a student-first institutional management platform that revolutionizes traditional academic systems. The app uses AI as its backbone to create an intelligent, intuitive experience for students, lecturers, and admins.

## Table of Contents

- [App Overview](#app-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Mobile App Setup](#mobile-app-setup)
- [Contributing](#contributing)
- [License](#license)

---

## App Overview

Kitchen 19 enables students to onboard in seconds via OAuth and upload their admission letter—AI extracts all profile data automatically. The platform organizes users into nested groups (Institution → Faculty → School → Department → Course → Year), creating structured communication channels.

Admins and class reps can add courses, upload syllabi, and structure the academic calendar. Timetables are created via drag-and-drop, and all previous materials persist as students advance. Each subject has its own AI chatbot trained on uploaded materials. Lecturers mark attendance via QR codes or location-based links. The app includes integrated online classes, assignment/exam management, notifications, an in-app browser, a social feed, and a student marketplace.

---

## Features

- AI-powered onboarding and document processing
- Hierarchical group management (Institution → Faculty → School → Department → Course → Year)
- Drag-and-drop timetable creation and editing
- Persistent academic materials across years
- AI chatbots for each subject, trained on course materials
- Attendance via QR code or geolocation
- Integrated online classes (Zoom-like)
- Assignment, CAT, and exam management with notifications
- In-app browser for institutional resources
- Social feed for cross-institutional student interaction
- Student marketplace for commerce
- Real-time notifications and chat

---

## Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Real-time:** Socket.io
- **AI:** OpenRouter/OpenAI integration
- **Deployment:** Vercel

---

## Project Structure

### Backend

```
backend/
   src/
      config/
         database.js
         ai.config.js          // OpenRouter/OpenAI switch config
         socket.config.js
      models/
         User.js               // Base user schema
         Student.js
         Lecturer.js
         Admin.js
         Institution.js
         Group.js              // Institution/Faculty/School/Dept/Course/Year hierarchy
         Course.js
         Subject.js
         Timetable.js
         Document.js
         Assignment.js
         Attendance.js
         Notification.js
         Post.js               // Social feed
         Marketplace.js
         OnlineClass.js
         Report.js
      controllers/
         auth.controller.js
         user.controller.js
         institution.controller.js
         group.controller.js
         course.controller.js
         timetable.controller.js
         document.controller.js
         assignment.controller.js
         attendance.controller.js
         notification.controller.js
         ai.controller.js      // AI chat, document processing, admission letter parsing
         onlineClass.controller.js
         social.controller.js
         marketplace.controller.js
         admin.controller.js   // Main admin approval, AI model switching
      ...
   scripts/                  # Utility scripts (e.g., seeding)
   uploads/                  # File uploads
   Dockerfile                # Docker configuration
   ecosystem.config.js       # PM2 process manager config
   package.json              # Backend dependencies
```

### Mobile (React Native + Expo)

```
mobile/
   src/
      components/
         common/
            Button.js
            Input.js
            Card.js
            Avatar.js
            Badge.js
            Loading.js
            ErrorMessage.js
            EmptyState.js
            Modal.js
            BottomSheet.js
            Dropdown.js
            SearchBar.js
            Tag.js
            Divider.js
         auth/
            OAuthButtons.js
            AdmissionLetterUpload.js
            ProfileCompletion.js
         dashboard/
            DashboardHeader.js
            QuickActions.js
            UpcomingClasses.js
            RecentNotifications.js
            StorageIndicator.js
         subjects/
            SubjectCard.js
            SubjectList.js
            SubjectDetails.js
            DocumentsList.js
            DocumentViewer.js
            AIChat.js
         timetable/
            TimetableGrid.js
            TimetableCard.js
            DaySchedule.js
            TimetableEditor.js (admin)
            ClassSlot.js
         assignments/
            ...
      _layout.tsx             # App layout
      index.tsx               # App entry point
   assets/                   # Images and other assets
   app.json                  # Expo configuration
   package.json              # Mobile dependencies
   tsconfig.json             # TypeScript configuration
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
