import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/types/database';

const protectedRoutes = ['/dashboard', '/settings', '/invoice'];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const needsAuth = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (needsAuth && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/invoice/:path*']
};
