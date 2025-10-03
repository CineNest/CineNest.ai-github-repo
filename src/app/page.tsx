'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/icons';

export default function Home() {
  const [script, setScript] = useState('');
  const router = useRouter();

  const handleGetStarted = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cineflow-script', script);
      } catch (error) {
        console.error("Could not save script to local storage:", error);
      }
    }
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-background">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl">
          <CardHeader className="items-center text-center">
            <AppLogo className="h-16 w-16 mb-2 text-primary" />
            <CardTitle className="text-3xl font-headline tracking-tight">CineFlow AI</CardTitle>
            <CardDescription className="max-w-md">
              From script to screen, faster. Paste your script below to begin, or start fresh on the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-4">
              <Textarea
                placeholder="Paste your script here..."
                className="min-h-[300px] text-base"
                value={script}
                onChange={(e) => setScript(e.target.value)}
              />
              <Button size="lg" onClick={handleGetStarted}>
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
