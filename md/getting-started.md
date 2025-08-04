# Getting Started

## Prerequisites

. Node.js 18+
. Docker (for MongoDB)
. OpenAI API key

## Quick Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Setup environment**

   ```bash
   npm run setup
   ```

3. **Configure environment variables**
   Edit `.env.local`:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=mongodb://localhost:27017/curie-interview-mvp
   ```

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

## Available Scripts

. `npm run dev` - Start development server
. `npm run build` - Build for production
. `npm run start` - Start production server
. `npm run lint` - Run ESLint
. `npm run docker:up` - Start MongoDB container
. `npm run docker:down` - Stop MongoDB container
