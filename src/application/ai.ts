import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import { it } from "node:test";

dotenv.config();

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messages: { role: "user" | "assistant"; content: string }[] = [];

export const respondToAIQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.body;
    const client = new OpenAI();

    messages.push({
      role: "user",
      content: query,
    });

    const response = await client.responses.create({
      model: "gpt-5",
      input: query,
      instructions:
        "You are an expert hotel booking assistant. Provide helpful and concise information related to hotel bookings, amenities, locations, and services. Use a friendly and professional tone.If the user try to deviate from the topic of hotel bookings,It is not valid ask relevant questions and gently steer the conversation back to relevant subjects.",
    });
    const resp = response["output"];

    const extractedText = resp
      .filter((item) => item.type === "message")
      .map((item) => item.content)
      .flat()
      .map((contentItem: any) => contentItem.text);

    messages.push({
      role: "assistant",
      content: extractedText[0],
    });

    console.log("AI Response:", messages); // Debugging line

    res.status(200).json({ output: extractedText[0] });
  } catch (error) {
    next(error);
  }
};
