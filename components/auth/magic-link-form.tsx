'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function MagicLinkForm(): JSX.Element {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback`
      }
    });
    setLoading(false);
    alert(error ? error.message : 'Check your email for a magic link.');
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-2'>
      <input
        className='h-9 rounded-md border px-3'
        type='email'
        placeholder='you@business.com'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <Button disabled={loading}>{loading ? 'Sending...' : 'Email me a magic link'}</Button>
    </form>
  );
}
