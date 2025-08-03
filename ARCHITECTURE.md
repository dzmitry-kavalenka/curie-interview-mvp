# Architecture Overview

This project follows a **Feature-Based Architecture** with clear separation of concerns.

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
├── features/               # Feature-based modules
│   ├── document-management/
│   │   ├── components/     # Document-related components
│   │   ├── services/       # Document business logic
│   │   ├── hooks/          # Document-specific hooks
│   │   ├── types/          # Document type definitions
│   │   └── utils/          # Document utilities
│   └── ai-summarization/
│       ├── components/     # AI-related components
│       ├── services/       # AI business logic
│       ├── hooks/          # AI-specific hooks
│       ├── types/          # AI type definitions
│       └── utils/          # AI utilities
├── shared/                 # Shared utilities and components
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components
│   │   ├── layout/        # Layout components
│   │   └── common/        # Common business components
│   ├── hooks/             # Shared hooks
│   ├── utils/             # Shared utilities
│   ├── types/             # Shared type definitions
│   └── config/            # App configuration
└── infrastructure/        # External integrations
    ├── database/          # Database models and services
    ├── external-services/ # External API integrations
    └── api/              # API routes and handlers
```

## Key Principles

1. **Feature Isolation**: Each feature is self-contained
2. **Shared Components**: Reusable UI and utilities
3. **Infrastructure Separation**: External services isolated
4. **Type Safety**: Strong TypeScript typing throughout
