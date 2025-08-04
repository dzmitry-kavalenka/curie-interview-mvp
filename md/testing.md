# Testing Documentation

## Quick Start

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Test Structure

Tests are placed in `__tests__` directories alongside the code they test:

```
src/
├── features/
│   └── document-management/
│       └── ai-summarization/
│           └── actions/
│               └── __tests__/
│                   └── summarize.test.ts
└── shared/
    └── components/
        └── ui/
            └── __tests__/
                └── button.test.tsx
```

## Coverage Requirements

Minimum 70% coverage for branches, functions, lines, and statements.

## Resources

. [Jest Docs](https://jestjs.io/docs/getting-started)
. [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
