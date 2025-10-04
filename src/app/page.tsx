'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useScript } from '@/context/script-context';
import { Loader2, ArrowRight, Upload } from 'lucide-react';
import { Header } from '@/components/app/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import mammoth from 'mammoth';

export default function Home() {
  const { setScript } = useScript();
  const [localScript, setLocalScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        setLocalScript(text);
      } else if (file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result;
          if (arrayBuffer) {
            try {
              const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer as ArrayBuffer });
              setLocalScript(result.value);
            } catch (error) {
              console.error('Error parsing .docx file:', error);
              toast({
                variant: 'destructive',
                title: 'Error Reading File',
                description: 'Could not extract text from the Word document.',
              });
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a .txt, .md, or .docx file.',
        });
      }
    }
  };
  
  const handleGetStarted = () => {
    if (!localScript.trim()) {
       toast({
        variant: 'destructive',
        title: 'Script is empty',
        description: 'Please enter or upload a script to continue.',
      });
      return;
    }
    setIsLoading(true);
    setScript(localScript);
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a192f] via-[#123a66] to-[#00c6ff]">
       <Header/>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        
      <Card className="w-full max-w-2xl shadow-2xl bg-card/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl font-headline tracking-tight">Enter Your Script</CardTitle>
            <CardDescription>Paste your script below or upload a file to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="TITLE: My Awesome Film..."
              className="min-h-[300px] bg-background/50 text-base"
              value={localScript}
              onChange={(e) => setLocalScript(e.target.value)}
            />
            <div className="flex items-center justify-between gap-4">
               <Label htmlFor="script-file" className="flex-1">
                <Button asChild variant="outline" className="w-full cursor-pointer">
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </span>
                </Button>
                <Input id="script-file" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.md,text/plain,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
              </Label>
              <Button size="lg" onClick={handleGetStarted} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

      </main>
       <footer className="w-full text-center p-4 text-white/60 text-sm">
          CineNest.ai &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
