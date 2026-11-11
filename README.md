# DSSD Front — NGO project collaboration

Web frontend for a system where NGOs publish projects, other organisations commit to covering their tasks, and directors follow progress. Built for *Desarrollo de Software en Sistemas Distribuidos* at UNLP (2025). The process and API live in [dssd](https://github.com/VeroIsoardi/dssd) (Bonita BPM).

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

## Roles

| Role | Can |
| --- | --- |
| **ONG** | Create projects through a two-step form (general info, then a work plan of 1–20 tasks) |
| **Organización** | Browse projects and commit to covering tasks |
| **Director** | See a KPI dashboard and leave observations on projects |
| **Administrador** | Manage users |

## Stack

Next.js 15 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Radix) · React Hook Form + Zod · Recharts

## Run it

```bash
npm install
npm run dev
```

The API base URL is set in [`src/lib/constants.ts`](src/lib/constants.ts) (`API_CONFIG.BASE_URL`). Point it at your backend.
