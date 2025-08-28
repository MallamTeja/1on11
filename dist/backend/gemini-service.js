"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWithGemini = void 0;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("./config");
const genAI = new generative_ai_1.GoogleGenerativeAI(config_1.config.gemini.apiKey);
/**
 * Searches for academic content using Google's Gemini AI
 * @param query The search query
 * @returns Promise with search results
 */
async function searchWithGemini(query) {
    if (!config_1.config.gemini.apiKey) {
        throw new Error('Gemini API key is not configured.');
    }
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `
You are an academic search assistant. For the query: "${query}", generate a JSON array of 4 relevant academic search results. Each object should have the following fields:

- id: a unique string
- title: a concise and relevant academic title
- summary: 2-3 sentence summary
- source: journal, university, or platform name
- type: article, video, presentation, or paper
- url: plausible content link
- downloadUrl (optional): for downloadable files
- fileType (optional): PDF, PPT, or DOCX
`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
            text.match(/```([\s\S]*?)```/) ||
            [null, text];
        const jsonText = jsonMatch[1].trim();
        const parsed = JSON.parse(jsonText);
        return parsed.map((item, i) => ({
            ...item,
            id: item.id || `${i + 1}`,
        }));
    }
    catch (error) {
        console.error('Gemini search error:', error);
        throw new Error('Failed to fetch results from Gemini');
    }
}
exports.searchWithGemini = searchWithGemini;
