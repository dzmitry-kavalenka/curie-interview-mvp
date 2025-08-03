import OpenAI from "openai";
import {
  MAX_RETRIES,
  RETRY_DELAY_MS,
  OPENAI_MODEL,
  OPENAI_MAX_TOKENS,
  OPENAI_TEMPERATURE,
} from "@/shared/config/config";
import { delay } from "./pdf-utils";
import { SUMMARY_SYSTEM_PROMPT, SUMMARY_USER_PROMPT_TEMPLATE } from "./prompts";
import { logger } from "@/shared/utils/logger";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(
  text: string,
  retryCount: number = 0
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: SUMMARY_USER_PROMPT_TEMPLATE.replace("{text}", text),
        },
      ],
      max_tokens: OPENAI_MAX_TOKENS,
      temperature: OPENAI_TEMPERATURE,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error: unknown) {
    const rateLimitError = error as { status?: number };

    // Retry on rate limit errors
    if (rateLimitError?.status === 429 && retryCount < MAX_RETRIES) {
      logger.ai(
        `Rate limit hit, retrying in ${RETRY_DELAY_MS}ms (attempt ${
          retryCount + 1
        }/${MAX_RETRIES})`
      );
      await delay(RETRY_DELAY_MS);
      return generateSummary(text, retryCount + 1);
    }

    throw error;
  }
}
