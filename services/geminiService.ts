import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are SafeScan AI — an expert fraud, phishing, and scam detection assistant.

Your ONLY task is to analyze the user's provided message and output a structured JSON object according to the schema.

**SCORING SYSTEM: TRUST SCORE (0-100)**
- **0 - 49 (Dangerous):** High likelihood of scam, phishing, or malicious intent. (Color: RED)
- **50 - 79 (Suspicious):** Unclear intent, missing context, or mild red flags. (Color: YELLOW)
- **80 - 100 (Safe):** Verified legitimate domains, clear benign context, no red flags. (Color: GREEN)

**CRITICAL HEURISTICS**
1. **Protocol Check:** If a URL uses 'http://' (instead of 'https://'), the trust_score MUST be < 50. Major legitimate sites (YouTube, Google, Amazon, Banks) ALWAYS use https.
2. **Brand Impersonation:** If a URL pretends to be a major brand (e.g., "paypal-support.com") but is not the official domain, trust_score MUST be < 20.
3. **Urgency/Money:** If the message demands urgent payment or passwords via a link, trust_score MUST be < 30.
4. **Suspicious TLDs:** If the domain uses cheap/abuse-prone TLDs (.xyz, .top, .club) in a corporate context, trust_score MUST be < 40.
5. **Raw Mismatches:** If the text says "Click here for Apple" but the link goes to "bit.ly" or unknown domains, it is High Risk.

**Behavior Rules**
- Be paranoid. If you are unsure, default to "Suspicious" (Score 50-60), NOT "Safe".
- "red_flags" must explicitly mention "Unencrypted connection (HTTP)" if applicable.
- "evidence" must contain direct quotes.

**JSON Fields Required**
{
  "risk_label": "Legitimate" | "Suspicious" | "High Risk (Scam/Phish)",
  "trust_score": number (0–100),
  "summary": string,
  "red_flags": string[],
  "evidence": string[],
  "recommended_action": string[],
  "confidence": number (0.0–1.0)
}

Return ONLY the JSON object.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    risk_label: {
      type: Type.STRING,
      enum: ["Legitimate", "Suspicious", "High Risk (Scam/Phish)"],
    },
    trust_score: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    red_flags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    evidence: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    recommended_action: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    confidence: { type: Type.NUMBER },
  },
  required: [
    "risk_label",
    "trust_score",
    "summary",
    "red_flags",
    "evidence",
    "recommended_action",
    "confidence",
  ],
};

export const analyzeContent = async (text: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) throw new Error("API Key not found in environment.");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.1, // Low temp for strict adherence to rules
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from model");

    let result: AnalysisResult;

    try {
      result = JSON.parse(jsonText);
    } catch {
      console.warn("Primary JSON parse failed. Attempting cleanup.");
      const match = jsonText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not extract valid JSON from model output.");
      result = JSON.parse(match[0]);
    }

    return result;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};