import { GoogleGenerativeAI, type GenerationConfig } from "@google/generative-ai";

// 1. Initialize the SDK
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing in .env");

export const genAI = new GoogleGenerativeAI(apiKey);

// 2. Define standard configuration for ALL resume tasks
// This ensures consistency across your app
export const resumeModelConfig: GenerationConfig = {
    temperature: 0.1, // Low temperature = more factual, less creative (good for ATS)
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json", // Critical for parsing
};

// 3. Select the best model for the job
// 1.5-flash is faster and cheaper (often free) for text analysis
export const resumeModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: resumeModelConfig,
});