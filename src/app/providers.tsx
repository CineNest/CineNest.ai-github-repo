'use client';

import { ScriptProvider } from '@/context/script-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <ScriptProvider>
        {children}
      </ScriptProvider>
    </FirebaseClientProvider>
  );
}
