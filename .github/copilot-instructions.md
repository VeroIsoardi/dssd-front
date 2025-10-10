# Copilot Instructions for AI Coding Agents

## Project Overview
- This is a Next.js (TypeScript) monorepo, bootstrapped with `create-next-app`.
- Main app code is in `src/app/` (entry: `page.tsx`, layout: `layout.tsx`).
- UI components are in `src/components/` and `src/app/components/ui/`.
- Forms use a step-based pattern (`src/app/components/project-form/`).
- Business logic and data fetching are in `src/services/` and `src/hooks/`.
- Types are defined in `src/types/`.
- Validation logic is in `src/lib/validations/`.

## Key Patterns & Conventions
- Use React Server Components and Next.js App Router conventions.
- UI primitives (Button, Input, etc.) are in `src/app/components/ui/`.
- Form steps are modular: see `project-form/` for multi-step form logic.
- Use hooks in `src/hooks/` for encapsulating reusable logic (e.g., `useProjectForm`).
- Service files in `src/services/` handle API/data access (e.g., `projects.ts`).
- Types are colocated in `src/types/` and imported where needed.
- Date utilities are in `src/lib/utils/date.ts`.

## Developer Workflows
- **Start dev server:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`)
- **Edit main page:** `src/app/page.tsx`
- **Add UI components:** `src/app/components/ui/`
- **Add form steps:** `src/app/components/project-form/`
- **Add API/service logic:** `src/services/`
- **Add types:** `src/types/`

## Project-Specific Notes
- Follows Next.js best practices for file-based routing and component structure.
- Uses [Geist](https://vercel.com/font) font via `next/font`.
- No custom test or build scripts beyond Next.js defaults.
- No custom lint rules beyond `eslint.config.mjs`.
- No backend code in this repo; all data access is via service files.

## Examples
- To add a new form step: create a file in `src/app/components/project-form/` and update `form-steps.tsx`.
- To add a new API call: add a function in `src/services/` and type in `src/types/`.
- To add a new UI primitive: add a file in `src/app/components/ui/` and export it.

## References
- Main entry: `src/app/page.tsx`
- Layout: `src/app/layout.tsx`
- UI primitives: `src/app/components/ui/`
- Form logic: `src/app/components/project-form/`
- Services: `src/services/`
- Types: `src/types/`
- Validations: `src/lib/validations/`
- Utils: `src/lib/utils/`

---
For more, see the project README.md or Next.js docs.