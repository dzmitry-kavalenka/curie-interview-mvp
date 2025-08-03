#!/usr/bin/env node

/**
 * Simple setup script to create .env.local file
 */

import { existsSync, writeFileSync } from "fs";
import { join } from "path";

import chalk from "chalk";

const envPath = join(process.cwd(), ".env.local");

// Check if .env.local already exists
if (existsSync(envPath)) {
  console.log(chalk.green("✅ .env.local already exists"));
  console.log(chalk.blue("📝 Make sure you have set your OPENAI_API_KEY"));
  process.exit(0);
}

// Create basic .env.local content
const envContent = `# OpenAI Configuration
# Get your API key from https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# MongoDB Configuration (optional - defaults to localhost)
MONGODB_URI=mongodb://localhost:27017/curie-interview-mvp

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PDF.js worker cdn
PDFJS_WORKER_CDN=/pdf.worker.min.mjs
`;

try {
  writeFileSync(envPath, envContent);
  console.log(chalk.green("✅ .env.local file created successfully!"));
  console.log(chalk.blue("📝 Next steps:"));
  console.log(chalk.cyan("1. Edit .env.local and add your OpenAI API key"));
  console.log(chalk.cyan("2. Run 'npm run docker:up' to start MongoDB"));
  console.log(
    chalk.cyan("3. Run 'npm run dev' to start the development server")
  );
  console.log(chalk.cyan("4. Open http://localhost:3000 in your browser"));
} catch (error) {
  console.error(chalk.red("❌ Error creating .env.local file:"), error.message);
}
