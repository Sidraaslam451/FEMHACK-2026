import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      const err = new Error('Message is required');
      err.statusCode = 400;
      throw err;
    }

    const systemPrompt = `You are a helpful assistant for SupportFlow, a customer support ticket platform. Answer questions about how to use the platform (submitting tickets, checking status, messaging agents) concisely and in a friendly tone. Keep responses under 3 sentences.`;

    const callModel = async (modelName) => {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}`);
      return result.response.text();
    };

    let reply;
    try {
      reply = await callModel(process.env.PRIMARY);
    } catch (primaryError) {
      console.error('Primary chat model failed:', primaryError.message);
      try {
        reply = await callModel(process.env.FALLBACK);
      } catch (fallbackError) {
        console.error('Fallback chat model failed:', fallbackError.message);
        reply = "Sorry, I'm having trouble responding right now. Please try again in a moment.";
      }
    }

    res.status(200).json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};