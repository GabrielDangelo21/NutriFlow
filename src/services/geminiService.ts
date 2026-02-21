import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
// Note: In a real production app, you'd proxy this through a backend to protect the API key.
// Since this is a client-side only app for personal use, we use VITE_GEMINI_API_KEY.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// We use 2.5-flash as it's the fastest and supports multimodal (vision + text) optimally
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export interface AIAnalysisResult {
    name: string;
    items: string[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    portion: string;
}

const SYSTEM_PROMPT = `
You are NutriAI, an expert nutritionist and calorie estimator.
Analyze the provided image (or text description) of a meal.
Identify the food items, estimate the portion sizes, and calculate the approximate nutritional values.

CRITICAL INSTRUCTION: You MUST return ONLY a valid JSON object. Do not wrap the JSON in markdown blocks (e.g., no \`\`\`json). Do not add any conversational text before or after the JSON.

The JSON object MUST follow exactly this structure:
{
  "name": "A short, descriptive name of the dish (e.g., 'Frango Grelhado com Arroz')",
  "items": ["list", "of", "ingredients", "identified"],
  "calories": 450,
  "protein": 35,
  "carbs": 40,
  "fat": 15,
  "portion": "e.g., '1 prato médio' or '~350g'"
}

If you cannot identify any food in the image, or the text is not related to food, return exactly this JSON:
{
  "error": "Não foi possível identificar comida nesta imagem ou texto."
}
`;

/**
 * Helper to ensure we extract JSON even if the model hallucinates markdown wrappers
 */
function extractJSON(text: string): AIAnalysisResult {
    try {
        // Attempt to parse directly first
        return JSON.parse(text);
    } catch {
        // If it fails, try to strip markdown blocks
        const match = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
        if (match && match[1]) {
            return JSON.parse(match[1]);
        }
        // If it still fails, find the first '{' and last '}'
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            return JSON.parse(text.substring(start, end + 1));
        }
        throw new Error('Could not extract valid JSON from the response.');
    }
}

/**
 * Analyzes a text description of a meal
 */
export async function analyzeMealText(text: string): Promise<AIAnalysisResult> {
    if (!apiKey) throw new Error('Gemini API Key is missing.');

    try {
        const prompt = `${SYSTEM_PROMPT}\n\nUser Description: ${text}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const parsed = extractJSON(responseText);

        if (parsed && typeof parsed === 'object' && 'error' in parsed) {
            throw new Error(String((parsed as Record<string, unknown>).error));
        }

        return parsed;
    } catch (error) {
        console.error('Error in analyzeMealText:', error);
        throw error;
    }
}

/**
 * Analyzes an image of a meal
 * @param base64Image The base64 string of the image (without the data:image/jpeg;base64, prefix)
 * @param mimeType The mime type of the image (e.g., 'image/jpeg')
 */
export async function analyzeMealImage(base64Image: string, mimeType: string): Promise<AIAnalysisResult> {
    if (!apiKey) throw new Error('Gemini API Key is missing.');

    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType
            }
        };

        const result = await model.generateContent([SYSTEM_PROMPT, imagePart]);
        const responseText = result.response.text();

        const parsed = extractJSON(responseText);

        if (parsed && typeof parsed === 'object' && 'error' in parsed) {
            throw new Error(String((parsed as Record<string, unknown>).error));
        }

        return parsed;
    } catch (error) {
        console.error('Error in analyzeMealImage:', error);
        throw error;
    }
}
