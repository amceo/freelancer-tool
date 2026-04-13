import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function requireActiveSubscription(): Promise<void> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data } = await supabase.from('users').select('subscription_status').eq('id', user.id).single();

  if (!data || data.subscription_status !== 'active') {
    redirect('/?upgrade=1');
  }
}
