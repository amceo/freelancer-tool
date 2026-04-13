import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error.message)}`, request.url));
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user?.email) {
    await supabase.from('users').upsert({ id: user.id, email: user.email }, { onConflict: 'id' });
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
