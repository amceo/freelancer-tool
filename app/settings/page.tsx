import { redirect } from 'next/navigation';
import { LateFeeSwitch } from '@/components/settings/late-fee-switch';
import { StripeConnectButton } from '@/components/settings/stripe-connect-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function SettingsPage(): Promise<JSX.Element> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('stripe_account_id,charge_late_fee')
    .eq('id', user.id)
    .single();

  return (
    <main className='mx-auto max-w-3xl space-y-4 p-6'>
      <Card>
        <CardHeader>
          <CardTitle>Stripe Connect</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {profile?.stripe_account_id ? <p>Connected account: {profile.stripe_account_id}</p> : <p>Not connected.</p>}
          <div className='flex gap-2'>
            <StripeConnectButton />
            {profile?.stripe_account_id && (
              <form action='/api/stripe/connect' method='DELETE'>
                <Button variant='outline' type='submit'>Disconnect</Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Automations</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center justify-between'>
          <p>Charge 5% late fee on overdue invoices</p>
          <LateFeeSwitch defaultChecked={Boolean(profile?.charge_late_fee)} />
        </CardContent>
      </Card>
    </main>
  );
}
