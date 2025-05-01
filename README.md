# Buzzinga Chat Application

A web application that allows users to chat with a Buzzinga AI assistant after authenticating with their Google account or email/password.

## Features

- User authentication (Google, Email/Password)
- Protected routes
- Embedded Buzzinga chat interface
- Modern Material-UI design
- Responsive layout

## Setup Instructions

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication methods in the Firebase Console:
   - Go to Authentication → Sign-in methods
   - Enable Google Authentication
   - Enable Email/Password Authentication
3. Get your Firebase configuration from Project Settings
4. Replace the Firebase configuration in `client/src/firebase.js` with your own
5. Add your domain (e.g., buzzingaai.github.io) to the authorized domains in Firebase Authentication settings
6. Install dependencies:
   ```bash
   cd client
   npm install
   ```
7. Start the development server:
   ```bash
   npm start
   ```

## Environment Setup

1. Make sure you have Node.js installed (version 14 or higher)
2. Install the required dependencies using npm
3. Configure Firebase with your project credentials

## Security

- All routes are protected and require authentication
- Google OAuth and Email/Password authentication are used for secure login
- Firebase security rules should be configured appropriately

## Technologies Used

- React
- Firebase Authentication
- Material-UI
- React Router
- Buzzinga AI Integration 