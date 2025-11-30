import { GoogleGenAI } from "@google/genai";
import { Message, Mood } from "../types";

// Helper to sanitize history for Gemini
const formatHistory = (messages: Message[]) => {
  return messages
    .filter(m => !m.isRecalled) // Ignore recalled messages
    .map(m => {
      // Handle multimodal inputs
      if (m.type === 'image') {
         // Extract base64 data (assuming data:image/png;base64,...)
         const base64Data = m.text.split(',')[1];
         const mimeType = m.text.split(';')[0].split(':')[1];
         
         return {
             role: m.role,
             parts: [
                 { inlineData: { mimeType, data: base64Data } },
                 { text: m.role === 'user' ? "I sent an image." : "Here is an image." }
             ]
         };
      }

      let content = m.text;
      if (m.type === 'sticker') {
        content = "[Sent a sticker]";
      } else if (m.type === 'video') {
        content = "[Sent a video file]";
      }
      
      if (m.replyTo) {
        content = `> Replying to ${m.replyTo.senderName}: "${m.replyTo.text}"\n\n${content}`;
      }
      return {
        role: m.role,
        parts: [{ text: content }]
      };
    });
};

export const generateResponse = async (
  apiKey: string,
  systemInstruction: string,
  history: Message[],
  newMessage: { text: string; type: 'text' | 'sticker' | 'image' | 'video' },
  context?: { replyTo?: Message; userMood?: Mood }
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We use generateContent with the full history + system instruction
    const recentHistory = history.slice(-15); 
    
    // Append mood to system instruction if available
    let enhancedSystemInstruction = systemInstruction;
    if (context?.userMood) {
        enhancedSystemInstruction += `\n\n[Context] User's current Status/Mood: ${context.userMood.emoji} ${context.userMood.content}. If relevant, you may acknowledge it naturally.`;
    }

    // Append context to the new message if exists
    let finalMessageParts: any[] = [];
    
    // Handle the text part with reply context
    let textContent = newMessage.text;
    if (newMessage.type === 'sticker') textContent = '[Sent a sticker]';
    if (newMessage.type === 'video') textContent = '[Sent a video]';
    if (newMessage.type === 'image') textContent = '[Sent an image]'; // Helper text

    if (context?.replyTo) {
        const replyContext = context.replyTo.type === 'sticker' ? '[Sticker]' : context.replyTo.text;
        textContent = `> (Replying to: "${replyContext}")\n${textContent}`;
    }
    
    // If it's an image, we need to send the image part + text part
    if (newMessage.type === 'image') {
        const base64Data = newMessage.text.split(',')[1];
        const mimeType = newMessage.text.split(';')[0].split(':')[1];
        finalMessageParts.push({ inlineData: { mimeType, data: base64Data } });
    }
    
    finalMessageParts.push({ text: textContent });

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: enhancedSystemInstruction,
        temperature: 0.8,
      },
      history: formatHistory(recentHistory)
    });

    const result = await chat.sendMessage({
      message: finalMessageParts
    });

    return result.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Let's try again in a moment.";
  }
};

export const generatePersonaDescription = async (apiKey: string, title: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, concise system instruction for an AI to roleplay as a "${title}". 
            It should be 2-3 sentences max. Focus on tone and typical topics. 
            Do not include "Here is a system instruction" just output the instruction.`,
        });
        return response.text.trim();
    } catch (error) {
        return `You are acting as: ${title}. Stay in character.`;
    }
}