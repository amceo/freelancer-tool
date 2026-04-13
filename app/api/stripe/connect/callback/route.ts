import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=missing_code', request.url));
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const clientId = process.env.STRIPE_CLIENT_ID;

  if (!secretKey || !clientId) {
    return NextResponse.redirect(new URL('/settings?error=config', request.url));
  }

  const tokenResponse = await fetch('https://connect.stripe.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: secretKey
    })
  });

  const payload = (await tokenResponse.json()) as { stripe_user_id?: string; error_description?: string };

  if (!tokenResponse.ok || !payload.stripe_user_id) {
    return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(payload.error_description ?? 'oauth')}`, request.url));
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  await supabase.from('users').update({ stripe_account_id: payload.stripe_user_id }).eq('id', user.id);
  return NextResponse.redirect(new URL('/settings?connected=1', request.url));
}
