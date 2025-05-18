import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY';

console.log('API Key Status:', OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY' ? 'Using fallback (incorrect)' : `Using environment variable: ${OPENAI_API_KEY.slice(0,4)}...${OPENAI_API_KEY.slice(-4)}`);

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

let chatHistory = [];
let languagePreference = 'arabic';

export const setLanguagePreference = (language) => {
  languagePreference = language.toLowerCase();
};

export const startNewChat = () => {
  chatHistory = [];
};

export const sendMessageToOpenAI = async (message, knowledgeBase = '') => {
  try {
    const isFirstMessage = chatHistory.length === 0;
    let prompt = message;

    let languageInstruction = '';
    if (languagePreference === 'arabic') {
      languageInstruction = 'أرجو أن تجيب باللغة العربية الفصحى بأسلوب واضح ومباشر. ';
    }

    if (isFirstMessage && knowledgeBase) {
      prompt = `${languageInstruction}Use the following information as your knowledge base when responding to the user's query.\nKnowledge base:\n${knowledgeBase}\n\nUser query: ${message}`;
    } else if (isFirstMessage) {
      prompt = `${languageInstruction}${message}`;
    }

    chatHistory.push({ role: 'user', content: prompt });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // ChatGPT 4.1 mini
      messages: chatHistory,
      temperature: 0.7,
      max_tokens: 800,
    });

    const text = response.choices[0].message.content;

    chatHistory.push({ role: 'assistant', content: text });

    return text;
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    if (OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY') {
      return 'خطأ في مفتاح API: تأكد من إضافة مفتاح OpenAI API الصحيح في ملف .env';
    } else {
      return 'عذرًا، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.';
    }
  }
};

export const loadKnowledgeBase = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};
