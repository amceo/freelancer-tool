import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const clientId = process.env.STRIPE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!clientId || !appUrl) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const redirectUri = `${appUrl}/api/stripe/connect/callback`;
  const stripeUrl = new URL('https://connect.stripe.com/oauth/authorize');
  stripeUrl.searchParams.set('response_type', 'code');
  stripeUrl.searchParams.set('client_id', clientId);
  stripeUrl.searchParams.set('scope', 'read_only');
  stripeUrl.searchParams.set('redirect_uri', redirectUri);

  return NextResponse.redirect(stripeUrl);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  await supabase.from('users').update({ stripe_account_id: null }).eq('id', user.id);
  return NextResponse.redirect(new URL('/settings', request.url));
}
