import { redirect } from 'next/navigation';
import { InvoiceTable } from '@/components/dashboard/invoice-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mapStripeInvoice } from '@/lib/invoices';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export default async function DashboardPage(): Promise<JSX.Element> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase.from('users').select('stripe_account_id,subscription_status').eq('id', user.id).single();

  if (!profile?.stripe_account_id) {
    return (
      <main className='mx-auto max-w-5xl p-6'>
        <Card>
          <CardHeader>
            <CardTitle>Connect Stripe first</CardTitle>
          </CardHeader>
          <CardContent>Go to Settings to connect your Stripe account.</CardContent>
        </Card>
      </main>
    );
  }

  const invoices = await stripe.invoices.list({ limit: 50 }, { stripeAccount: profile.stripe_account_id });
  const rows = invoices.data.map(mapStripeInvoice);

  return (
    <main className='mx-auto max-w-6xl space-y-4 p-6'>
      {profile.subscription_status !== 'active' && (
        <Card>
          <CardContent className='pt-6'>You are on free plan. Upgrade to automate reminders.</CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceTable invoices={rows} />
        </CardContent>
      </Card>
    </main>
  );
}
