import { redirect } from 'next/navigation';

export default function LegacyDemandPage({ params }: { params: { id: string } }): never {
  redirect(`/dashboard/invoice/${params.id}/demand`);
}
