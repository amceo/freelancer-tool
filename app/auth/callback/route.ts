import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // This MUST be the full URL – Supabase requires it
  const { data, error } = await supabase.auth.exchangeCodeForSession(request.url);

  if (error) {
    return NextResponse.redirect(`/?error=${encodeURIComponent(error.message)}`);
  }

  // Optional: Insert user into DB
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user?.email) {
    await supabase
      .from('users')
      .upsert({ id: user.id, email: user.email }, { onConflict: 'id' });
  }

  return NextResponse.redirect('/dashboard');
}