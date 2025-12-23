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



Structure
📦 media-app/
├── public/                              # Public static assets (+ media placeholders)
│   ├── favicon.ico
│   ├── robots.txt
│   └── media/                           # Default media files (fallbacks)
├── src/
│   ├── app/                             # App Router routes
│   │   ├── layout.tsx                   # Global layout (header, footer nav, etc.)
│   │   ├── loading.tsx                  # Global loading UI
│   │   ├── error.tsx                    # Global error boundary
│   │   ├── page.tsx                     # Home landing
│   │   ├── styles/                      # Route-scoped css/modules
│   │   │   └── globals.css
│   │   ├── (auth)/                      # Auth group (no URL segment change)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── media/                       # Media browsing & playback
│   │   │   ├── layout.tsx               # Media section layout
│   │   │   ├── page.tsx                 # Discover / feed
│   │   │   ├── [id]/                    # Dynamic media detail
│   │   │   │   ├── page.tsx             # Watch/Listen page
│   │   │   │   └── _components/         # Colocated media-specific UI
│   │   │   └── categories/
│   │   │       └── [category]/page.tsx
│   │   ├── live/                        # Live channels & streams
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── [channelId]/page.tsx
│   │   ├── news/                        # Articles / news feed
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   └── _components/             # Articles UI
│   │   └── dashboard/                   # User dashboard (route group)
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── uploads/                 # Uploads management
│   │       │   └── page.tsx
│   │       └── analytics/               # Activity & usage stats
│   │           └── page.tsx
│   ├── components/                      # Shared UI (atoms, molecules)
│   │   ├── ui/                          # UI primitives (Button, Modal, Icons)
│   │   ├── media/                       # Shared media UI (player, carousel)
│   │   └── nav/                         # Nav, sidebar
│   ├── hooks/                           # Custom React hooks
│   ├── contexts/                        # Providers, global state
│   ├── services/                        # API clients, fetch logic
│   ├── lib/                             # Utils & low-level libraries
│   │   ├── api/                         # REST / GraphQL clients
│   │   ├── media.ts                     # Streaming client helpers
│   │   └── auth.ts                      # Auth helpers
│   ├── types/                           # Shared TypeScript types
│   ├── stores/                          # Zustand / global stores
│   └── styles/                          # Global styles & themes
├── .env*                                # Env configs (local/prod/staging)
├── next.config.js                       # Next config & routing options
├── tsconfig.json                        # TypeScript config
├── package.json                         # NPM scripts & deps
└── README.md                            # Docs & setup




src/
└── app/
    └── api/
        ├── auth/
        │   ├── login/
        │   │   └── route.ts
        │   ├── register/
        │   │   └── route.ts
        │   ├── refresh/
        │   │   └── route.ts
        │   └── logout/
        │       └── route.ts
        │
        ├── users/
        │   ├── me/
        │   │   └── route.ts
        │   └── [userId]/
        │       └── route.ts
        │
        ├── media/
        │   ├── route.ts                 # GET: list media, POST: upload metadata
        │   ├── [mediaId]/
        │   │   ├── route.ts             # GET, PATCH, DELETE
        │   │   ├── stream/
        │   │   │   └── route.ts         # HLS/DASH stream URLs
        │   │   ├── views/
        │   │   │   └── route.ts         # View count tracking
        │   │   └── reactions/
        │   │       └── route.ts         # Likes, shares
        │   └── categories/
        │       └── route.ts
        │
        ├── live/
        │   ├── route.ts                 # Live channels list
        │   └── [channelId]/
        │       ├── route.ts             # Channel metadata
        │       ├── stream/
        │       │   └── route.ts         # Live stream endpoint
        │       └── chat/
        │           └── route.ts
        │
        ├── news/
        │   ├── route.ts                 # Articles feed
        │   └── [slug]/
        │       └── route.ts
        │
        ├── podcast/
        │   ├── route.ts
        │   └── [episodeId]/
        │       └── route.ts
        │
        ├── uploads/
        │   ├── signed-url/
        │   │   └── route.ts             # Cloudinary / S3 presigned URLs
        │   └── finalize/
        │       └── route.ts
        │
        ├── analytics/
        │   ├── views/
        │   │   └── route.ts
        │   └── engagement/
        │       └── route.ts
        │
        ├── search/
        │   └── route.ts
        │
        └── webhooks/
            ├── stripe/
            │   └── route.ts
            └── media-processor/
                └── route.ts
