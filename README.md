# Better Auth Next.js Triplit Starter (App Router)

## Installation

First, create a Triplit Database or run triplit dev then configure your environment variables.

You can generate a `BETTER_AUTH_SECRET` [here](https://www.better-auth.com/docs/installation#set-environment-variables).

If using Triplit Cloud, you must set `External JWT secret` to your `BETTER_AUTH_SECRET` in your project settings on the Triplit dashboard.

```bash
BETTER_AUTH_SECRET=""
TRIPLIT_DB_URL=""
TRIPLIT_SERVICE_TOKEN=""
TRIPLIT_ANON_TOKEN=""
TRIPLIT_SCHEMA_PATH="src/triplit/schema.ts"

EXTERNAL_JWT_SECRET=$BETTER_AUTH_SECRET
NEXT_PUBLIC_TRIPLIT_DB_URL=$TRIPLIT_DB_URL
NEXT_PUBLIC_TRIPLIT_ANON_TOKEN=$TRIPLIT_ANON_TOKEN
```

**Note:** Set a custom DB name in `src/triplit/client.ts`, it can lead to conflicts if you are developing multiple projects.

- Twitter: [@daveycodez](https://x.com/daveycodez)

☕️ [Buy me a coffee](https://buymeacoffee.com/daveycodez)

## Features:

[Better Auth](https://better-auth.com)

[Better Auth UI](https://better-auth-ui.com)

[Triplit](https://triplit.dev)

[shadcn/ui](https://ui.shadcn.com)

[TailwindCSS](https://tailwindcss.com)

[Serwist](https://serwist.pages.dev)

[Biome](https://biomejs.dev)

[Next.js](https://nextjs.org)

[Turborepo](https://turbo.build)

## Next.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
