// services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAE23xoltgfj0_Ly6acD65SSS24vZ4N6AM";
const genAI = new GoogleGenerativeAI(apiKey);

export async function askGemini(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  const result = await model.generateContent(prompt);
  if (!result) {
    alert(result)
  }
  return result.response.text();
}