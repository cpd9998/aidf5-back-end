import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY in environment variables.");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function embed(
  text: string,
  model = "text-embedding-3-small"
): Promise<number[]> {
  if (!text || !text.trim()) {
    throw new Error("embed(text): `text` must be a non-empty string.");
  }

  const res = await client.embeddings.create({
    model,
    input: text,
    dimensions: 1536,
  });

  const vector = res.data?.[0]?.embedding;
  if (!vector) {
    throw new Error("No embedding returned from OpenAI.");
  }
  return vector;
}
