'use client';

import { useState, useTransition } from 'react';
import { Document, Page, StyleSheet, Text, pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { generateDemandLetter } from '@/app/invoice/[id]/demand/actions';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, lineHeight: 1.5 },
  heading: { fontSize: 16, marginBottom: 16 },
  body: { whiteSpace: 'pre-wrap' }
});

function LetterPdf({ content }: { content: string }): JSX.Element {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.heading}>Payment Demand Letter</Text>
        <Text style={styles.body}>{content}</Text>
      </Page>
    </Document>
  );
}

interface Props {
  invoiceId: string;
}

export function DemandLetterEditor({ invoiceId }: Props): JSX.Element {
  const [content, setContent] = useState('');
  const [pending, startTransition] = useTransition();

  function onGenerate(): void {
    startTransition(async () => {
      const text = await generateDemandLetter(invoiceId);
      setContent(text);
    });
  }

  async function onDownload(): Promise<void> {
    const blob = await pdf(<LetterPdf content={content} />).toBlob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `demand-letter-${invoiceId}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <Button onClick={onGenerate} disabled={pending}>{pending ? 'Generating...' : 'Generate Letter'}</Button>
        <Button variant='outline' onClick={onDownload} disabled={!content}>Download PDF</Button>
      </div>
      <textarea
        className='min-h-[400px] w-full rounded-md border p-3 text-sm'
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder='Generated demand letter will appear here.'
      />
    </div>
  );
}
