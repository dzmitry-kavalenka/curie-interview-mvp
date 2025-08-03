# Curie Interview MVP

A modern document management and AI summarization application built with Next.js, TypeScript, and Tailwind CSS.

## Features

. **Document Upload & Management**: Upload PDF files and manage them in a clean interface
. **AI-Powered Summarization**: Get intelligent summaries of your documents using OpenAI
. **PDF Text Selection**: Select and copy text from PDF documents with full keyboard support
. **Responsive Design**: Works seamlessly across desktop and mobile devices
. **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## PDF Text Selection

The PDF viewer now supports text selection with the following features:

. **Mouse Selection**: Click and drag to select text in PDF documents
. **Keyboard Support**: Use keyboard shortcuts for text selection
. **Copy to Clipboard**: One-click copying of selected text
. **Clear Selection**: Clear current selection with the X button or Escape key
. **Visual Feedback**: Selected text is displayed in a dedicated panel

### Text Selection Controls

. **Copy Button**: Copy selected text to clipboard
. **Clear Button (X)**: Clear current selection
. **Escape Key**: Clear selection and close the selection panel
. **Mouse Drag**: Select text by clicking and dragging over the desired area

## Getting Started

### Prerequisites

. Node.js 18+
. Docker (for MongoDB)
. OpenAI API key

### Setup

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd curie-interview-mvp
   npm install
   ```

2. **Create environment file**

   ```bash
   npm run setup
   ```

3. **Configure environment variables**
   Edit `.env.local` and add your OpenAI API key:

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

## Development

### Available Scripts

. `npm run dev` - Start development server
. `npm run build` - Build for production
. `npm run start` - Start production server
. `npm run lint` - Run ESLint
. `npm run setup` - Create environment file
. `npm run docker:up` - Start MongoDB container
. `npm run docker:down` - Stop MongoDB container
. `npm run docker:logs` - View MongoDB logs

### Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── dashboard/      # Main dashboard page
│   └── files/          # File viewer pages
├── components/          # React components
├── hooks/              # Custom React hooks
└── lib/                # Utilities and services
    ├── db/             # Database models and services
    ├── openai-client.ts # OpenAI integration
    └── pdf-utils.ts    # PDF processing utilities
```

## API Endpoints

. `POST /api/upload` - Upload PDF file
. `POST /api/summarize` - Generate AI summary
. `GET /api/uploads` - Get upload history
. `GET /api/files/[filename]` - Get specific file

## Configuration

### Environment Variables

. `OPENAI_API_KEY` - Your OpenAI API key (required)
. `MONGODB_URI` - MongoDB connection string (defaults to localhost)
. `NODE_ENV` - Environment (development/production)
. `NEXT_PUBLIC_APP_URL` - Application URL

### File Limits

. Maximum PDF size: 5MB
. Maximum text length: 50,000 characters
. Supported format: PDF only

## Docker

The application uses Docker for MongoDB only. The main application runs locally for development.

### MongoDB Container

```bash
# Start MongoDB
npm run docker:up

# Stop MongoDB
npm run docker:down

# View logs
npm run docker:logs
```

## Production

For production deployment:

1. Set up a MongoDB instance (Atlas, etc.)
2. Configure environment variables
3. Build and deploy the Next.js application

```bash
npm run build
npm run start
```

## Technologies

. **Frontend**: Next.js 15, React 19, TypeScript
. **Styling**: Tailwind CSS, Framer Motion
. **Backend**: Next.js API Routes
. **Database**: MongoDB with Mongoose
. **AI**: OpenAI GPT models
. **PDF Processing**: pdf-parse, pdfjs-dist
. **UI Components**: Radix UI, Lucide React

## License

MIT
