import { formatDistanceToNowStrict } from 'date-fns';
import Stripe from 'stripe';

export interface InvoiceTableRow {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerEmail: string;
  amountDue: number;
  dueDate: string | null;
  status: 'paid' | 'open' | 'overdue';
  daysOverdue: number;
  hostedInvoiceUrl: string | null;
}

export function mapStripeInvoice(invoice: Stripe.Invoice): InvoiceTableRow {
  const dueDate = invoice.due_date ? new Date(invoice.due_date * 1000) : null;
  const now = new Date();
  const daysOverdue = dueDate && invoice.status === 'open' && dueDate.getTime() < now.getTime()
    ? Math.max(1, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const status: InvoiceTableRow['status'] = invoice.status === 'paid' ? 'paid' : daysOverdue > 0 ? 'overdue' : 'open';

  return {
    id: invoice.id,
    invoiceNumber: invoice.number ?? invoice.id,
    customer: typeof invoice.customer_name === 'string' && invoice.customer_name.length > 0 ? invoice.customer_name : 'Unknown',
    customerEmail: invoice.customer_email ?? '',
    amountDue: invoice.amount_due / 100,
    dueDate: dueDate ? dueDate.toISOString() : null,
    status,
    daysOverdue,
    hostedInvoiceUrl: invoice.hosted_invoice_url
  };
}

export function formatDueDate(input: string | null): string {
  if (!input) return 'N/A';
  return new Date(input).toLocaleDateString();
}

export function formatRelativeOverdue(daysOverdue: number): string {
  if (daysOverdue === 0) return '—';
  return formatDistanceToNowStrict(new Date(Date.now() - daysOverdue * 24 * 60 * 60 * 1000), { addSuffix: true });
}
