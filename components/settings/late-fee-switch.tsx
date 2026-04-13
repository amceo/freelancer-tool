'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface Props {
  defaultChecked: boolean;
}

export function LateFeeSwitch({ defaultChecked }: Props): JSX.Element {
  const [checked, setChecked] = useState(defaultChecked);

  async function onCheckedChange(next: boolean): Promise<void> {
    setChecked(next);
    const response = await fetch('/settings/late-fee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chargeLateFee: next })
    });
    if (!response.ok) {
      setChecked(!next);
      alert('Unable to save preference.');
    }
  }

  return <Switch checked={checked} onCheckedChange={onCheckedChange} />;
}
