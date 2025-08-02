#!/usr/bin/env node

/**
 * Simple setup script to create .env.local file
 */

import { existsSync, writeFileSync } from "fs";
import { join } from "path";

const envPath = join(process.cwd(), ".env.local");

// Check if .env.local already exists
if (existsSync(envPath)) {
  console.log("✅ .env.local already exists");
  console.log("📝 Make sure you have set your OPENAI_API_KEY");
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
`;

try {
  writeFileSync(envPath, envContent);
  console.log("✅ .env.local file created successfully!");
  console.log("📝 Next steps:");
  console.log("1. Edit .env.local and add your OpenAI API key");
  console.log("2. Run 'npm run docker:up' to start MongoDB");
  console.log("3. Run 'npm run dev' to start the development server");
  console.log("4. Open http://localhost:3000 in your browser");
} catch (error) {
  console.error("❌ Error creating .env.local file:", error.message);
}
