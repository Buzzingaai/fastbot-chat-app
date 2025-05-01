# BUZZINGA Chat Application

A React-based chat application with Firebase authentication and Gemini AI integration.

## Setup Instructions

### 1. Gemini API Key Setup

To use the Gemini AI features, you need to:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to get a Gemini API key
2. Create a `.env` file in the client directory with:
   ```
   REACT_APP_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
3. Replace `your_actual_gemini_api_key_here` with the API key you obtained

### 2. Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### 3. Features

- Firebase authentication (Google and email/password)
- Gemini AI chatbot integration
- Knowledge base management system
- Admin dashboard for user management

### 4. Deployment

This application is deployed to GitHub Pages at:
https://buzzingaai.github.io/fastbot-chat-app/ 