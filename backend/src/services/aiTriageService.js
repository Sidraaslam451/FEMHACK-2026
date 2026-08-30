// backend/src/services/aiTriageService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildPrompt = (subject, description) => `
You are a customer support triage assistant. Analyze this customer ticket and respond with ONLY valid JSON, no markdown, no extra text.

Ticket Subject: ${subject}
Ticket Description: ${description}

Respond in this exact JSON format:
{
  "category": "Billing" | "Technical" | "General" | "Account" | "Other",
  "priority": "Low" | "Medium" | "High",
  "summary": "one short sentence summarizing the issue"
}
`;

const parseAIResponse = (text) => {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  const validCategories = ['Billing', 'Technical', 'General', 'Account', 'Other'];
  const validPriorities = ['Low', 'Medium', 'High'];

  if (!validCategories.includes(parsed.category)) parsed.category = 'Other';
  if (!validPriorities.includes(parsed.priority)) parsed.priority = 'Medium';
  if (!parsed.summary || typeof parsed.summary !== 'string') {
    parsed.summary = 'No summary available';
  }

  return parsed;
};

const callModel = async (modelName, prompt) => {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseAIResponse(text);
};

export const triageTicket = async (subject, description) => {
  const prompt = buildPrompt(subject, description);

  try {
    const result = await callModel(process.env.PRIMARY, prompt);
    return { ...result, failed: false };
  } catch (primaryError) {
    console.error('Primary model failed:', primaryError.message);

    try {
      const result = await callModel(process.env.FALLBACK, prompt);
      return { ...result, failed: false };
    } catch (fallbackError) {
      console.error('Fallback model failed:', fallbackError.message);
      return {
        category: null,
        priority: null,
        summary: null,
        failed: true,
      };
    }
  }
};