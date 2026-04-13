import { DemandLetterEditor } from '@/components/dashboard/demand-letter-editor';

export default function DemandPage({ params }: { params: { id: string } }): JSX.Element {
  return (
    <main className='mx-auto max-w-4xl p-6'>
      <h1 className='mb-4 text-2xl font-semibold'>AI Demand Letter</h1>
      <DemandLetterEditor invoiceId={params.id} />
    </main>
  );
}
