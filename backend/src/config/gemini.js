import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY missing");

const client = new GoogleGenerativeAI(apiKey);

export const DEFAULT_MODEL = "gemini-2.5-flash";

export const ai = {
  
  generateText: async ({ model = DEFAULT_MODEL, input = "" } = {}) => {
    const modelInstance = client.getGenerativeModel({ model });
    const result = await modelInstance.generateContent(input);
    const text = result?.response?.text?.() ?? "";
    return { text, raw: result };
  },
};
