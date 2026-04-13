'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { InvoiceTableRow } from '@/lib/invoices';

interface Props {
  invoices: InvoiceTableRow[];
}

export function InvoiceTable({ invoices }: Props): JSX.Element {
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const rows = useMemo(() => overdueOnly ? invoices.filter((invoice) => invoice.status === 'overdue') : invoices, [invoices, overdueOnly]);

  async function sendReminder(invoiceId: string): Promise<void> {
    setSendingId(invoiceId);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/remind`, { method: 'POST' });
      const payload: { error?: string } = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unknown error');
      alert('Reminder sent successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reminder';
      alert(message);
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className='space-y-4'>
      <label className='flex items-center gap-2 text-sm'>
        <input type='checkbox' checked={overdueOnly} onChange={(event) => setOverdueOnly(event.target.checked)} />
        Show Overdue Only
      </label>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Days Overdue</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.customer}</TableCell>
              <TableCell>${invoice.amountDue.toFixed(2)}</TableCell>
              <TableCell>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'warning' : 'outline'}>{invoice.status}</Badge>
              </TableCell>
              <TableCell>{invoice.daysOverdue || '—'}</TableCell>
              <TableCell className='space-x-2'>
                <Button size='sm' onClick={() => sendReminder(invoice.id)} disabled={sendingId === invoice.id}>Send Reminder</Button>
                <Button size='sm' variant='outline' asChild>
                  <a href={`/invoice/${invoice.id}/demand`}>Demand Letter</a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
