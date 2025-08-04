# Architecture

## Tech Stack

. **Frontend**: Next.js 15, React 19, TypeScript
. **Styling**: Tailwind CSS, Framer Motion
. **Backend**: Next.js API Routes
. **Database**: MongoDB with Mongoose
. **AI**: OpenAI GPT models
. **PDF Processing**: pdf-parse, pdfjs-dist
. **UI Components**: Radix UI, Lucide React

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── dashboard/      # Main dashboard page
│   └── files/          # File viewer pages
├── features/           # Feature modules
│   ├── document-management/
├── infrastructure/     # External services & database
│   ├── database/       # MongoDB models & services
│   └── external-services/ # OpenAI integration
└── shared/            # Shared components & utilities
    ├── components/     # UI components
    ├── config/        # Configuration
    └── utils/         # Utilities
```

## Key Components

. **Document Management** - File upload, viewing, and history
. **AI Summarization** - OpenAI integration for document summaries
. **PDF Viewer** - Text selection and rendering
. **Annotation System** - Document annotations and notes
