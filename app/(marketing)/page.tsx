import Link from 'next/link';
import { MagicLinkForm } from '@/components/auth/magic-link-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LandingPage(): JSX.Element {
  return (
    <main className='mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16'>
      <section className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold'>Invoice Shepherd</h1>
        <p className='text-lg text-muted-foreground'>Track overdue invoices, send escalating reminders, and generate demand letters instantly.</p>
        <div className='mx-auto max-w-md'>
          <MagicLinkForm />
        </div>
        <div className='flex justify-center gap-3'>
          <Button asChild>
            <Link href='/dashboard'>Dashboard</Link>
          </Button>
          <Button variant='outline' asChild>
            <Link href={process.env.STRIPE_PAYMENT_LINK_URL ?? '#'}>Upgrade $19/month</Link>
          </Button>
        </div>
      </section>
      <section className='grid gap-4 md:grid-cols-3'>
        {['Stripe invoice sync', 'Automated overdue reminders', 'AI legal demand letters'].map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle>{item}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-semibold'>$19/month</p>
          <p className='text-sm text-muted-foreground'>Unlimited reminders, AI letters, and daily cron automation.</p>
        </CardContent>
      </Card>
    </main>
  );
}
