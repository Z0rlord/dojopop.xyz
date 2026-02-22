# Dojo Pop - Proof of Practice

Martial arts school management PWA with QR check-in, belt tracking, and video archival.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL (Neon)
- PWA (next-pwa)
- Nostr (messaging)
- Crossmint (payments)

## Features

- ✅ PWA with offline support
- ✅ Polish/English language toggle
- ✅ QR code check-in system
- ✅ NFC tap check-in
- ✅ Student belt rank tracking
- ✅ Video upload for technique preservation
- ✅ DOJO token rewards
- ✅ Leaderboards
- ✅ Nostr encrypted messaging
- ✅ Crossmint payments

## Getting Started

```bash
npm install
npx prisma migrate dev
npm run dev
```

## Environment Variables

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://the47.xyz"
RESEND_API_KEY="..."
CROSSMINT_SECRET_KEY="..."
NEXT_PUBLIC_CROSSMINT_API_KEY="..."
```

## Deployment

Deployed on Netlify: https://the47.xyz
# Build timestamp: Sun Feb 22 10:40:08 AM CST 2026

Build: Sun Feb 22 01:46:52 PM CST 2026
# Deploy: Sun Feb 22 02:48:52 PM CST 2026
