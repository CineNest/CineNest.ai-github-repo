'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { ScriptProvider } from '@/context/script-context';
import { Header } from '@/components/app/header';
import { SidebarNav } from '@/components/app/sidebar-nav';
import { ThemeProvider } from '@/components/app/theme-provider';
import type { ReactNode } from 'react';
import { useUser }s from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        {/* You can replace this with a more sophisticated loading spinner */}
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ScriptProvider>
        <SidebarProvider>
          <ProtectedLayout>
            <div className="flex min-h-screen w-full">
              <Sidebar>
                <SidebarHeader />
                <SidebarContent>
                  <SidebarNav />
                </SidebarContent>
              </Sidebar>
              <SidebarInset className="flex flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                  {children}
                </main>
              </SidebarInset>
            </div>
          </ProtectedLayout>
        </SidebarProvider>
      </ScriptProvider>
    </ThemeProvider>
  );
}
