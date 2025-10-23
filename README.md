# Circle Email Login + User Wallet (Next.js + Netlify)

This app scaffolds email login and a user-controlled wallet UI using Next.js 14 (App Router), Tailwind CSS, and Netlify. Circle Web SDK integration is stubbed and reads environment variables.

## Setup

- **Install deps**
```
npm install
```

- **Environment**
  - Copy `.env.example` to `.env.local` and fill values:
    - `NEXT_PUBLIC_CIRCLE_APP_ID` — public app identifier for Circle Web SDK
    - `CIRCLE_API_KEY` — server key if needed for server actions or routes

- **Develop**
```
npm run dev
```

- **Build**
```
npm run build && npm start
```

## Circle Integration

Edit `lib/circle.ts` to import and initialize the Circle Web SDK of your choice (Programmable Wallets or Web3 Services). Update `components/LoginForm.tsx` and `components/WalletPanel.tsx` to call real SDK methods.

## Deploy on Netlify

- Ensure `netlify.toml` is present. The project uses `@netlify/plugin-nextjs` for Next.js features.
- Connect the repo on Netlify, set env vars, and deploy. Build command: `npm run build`.
