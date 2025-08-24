import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY!);

export interface GeminiSearchResult {
  id: string;
  title: string;
  summary: string;
  source: string;
  type: string;
  url: string;
  downloadUrl?: string;
  fileType?: 'PDF' | 'PPT' | 'DOCX';
}

/**
 * Searches for academic content using Google's Gemini AI
 * @param query The search query
 * @returns Promise with search results
 */
export async function searchWithGemini(query: string): Promise<GeminiSearchResult[]> {
  if (!API_KEY) {
    throw new Error('Gemini API key is not set in environment variables.');
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

    return parsed.map((item: GeminiSearchResult, i: number) => ({
      ...item,
      id: item.id || `${i + 1}`,
    }));
  } catch (error) {
    console.error('Gemini search error:', error);
    throw new Error('Failed to fetch results from Gemini');
  }
}
