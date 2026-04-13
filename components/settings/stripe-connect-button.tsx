'use client';

import { Button } from '@/components/ui/button';

export function StripeConnectButton(): JSX.Element {
  return (
    <Button asChild>
      <a href='/api/stripe/connect'>Connect Stripe Account</a>
    </Button>
  );
}
