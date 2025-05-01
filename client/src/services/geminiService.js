import { GoogleGenerativeAI } from '@google/generative-ai';

// Replace with your actual API key
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

// Initialize the API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Access the model - use 'gemini-pro' for text, 'gemini-pro-vision' for images+text
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// History stores the conversation context
let chatHistory = [];

// Default language setting
let languagePreference = 'arabic';

// Set language preference
export const setLanguagePreference = (language) => {
  languagePreference = language.toLowerCase();
};

export const startNewChat = () => {
  chatHistory = [];
};

export const sendMessageToGemini = async (message, knowledgeBase = '') => {
  try {
    // For the first message or when using knowledge base, construct a special prompt
    const isFirstMessage = chatHistory.length === 0;
    let prompt = message;
    
    // Language instruction
    let languageInstruction = '';
    if (languagePreference === 'arabic') {
      languageInstruction = 'أرجو أن تجيب باللغة العربية الفصحى بأسلوب واضح ومباشر. ';
    }

    if (isFirstMessage && knowledgeBase) {
      prompt = `${languageInstruction}Use the following information as your knowledge base when responding to the user's query. 
Knowledge base:
${knowledgeBase}

User query: ${message}`;
    } else if (isFirstMessage) {
      prompt = `${languageInstruction}${message}`;
    } else {
      prompt = message;
    }

    // Add the user message to history
    chatHistory.push({ role: 'user', parts: [{ text: prompt }] });

    // Generate content from Gemini
    const result = await model.generateContent({
      contents: chatHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      },
    });

    const response = result.response;
    const text = response.text();

    // Add the assistant's response to history
    chatHistory.push({ role: 'model', parts: [{ text }] });

    return text;
  } catch (error) {
    console.error('Error communicating with Gemini:', error);
    return 'عذرًا، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.';
  }
};

// For loading knowledge base from file
export const loadKnowledgeBase = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsText(file);
  });
}; 