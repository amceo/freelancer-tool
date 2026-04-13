import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { applyLateFeeIfNeeded, sendReminderEmail } from '@/lib/reminders';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('users')
    .select('stripe_account_id, charge_late_fee')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_account_id) {
    return NextResponse.json({ error: 'No connected Stripe account' }, { status: 400 });
  }

  try {
    const invoice = await stripe.invoices.retrieve(params.id, {}, { stripeAccount: profile.stripe_account_id });

    if (!invoice.customer_email) {
      return NextResponse.json({ error: 'Invoice has no customer email' }, { status: 400 });
    }

    await applyLateFeeIfNeeded(invoice, profile.stripe_account_id, Boolean(profile.charge_late_fee));
    await sendReminderEmail({
      to: invoice.customer_email,
      customerName: invoice.customer_name ?? 'Client',
      amountDue: invoice.amount_due / 100,
      invoiceLink: invoice.hosted_invoice_url,
      invoiceNumber: invoice.number ?? invoice.id
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send reminder';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
