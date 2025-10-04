'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/icons';
import { Loader2, Upload, Users } from 'lucide-react';
import { useScript } from '@/context/script-context';
import Link from 'next/link';
import { useUser } from '@/firebase';

export default function Home() {
  const { script, setScript } = useScript();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isUserLoading } = useUser();
  const [webhookResult, setWebhookResult] = useState('');

  const handleGetStarted = () => {
    setIsLoading(true);
    // The script is already managed by the context, which handles localStorage
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setScript(text);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isUserLoading) {
    return (
       <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-[#0a192f] via-[#123a66] to-[#00c6ff]">
        <Loader2 className="h-16 w-16 animate-spin text-white" />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-[#0a192f] via-[#123a66] to-[#00c6ff]">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-white/20">
          <CardHeader className="items-center text-center">
            <AppLogo className="h-16 w-16 mb-2 text-primary" />
            <CardTitle className="text-3xl font-headline tracking-tight">CineFlow AI</CardTitle>
            <CardDescription className="max-w-md">
              From script to screen, faster. Paste your script below to begin, or upload a file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-4">
              <Textarea
                placeholder="Paste your script here... The first line becomes the title, the rest is the body."
                className="min-h-[120px] text-base bg-background/70"
                value={script}
                onChange={(e) => setScript(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="lg" onClick={handleGetStarted} className="flex-1" disabled={isLoading || isUserLoading}>
                  {(isLoading || isUserLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Started
                </Button>
                 <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".txt,.md,.rtf"
                />
                <Button variant="outline" size="lg" onClick={handleUploadClick} className="bg-transparent hover:bg-white/10 text-white border-white/50 hover:text-white">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Script
                </Button>
                <Link href="/crew" passHref>
                  <Button variant="outline" size="lg" className="bg-transparent hover:bg-white/10 text-white border-white/50 hover:text-white w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Crew
                  </Button>
                </Link>
              </div>
               {webhookResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Webhook Response:</h4>
                  <pre className="text-sm whitespace-pre-wrap">{webhookResult}</pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
