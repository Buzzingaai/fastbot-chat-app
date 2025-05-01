# FastBot Chat Application

A web application that allows users to chat with a FastBot AI assistant after authenticating with their Google account.

## Features

- Google Authentication
- Protected routes
- Embedded FastBot chat interface
- Modern Material-UI design
- Responsive layout

## Setup Instructions

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Google Authentication in the Firebase Console
3. Get your Firebase configuration from Project Settings
4. Replace the Firebase configuration in `client/src/firebase.js` with your own
5. Install dependencies:
   ```bash
   cd client
   npm install
   ```
6. Start the development server:
   ```bash
   npm start
   ```

## Environment Setup

1. Make sure you have Node.js installed (version 14 or higher)
2. Install the required dependencies using npm
3. Configure Firebase with your project credentials

## Security

- All routes are protected and require authentication
- Google OAuth is used for secure authentication
- Firebase security rules should be configured appropriately

## Technologies Used

- React
- Firebase Authentication
- Material-UI
- React Router
- FastBot AI Integration 