import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export interface ClinicalAnalysis {
  diagnosis: {
    condition: string;
    confidence: number;
    reasoning: string;
  }[];
  risk_level: "Low" | "Moderate" | "High" | "Critical";
  recommendations: string[];
  suggested_tests: string[];
  clinical_notes: string;
}

export const analyzeClinicalCase = async (patientData: any): Promise<ClinicalAnalysis> => {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    You are a highly experienced Clinical Decision Support System (CDSS) AI.
    Analyze the following patient data and provide a structured clinical assessment.
    
    PATIENT DATA:
    ${JSON.stringify(patientData, null, 2)}
    
    INSTRUCTIONS:
    1. Provide a list of differential diagnoses ranked by confidence.
    2. Assess the overall risk level.
    3. Suggest immediate next steps and specific diagnostic tests.
    4. Include brief clinical reasoning for each diagnosis.
    5. Maintain a medically cautious tone.
    6. Do NOT provide final prescriptions.
    7. Include a disclaimer that this is for decision support only.
    
    OUTPUT FORMAT: JSON only.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnosis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                condition: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                reasoning: { type: Type.STRING },
              },
              required: ["condition", "confidence", "reasoning"],
            },
          },
          risk_level: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Critical"] },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggested_tests: { type: Type.ARRAY, items: { type: Type.STRING } },
          clinical_notes: { type: Type.STRING },
        },
        required: ["diagnosis", "risk_level", "recommendations", "suggested_tests", "clinical_notes"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const chatWithAssistant = async (messages: { role: "user" | "model"; content: string }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are MediSense AI, a Clinical Decision Support Assistant. Help medical professionals analyze cases, understand symptoms, and research medical literature. Always be cautious, provide differential diagnoses, and include a disclaimer that you are not a substitute for professional judgment.",
    },
  });

  const lastMessage = messages[messages.length - 1].content;
  const history = messages.slice(0, -1).map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  const result = await chat.sendMessage({
    message: lastMessage,
  });

  return result.text;
};
