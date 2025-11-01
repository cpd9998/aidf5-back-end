import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import { it } from "node:test";
import Hotel from "../infrastructure/entities/Hotel";

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
    const hotelData = await Hotel.find();

    const client = new OpenAI();

    messages.push({
      role: "user",
      content: query,
    });

    const response = await client.responses.create({
      model: "gpt-5",
      input: query,
      instructions:
        "You are a helpful assistant that helps users to choose a hotel for vibe they describe.the available hotels are given below.Based on that recommend them a hotel along with information: " +
        JSON.stringify(hotelData),
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

    res.status(200).json({
      response: extractedText[0],
    });
  } catch (error) {
    next(error);
  }
};
