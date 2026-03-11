// backend/services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function askGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  return result.response?.text() ?? "";
}
