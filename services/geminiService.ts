import { GoogleGenAI } from "@google/genai";
import { CrazyFoodCombo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFoodImage = async (combo: CrazyFoodCombo): Promise<string | null> => {
  try {
    // Construct a vivid prompt for the image generation model
    const prompt = `
      A photorealistic, high-quality professional food photography shot of a crazy food combination.
      
      The dish is: ${combo.base.nameEn}.
      
      IMPORTANT visual details:
      1. The main body/substance of the ${combo.base.nameEn} is made entirely of ${combo.mainIngredient.nameEn}.
      2. It is topped with or accompanied by ${combo.toppingIngredient.nameEn}.
      
      Make it look distinct, appetizing yet weird. Bright lighting, vibrant colors.
      Center composition.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    // Extract the image from the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64Data}`;
      }
    }

    console.warn("No image data found in response");
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};