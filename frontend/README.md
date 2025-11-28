# Feedly Frontend

This is the frontend for the Feedly SaaS platform, built with Next.js 16, TailwindCSS, and TypeScript.

## Project Structure

The project follows a structured architecture to ensure scalability and maintainability.

### `/src/components`

Reusable UI components.

- `ui/`: **Shadcn/ui** components (Button, Card, Input, etc.).
- `charts/`: Data visualization components.

### `/src/app`

Next.js App Router pages.

- `(auth)/`: Authentication pages (Login, Signup).
- `(dashboard)/`: Protected dashboard pages (Dashboard, Apps, Chatbot, Reports).

### `/src/styles`

Global styles and Tailwind configuration.

- `globals.css`: Main stylesheet with Tailwind directives and shadcn CSS variables.

### `/src/utils` & `/src/lib`

Utility functions.

- `lib/utils.ts`: Shadcn utility for class merging (`cn`).
- `utils/api.ts`: API fetcher helper.
- `utils/formatters.ts`: Date and currency formatters.

### `/src/hooks`

Custom React hooks.

- `useAuth.ts`: Authentication logic.
- `useFetchReviews.ts`: Data fetching for reviews.

### `/src/context` & `/src/store`

State management.

- `context/AuthContext.tsx`: React Context for auth state.
- `store/useStore.ts`: Zustand store for global app state (e.g., theme).

### `/src/types`

TypeScript type definitions.

- `index.ts`: Shared types (User, Review).
- `api.ts`: API response types.

### `/src/services`

API integration services.

- `apiService.ts`: Wrapper around fetch/axios.
- `aiService.ts`: Specific calls to AI endpoints.

### `/src/config`

Configuration constants.

- `constants.ts`: App-wide constants.
- `env.ts`: Environment variable accessors.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) with your browser.
