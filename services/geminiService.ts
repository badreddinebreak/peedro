
import { GoogleGenAI, Modality } from "@google/genai";

// Ensure the API key is set in the environment variables
// Vite exposes env vars via define in vite.config.ts mapping to process.env.API_KEY
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function summarizeText(text: string): Promise<string> {
  if (!ai) throw new Error("API Key is missing. Please configure VITE_API_KEY in your Vercel settings.");
  if (!text.trim()) {
    throw new Error("Input text cannot be empty.");
  }

  const model = 'gemini-2.5-flash';
  const prompt = `Please provide a concise summary of the following document. Focus on the key points and main ideas. The summary should be easy to understand for a general audience.

Document:
---
${text}
---

Summary:`;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.3,
        topP: 0.9,
        topK: 20,
      }
    });
    
    const summary = response.text;

    if (!summary) {
      throw new Error("The AI did not return a summary. The content might be inappropriate or empty.");
    }

    return summary.trim();
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    if (error.message.includes('API key not valid')) {
        throw new Error("The provided API key is invalid. Please check your configuration.");
    }
    throw new Error("Failed to generate summary from AI. Please try again later.");
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!ai) throw new Error("API Key is missing. Please configure VITE_API_KEY in your Vercel settings.");
  if (!text.trim()) {
    throw new Error("Input text cannot be empty.");
  }
  if (!targetLanguage) {
    throw new Error("Target language must be specified.");
  }

  const model = 'gemini-2.5-flash';
  const prompt = `Translate the following text to ${targetLanguage}. Return only the translated text, without any additional comments or explanations.

  Text:
  ---
  ${text}
  ---

  Translation:`;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    const translation = response.text;

    if (!translation) {
      throw new Error("The AI did not return a translation.");
    }

    return translation.trim();
  } catch (error: any) {
    console.error("Error calling Gemini API for translation:", error);
    if (error.message.includes('API key not valid')) {
        throw new Error("The provided API key is invalid. Please check your configuration.");
    }
    throw new Error("Failed to generate translation from AI. Please try again later.");
  }
}

export async function correctText(text: string): Promise<string> {
    if (!ai) throw new Error("API Key is missing. Please configure VITE_API_KEY in your Vercel settings.");
    if (!text.trim()) {
        throw new Error("Input text cannot be empty.");
    }

    const model = 'gemini-2.5-flash';
    const prompt = `Please correct the spelling and grammar of the following text. Return only the corrected text, without any explanations or comments about the changes.

    Original Text:
    ---
    ${text}
    ---

    Corrected Text:`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        const corrected = response.text;

        if (!corrected) {
            throw new Error("The AI did not return a corrected text.");
        }

        return corrected.trim();
    } catch (error: any) {
        console.error("Error calling Gemini API for text correction:", error);
        if (error.message.includes('API key not valid')) {
            throw new Error("The provided API key is invalid. Please check your configuration.");
        }
        throw new Error("Failed to correct text with AI. Please try again later.");
    }
}

export async function removeBackground(base64ImageData: string, mimeType: string): Promise<string> {
    if (!ai) throw new Error("API Key is missing. Please configure VITE_API_KEY in your Vercel settings.");
    if (!base64ImageData) {
        throw new Error("Image data cannot be empty.");
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: 'Remove the background from this image, making it transparent. Return only the subject with a transparent background.',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                return part.inlineData.data;
            }
        }
        
        const textResponse = response.text;
        if (textResponse) {
            if (textResponse.toLowerCase().includes("i can't") || textResponse.toLowerCase().includes("i am unable")) {
                 throw new Error(`AI was unable to process the image: "${textResponse}"`);
            }
        }

        throw new Error("The AI did not return an image. It might not have been able to process the request.");

    } catch (error: any) {
        console.error("Error calling Gemini API for background removal:", error);
        if (error.message.includes('API key not valid')) {
            throw new Error("The provided API key is invalid. Please check your configuration.");
        }
        throw new Error("Failed to remove background with AI. Please try again later.");
    }
}

export async function editImage(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
    if (!ai) throw new Error("API Key is missing. Please configure VITE_API_KEY in your Vercel settings.");
    if (!base64ImageData) {
        throw new Error("Image data cannot be empty.");
    }
    if (!prompt.trim()) {
        throw new Error("Edit instructions (prompt) cannot be empty.");
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                return part.inlineData.data;
            }
        }
        
        const textResponse = response.text;
        if (textResponse) {
            if (textResponse.toLowerCase().includes("i can't") || textResponse.toLowerCase().includes("i am unable")) {
                 throw new Error(`AI was unable to process the image: "${textResponse}"`);
            }
        }

        throw new Error("The AI did not return an image. It might not have been able to fulfill the edit request.");

    } catch (error: any) {
        console.error("Error calling Gemini API for image editing:", error);
        if (error.message.includes('API key not valid')) {
            throw new Error("The provided API key is invalid. Please check your configuration.");
        }
        throw new Error("Failed to edit image with AI. Please try again later.");
    }
}

export async function extractCsvFromImage(base64ImageData: string, mimeType: string): Promise<string> {
    if (!ai) throw new Error("API Key is missing. Please configure VITE_API_KEY in your Vercel settings.");
    if (!base64ImageData) {
        throw new Error("Image data cannot be empty.");
    }
    
    const textPart = {
        text: `Analyze this image of a document page. Identify any tables.
        Extract all data from any tables found and format it as clean CSV (Comma Separated Values).
        - Use a comma (,) as the delimiter.
        - Enclose fields in double quotes ("") if they contain commas or newlines.
        - If multiple tables exist, separate their CSV data with two blank newlines.
        - If no tables are found on this page, return the exact text: NO_TABLES_FOUND
        Return ONLY the CSV data or the specified text for no tables. Do not include markdown formatting, explanations, or any other text.`,
    };

    const imagePart = {
        inlineData: {
            mimeType: mimeType,
            data: base64ImageData,
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const csvData = response.text;

        if (!csvData) {
            throw new Error("The AI did not return any data.");
        }

        return csvData.trim();

    } catch (error: any) {
        console.error("Error calling Gemini API for table extraction:", error);
        if (error.message.includes('API key not valid')) {
            throw new Error("The provided API key is invalid. Please check your configuration.");
        }
        throw new Error("Failed to extract table data with AI. The page might be too complex or contain no clear tables.");
    }
}
