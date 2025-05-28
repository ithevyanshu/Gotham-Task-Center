
'use client';

import type { ReactNode } from 'react';

// This component is now a simple pass-through.
// If QueryClientProvider or other context providers are needed later,
// they can be added here.
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
