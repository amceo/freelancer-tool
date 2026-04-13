import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { applyLateFeeIfNeeded, sendReminderEmail } from '@/lib/reminders';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('id,email,stripe_account_id,charge_late_fee')
    .not('stripe_account_id', 'is', null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const user of users ?? []) {
    if (!user.stripe_account_id) continue;

    const invoices = await stripe.invoices.list({ status: 'open', limit: 100 }, { stripeAccount: user.stripe_account_id });
    const overdueInvoices = invoices.data.filter((invoice) => invoice.due_date !== null && invoice.due_date * 1000 < Date.now());

    for (const invoice of overdueInvoices) {
      if (!invoice.customer_email) continue;
      await applyLateFeeIfNeeded(invoice, user.stripe_account_id, Boolean(user.charge_late_fee));
      await sendReminderEmail({
        to: invoice.customer_email,
        customerName: invoice.customer_name ?? 'Client',
        amountDue: invoice.amount_due / 100,
        invoiceLink: invoice.hosted_invoice_url,
        invoiceNumber: invoice.number ?? invoice.id
      });
      console.log(`Reminder sent: user=${user.id} invoice=${invoice.id}`);
    }
  }

  return NextResponse.json({ ok: true });
}
