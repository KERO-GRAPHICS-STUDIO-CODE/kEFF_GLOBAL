# RiVuG

**High-End Escrow Marketplace & Secure Digital Commerce.**

A secure financial intermediary and escrow marketplace engineered to eliminate online fraud and build trust for buyers and sellers across the Cross River and Ugep region.

## Core Features

* **Zero-Upload Live KYC:** Mandatory live-camera biometric and document verification.
* **Force-Listen Audio T&C:** Immersive compliance flow requiring users to review audio-guided legal terms.
* **Paystack Virtual Accounts:** Dynamic bank transfer channels generating unique session-specific virtual accounts with automated payment detection.
* **Resend Transactional Emails:** Professional HTML receipts and notifications sent directly from `admin@rivug.store`.
* **Anti-Phishing Security:** Persistent site-wide warnings protecting users against fraudulent clones by enforcing `rivug.store`.
* **5-Minute Inactivity Auto-Logout:** Strict session termination logic for all roles after 300 seconds of inactivity.
* **God-Mode Admin Controls:** Financial analytics, transaction monitoring, and dispute resolution pipelines.

## Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, TypeScript
* **Backend & Realtime:** Supabase (PostgreSQL, Auth, Realtime Channels)
* **Payments:** Paystack API (Inline Checkout & Webhooks)
* **Communications:** Resend API
* **Hosting:** Vercel

## Environment Variables

Copy the `.env.example` to `.env.local` and populate the required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=https://rivug.store
```

## Support

Official Domain: **[rivug.store](https://rivug.store)**

Official Support Email: **admin@rivug.store**
