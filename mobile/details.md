## Frontend File Structure (React Native + Expo)

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   ├── Avatar.js
│   │   │   ├── Badge.js
│   │   │   ├── Loading.js
│   │   │   ├── ErrorMessage.js
│   │   │   ├── EmptyState.js
│   │   │   ├── Modal.js
│   │   │   ├── BottomSheet.js
│   │   │   ├── Dropdown.js
│   │   │   ├── SearchBar.js
│   │   │   ├── Tag.js
│   │   │   └── Divider.js
│   │   │
│   │   ├── auth/
│   │   │   ├── OAuthButtons.js
│   │   │   ├── AdmissionLetterUpload.js
│   │   │   └── ProfileCompletion.js
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardHeader.js
│   │   │   ├── QuickActions.js
│   │   │   ├── UpcomingClasses.js
│   │   │   ├── RecentNotifications.js
│   │   │   └── StorageIndicator.js
│   │   │
│   │   ├── subjects/
│   │   │   ├── SubjectCard.js
│   │   │   ├── SubjectList.js
│   │   │   ├── SubjectDetails.js
│   │   │   ├── DocumentsList.js
│   │   │   ├── DocumentViewer.js
│   │   │   └── AIChat.js
│   │   │
│   │   ├── timetable/
│   │   │   ├── TimetableGrid.js
│   │   │   ├── TimetableCard.js
│   │   │   ├── DaySchedule.js
│   │   │   ├── TimetableEditor.js (admin)
│   │   │   └── ClassSlot.js
│   │   │
│   │   ├── assignments/
│   │   │   ├── AssignmentCard.js
│   │   │   ├── AssignmentList.js
│   │   │   ├── AssignmentDetails.js
│   │   │   ├── SubmissionForm.js
│   │   │   ├── SubmissionsList.js (lecturer)
│   │   │   └── GradingInterface.js (lecturer)
│   │   │
│   │   ├── attendance/
│   │   │   ├── AttendanceCard.js
│   │   │   ├── QRScanner.js
│   │   │   ├── QRGenerator.js (lecturer)
│   │   │   ├── AttendanceStats.js
│   │   │   ├── ExcuseForm.js
│   │   │   └── AttendanceReport.js
│   │   │
│   │   ├── onlineClass/
│   │   │   ├── ClassRoom.js
│   │   │   ├── VideoPlayer.js
│   │   │   ├── ParticipantsList.js
│   │   │   ├── ChatBox.js
│   │   │   ├── ScreenShare.js
│   │   │   └── ClassControls.js (lecturer)
│   │   │
│   │   ├── groups/
│   │   │   ├── GroupCard.js
│   │   │   ├── GroupList.js
│   │   │   ├── GroupDetails.js
│   │   │   ├── MembersList.js
│   │   │   ├── GroupNotifications.js
│   │   │   ├── ElectionCard.js
│   │   │   └── VotingInterface.js
│   │   │
│   │   ├── notifications/
│   │   │   ├── NotificationCard.js
│   │   │   ├── NotificationList.js
│   │   │   ├── NotificationBadge.js
│   │   │   └── NotificationSettings.js
│   │   │
│   │   ├── social/
│   │   │   ├── PostCard.js
│   │   │   ├── PostList.js
│   │   │   ├── CreatePost.js
│   │   │   ├── CommentSection.js
│   │   │   ├── EventCard.js
│   │   │   ├── EventsList.js
│   │   │   └── CreateEvent.js
│   │   │
│   │   ├── marketplace/
│   │   │   ├── ItemCard.js
│   │   │   ├── ItemList.js
│   │   │   ├── ItemDetails.js
│   │   │   ├── CreateListing.js
│   │   │   ├── CategoryFilter.js
│   │   │   └── MyListings.js
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── CourseManagement.js
│   │   │   ├── SubjectManagement.js
│   │   │   ├── DocumentUpload.js
│   │   │   ├── TimetableCreator.js
│   │   │   ├── MemberManagement.js
│   │   │   ├── PermissionsManager.js
│   │   │   └── ElectionManager.js
│   │   │
│   │   ├── mainAdmin/
│   │   │   ├── MainAdminDashboard.js
│   │   │   ├── InstitutionApproval.js
│   │   │   ├── AIModelSwitch.js
│   │   │   ├── ReportsManager.js
│   │   │   ├── AnalyticsDashboard.js
│   │   │   └── PlatformSettings.js
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileHeader.js
│   │   │   ├── ProfileInfo.js
│   │   │   ├── EditProfile.js
│   │   │   ├── SubscriptionCard.js
│   │   │   └── SettingsMenu.js
│   │   │
│   │   └── webview/
│   │       ├── InstitutionWebView.js
│   │       └── StudentPortalWebView.js
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── WelcomeScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   ├── OnboardingScreen.js
│   │   │   └── ProfileCompletionScreen.js
│   │   │
│   │   ├── main/
│   │   │   ├── DashboardScreen.js
│   │   │   ├── SubjectsScreen.js
│   │   │   ├── SubjectDetailsScreen.js
│   │   │   ├── TimetableScreen.js
│   │   │   ├── AssignmentsScreen.js
│   │   │   ├── AssignmentDetailsScreen.js
│   │   │   ├── AttendanceScreen.js
│   │   │   ├── OnlineClassScreen.js
│   │   │   ├── GroupsScreen.js
│   │   │   ├── GroupDetailsScreen.js
│   │   │   ├── NotificationsScreen.js
│   │   │   ├── SocialScreen.js
│   │   │   ├── MarketplaceScreen.js
│   │   │   ├── ProfileScreen.js
│   │   │   └── SettingsScreen.js
│   │   │
│   │   ├── ai/
│   │   │   ├── AIChatScreen.js
│   │   │   └── AIUsageScreen.js
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminHomeScreen.js
│   │   │   ├── ManageCoursesScreen.js
│   │   │   ├── ManageSubjectsScreen.js
│   │   │   ├── CreateTimetableScreen.js
│   │   │   ├── ManageMembersScreen.js
│   │   │   └── ElectionScreen.js
│   │   │
│   │   ├── mainAdmin/
│   │   │   ├── MainAdminHomeScreen.js
│   │   │   ├── ApprovalsScreen.js
│   │   │   ├── AIConfigScreen.js
│   │   │   ├── ReportsScreen.js
│   │   │   └── AnalyticsScreen.js
│   │   │
│   │   ├── lecturer/
│   │   │   ├── LecturerDashboardScreen.js
│   │   │   ├── CreateAssignmentScreen.js
│   │   │   ├── GradeSubmissionsScreen.js
│   │   │   ├── MarkAttendanceScreen.js
│   │   │   └── StartClassScreen.js
│   │   │
│   │   └── payment/
│   │       ├── SubscriptionScreen.js
│   │       ├── PaymentScreen.js
│   │       └── PaymentSuccessScreen.js
│   │
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   ├── MainNavigator.js
│   │   ├── StudentNavigator.js
│   │   ├── LecturerNavigator.js
│   │   ├── AdminNavigator.js
│   │   ├── MainAdminNavigator.js
│   │   └── navigationTypes.js
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.js              // Axios instance
│   │   │   ├── auth.api.js
│   │   │   ├── user.api.js
│   │   │   ├── institution.api.js
│   │   │   ├── group.api.js
│   │   │   ├── course.api.js
│   │   │   ├── subject.api.js
│   │   │   ├── timetable.api.js
│   │   │   ├── assignment.api.js
│   │   │   ├── attendance.api.js
│   │   │   ├── onlineClass.api.js
│   │   │   ├── notification.api.js
│   │   │   ├── ai.api.js
│   │   │   ├── social.api.js
│   │   │   ├── marketplace.api.js
│   │   │   ├── document.api.js
│   │   │   ├── payment.api.js
│   │   │   └── report.api.js
│   │   │
│   │   ├── socket/
│   │   │   ├── socket.js              // Socket.io setup
│   │   │   ├── onlineClass.socket.js
│   │   │   ├── notification.socket.js
│   │   │   ├── chat.socket.js
│   │   │   └── attendance.socket.js
│   │   │
│   │   ├── storage/
│   │   │   ├── asyncStorage.js
│   │   │   ├── secureStorage.js
│   │   │   └── fileStorage.js
│   │   │
│   │   ├── oauth/
│   │   │   ├── googleAuth.js
│   │   │   ├── facebookAuth.js
│   │   │   └── appleAuth.js
│   │   │
│   │   └── permissions/
│   │       ├── camera.js
│   │       ├── location.js
│   │       ├── notifications.js
│   │       └── storage.js
│   │
│   ├── store/
│   │   ├── store.js                   // Redux store config
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── userSlice.js
│   │   │   ├── subjectSlice.js
│   │   │   ├── timetableSlice.js
│   │   │   ├── assignmentSlice.js
│   │   │   ├── attendanceSlice.js
│   │   │   ├── notificationSlice.js
│   │   │   ├── groupSlice.js
│   │   │   ├── socialSlice.js
│   │   │   ├── marketplaceSlice.js
│   │   │   └── onlineClassSlice.js
│   │   │
│   │   └── middleware/
│   │       ├── socketMiddleware.js
│   │       └── errorMiddleware.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useSocket.js
│   │   ├── useNotifications.js
│   │   ├── useLocation.js
│   │   ├── useCamera.js
│   │   ├── useFileUpload.js
│   │   ├── useDebounce.js
│   │   ├── useInfiniteScroll.js
│   │   ├── usePermissions.js
│   │   └── usePremium.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── dateHelpers.js
│   │   ├── fileHelpers.js
│   │   ├── errorHandlers.js
│   │   ├── colors.js
│   │   ├── theme.js
│   │   └── animations.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── splash.png
│   │   │   ├── onboarding/
│   │   │   └── placeholders/
│   │   │
│   │   ├── icons/
│   │   │   └── (custom SVG icons)
│   │   │
│   │   ├── fonts/
│   │   │   └── (custom fonts)
│   │   │
│   │   └── animations/
│   │       └── (Lottie files)
│   │
│   ├── styles/
│   │   ├── globalStyles.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── shadows.js
│   │
│   ├── config/
│   │   ├── env.js
│   │   ├── api.config.js
│   │   ├── socket.config.js
│   │   └── oauth.config.js
│   │
│   └── App.js
│
├── .expo/
├── .gitignore
├── app.json
├── babel.config.js
├── package.json
├── metro.config.js
└── README.md
```

---

## Key Notes:

- **State Management**: Redux with slices for different features
- **Navigation**: React Navigation with separate navigators per role
- **Real-time**: Socket.io integration for live features
- **Storage**: AsyncStorage for data, SecureStore for tokens
- **File Upload**: Expo ImagePicker & DocumentPicker
- **OAuth**: Native integrations for Google/Facebook/Apple
- **Permissions**: Camera, location, notifications handled
- **UI**: Custom reusable components with consistent theming

## Frontend Dependencies - Ultimate Package List

```json
{
  "dependencies": {
    // ===== CORE EXPO & REACT =====
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "expo-dev-client": "~4.0.0",
    
    // ===== NAVIGATION =====
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/drawer": "^6.6.6",
    "@react-navigation/material-top-tabs": "^6.6.5",
    "react-native-screens": "~3.31.1",
    "react-native-safe-area-context": "4.10.1",
    "react-native-gesture-handler": "~2.16.1",
    
    // ===== STATE MANAGEMENT =====
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "redux-persist": "^6.0.0",
    "@redux-devtools/extension": "^3.3.0",
    
    // ===== API & NETWORKING =====
    "axios": "^1.6.2",
    "socket.io-client": "^4.6.1",
    "@tanstack/react-query": "^5.17.0",
    "react-native-mmkv": "^2.11.0",
    
    // ===== OAUTH & AUTH =====
    "expo-auth-session": "~5.5.2",
    "expo-web-browser": "~13.0.3",
    "@react-native-google-signin/google-signin": "^11.0.0",
    "react-native-fbsdk-next": "^12.1.2",
    "expo-apple-authentication": "~6.4.1",
    "expo-secure-store": "~13.0.1",
    
    // ===== UI LIBRARIES =====
    "react-native-paper": "^5.12.1",
    "@ui-kitten/components": "^5.3.1",
    "@ui-kitten/eva-icons": "^5.3.1",
    "@eva-design/eva": "^2.2.0",
    "react-native-elements": "^3.4.3",
    "native-base": "^3.4.28",
    "@shopify/restyle": "^2.4.2",
    
    // ===== ANIMATIONS =====
    "react-native-reanimated": "~3.10.1",
    "lottie-react-native": "6.7.0",
    "react-native-animatable": "^1.4.0",
    "react-native-shimmer-placeholder": "^2.0.9",
    "react-native-shared-element": "^0.8.9",
    "@react-native-community/blur": "^4.4.0",
    "react-native-skeleton-content": "^1.0.28",
    
    // ===== ICONS & IMAGES =====
    "@expo/vector-icons": "^14.0.0",
    "react-native-vector-icons": "^10.0.3",
    "react-native-svg": "15.2.0",
    "expo-linear-gradient": "~13.0.2",
    "expo-image": "~1.12.9",
    "expo-blur": "~13.0.2",
    "react-native-fast-image": "^8.6.3",
    
    // ===== FILE HANDLING =====
    "expo-document-picker": "~12.0.1",
    "expo-image-picker": "~15.0.5",
    "expo-file-system": "~17.0.1",
    "expo-media-library": "~16.0.3",
    "react-native-fs": "^2.20.0",
    "react-native-blob-util": "^0.19.8",
    "react-native-pdf": "^6.7.3",
    "react-native-view-shot": "^3.8.0",
    
    // ===== CAMERA & QR =====
    "expo-camera": "~15.0.9",
    "expo-barcode-scanner": "~13.0.1",
    "react-native-qrcode-svg": "^6.3.0",
    "react-native-vision-camera": "^3.6.17",
    
    // ===== VIDEO & AUDIO =====
    "expo-av": "~14.0.5",
    "react-native-video": "^6.0.0-rc.0",
    "@react-native-community/audio-toolkit": "^2.0.3",
    "expo-speech": "~12.0.2",
    
    // ===== WEBRTC & VIDEO CALLS =====
    "react-native-webrtc": "^118.0.3",
    "@videosdk.live/react-native-sdk": "^1.1.11",
    "agora-react-native-rtc": "^6.2.6",
    
    // ===== LOCATION & MAPS =====
    "expo-location": "~17.0.1",
    "react-native-maps": "1.14.0",
    "react-native-geolocation-service": "^5.3.1",
    
    // ===== NOTIFICATIONS =====
    "expo-notifications": "~0.28.9",
    "@notifee/react-native": "^7.8.2",
    "expo-device": "~6.0.2",
    
    // ===== WEBVIEW =====
    "react-native-webview": "13.8.6",
    
    // ===== FORMS & VALIDATION =====
    "react-hook-form": "^7.49.2",
    "yup": "^1.3.3",
    "@hookform/resolvers": "^3.3.4",
    "formik": "^2.4.5",
    
    // ===== CHARTS & GRAPHS =====
    "react-native-chart-kit": "^6.12.0",
    "react-native-svg-charts": "^5.4.0",
    "victory-native": "^36.9.2",
    "react-native-gifted-charts": "^1.4.0",
    
    // ===== CALENDARS & DATE =====
    "react-native-calendars": "^1.1302.0",
    "react-native-calendar-strip": "^2.2.6",
    "date-fns": "^3.0.6",
    "dayjs": "^1.11.10",
    "moment": "^2.30.1",
    "react-native-month-year-picker": "^1.12.0",
    "@react-native-community/datetimepicker": "8.0.1",
    
    // ===== UI ENHANCEMENTS =====
    "react-native-modal": "^13.0.1",
    "@gorhom/bottom-sheet": "^4.6.0",
    "react-native-action-sheet": "^2.2.0",
    "react-native-popup-menu": "^0.16.1",
    "react-native-dropdown-picker": "^5.4.6",
    "react-native-swipe-list-view": "^3.2.9",
    "react-native-snap-carousel": "^3.9.1",
    "react-native-pager-view": "6.3.0",
    "@react-native-community/viewpager": "^5.0.11",
    "react-native-tab-view": "^3.5.2",
    
    // ===== TOAST & ALERTS =====
    "react-native-toast-message": "^2.2.0",
    "react-native-flash-message": "^0.4.2",
    "react-native-awesome-alerts": "^2.0.0",
    
    // ===== GESTURES & INTERACTIONS =====
    "react-native-swipeable": "^0.6.0",
    "react-native-draggable": "^3.3.0",
    "react-native-drag-drop": "^1.0.3",
    "react-native-sortable-list": "^0.0.25",
    
    // ===== LISTS & SCROLLING =====
    "react-native-virtualized-view": "^2.0.0",
    "@shopify/flash-list": "^1.6.3",
    "recyclerlistview": "^4.2.0",
    "react-native-bidirectional-infinite-scroll": "^2.0.2",
    
    // ===== SEARCH & FILTERS =====
    "fuse.js": "^7.0.0",
    "lodash": "^4.17.21",
    
    // ===== MARKDOWN & TEXT =====
    "react-native-markdown-display": "^7.0.2",
    "react-native-render-html": "^6.3.4",
    "react-native-hyperlink": "^0.0.22",
    
    // ===== PAYMENT =====
    "@stripe/stripe-react-native": "^0.37.2",
    "react-native-paystack-webview": "^4.1.1",
    
    // ===== SPLASH & ONBOARDING =====
    "expo-splash-screen": "~0.27.4",
    "react-native-onboarding-swiper": "^1.2.0",
    "react-native-app-intro-slider": "^4.0.4",
    
    // ===== HAPTICS & FEEDBACK =====
    "expo-haptics": "~13.0.1",
    
    // ===== STORAGE & CACHE =====
    "@react-native-async-storage/async-storage": "1.23.1",
    "react-native-encrypted-storage": "^4.0.3",
    
    // ===== UTILITIES =====
    "react-native-uuid": "^2.0.2",
    "expo-crypto": "~13.0.2",
    "expo-clipboard": "~6.0.3",
    "expo-sharing": "~12.0.1",
    "expo-linking": "~6.3.1",
    "expo-constants": "~16.0.1",
    "expo-network": "~6.0.1",
    "expo-status-bar": "~1.12.1",
    "expo-font": "~12.0.5",
    "expo-asset": "~10.0.6",
    
    // ===== PERFORMANCE =====
    "react-native-performance": "^5.1.0",
    "@react-native-firebase/perf": "^19.0.1",
    
    // ===== ANALYTICS (Optional) =====
    "expo-analytics": "^7.0.1",
    "@segment/analytics-react-native": "^2.19.0",
    
    // ===== ERROR TRACKING =====
    "sentry-expo": "~8.0.0",
    "@sentry/react-native": "^5.15.2",
    
    // ===== CHAT ENHANCEMENTS =====
    "react-native-gifted-chat": "^2.4.0",
    "react-native-parsed-text": "^0.0.22",
    "react-native-emoji-selector": "^0.2.0",
    
    // ===== BADGES & RATINGS =====
    "react-native-ratings": "^8.1.0",
    "react-native-star-rating": "^1.1.0",
    
    // ===== SHIMMER & LOADING =====
    "react-native-loading-spinner-overlay": "^3.0.1",
    "react-native-progress": "^5.0.1",
    
    // ===== SOCIAL SHARING =====
    "expo-share-intent": "~2.0.0",
    "react-native-share": "^10.0.2",
    
    // ===== PULL TO REFRESH =====
    "react-native-pull-to-refresh": "^5.0.1"
  },
  
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-native": "^4.1.0"
  }
}
```

---

## Installation Command

```bash
# Install all at once (select what you need)
npx expo install expo-dev-client react-native-reanimated lottie-react-native @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler @reduxjs/toolkit react-redux axios socket.io-client expo-auth-session expo-web-browser expo-secure-store react-native-paper @ui-kitten/components @ui-kitten/eva-icons @eva-design/eva expo-linear-gradient expo-blur expo-image expo-document-picker expo-image-picker expo-file-system expo-camera expo-barcode-scanner expo-av expo-location react-native-maps expo-notifications expo-device react-native-webview react-hook-form yup date-fns react-native-calendars react-native-modal @gorhom/bottom-sheet react-native-toast-message @shopify/flash-list expo-splash-screen expo-haptics @react-native-async-storage/async-storage expo-crypto expo-clipboard expo-linking expo-constants expo-status-bar expo-font

# Additional native modules (if needed)
npm install react-native-qrcode-svg react-native-pdf react-native-gifted-chat victory-native react-native-chart-kit @stripe/stripe-react-native react-native-webrtc
```

---

## Key Feature Groups:

**🎨 UI/UX Excellence:**
- UI Kitten, React Native Paper, Native Base for pre-built components
- Reanimated + Lottie for smooth animations
- Shimmer placeholders for loading states
- Bottom sheets, modals, action sheets

**📱 Core Features:**
- Socket.io for real-time updates
- WebRTC for video calls
- QR code generation/scanning
- PDF viewing
- Camera integration

**🎯 Enhanced UX:**
- Pull to refresh
- Infinite scroll with Flash List
- Skeleton loaders
- Toast notifications
- Haptic feedback

**📊 Data Visualization:**
- Victory Native for charts
- React Native Chart Kit
- Gifted Charts

**🔐 Security & Auth:**
- OAuth providers (Google, Facebook, Apple)
- Secure storage for tokens
- Encrypted storage

**📁 File Management:**
- Document picker
- Image picker
- PDF viewer
- File system access

## Screen Descriptions

### **Auth Screens**

#### **WelcomeScreen.js**
First screen users see. Features a stunning hero section with animated gradient background, app logo with subtle floating animation, tagline emphasizing "student-first" approach, and three OAuth buttons (Google, Facebook, Apple) with ripple effects. Includes role selection chips (Student/Lecturer) that expand with smooth animation. Bottom section has a carousel of key features with auto-scroll and page indicators.

#### **LoginScreen.js**
Minimalist design with centered OAuth buttons featuring provider logos and brand colors. Each button has press animation and loading state. Background has parallax effect with abstract educational illustrations. Animated transitions when switching between student/lecturer modes. Error messages appear as toast notifications from top.

#### **OnboardingScreen.js**
Three-slide swiper introducing core features: 1) AI-powered learning, 2) Smart scheduling, 3) Connected community. Each slide has custom Lottie animations, bold headlines, and concise descriptions. Progress dots at bottom with current slide highlighted. Skip button in top-right, Next/Get Started button at bottom with gradient fill that changes per slide.

#### **ProfileCompletionScreen.js**
Single-screen upload interface with drag-drop zone for admission letter. Features a dashed border box that highlights on drag-over, cloud upload icon, and "Upload Admission Letter" text. Shows file preview after selection with name, size, and remove button. Upload button triggers progress bar with percentage. AI processing indicator with animated dots. Success animation (checkmark) with auto-redirect to dashboard after 2 seconds.

---

### **Main Screens**

#### **DashboardScreen.js**
Primary hub with personalized greeting (Good morning, [Name]) and avatar at top. Quick stats cards showing attendance rate, pending assignments, and upcoming classes with color-coded icons. "Today's Schedule" section with horizontal scroll of time-slotted class cards. "Recent Activity" feed showing latest notifications as compact cards. Quick action FAB menu in bottom-right for common tasks (mark attendance, join class, upload assignment). Pull-to-refresh functionality. Smooth scroll-to-top button appears after scrolling down.

#### **SubjectsScreen.js**
Grid layout of subject cards with course code, name, lecturer thumbnail, and background gradient unique per subject. Each card shows unread notification badge. Search bar at top with filter icon (filter by semester/year). Horizontal tabs for "Current Semester" and "All Subjects". Cards have press animation scaling down slightly. Empty state shows illustration with "No subjects yet" message for new students.

#### **SubjectDetailsScreen.js**
Hero section with subject name, code, and lecturer info. Tabbed interface: Overview (syllabus, course outline), Documents (categorized by type), Assignments, Attendance. Overview tab shows AI-generated summary of course with expandable full syllabus. Floating AI chat button in bottom-right corner that expands to chat interface. Documents organized in collapsible sections (Notes, Videos, Links) with download icons. Smooth transitions between tabs.

#### **TimetableScreen.js**
Weekly calendar view with current day highlighted. Time slots displayed vertically (8AM-6PM) with horizontal scroll for days. Class blocks show subject name, room, lecturer thumbnail. Color-coded by subject. "Today" button to jump to current day. Toggle between week/day view. Upcoming class notification banner at top (X minutes until class). Long-press on class opens quick actions (view details, mark attendance, join online). Smooth animations when switching views.

#### **AssignmentsScreen.js**
Segmented control at top: Pending, Submitted, Graded. Pending tab shows assignments sorted by due date with countdown timer. Each card displays subject, title, type badge (Assignment/CAT/Exam), due date with color (green: >3 days, yellow: 1-3 days, red: <1 day). Quick submit button on card. Submitted tab shows status (Under Review/Graded) with score badge. Filter button opens bottom sheet with filters (subject, type, date range). Swipe-to-delete on completed items.

#### **AssignmentDetailsScreen.js**
Header with assignment title, subject badge, and due date countdown. Description section with formatted text. Attachments list with preview thumbnails. Submission section shows uploaded file preview with re-upload option. Status banner (Not Submitted/Submitted/Graded) with appropriate colors. If graded, shows score with progress circle, feedback text, and lecturer comments. Submit button fixed at bottom with upload icon. Loading overlay during submission with upload progress.

#### **AttendanceScreen.js**
Split into two tabs: Today and History. Today tab shows active attendance sessions as cards with subject, time, location (if physical), and QR code button or "Mark Attendance" button. QR scanner opens full-screen camera with scanning frame. Location-based attendance shows map with radius circle. History tab displays calendar heat map showing attendance patterns. Subject filter dropdown. Statistics card at top showing overall percentage, present days, absent days with circular progress indicators.

#### **OnlineClassScreen.js**
Full-screen video interface. Large video container for lecturer/screen share at top. Participant thumbnails in horizontal scroll at bottom. Control bar with mute/unmute mic, video on/off, end call, switch camera, screen share buttons. Floating chat button opens slide-in chat panel from right. Participant list button shows drawer with names and muted status. Lecturer has additional controls (admit participants, enable/disable chat, end class for all). Network quality indicator in corner. Minimal UI that auto-hides after inactivity.

#### **GroupsScreen.js**
Nested list showing group hierarchy: Institution → Faculty → School → Department → Course → Year. Each level is collapsible with chevron icons. Current level highlighted. Group cards show name, member count, and notification badge. Search bar filters groups. Tapping group opens details. Bottom tabs for "My Groups" and "Discover" (other institution groups for social features). Smooth expand/collapse animations.

#### **GroupDetailsScreen.js**
Hero with group name, institution logo, member count. Tabs: Feed, Members, Files, Elections. Feed tab shows group-specific notifications/announcements as timeline cards with timestamps. Members tab has searchable list with avatars, names, roles (admin badge). Files tab shows shared documents in list. Elections tab displays active elections with candidate cards (photo, name, votes), vote button, and results after deadline. Admin users see "+ Post Announcement" FAB.

#### **NotificationsScreen.js**
List of notification cards chronologically grouped by date (Today, Yesterday, This Week). Each card shows icon based on type, title, message preview, timestamp. Unread notifications have blue dot indicator and slightly bolder text. Swipe-left reveals delete action. Long-press for multi-select mode. Top bar has "Mark all as read" button and filter icon (filter by type). Pull-to-refresh. Empty state shows "All caught up!" with illustration.

#### **SocialScreen.js**
Instagram-like feed of posts from students across institutions. Post cards show user avatar, name, institution badge, post content (text/images), timestamp, like count, comment count. Double-tap to like with heart animation. Comment button opens bottom sheet with comment list. Create post FAB opens modal with text input, image picker, event toggle. Event posts have special banner with date, location, institution tags. Filter tabs at top: For You, Following, Events. Infinite scroll with loading spinner.

#### **MarketplaceScreen.js**
Grid of product cards with image, title, price, condition badge. Category chips at top (Books, Electronics, Clothing, Services, Other) with horizontal scroll. Search bar with filter button (price range, condition, institution). Each card has "sold" overlay if unavailable. Tapping opens details. "My Listings" button in top-right. Create listing FAB opens multi-step form. Smooth skeleton loading while fetching. Sort dropdown (Recent, Price Low-High, Price High-Low).

#### **ProfileScreen.js**
Header with large avatar, name, institution, course, year. Edit button in top-right. Stats row showing posts, listings, attendance rate. Subscription card showing plan (Free/Premium) with upgrade button for free users. Sections: Personal Info (expandable cards), Storage Usage (progress bar with used/total), Settings menu items (Notifications, Privacy, Help, Logout). Logout shows confirmation alert. Premium users see badge and expiry date.

#### **SettingsScreen.js**
Grouped list: Account (Edit Profile, Change Password, Linked Accounts), Notifications (push toggles per category), Appearance (theme selection with preview), Privacy (visibility settings), Storage (manage downloads), About (version, terms, privacy policy). Each item navigates to sub-screen or shows inline controls. Danger zone at bottom with "Delete Account" in red. Modern iOS-style settings design with section headers.

---

### **AI Screens**

#### **AIChatScreen.js**
Chat interface with messages bubbles (user: right/blue, AI: left/gray). Input bar at bottom with text field, attachment button, send button. AI responses support markdown rendering. Typing indicator with animated dots when AI is responding. Subject context banner at top showing which subject's AI is active. "Clear Chat" button in top-right. Empty state shows suggested questions as chips. Auto-scroll to bottom on new message. Premium users see "GPT-4" badge, free users see "Free Model" badge.

#### **AIUsageScreen.js**
Dashboard showing AI usage stats: total chats, tokens used this month, messages sent. Progress bar towards free tier limit with "X% used" text. Premium users see "Unlimited" instead. Historical chart showing daily usage over last 30 days. Breakdown by subject in donut chart. Upgrade to premium CTA for free users approaching limit. Reset date shown (resets monthly).

---

### **Admin Screens**

#### **AdminHomeScreen.js**
Admin dashboard with role badge (Class Rep/Course Coordinator/etc). Quick stats: Total Students, Total Subjects, Attendance Rate, Pending Tasks. Task list showing pending approvals, elections, reports. Quick actions grid with icon buttons (Manage Courses, Create Timetable, Upload Documents, Send Announcement). Recent activity feed. Access to group management. Color scheme different from student dashboard (admin blue/purple theme).

#### **ManageCoursesScreen.js**
List of courses with edit/delete icons. Each course card shows name, code, year, semester, enrolled students count. "+ Add Course" FAB opens modal form with fields: name, code, year, semester. Edit opens same modal pre-filled. Delete requires confirmation. Search and filter options. Drag handles on cards to reorder. Changes auto-save with success toast.

#### **ManageSubjectsScreen.js**
Similar to courses screen but for subjects. Cards show subject name, code, assigned lecturer, document count. Form includes lecturer selection dropdown, syllabus upload field. "Assign Lecturer" quick action on cards. "Upload Syllabus" button triggers AI processing with progress indicator. Subject details shows linked documents count and quick view button.

#### **CreateTimetableScreen.js**
Drag-and-drop interface. Left sidebar shows available subjects with lecturer names. Center shows weekly grid (days vs time slots). Drag subject cards onto grid slots. Each slot allows editing time, room, online/physical toggle. Color-coded by subject. Clone button to duplicate from previous semester. Save button triggers validation (conflict checking) with error highlights. Preview mode shows final timetable. Export as image option.

#### **ManageMembersScreen.js**
Member list with search, role filters. Each member card shows avatar, name, student ID, role badge. Admin users have crown icon. "+" button to add members (email input, role selection). Remove member button (admin can't remove other admins). Bulk actions: export list, send group email. Permissions editor for admins showing checkboxes for different permissions. Changes require confirmation.

#### **ElectionScreen.js**
Election management interface. If no active election: "Start Election" button with form (candidate selection from members, end date picker). If active: Real-time results with candidate cards showing vote counts, progress bars. Countdown timer to end date. "End Election Early" button. After election: winner announcement banner, "Create Admin" button to convert winner to class rep with permission selection. Election history list at bottom.

---

### **Main Admin Screens**

#### **MainAdminHomeScreen.js**
Platform overview dashboard. KPIs: Total Institutions, Total Users, Active Sessions, Revenue (if premium). Charts showing growth metrics. Pending approvals counter with urgent badge. System health indicators (API status, database, storage). Quick actions: Approve Institutions, View Reports, Configure AI, Analytics. Recent platform activity log. Different color theme (gold/orange for main admin).

#### **ApprovalsScreen.js**
List of pending institution applications. Each card shows institution name, logo upload, country, submitted date, applicant email. "View Details" button opens full application with all fields. Approve/Reject buttons with reason field for rejection. Email templates for approval/rejection notifications. Filter by status (Pending, Approved, Rejected). Search by institution name.

#### **AIConfigScreen.js**
Toggle switches for AI providers: OpenRouter, OpenAI. API key input fields (masked). Model selection dropdown for free tier (default model). Test API button to verify connection. Usage dashboard showing total API calls, costs. Rate limiting settings. Error logs section showing recent AI failures. Save button with confirmation. Success/error notifications.

#### **ReportsScreen.js**
List of user reports categorized by type. Each report card shows reporter, target, type, status badge, date. Priority flag for urgent reports. "Review" button opens detailed view with evidence (screenshots), description, actions taken history. Action buttons: Dismiss, Warn User, Suspend User, Delete Content, Ban User. Requires confirmation with reason field. Resolution creates notification to reporter. Filter and search tools.

#### **AnalyticsScreen.js**
Comprehensive analytics dashboard. Multiple chart types: Line charts (user growth over time), Bar charts (active users by institution), Pie charts (user roles distribution), Heat maps (usage by hour/day). Date range picker. Key metrics cards: DAU, MAU, Session duration, Retention rate. Export data button. Premium subscriptions revenue chart. Institution comparison table with sorting.

---

### **Lecturer Screens**

#### **LecturerDashboardScreen.js**
Today's classes timeline with status indicators (Upcoming, In Progress, Completed). Quick stats: Total Students, Attendance Rate, Pending Submissions. Subjects taught with student count per subject. Recent submissions notification cards. Quick actions: Start Class, Create Assignment, Mark Attendance, Grade Submissions. Schedule overview for the week. Color theme: professional green/teal.

#### **CreateAssignmentScreen.js**
Multi-step form wizard. Step 1: Basic info (title, description, type selection chips). Step 2: Settings (due date picker, total marks input, subject/group selection). Step 3: Attachments (file upload with preview). Review step showing all info. Progress indicator at top. "Save as Draft" button throughout. "Publish" button at end. Validation with inline errors. Success animation on publish with share option.

#### **GradeSubmissionsScreen.js**
List of student submissions for selected assignment. Filter options: All, Graded, Ungraded. Each card shows student name, submission date, file type icon, current grade. "Grade" button opens modal with file preview (PDF/image viewer), marks input field, feedback textarea. Save button with validation. Bulk grading option: select multiple, assign same feedback template. Progress indicator showing X/Y graded. Export grades button.

#### **MarkAttendanceScreen.js**
Class selection dropdown. Location picker with map if physical class. "Generate QR Code" button (for physical) creates QR displayed full-screen with timer. Auto-refresh QR every 5 minutes. Student list showing status icons (present/absent/late). Manual toggle switches per student. "Auto Mark Absent" button for no-shows after timer. Excuse requests section with approve/reject buttons per request. Real-time updates as students mark attendance.

#### **StartClassScreen.js**
Pre-class checklist: verify subject, group, schedule time. Input actual class location (autocomplete). Start type selection: Online (launches video room) or Physical (generates attendance QR). Recording toggle for online classes. "Start Class" button triggers countdown (3,2,1) then launches interface. Attendance marking happens simultaneously. Active class shows participant count and elapsed time. "End Class" button with confirmation saves session automatically.

---

### **Payment Screens**

#### **SubscriptionScreen.js**
Two-column comparison: Free vs Premium. Feature lists with checkmarks/crosses. Premium features highlighted: Latest AI models, Unlimited storage, No ads, Priority support, Advanced analytics. Pricing card with monthly/yearly toggle (yearly shows savings badge). "Subscribe Now" button with gradient. FAQ accordion at bottom. Testimonials carousel. Current plan badge at top for existing subscribers. "Manage Subscription" link.

#### **PaymentScreen.js**
Payment form with Stripe integration. Card input fields with inline validation and icons. Mobile money option (for Kenya: M-Pesa). Summary section showing plan, duration, price, taxes. Promo code input with apply button. Total amount prominently displayed. "Pay Now" button with loading state. Security badges (SSL, PCI compliant). Terms acceptance checkbox. Payment processing shows overlay with animation. Auto-redirect on success.

#### **PaymentSuccessScreen.js**
Success animation (checkmark with confetti). "Payment Successful" headline. Transaction details card: amount, date, transaction ID. "What's Next" section with premium feature highlights. "Go to Dashboard" button. Email confirmation message. Social share button "I just upgraded!". Receipt download option. Celebration message tailored to chosen plan.

---
## Component Descriptions

### **Common Components**

#### **Button.js**
Highly customizable button supporting multiple variants: primary (gradient), secondary (outlined), tertiary (text-only), danger (red). Props include size (small, medium, large), loading state (shows spinner, disables interaction), disabled state (reduced opacity), icon support (left/right placement), full-width option. Press animation scales down to 0.95. Ripple effect on Android. Supports custom colors while maintaining accessibility contrast. Haptic feedback on press.

#### **Input.js**
Text input with floating label animation. Props: placeholder, value, onChange, error message, helper text, left/right icons, secure entry toggle (eye icon for passwords), multiline support, character counter, max length. Focus state changes border color and label position. Error state shows red border and error message below. Clear button appears when text exists. Keyboard type props (email, numeric, phone). Auto-capitalize and auto-correct options.

#### **Card.js**
Versatile container with elevation shadow. Supports variants: flat, elevated, outlined. Rounded corners with customizable radius. Padding presets (none, small, medium, large). Background color prop with default white. Press animation optional for interactive cards. Gradient background support. Nested Card.Header, Card.Body, Card.Footer subcomponents for structured content. Overflow hidden for image cards.

#### **Avatar.js**
Circular image component with fallback to initials. Sizes: xs, sm, md, lg, xl. Border support with color prop. Online status indicator (green dot) in bottom-right. Press animation and onPress handler for profile navigation. Image loading state shows skeleton. Fallback background colors generated from name hash. Badge support in top-right corner for notifications. Group avatar layout for multiple users (overlapping circles).

#### **Badge.js**
Small label component for status indicators. Variants: solid, outlined, dot-only. Colors: primary, success, warning, danger, info, neutral. Positioning props for absolute placement on parent. Count prop for numeric badges (99+ for values over 99). Pulse animation option for attention. Close button optional. Size variants: small, medium, large. Icon support before text.

#### **Loading.js**
Multiple loading indicator styles: spinner, skeleton, shimmer, dots animation, pulse. Full-screen overlay option with blur background. Inline loading for buttons/cards. Customizable color, size, speed. Message prop displays text below spinner. Lottie animation support for branded loaders. Skeleon includes preset layouts: list item, card, profile. Shimmer effect animates left-to-right gradient.

#### **ErrorMessage.js**
Error display component with icon and retry button. Variants: inline (small banner), full-screen (with illustration), toast (dismissible). Props: message, error code, retry handler, contact support link. Illustration changes based on error type (network, server, not found, permission). Auto-dismiss option for minor errors. Supports custom actions array. Accessibility: screen reader announces errors.

#### **EmptyState.js**
Placeholder for empty lists/screens. Props: illustration (from presets or custom), title, description, action button. Presets: no data, no results, no internet, permission denied, coming soon. Lottie animations for engaging experience. Action button triggers relevant flow (refresh, go back, try search). Maintains consistent spacing and typography. Vertical centering in parent container.

#### **Modal.js**
Full-screen or centered modal overlay. Slide-up animation from bottom (iOS style) or fade-in (Android style). Props: visible, onClose, title, size (full, large, medium, small). Close button in header. Backdrop tap to dismiss (optional). Nested Modal.Header, Modal.Body, Modal.Footer. Keyboard avoiding view for inputs. Hardware back button support on Android. Swipe down to dismiss option. Blur backdrop effect.

#### **BottomSheet.js**
Swipeable sheet from bottom using @gorhom/bottom-sheet. Snap points array for different heights. Drag handle at top. Backdrop with custom opacity. Dynamic content height support. Props: onClose, snapPoints, enablePanDownToClose. Keyboard handling pushes sheet up. Nested scrollable content. Portal rendering above navigation. Smooth spring animations. Custom background and corner radius.

#### **Dropdown.js**
Native picker replacement with custom styling. Opens bottom sheet on mobile, popover on tablet. Props: items array, selected value, onChange, placeholder, searchable. Each item has label, value, icon optional. Search input at top of list. Multi-select mode with checkboxes. Section headers for grouped items. Disabled items shown with reduced opacity. Clear selection option. Keyboard navigation support.

#### **SearchBar.js**
Search input with icon, clear button, filter button. Props: value, onChange, onFilter, placeholder. Debounced onChange to prevent excessive API calls. Cancel button appears when typing (iOS style). Focus animation expands width. Recent searches dropdown on focus. Voice search icon optional. Barcode scanner integration for product search. Loading indicator in right side when fetching results.

#### **Tag.js**
Small label component for categorization. Variants: filled, outlined, light (background with low opacity). Close button for removable tags. Icon support before text. Sizes: small, medium, large. Press animation for selectable tags. Multi-select state management. Color variants from theme. Used in filters, categories, skills, interests. Max width with ellipsis for long text.

#### **Divider.js**
Horizontal or vertical separator line. Props: orientation, color, thickness, spacing (margin around line). Text label option displayed in center (e.g., "OR"). Gradient divider with color array. Dashed style option. Inset variant with padding from edges. Full-bleed or contained within padding. Used in lists, forms, sections.

---

### **Auth Components**

#### **OAuthButtons.js**
Stacked social login buttons with provider branding. Each button shows provider logo, "Continue with [Provider]" text, loading state. Google: white background, blue text. Facebook: blue background, white text. Apple: black background, white text. Press animations, error handling, loading spinners. Auto-retry on network failure. Success callback returns user data. Platform-specific implementations (Google Sign-In SDK, Facebook SDK, Apple Auth).

#### **AdmissionLetterUpload.js**
Drag-drop zone with file picker fallback. Dashed border animates on drag-over. Cloud upload icon with "Drag & drop or tap to upload" text. File type validation (PDF, images only). File size limit (10MB) with error message. Preview shows thumbnail, filename, size, remove icon. Upload progress bar with percentage. Success state shows checkmark animation. AI processing indicator with "Extracting information..." text. Retry button on failure.

#### **ProfileCompletion.js**
Multi-field form pre-filled from AI extraction. Fields: First Name, Last Name, Student ID, Institution (dropdown with search), Faculty, School, Department, Course (depends on department), Year of Study, Enrollment Date. Each field shows AI confidence indicator (high/medium/low). Editable fields with validation. "Looks good!" confirmation button. Skip option for manual entry later. Progress indicator at top. Save button triggers account activation.

---

### **Dashboard Components**

#### **DashboardHeader.js**
Top section with greeting, avatar, and notification bell. Time-based greeting (Good morning/afternoon/evening) with name. Avatar opens profile quick-view bottom sheet. Notification bell shows badge count, opens notifications. Background gradient or institution branding. Date displayed in secondary text. Quick settings icon in corner. Search icon for global search. Sticky header on scroll with blur effect.

#### **QuickActions.js**
Grid or horizontal scroll of action cards. Each card has icon, label, optional badge. Actions: Mark Attendance, Join Class, Submit Assignment, AI Chat, Marketplace, Social Feed, Timetable. Press animation scales card. Badge shows pending count. Customizable based on user role (student vs lecturer vs admin). Reorderable by long-press-drag. Add/remove actions via settings.

#### **UpcomingClasses.js**
Horizontal scrollable list of class cards for today. Each card shows: time, subject name, room/online badge, lecturer name, thumbnail image. Color-coded border by subject. "Starting soon" badge if within 15 minutes. "Join Now" button for online classes. "In Progress" indicator for active classes. Past classes shown with muted style. Empty state shows "No classes today 🎉". Tap card for details. Auto-scroll to next class.

#### **RecentNotifications.js**
Compact list of latest 5 notifications. Each item shows icon, title, timestamp. Unread indicator (blue dot). Tap to expand full message or navigate. "View All" button at bottom navigates to NotificationsScreen. Auto-refresh every minute. Swipe to dismiss. Grouped by time (Just now, 5 min ago, 1 hour ago). Priority notifications pinned at top. Pull-down to refresh manually.

#### **StorageIndicator.js**
Progress bar showing used/total storage. Color changes based on usage: green (<50%), yellow (50-80%), red (>80%). Text shows "X GB of Y GB used". Tap to navigate to storage management. Premium users see "Unlimited" or much higher limit. Warning message when approaching limit. Quick cleanup button suggests cached files to delete. Animated fill as data loads.

---

### **Subject Components**

#### **SubjectCard.js**
Card with gradient background unique per subject (color hash from ID). Top shows course code in small text. Subject name in bold headline. Lecturer info with small circular avatar and name. Bottom row shows icons with counts: documents, assignments, attendance rate. Notification badge in top-right corner. Press animation and navigation to details. Shimmer loading state. Favorite star icon in corner (optional feature).

#### **SubjectList.js**
Flat list or grid layout toggle. Filter bar above list (semester, year). Search functionality. Sort options (A-Z, recent, attendance). Empty state with illustration. Pull-to-refresh. Infinite scroll if many subjects. Section headers for semesters. Skeleton loaders while fetching. Animated entry of cards (stagger delay). Swipe actions: favorite, hide.

#### **SubjectDetails.js**
Header section sticky at top with blur. Subject name, code, lecturer card (tap to email/message). Tab navigator below: Overview, Documents, Assignments, Attendance. Overview shows AI-generated summary, expandable syllabus, course outline with week-by-week topics, learning objectives, grading breakdown. Share subject button. Enroll/unenroll toggle for electives. Prerequisites listed.

#### **DocumentsList.js**
Grouped by category: Notes, Assignments, Videos, Links, Other. Each category collapsible accordion. Document item shows icon (by type), title, upload date, size. Download button (cloud icon). Preview button (eye icon). Open in external app option. Filter by date or type. Search within documents. Sort by name/date/size. Bulk download selection mode. Recently viewed section at top. Offline indicator for downloaded files.

#### **DocumentViewer.js**
Full-screen document viewer for PDFs and images. Top bar: title, close button, share button, download button. PDF: page navigation (prev/next), page counter (3/10), zoom controls, thumbnail view sidebar. Image: pinch-to-zoom, double-tap zoom, pan gestures. Markdown documents rendered with syntax highlighting. Video player with controls. Link preview with Open in Browser button. Annotation tools for premium users (highlight, notes).

#### **AIChat.js**
Chat interface within subject context. Messages in bubbles (user: right/blue, AI: left/gray with avatar). Subject name banner at top. Input bar at bottom with text field and send button. AI typing indicator with animated dots. Messages support markdown: bold, italic, code blocks, lists, links. Code syntax highlighting. Copy code button. Regenerate response button. Rate response (thumbs up/down). Suggested follow-up questions as chips. Clear chat confirmation dialog. Context banner shows "Using documents from [Subject]".

---

### **Timetable Components**

#### **TimetableGrid.js**
Weekly calendar grid. Days as columns (Mon-Sun), time slots as rows (8AM-6PM). Each cell can contain a class block. Class blocks span multiple rows based on duration. Color-coded by subject with opacity. Shows subject code, room, small lecturer avatar. Current time indicator (horizontal line with dot). Current day column highlighted. Empty slots light gray. Grid lines subtle. Pinch-to-zoom week. Scroll vertically through day, horizontally through week.

#### **TimetableCard.js**
Alternative card-based layout for mobile. Each day as section header (collapsible). Classes under each day as timeline with connecting lines. Time on left, class card on right. Card shows subject, time range, location, lecturer. Color bar on left edge matching subject. "Join" button for online classes. "Navigate" for physical classes (opens maps). Countdown timer for next class. All-day scrollable. "No classes" message for empty days.

#### **DaySchedule.js**
Single day view (today by default). Large time slots showing full class details. Card per class with subject name, course code, time, duration bar, room, lecturer info, description. Status badge (upcoming/in progress/completed). Quick actions: mark attendance, join class, view subject. Travel time suggestions between physical classes. Break periods shown with coffee icon. Free periods motivational messages. Schedule sharing as image.

#### **TimetableEditor.js** (Admin)
Drag-and-drop builder interface. Left sidebar lists available subjects with details. Weekly grid in center (days vs time slots). Drag subject from sidebar onto grid, opens modal to set time, duration, room, online/physical. Edit existing slots by tap. Color preview matches subject. Conflict detection highlights overlapping classes in red. Validation before save. Clone from previous semester prepopulates grid. Undo/redo stack. Preview mode toggle. Export as PDF/image. Publish notification to students.

#### **ClassSlot.js**
Individual class block within timetable. Compact view shows subject code, time. Expanded view shows subject name, lecturer, room, additional details. Online indicator (video icon). Physical location (map pin icon). Color bar on left from subject theme. Status dot (upcoming: gray, in progress: green, completed: blue). Tap action opens details bottom sheet. Long-press shows quick actions: edit, delete, reschedule (admin only), join, navigate. Loading skeleton while fetching.

---

### **Assignment Components**

#### **AssignmentCard.js**
Card with assignment title in bold. Type badge (Assignment/CAT/Exam) with color: blue/yellow/red. Subject name in secondary text. Due date with countdown timer, color-coded urgency (green: >3 days, yellow: 1-3 days, red: <1 day, gray: overdue). Status indicator (Not Submitted/Submitted/Graded). Score badge if graded (circular progress with percentage). Quick submit button if not submitted. Swipe actions: view details, submit, delete (if draft). Press animation navigates to details.

#### **AssignmentList.js**
Segmented tabs: Pending, Submitted, Graded. Sorted by due date (Pending), submission date (Submitted), graded date (Graded). Filter button opens bottom sheet: subject filter, type filter, date range. Search by title. Empty states per tab with illustrations and messages. Pull-to-refresh. Infinite scroll for long lists. Section headers by month. Overdue assignments at top with warning banner. Loading skeletons maintain layout.

#### **AssignmentDetails.js**
Header with assignment title, subject badge, type badge. Due date with large countdown. Description section with rich text formatting, expandable if long. Attachments section with file previews (thumbnails for images, icons for others). Download all button. Requirements checklist if structured. Submission section: upload area (drag-drop or file picker), file preview after selection, file name, size, remove button. Submit button fixed at bottom, disabled until file selected. Submission confirmation dialog. Submitted view shows file, submission date, awaiting grade message. Graded view shows score with circular progress, feedback text in card, lecturer comments, resubmit option (if allowed).

#### **SubmissionForm.js**
Step wizard or single-screen form. File upload section prominent with drag-drop zone. File type validation based on assignment requirements. Optional text submission area (WYSIWYG editor). Late submission warning if past due date. Confirmation checkbox "I certify this is my own work". Preview button shows what will be submitted. Submit button with loading state. Upload progress bar with percentage. Network failure handling with retry. Success animation and auto-redirect. Draft save option throughout process.

#### **SubmissionsList.js** (Lecturer)
Table or card list of all student submissions for assignment. Columns/fields: Student name with avatar, submission date/time, status (Submitted/Graded), score, actions. Filter: All/Graded/Ungraded. Search by student name. Sort by name, date, score. Bulk actions toolbar appears when items selected: download all, grade all with template. Each row expandable to preview file inline. Grade button opens modal. Overdue submissions highlighted. Export list as CSV. Stats card at top: total submitted, graded, average score.

#### **GradingInterface.js** (Lecturer)
Split-screen layout. Left: file preview (PDF viewer, image viewer, or text display). Right: grading panel. Marks input with slider or number field, total marks displayed. Rubric checklist if predefined. Feedback textarea with rich text formatting. Comment templates dropdown for common feedback. Save draft button. Submit grade button triggers confirmation. Navigation to next/previous submission. Student info card: name, photo, student ID, previous submissions. Plagiarism check indicator (future feature). Keyboard shortcuts for fast grading. Auto-save drafts every 30 seconds.

---

### **Attendance Components**

#### **AttendanceCard.js**
Card for single attendance session. Header: subject name, date, time. Class type badge (Physical/Online). Location shown for physical with map preview. Status: Active (green border), Ended (gray). Student perspective shows "Mark Attendance" button (primary CTA). Lecturer perspective shows "Generate QR" and "Manual Mark" buttons. Stats row: marked/total, percentage. List of students with status icons (green check, red cross, yellow clock for late, gray dash for excused). Real-time updates via WebSocket. Press animation navigates to details.

#### **QRScanner.js**
Full-screen camera view with scanning frame in center. Animated corner brackets pulsing. Instructions text above frame: "Scan the QR code displayed by your lecturer". Torch toggle in top corner for low light. Gallery button to scan from image. Beep sound and haptic feedback on successful scan. Processes QR data (validates token, checks expiry, verifies location if needed). Shows success animation (checkmark) or error message. Handles permissions gracefully (requests camera access, shows instructions if denied). Cancel button to dismiss.

#### **QRGenerator.js** (Lecturer)
Large QR code displayed center-screen. Subject and class details above. Timer showing expiry countdown (5 minutes). Refresh button to generate new QR (invalidates old). Brightness boost to maximum for better scanning. Full-screen option. Instruction text for students. Student list below showing who has scanned (real-time updates). Manual mark button for students having issues. Auto-mark absent button when session ends. Share QR as image option. QR contains: attendance ID, security token, expiry timestamp.

#### **AttendanceStats.js**
Dashboard showing student's attendance data. Overall percentage in large circular progress indicator. Subject breakdown: list of subjects with mini progress bars, percentages, counts (present/total). Calendar heat map view showing daily attendance pattern (GitHub contribution style). Color intensity shows attendance: green shades for present, red for absent, gray for no class. Monthly/semester/year views. Trend chart (line graph) over time. Comparison to class average (if available). Warnings if falling below threshold. Insights: "You have perfect attendance in 3 subjects!". Export report button.

#### **ExcuseForm.js**
Form for submitting absence excuse. Date picker for absence date (pre-filled if from specific session). Reason text area (multiline). Category dropdown (Sick, Family Emergency, Religious, Official, Other). Attachment upload (medical certificate, etc.). Submit button. Preview of submission. Status tracking after submission (Pending/Approved/Rejected). Notification when lecturer responds. History of past excuses with outcomes. Character limit on reason (500 chars). Validation prevents spam submissions.

#### **AttendanceReport.js**
Detailed report view for a session. Header: subject, date, time, class type. Statistics cards: total students, present, absent, late, excused. Percentages and color-coded indicators. Student list with filters (All/Present/Absent/Late/Excused). Each student row: avatar, name, status with icon, time marked (if present), excuse reason (if applicable). Lecturer actions per student: change status, approve excuse, add note. Export options: PDF, CSV, Excel. Chart showing attendance trend for this subject over time. Comparison to previous sessions. Email report button sends to course coordinator.

---

### **Online Class Components**

#### **ClassRoom.js**
Full-screen video conferencing interface. Main video container at top (lecturer stream or screen share). Participant thumbnails in horizontal scroll at bottom (max 6 visible, scroll for more). Control bar at bottom-center: mic toggle (muted/unmuted icon with visual feedback), camera toggle, end call (red phone icon), switch camera (front/back), screen share (lecturer only), more options (overflow menu). Floating chat button in bottom-right corner (badge shows unread count). Participant list button in top-right (count displayed). Network indicator in top-left (bars showing connection quality with color). UI auto-hides after 3 seconds of inactivity, tap to show. Muted users have indicator on thumbnail. Speaking indicator (pulsing border) on active speaker.

#### **VideoPlayer.js**
Video container with aspect ratio maintained. Loading state shows spinner and "Connecting..." text. Poor connection shows blur effect and warning banner. Pinch-to-zoom on mobile. Double-tap switches between fit and fill modes. Picture-in-picture mode when minimizing app. Video quality indicator (HD/SD/LD). Automatic quality adjustment based on bandwidth. Pause/resume on background/foreground. Screenshot disabled for privacy. Name label on hover/tap. Maximized mode on tap (lecturer video fills screen).

#### **ParticipantsList.js**
Slide-in drawer from right. Header shows total participant count and "Close" button. Search bar to filter participants by name. List with avatars, names, role badges (Lecturer/Student). Status indicators: mic on/off, camera on/off, hand raised (yellow hand icon), connection quality (bars). Lecturer controls per student: mute/unmute, remove from class, spotlight video, make co-host. Admit waiting participants section at bottom (if waiting room enabled). Alphabetical sort option. Copy participant list button. Export attendance automatically on class end.

#### **ChatBox.js**
Slide-in panel from right side. Header: "Chat" title, participant count, close button. Message list with avatars, names, timestamps. Messages support text, emojis, links (auto-detected and clickable). Sent by current user aligned right. System messages centered (user joined/left). Input bar at bottom with text field, emoji picker button, send button. Character limit (500). Typing indicators show "[Name] is typing...". Scroll to bottom button when not at latest. Lecturer can disable chat or enable Q&A mode only. Delete message option for own messages. Report message option. Unread message badge updates.

#### **ScreenShare.js**
Screen sharing controls for lecturer. "Share Screen" button opens native picker (select entire screen, specific window, or specific app). Preview of what's being shared. Stop sharing button (red, prominent). Quality toggle (Optimize for text/video). Cursor visibility toggle. Audio from screen option (system sounds). Notification to participants "Lecturer is sharing screen". Student view switches main video to screen content. Original lecturer video moves to thumbnail. Annotations toolbar for lecturer (draw, pointer, highlighter). Clear annotations button.

#### **ClassControls.js** (Lecturer)
Extended control panel for lecturers. Participant management: mute all, unmute all, remove participant, admit from waiting room. Recording controls: start/stop recording, pause, recording indicator. Layout options: speaker view, gallery view, spotlight student. Breakout rooms: create rooms, assign students, broadcast message, end breakout rooms. Polls: create quick poll, share results. Whiteboard: open collaborative whiteboard. Settings: enable waiting room, lock meeting, disable chat, disable screen share. End class for all button (confirmation required). Class statistics: duration, participant count over time, chat activity.

---

### **Group Components**

#### **GroupCard.js**
Card with institution logo as background (faded). Group name in bold headline. Type badge (Institution/Faculty/School/Department/Course/Year). Member count with people icon. Notification badge in top-right (unread count). Admin users have crown icon displayed. Color-coded border by group type. Press animation navigates to group details. Long-press shows quick actions: mute notifications, leave group (confirmation required), view info. Shimmer loading during fetch. Recent activity indicator (green dot if new posts today).

#### **GroupList.js**
Hierarchical tree view or flat list toggle. Tree view shows collapsible sections per hierarchy level. Indentation shows nesting. Expand/collapse icons (chevrons). Breadcrumb at top shows current path. Flat list shows all groups with type labels. Search filters by name. Filter chips: My Groups, All Groups, Muted. Sort options: Recently Active, A-Z, Member Count. Pull-to-refresh. Empty state for new users: "You'll be automatically added to groups based on your course". Skeleton loaders maintain hierarchy during load.

#### **GroupDetails.js**
Header section: large group name, institution logo, type badge, member count. Tabs below: Feed, Members, Files, Elections. Feed tab shows announcement cards chronologically, posted by admins. Each announcement: admin avatar, name, timestamp, content (text/images), reactions (like, useful, important), comment count. Post announcement FAB (admin only). Members tab: searchable list, role filters (Admin/Student/Lecturer), cards with avatars and names, message button. Files tab: shared documents, upload button (admin), folder structure, search, preview. Elections tab: active election with candidates, vote button, countdown, results after closing. Settings button (admin): manage members, edit details, notification settings.

#### **MembersList.js**
List of group members with virtual scrolling for performance. Each item: circular avatar, full name, role badge (Admin/Student), online status indicator (green dot). Search bar at top. Filter chips: All, Admins, Students, Lecturers. Alphabet index for quick navigation on large lists. Section headers by first letter. Loading states for avatars. Tap member opens profile quick-view bottom sheet (if permitted). Admin view has additional controls: promote to admin, remove from group. Bulk select mode for admin actions. Export member list. Invite link generator (admin).

#### **GroupNotifications.js**
Specialized notification feed for group-specific items. Chronologically grouped (Today, Yesterday, This Week, Earlier). Each notification card: icon by type (announcement, timetable change, class reminder, assignment), title, preview text, timestamp. Unread notifications prominent with blue indicator and bold text. Expandable cards show full content. Action buttons relevant to notification type (view assignment, join class, confirm attendance). Swipe-to-delete or mark read. Filter by notification type. Mute notifications toggle at top. Clear all read button. Real-time updates via WebSocket.

#### **ElectionCard.js**
Card for single candidate in election. Large circular photo at top. Name below in bold. Course and year in secondary text. Optional manifesto/bio section (expandable). Vote count shown after election ends (hidden during voting). Vote button if election active and user hasn't voted. Selected state (checkmark overlay) after voting. Disabled state with "Voted" badge once user votes. Press animation on selection. Real-time vote count updates for transparency (optional setting). Winner announcement badge (gold crown) after results.

#### **VotingInterface.js**
Election dashboard. Header: election title, countdown timer to close, total votes cast. Candidate cards in scrollable list (use ElectionCard components). Single-select mode enforced. Confirm vote button at bottom, disabled until selection made. Confirmation dialog before submitting vote (vote is final). Success animation after voting. Results view (after election ends): candidates sorted by votes, percentages shown with progress bars, winner highlighted with animation. Voter turnout stats (X% of group voted). Share results option. Admin controls: end election early, extend deadline, announce winner, create admin role for winner.

---

### **Notification Components**

#### **NotificationCard.js**
Card with icon on left (color-coded by type), content on right. Title in bold. Message preview (truncated with "..."). Timestamp in relative format (Just now, 5m ago, 2h ago, Yesterday). Unread indicator (blue dot or background tint). Press to expand or navigate to related content. Long-press shows actions: mark read/unread, delete, mute this type. Swipe-left reveals delete button. Different icons: bell (general), calendar (class reminder), clipboard (assignment), chart (grade), megaphone (announcement), alert (urgent). Priority notifications have border accent.

#### **NotificationList.js**
Grouped list with section headers by date. Infinite scroll with load more. Filter button opens bottom sheet: type filters (checkboxes for each type), mark all as read button, notification settings link. Search functionality. Pull-to-refresh. Empty state: "You're all caught up!" with illustration. Unread tab shows only unread items. Archived tab for dismissed notifications. Bulk select mode with toolbar (mark read, delete). Real-time push causes smooth animation of new item sliding in at top. Badge count updates in header.

#### **NotificationBadge.js**
Small circular badge for displaying counts. Positioned absolutely on parent (top-right corner typical). Count displayed as number (99+ for values over 99). Colors: red for urgent, blue for info. Dot-only mode for "has items" without count. Pulse animation option for attention. Auto-hide when count is zero. Size variants: small (10px), medium (16px), large (20px). Supports custom positioning offsets. Used on tab bar icons, notification bell, group cards, message icons.

#### **NotificationSettings.js**
Settings screen for notification preferences. Grouped sections: Push Notifications (master toggle), Notification Types (each type with toggle: Assignments, Classes, Grades, Announcements, Social, Marketplace). Quiet Hours section with time range picker (mute notifications during these hours). Delivery method toggles: Push, Email, SMS. Sound picker (preview button for each sound). Vibration toggle. LED color picker (if supported). Group notification settings (mute specific groups). Do Not Disturb mode toggle. Test notification button. Save button with confirmation toast.

---

### **Social Components**

#### **PostCard.js**
Instagram-style post card. Header: circular avatar, username, institution badge (small logo), timestamp, three-dot menu (report, hide, unfollow). Content section: text with mentions/hashtags clickable, read more expand for long text, images in swipeable carousel with page indicators, video player with controls. Event banner (if event post) with date, location, RSVP button. Footer row: like button (heart icon, filled if liked), count, comment button, count, share button, bookmark button. Double-tap to like with heart animation. Press avatar or username navigates to profile. Smooth animations on interactions.

#### **PostList.js**
Feed with infinite scroll. Tabs at top: For You (algorithm), Following, Events. Pull-to-refresh. Video posts auto-play when in viewport (muted). Skeleton loaders between batches. Ad placeholders (future monetization). Sticky create post button (floating plus icon). Scroll-to-top button appears after scrolling down. Real-time updates show "New posts available" banner at top. Optimistic UI updates on like/comment. Empty states per tab with relevant messages and actions. Report inappropriate content flow.

#### **CreatePost.js**
Modal or full-screen form. Header: Cancel button, "New Post" title, Post button (disabled until valid). Profile picture and username at top. Text input (multiline, placeholder "What's on your mind?"). Character counter (max 1000). Image picker button adds up to 5 images (preview thumbnails with remove option). Video picker (single video, max 2 minutes). Event toggle shows additional fields: event title, date picker, location input with map. Visibility selector: Public, Institution Only, Specific Groups. Hashtag suggestions as you type. Mention autocomplete (@username). Draft auto-save. Media upload progress. Validation before posting.

#### **CommentSection.js**
Bottom sheet overlay showing comments. Header: "Comments" title, count, close button. Input bar at bottom (fixed): small avatar, text field, send button. Comment list: nested replies (indented), avatars, names, timestamps, text, like button with count. "Reply" button opens reply input. "Load more replies" for collapsed threads. Long-press comment for actions: delete (own comments), report (others' comments). Real-time updates add new comments smoothly. Empty state: "Be the first to comment". Keyboard avoidance pushes list up. Mentions and hashtags clickable.

#### **EventCard.js**
Special post card for events. Large banner image at top (event photo or default). Event title in headline text. Date badge with calendar icon in top-left corner of image. Time and location row with icons. Description text (expandable). Host information (user/organization). RSVP section: Going/Maybe/Can't Go buttons, attendee count and avatars. Share event button. Add to calendar button (generates ICS file). Comments section below. Map preview for location. Interested users list. Related events carousel at bottom. Expired events shown with "Past Event" overlay.

#### **EventsList.js**
Calendar-first view or list view toggle. Calendar shows dots on dates with events. List below shows upcoming events chronologically. Filter: All, This Week, This Month, Saved. Search by title or location. Category tags (Academic, Social, Sports, Cultural). Each card compact version of EventCard. Sort by date or popularity (attendee count). Empty state: "No upcoming events" with create event CTA. Past events in separate tab. Export to calendar button (all upcoming events).

#### **CreateEvent.js**
Multi-step form. Step 1: Event title, description (with rich text formatting). Step 2: Date and time pickers (start/end), all-day toggle. Step 3: Location input with map picker, virtual event toggle (adds link field). Step 4: Cover image upload with crop tool. Step 5: Privacy (Public/Institution/Specific Groups), RSVP required toggle. Review step shows preview. Save as draft button available throughout. Publish button at end. Share immediately after creation option. Template selector for recurring events (weekly class, monthly meet...Template selector for recurring events (weekly class, monthly meetup). Co-host invitation (add other users as organizers). Capacity limit field with waitlist option. Registration deadline picker. Tags/categories multi-select. External registration link field (for ticketed events). Reminder settings (notify attendees X days/hours before). Duplicate event option from past events. Preview mode shows exactly how event will appear. Auto-fill from previous events dropdown. Validation prevents missing required fields with inline error messages.

---

### **Marketplace Components**

#### **ItemCard.js**
Product card with square image at top (1:1 aspect). "Sold" overlay with opacity if unavailable. Condition badge in top-right corner (New/Used/Refurbished). Price in bold, large text with currency symbol. Title below (2 lines max with ellipsis). Location with pin icon and seller's institution badge. Seller avatar (small circle) in bottom-left. Time posted (relative: 2h ago). Wishlist heart icon in top-left corner (toggleable). Press animation navigates to details. Long-press shows quick actions: share, report, hide. Shimmer loading state maintains layout.

#### **ItemList.js**
Grid layout (2 columns on mobile, 3+ on tablet). Masonry layout option for varied image heights. Filter bar sticky at top: category chips (horizontal scroll), price range slider in bottom sheet, condition checkboxes, location radius selector. Sort dropdown: Recent, Price Low-High, Price High-Low, Most Viewed. Search bar with autocomplete suggestions. Active filters shown as dismissible chips below search. Pull-to-refresh. Infinite scroll with loading spinner. Empty state per category with relevant illustration. Featured listings at top (premium feature or admin curated).

#### **ItemDetails.js**
Image carousel at top (swipeable, zoom on tap, page indicators). Seller card below: avatar, name, institution, member since date, ratings (stars), message button, call button (if phone visible). Title in large text. Price prominent with negotiable badge if applicable. Condition and category badges. Description section (expandable if long). Specifications list (category-specific fields). Location with map preview. Posted date and view count. Similar items carousel at bottom. Action buttons fixed at footer: Message Seller, Make Offer, Report Listing. Share button in header. Image viewer opens gallery view on image tap. Breadcrumb navigation (Category > Subcategory).

#### **CreateListing.js**
Step-by-step wizard with progress indicator. Step 1: Category selection (icon grid). Step 2: Photos (up to 5, drag to reorder, crop tool, first image is cover). Step 3: Basic info (title with character limit, price input with currency selector, condition radio buttons). Step 4: Description (rich text editor with formatting, bullet points, character limit 1000). Step 5: Category-specific fields (e.g., books: ISBN, author, edition). Step 6: Location (auto-filled from profile, manual override, map picker). Step 7: Contact preferences (phone visibility toggle, preferred contact method). Review step shows preview. Save draft throughout. Publish button at end. Success screen with share options and view listing button.

#### **CategoryFilter.js**
Bottom sheet with category tree. Main categories (Books, Electronics, etc.) expand to subcategories. Checkbox selection (multi-select mode). Search within categories. Recently used categories section at top. Clear all button. Apply button with count of active filters. Visual icons per category for quick recognition. Nested levels indicated by indentation. Expandable/collapsible with animation. Badge count on categories showing available items. Back button for deep navigation. Breadcrumb shows current path.

#### **MyListings.js**
Tabs: Active, Sold, Drafts. Each listing card shows thumbnail, title, price, status, views count, messages count. Quick actions per listing: Edit, Mark as Sold, Delete, Boost (premium feature), Share. Analytics card at top: total views, total messages, conversion rate. Filter by category and date. Search own listings. Empty states per tab with create CTA. Swipe actions: edit (swipe right), delete (swipe left with confirmation). Bulk select mode for managing multiple listings. Export listing data. Performance insights (views over time chart).

---

### **Admin Components**

#### **AdminDashboard.js**
Stats overview cards: Total Students (with trend arrow), Total Subjects, Average Attendance, Pending Tasks (urgent badge). Quick actions grid: Manage Courses, Create Timetable, Upload Documents, Send Announcement, Manage Members, View Reports. Recent activity timeline: document uploads, timetable changes, member additions, with timestamps and actor names. Pending approvals section: election results, excuse requests, with approve/reject buttons. Notifications center widget. Calendar widget showing upcoming deadlines. Role indicator badge in header (Class Rep/Course Coordinator/etc.). Admin-specific color theme (purple/blue gradients).

#### **CourseManagement.js**
List of courses with expandable cards. Each card shows: course name, code, duration, department, enrolled students count. Expand shows subjects list, years, semesters. Edit button opens modal with form fields: name, code, department dropdown, duration (years), description textarea. Delete requires confirmation with warning about students enrolled. Add course FAB opens same modal empty. Drag handles on cards for reordering (priority). Bulk actions: export course list, merge courses, archive old courses. Search and filter (by department, active/archived). Validation prevents duplicate course codes.

#### **SubjectManagement.js**
Nested under courses or flat list view toggle. Subject cards show: name, code, lecturer (with assign/change button), year/semester, document count, student count. Quick actions per subject: Upload Syllabus (triggers AI processing with progress bar), Add Documents, View Details, Edit, Delete. Create subject modal: course dropdown, name/code fields, year/semester selectors, lecturer assignment. Bulk upload subjects via CSV template. Filter by course, lecturer, year. Sort by name, code, student count. Subject details modal shows stats, document list, assignment list, attendance data.

#### **DocumentUpload.js**
Bulk upload interface. Drag-drop zone accepts multiple files (PDFs, docs, images, videos). File list shows name, type icon, size, progress bar during upload. Subject assignment dropdown per file or batch assignment. Category tags (Lecture Notes, Tutorial, Past Paper, Reference). Week/topic assignment (links to syllabus structure). Visibility toggle (everyone/specific year). Upload queue with retry for failed uploads. Cloud storage usage indicator. Metadata fields: title, description, tags. OCR processing option for PDFs (premium). Success notification with view document links. Upload history log.

#### **TimetableCreator.js**
Advanced drag-drop builder. Left sidebar: available subjects list (collapsible by year), search subjects, lecturer filter. Center: weekly grid (days × time slots), zoom controls, view presets (week/day). Right sidebar: selected slot details (edit time, duration, room, online/physical, recurring option). Drag subject card to grid, opens modal for details. Visual conflict detection: overlapping slots highlighted red, lecturer double-booking shown, room conflicts. Validation rules: minimum break between classes, max hours per day, lecturer availability. Templates dropdown (load previous semesters, department standards). Clone semester feature pre-fills grid. Undo/redo history. Preview mode (student view). Publish with notification preview. Export options: PDF, image, Excel, iCal.

#### **MemberManagement.js**
Member directory with powerful filters. Search by name, ID, email. Filter panel: role (student/lecturer/admin), year, department, attendance range, enrollment date. List shows cards: avatar, name, ID, role badge, enrollment date, attendance %, last active. Bulk select mode: send email/notification, remove from group, change role, export selected. Add member button: email input (validates student email), role assignment, group assignment (auto or manual). Individual actions: view profile, edit role, remove (with confirmation and reassignment for admins), send message, view analytics. Admin promotion workflow: select user, choose admin type (class rep/course coordinator/etc.), assign permissions checklist, set term duration. Audit log shows all membership changes.

#### **PermissionsManager.js**
Matrix view or list view toggle. Matrix: rows are users (admins), columns are permissions, checkboxes at intersections. Permissions include: Manage Courses, Manage Timetable, Manage Documents, Manage Students, Approve Users, Send Notifications, Manage Elections, View Reports, Edit Group Details. Permission groups (presets): Class Rep Bundle, Course Coordinator Bundle, Timetable Manager Bundle. Individual permission toggles with descriptions on hover/tap. Changes require password confirmation. Activity log shows permission grants/revokes with timestamps. Role-based templates. Permission inheritance from parent groups. Expiry dates for temporary permissions.

#### **ElectionManager.js**
Election lifecycle manager. No Active Election view: Create Election button, past elections list. Create form: election title, position (Class Rep default), nomination period (start/end dates), voting period (dates), eligible candidates (student selection with search), eligible voters (whole group or filtered), anonymous voting toggle, require quorum (minimum votes). Active election dashboard: real-time vote counts (hidden or visible based on settings), voter turnout percentage with goal, progress bars per candidate, recent votes timeline, live activity feed. Monitoring panel: flag suspicious voting patterns, IP tracking (optional), revoke votes with justification. End election button (manual end before deadline). Post-election: winner announcement banner, runner-up displayed, detailed results with charts, export results, create admin role button (converts winner to admin with permission wizard), send congratulations notification, archive election.

---

### **Main Admin Components**

#### **MainAdminDashboard.js**
Executive overview with KPIs. Large stat cards: Total Institutions (with growth %), Total Users (breakdown: students/lecturers/admins), Active Sessions (real-time count), Monthly Revenue (premium subscriptions), Storage Used (platform-wide). Line charts: User growth over time (daily/monthly), Session activity (hourly heatmap), Revenue trends. Pending approvals counter with urgent badge (pulsing if >5). System health section: API status (green/yellow/red dot), Database connection, Storage availability, AI service status. Quick actions: Approve Institutions, Manage AI Config, View Reports, Platform Analytics, User Management, Billing. Recent activity log: new signups, institution applications, support tickets, with timestamps. Alerts panel: storage approaching limit, unusual activity, failed payments.

#### **InstitutionApproval.js**
Queue-based approval system. Pending applications list: institution cards with logo preview, name, country, application date, applicant email. Priority sorting (oldest first or flagged urgent). Card details expandable: full application form data, academic calendar structure, contact information, uploaded documents (verification certificates). Quick actions: Approve (green button), Reject (red, requires reason), Request More Info (opens email template). Bulk actions toolbar when multiple selected. Approve triggers: create institution in database, activate applicant as institution admin, send approval email with login instructions, add to institution directory. Reject triggers: send rejection email with reason, archive application. Activity log per institution: views, comments, status changes. Search and filter: by country, date range, status.

#### **AIModelSwitch.js**
AI provider configuration panel. Provider toggles: OpenRouter (master toggle), OpenAI (toggle). API key management: input fields (masked, reveal button), test connection button with loading state and success/failure message. Model selection for free tier: dropdown of available models (GPT-3.5, Llama, Claude Haiku), description and cost per model. Premium model selection: GPT-4, Claude Opus, custom models. Rate limiting settings: requests per hour per user (free tier), premium tier limits, burst allowance. Cost tracking: current month spend, cost per feature (chat, OCR, document processing), projected costs. Usage analytics: API calls timeline, most used models, peak usage hours, error rate chart. Fallback configuration: primary model fails → fallback model. Maintenance mode toggle: disable AI features with user message. Test panel: input text, select model, test response with latency shown.

#### **ReportsManager.js**
Report triage system. Tabs: Pending, Under Review, Resolved, Dismissed. Each report card: reporter (name, avatar), target (user/post/listing), type badge (Harassment/Spam/Inappropriate/Admin Abuse), severity (user-set or auto-flagged), submission date, status. Pending view: sort by severity and date. Open report details modal: full description, evidence attachments (screenshots, links), reporter history (serial reporter flagged), target user history (prior reports), AI content analysis (flags detected), similar reports (grouped). Action panel: Dismiss (with reason), Warn User (sends official warning), Suspend User (duration picker), Delete Content, Ban User (permanent), Contact Authorities (for serious issues). All actions require reason field and confirmation. Under Review: assigned to specific admin, add notes, change status. Resolved view: shows outcome, date, handling admin. Analytics: reports over time, most common types, resolution times, repeat offenders. Export reports for compliance.

#### **AnalyticsDashboard.js**
Comprehensive platform analytics with multiple views. Overview tab: headline metrics (DAU, MAU, retention rate, churn rate, ARPU), comparison to previous period with trend indicators. User analytics: registration funnel (started/completed onboarding), cohort retention heatmap, user engagement score distribution, top institutions by activity. Content analytics: posts created, documents uploaded, assignments submitted, messages sent, all with timeline charts. Feature usage: most used features (bar chart), feature adoption rates, unused features (candidates for removal). Financial: MRR, LTV, CAC, conversion funnel (free to premium), revenue by institution. Performance: API response times, error rates by endpoint, uptime percentage, storage IOPS. Geographic: user distribution map, institution locations, growth by region. Custom date range picker. Export all data as CSV/Excel. Scheduled email reports. Real-time dashboard updates via WebSocket.

---

### **Lecturer Components**

#### **LecturerDashboard.js**
Lecturer-optimized home view. Today's classes section: timeline of classes (upcoming/in progress/completed), countdown to next class, quick start class button. Stats row: Total Students (across all classes), Attendance Rate (average), Pending Submissions (needs grading), Average Grade. My Subjects list: subject cards with class count, next class time, pending tasks badge. Recent submissions widget: latest 5 submissions with student names, assignment titles, time submitted, grade button. Quick actions: Start Class, Create Assignment, Mark Attendance, Grade Work, Upload Material, Message Students. Calendar widget: upcoming classes and deadlines. Notifications for student questions. Color scheme: professional green/teal.

#### **CreateAssignmentScreen.js** (already described in screens, this is the component)
Form wizard component reusable for creating assignments. Step indicators at top (1/4, 2/4, etc.). Step 1 - Basics: assignment title input, type selector (radio buttons: Assignment, CAT, Exam), description rich text editor. Step 2 - Details: subject dropdown, group/class selection (multiple groups supported), due date/time picker with calendar, total marks input with validation. Step 3 - Attachments: file upload drag-drop zone, multiple files supported, preview thumbnails, remove option. Step 4 - Review: read-only summary of all fields, edit buttons per section, notes field for internal use. Navigation: Previous/Next buttons, save draft at any step, progress persists. Validation: inline errors, prevents next step if required fields missing. Submit button at final step with confirmation. Success modal with options: view assignment, create another, share with students.

#### **GradeSubmissionsScreen.js** (component version)
Grading workflow component. Header: assignment details card (title, due date, total marks, submission stats). Filter bar: show all/graded/ungraded, sort by name/date/status. Submission list: student cards with avatar, name, submission time, late badge if past due, file preview thumbnail, current grade (if any). Click submission opens grading modal: split view (file viewer left, grading panel right), navigation arrows for next/previous submission, marks input with slider, rubric checklist if configured, feedback text area with formatting, comment templates dropdown (commonly used feedback), save draft button, submit grade button. Bulk grading mode: select multiple submissions, apply same feedback template, set marks by percentage. Progress tracking: X of Y graded, estimated time remaining. Export grades as CSV. Email students when grades published. Undo grade option (within 24 hours).

#### **MarkAttendanceScreen.js** (component version)
Attendance marking wizard. Step 1 - Setup: subject selector, group selector, class type radio (Physical/Online), date/time pre-filled with current. Step 2 - Location (if physical): current location shown on map, set radius slider (default 100m), preview attendance zone on map. Step 3 - Method: QR code generation (full-screen QR with timer, refresh button, brightness boost), or Online link (generates join link, displays to students automatically). Step 4 - Monitor: student list with real-time status updates (WebSocket), marked count/total, percentage, students who marked shown with checkmark and time, unmarked shown with pending status. Manual override toggles per student. Excuse requests section: pending excuses with approve/reject. Auto-mark absent button sets all unmarked to absent after class end. End session button finalizes attendance. Export attendance sheet. Statistics: on-time percentage, late arrivals, habitual absentees flagged.

#### **StartClassScreen.js** (component version)
Pre-class launch checklist component. Header: class details (subject, time, group, estimated students). Checklist items with checkboxes: verify syllabus topic for today, materials ready (documents uploaded), attendance method selected, notification sent to students (auto or manual trigger). Class type selector: Online (shows video platform options, test camera/mic button, room link preview) or Physical (location confirmation, QR ready indicator). Recording preference toggle (record class yes/no, privacy notice). Start button (large, green, pulsing): countdown animation (3, 2, 1), launches video room or marks class as started. Active class management: participant count live, duration timer, quick controls (mute all, end class, share screen), attendance monitoring panel. End class requires confirmation, generates summary: attendees, duration, recording link (if applicable), auto-creates attendance record. Post-class: save notes, upload recording, schedule next class.

---

### **Payment Components**

#### **SubscriptionScreen.js** (component version)
Pricing comparison component. Current plan badge at top (Free/Premium). Two-column layout: Free and Premium with feature lists. Features categorized: AI Access (free: basic models, premium: GPT-4, Claude), Storage (free: 500MB, premium: 10GB), Support (free: email, premium: priority), Ads (free: yes, premium: no), Analytics (free: basic, premium: advanced). Visual checkmarks/crosses per feature. Premium column highlighted with gradient background. Pricing card: monthly/yearly toggle (yearly shows "Save 20%" badge), price display (large, bold), per-user pricing note. CTA button: "Upgrade to Premium" (prominent gradient button). FAQ accordion below: What's included? Can I cancel? Refund policy? Testimonial carousel from premium users. Trial offer banner: "7 days free trial". Current subscribers see: expiry date, renewal date, manage subscription button, cancel link (opens confirmation).

#### **PaymentScreen.js** (component version)
Payment processing form. Header: subscription summary (plan, duration, price). Payment methods tabs: Card, Mobile Money (M-Pesa for Kenya). Card tab: Stripe card element (number, expiry, CVC fields with validation and icons), cardholder name input, country dropdown, postal code. Mobile Money tab: phone number input with country code picker, provider dropdown (M-Pesa, Airtel Money), instructions text. Order summary section: subtotal, tax breakdown, discount (if promo applied), total (large, bold). Promo code input with apply button (validates and updates total). Terms checkbox: "I agree to Terms and Subscription Policy". Pay button (fixed at bottom): shows amount "Pay [Currency Amount]", disabled until valid, loading spinner during processing. Security badges: SSL lock icon, "Secure Payment" text, payment processor logos. Error handling: card declined shows error message and retry button, network error shows reconnect option.

#### **PaymentSuccessScreen.js** (component version)
Success confirmation screen. Animated checkmark (expanding circle with check) at top. "Payment Successful!" headline. Confetti animation (Lottie). Transaction details card: plan name, duration, amount paid, transaction ID (copyable), payment method, date/time. "What's Next" section: feature highlights (You now have access to GPT-4, 10GB storage unlocked, etc.), each with icon and description. Receipt section: view receipt button (opens PDF), email sent confirmation, download receipt link. CTA buttons: "Explore Premium Features" (primary), "Go to Dashboard" (secondary). Social share button: "I just upgraded to Premium!" (pre-filled text for Twitter/Facebook). Support link: "Need help? Contact Support". Celebration message: "Welcome to Premium! 🎉". Auto-redirect after 10 seconds with countdown.

---

### **Profile & Settings Components**

#### **ProfileHeader.js**
Hero section for profile. Large circular avatar (120px) center-aligned, edit button overlay on hover/press. Name below in headline font. Institution badge with logo. Course and year in secondary text. Role badge (Student/Lecturer/Admin). Premium badge if subscribed (gold crown icon). Stats row: Posts count, Listings count, Attendance rate (percentage), each tappable to view details. Edit profile button (pencil icon) opens edit modal. Background gradient or cover photo (uploadable). Online status indicator (green dot) on avatar. Share profile button generates shareable link. QR code button for profile (opens QR scanner/display).

#### **ProfileInfo.js**
Expandable information cards. Personal Information card: email (with verified badge), phone (with visibility toggle), date of birth, gender, location. Academic Information card: student ID, enrollment date, expected graduation, GPA (if available), major/minor. Bio section: editable text area, character limit (300), supports mentions/hashtags. Interests tags: add custom tags, used for recommendations. Social links: website, Twitter, LinkedIn, Instagram (icon buttons). Privacy settings inline: profile visibility (Public/Institution/Private), show email toggle, show phone toggle. Each card collapsible with chevron. Edit button per section opens inline editing or modal.

#### **EditProfile.js**
Modal form for editing profile. Tabs: Basic Info, Academic, Privacy. Basic Info: avatar upload (camera or gallery), name fields (first, last), bio textarea, phone input, location picker. Academic: institution dropdown (if changing), course dropdown, year selector, expected graduation date. Privacy: visibility radio buttons, contact preferences (email/phone/in-app), notification settings link. Social links section: input fields for URLs with validation. Save button (fixed at top-right), cancel button (closes without saving with confirmation if changes made). Real-time validation: email format, phone format, required fields. Character counters for limited fields. Image cropper for avatar upload. Success toast on save. Changes reflect immediately in profile view.

#### **SubscriptionCard.js**
Subscription status card in profile. Current plan badge (Free/Premium with icon). Free users see: plan name "Free Plan", features list (limited), storage used progress bar (X/500MB), CTA "Upgrade to Premium" button (gradient). Premium users see: plan name "Premium", expiry date "Renews on [Date]", features unlocked list (checkmarks), storage used (X/10GB), manage subscription button (opens payment portal), cancel subscription link (with confirmation flow). Trial users see: "Premium Trial", days remaining countdown, "Subscribe now to continue" CTA. Expired premium shows: "Subscription Expired", grace period message, renew now button. Visual hierarchy: plan name large, details smaller, CTA prominent.

#### **SettingsMenu.js**
Grouped settings list. Account section: Edit Profile, Change Password, Linked Accounts (OAuth providers), Email Preferences. Notifications section: Push Notifications (with toggle), Email Notifications (toggle), Notification Categories (opens detailed settings). Appearance section: Theme (Light/Dark/Auto with radio), Language (dropdown), Font Size (slider with preview). Privacy section: Profile Visibility, Data Sharing toggle, Block List, Two-Factor Authentication. Storage section: Manage Downloads, Clear Cache (shows size, clear button), Offline Mode toggle. About section: Version number, Terms of Service link, Privacy Policy link, Licenses, Rate App, Share App. Support section: Help Center link, Contact Support, Report a Problem, Send Feedback. Danger Zone section (red tint): Logout (confirmation), Delete Account (requires password, warning message). Each item with icon, chevron if navigates. Toggles show current state.

---

### **WebView Components**

#### **InstitutionWebView.js**
Embedded web view for institution website. Full-screen web view component. Top bar: institution logo, title, close button, reload button, forward/back navigation buttons (enabled/disabled based on history), share page button, open in browser button. Loading indicator (progress bar) while page loads. Error handling: connection error shows retry screen, 404 shows helpful message. JavaScript enabled with security considerations. Cookie handling for persistent login. Download handling: prompt to save files to device. Zoom controls optional. Safe browsing: blocks known malicious sites. URL whitelist for security (only institution domain). Native bridging: web page can trigger native features (camera, file upload) with permission prompts. Auto-fill credentials option (saved in secure storage). Bookmark/favorite button adds to quick access.

#### **StudentPortalWebView.js**
Wrapper for institution's student portal. Similar to InstitutionWebView but portal-specific. Auto-login injection if credentials stored (with permission). Session management: keeps portal session alive. Deep link handling: portal links open in-app instead of external browser. Screen recording disabled for privacy/security. Copy/paste functionality. Text selection and search. Native navigation back button closes webview. Orientation lock option. Cache management for performance. Offline detection shows message. Pull-to-refresh gesture. Page zoom gestures. Print page option. Form auto-fill from student profile data. Custom CSS injection for better mobile UX (optional). Logout button clears session and credentials.

---

Would you like me to continue with any specific component category in more detail, or move on to describing the services, hooks, or other parts of the architecture?