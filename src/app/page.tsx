'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/icons';
import { Loader2, Upload } from 'lucide-react';

export default function Home() {
  const [script, setScript] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGetStarted = async () => {
    setIsLoading(true);
    setOutput('');
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cineflow-script', script);
      }

      const response = await fetch('https://decomposable-margurite-transparently.ngrok-free.dev/webhook/http://localhost:5678/webhook/test/my-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      // Assuming the webhook returns a JSON with a 'message' or similar key.
      // Adjust if the response format is different.
      const responseOutput = result.message || JSON.stringify(result, null, 2);
      setOutput(responseOutput);

      // We can still navigate, or we can stay to show the output.
      // I will keep it on this page to show the output.
      // router.push('/dashboard');

    } catch (error) {
      console.error("Could not process script:", error);
      setOutput(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
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

  const handleDashboardNav = () => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('cineflow-script', script);
        } catch (error) {
            console.error("Could not save script to local storage:", error);
        }
    }
    router.push('/dashboard');
  }

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
                className="min-h-[120px] text-base"
                value={script}
                onChange={(e) => setScript(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="lg" onClick={handleGetStarted} className="flex-1" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Started
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".txt,.md,.rtf"
                />
                <Button variant="outline" size="lg" onClick={handleUploadClick}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
              {output && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Workflow Output:</h3>
                  <Textarea readOnly value={output} className="min-h-[100px] bg-muted font-mono text-sm" />
                </div>
              )}
               <Button variant="link" onClick={handleDashboardNav} className="mt-4">
                  Go to Dashboard
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
