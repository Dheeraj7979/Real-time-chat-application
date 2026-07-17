
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const agentController = async (req, res) => {

  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const response = await ai.models.generateContent({
      model: "models/gemini-3.1-flash-lite",
      contents: message,
    });


    return res.status(200).json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate response.",
      error: error.message,
    });
  }
};