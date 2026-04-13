# Invoice Shepherd

Invoice Shepherd is a micro-SaaS for freelancers to track overdue Stripe invoices, send reminders, add late fees, and generate AI demand letters.

## Tech Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui components
- Supabase Auth + Postgres (RLS)
- Stripe Connect Standard (read-only)
- Resend email API
- Vercel AI SDK + OpenAI gpt-4o-mini
- React-PDF for legal letter downloads
- Vercel Cron for daily overdue checks

## 1) Initialize project
```bash
npx create-next-app@latest invoice-shepherd --ts --tailwind --eslint --app
cd invoice-shepherd
```

## 2) Install dependencies
```bash
npm i @supabase/supabase-js @supabase/auth-helpers-nextjs stripe @stripe/stripe-js resend ai @ai-sdk/openai openai @react-pdf/renderer zod date-fns
npm i @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-switch class-variance-authority clsx tailwind-merge lucide-react
```

## 3) Install shadcn/ui
```bash
npx shadcn@latest init
npx shadcn@latest add button card table switch dialog
```

## 4) Configure environment
Copy `.env.example` to `.env.local` and fill values.

## 5) Run Supabase migration
Apply `supabase/migrations/001_init.sql` in Supabase SQL editor.

## 6) Run locally
```bash
npm run dev
```

## 7) Configure Vercel Cron
`vercel.json` includes:
- `0 9 * * *` hitting `/api/cron/daily`
- send `Authorization: Bearer $CRON_SECRET`

## API Routes and error handling
- `GET /api/stripe/connect`: redirect to Stripe OAuth or return 500 when missing config.
- `DELETE /api/stripe/connect`: clears connected account.
- `GET /api/stripe/connect/callback`: handles OAuth exchange and stores Stripe account ID.
- `POST /api/invoices/[id]/remind`: validates auth, connection, customer email, catches Stripe/Resend errors.
- `POST /settings/late-fee`: validates boolean payload and persists preference.
- `GET /api/cron/daily`: validates bearer token and processes overdue reminders.
- `POST /api/stripe/webhook`: validates Stripe signature and updates subscription state.

## Notes
- Stripe data reads run per connected account using `stripeAccount` request option.
- Late fee adds a 5% invoice item before reminder send.
- Demand letters are editable before PDF export.
