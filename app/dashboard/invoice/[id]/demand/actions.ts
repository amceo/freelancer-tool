'use server';

import { openai } from '@/lib/openai';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function generateDemandLetter(invoiceId: string): Promise<string> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: profile } = await supabase.from('users').select('stripe_account_id,email').eq('id', user.id).single();
  if (!profile?.stripe_account_id) {
    throw new Error('Stripe account not connected');
  }

  const invoice = await stripe.invoices.retrieve(invoiceId, {}, { stripeAccount: profile.stripe_account_id });
  const dueDate = invoice.due_date ? new Date(invoice.due_date * 1000) : new Date();
  const daysOverdue = Math.max(1, Math.floor((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

  const completion = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: `Generate a formal payment demand letter with these variables: client_name=${invoice.customer_name ?? 'Client'}, amount_owed=$${(
      invoice.amount_due / 100
    ).toFixed(2)}, days_overdue=${daysOverdue}, freelancer_name=${profile.email}, invoice_number=${invoice.number ?? invoice.id}. Tone: professional, concise, legally cautious.`
  });

  const text = completion.output_text?.trim();
  if (!text) {
    throw new Error('Failed to generate demand letter');
  }

  return text;
}
