import Stripe from 'stripe';
import { resend } from '@/lib/resend';
import { stripe } from '@/lib/stripe';

export async function applyLateFeeIfNeeded(invoice: Stripe.Invoice, stripeAccountId: string, chargeLateFee: boolean): Promise<void> {
  if (!chargeLateFee || invoice.amount_due <= 0 || !invoice.customer) {
    return;
  }

  const lateFeeCents = Math.round(invoice.amount_due * 0.05);
  if (lateFeeCents <= 0) {
    return;
  }

  await stripe.invoiceItems.create(
    {
      customer: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer.id,
      invoice: invoice.id,
      amount: lateFeeCents,
      currency: invoice.currency,
      description: '5% late fee'
    },
    { stripeAccount: stripeAccountId }
  );
}

export async function sendReminderEmail(input: { to: string; customerName: string; amountDue: number; invoiceLink: string | null; invoiceNumber: string }): Promise<void> {
  await resend.emails.send({
    from: 'Invoice Shepherd <reminders@invoiceshepherd.app>',
    to: [input.to],
    subject: `Friendly reminder: Invoice ${input.invoiceNumber} is due`,
    html: `<p>Hi ${input.customerName || 'there'},</p><p>This is a friendly reminder that invoice <strong>${input.invoiceNumber}</strong> for <strong>$${input.amountDue.toFixed(2)}</strong> is overdue.</p><p>${input.invoiceLink ? `<a href='${input.invoiceLink}'>View invoice</a>` : ''}</p><p>Thanks!</p>`
  });
}
