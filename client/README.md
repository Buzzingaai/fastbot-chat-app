# BUZZINGA Chat Application

A React-based chat application with Firebase authentication and OpenAI integration (ChatGPT 4.1 mini).

## Setup Instructions

### 1. OpenAI API Key Setup

To use the chat features, you need to:

1. Obtain an API key from [OpenAI](https://platform.openai.com/)
2. Create a `.env` file in the client directory with:
   ```
   REACT_APP_OPENAI_API_KEY=your_actual_openai_api_key_here
   ```
3. Replace `your_actual_openai_api_key_here` with the API key you obtained

### 2. Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### 3. Features

- Firebase authentication (Google and email/password)
- OpenAI chatbot integration (ChatGPT 4.1 mini)
- Knowledge base management system
- Admin dashboard for user management

### 4. Deployment

This application is deployed to GitHub Pages at:
https://buzzingaai.github.io/fastbot-chat-app/
