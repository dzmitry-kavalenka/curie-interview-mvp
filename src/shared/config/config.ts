// MVP Configuration - Simple limits
export const MAX_PDF_SIZE_MB = 5; // Maximum PDF size in MB
export const MAX_PDF_COUNT = 5; // Maximum number of PDF files for MVP
export const MAX_TEXT_LENGTH = 50000; // Maximum text length in characters (~12,500 tokens)
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 21000; // 21 seconds

// OpenAI Configuration
export const OPENAI_MODEL = "gpt-3.5-turbo";
export const OPENAI_MAX_TOKENS = 1500;
export const OPENAI_TEMPERATURE = 0.3;
