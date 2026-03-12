import { GoogleGenAI, Type } from "@google/genai";
import { MediaFrame, ModelType } from "../types";

// In AI Studio, process.env.GEMINI_API_KEY is injected.
// When running locally (e.g. Android Studio), we need to use import.meta.env.VITE_GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export async function analyzeMedia(frames: MediaFrame[], modelType: ModelType = 'gemini-3.1-pro', learningCount: number = 0) {
  try {
    const contents: any[] = frames.map(frame => ({
      inlineData: {
        data: frame.base64Data,
        mimeType: frame.mimeType,
      }
    }));

    let prompt = "Analyze these sequential frames extracted from a video (or a single image). Focus especially on: 1. Hands and fingers (extra/missing digits, unnatural blending). 2. Written text (gibberish, morphing letters). 3. SynthID watermarks or Veo artifacts. 4. Temporal inconsistencies between frames. If you are absolutely certain it is AI based on these factors, return a score of 100. Determine the probability that this media is AI-generated. Return a JSON object with two fields: 'score' (a number from 0 to 100, where 0 is definitely real and 100 is definitely AI) and 'reason' (a short 1-sentence explanation focusing on the specific artifacts or consistencies found).";

    if (modelType === 'mirage-1.0') {
      prompt += ` You are acting as Mirage 1.0, a self-learning model continuously fine-tuned on user data, currently trained on ${learningCount} user scans. Emphasize your specialized training and high confidence in the reason.`;
    }

    contents.push(prompt);

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: "Probability from 0 to 100",
            },
            reason: {
              type: Type.STRING,
              description: "A short 1-sentence explanation",
            },
          },
          required: ["score", "reason"],
        },
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Error analyzing media:", error);
    return { score: 50, reason: "Error analyzing media. Could not determine." };
  }
}


