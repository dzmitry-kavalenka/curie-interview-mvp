# Curie Interview MVP

A modern document management and AI summarization application built with Next.js, TypeScript, and Tailwind CSS.

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Setup environment**

   ```bash
   npm run setup
   ```

3. **Configure AWS S3 (for production PDF storage)**

   ```bash
   npm run setup:s3
   ```

   Follow the guide to set up your S3 bucket and add credentials to `.env`
   Note: S3 is only required for production. Development uses local storage.

4. **Start MongoDB**

   ```bash
   npm run docker:up
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Documentation

. [Getting Started](md/getting-started.md) - Setup and installation
. [API Reference](md/api.md) - API endpoints and usage
. [Architecture](md/architecture.md) - Tech stack and project structure
. [Testing](md/testing.md) - Testing strategy and guidelines

## Features

. **Document Upload & Management** - Upload and manage PDF files
. **AI-Powered Summarization** - Generate intelligent summaries using OpenAI
. **PDF Text Selection** - Select and copy text with keyboard support
. **Responsive Design** - Works seamlessly across all devices

## Technologies

. **Frontend**: Next.js 15, React 19, TypeScript
. **Styling**: Tailwind CSS, Framer Motion
. **Backend**: Next.js API Routes
. **Database**: MongoDB with Mongoose
. **AI**: OpenAI GPT models
. **UI Components**: Radix UI, Lucide React

## License

MIT
