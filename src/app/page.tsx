
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useScript } from '@/context/script-context';
import { Loader2, ArrowRight, Upload, FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import mammoth from 'mammoth';
import { automateTaskAction } from './actions';

export default function Home() {
  const { setScript } = useScript();
  const [localScript, setLocalScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [aiResult, setAiResult] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setAiResult('');
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
              setFileName('');
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
        setFileName('');
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a .txt, .md, or .docx file.',
        });
      }
    }
  };
  
  const handleGetStarted = async () => {
    if (!localScript.trim()) {
       toast({
        variant: 'destructive',
        title: 'Script is empty',
        description: 'Please enter or upload a script to continue.',
      });
      return;
    }
    
    setScript(localScript);
    setIsLoading(true);
    router.push('/dashboard');
  };
  
  const isInputPresent = localScript.trim() !== '';

  return (
    <div className="relative min-h-screen w-full bg-hero-pattern">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-pink-400 via-primary to-cyan-400 mb-8">
              CineNest.ai
          </h1>

          <Card className="w-full max-w-2xl shadow-2xl bg-card/80 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-3xl font-headline tracking-tight">Enter Your Script</CardTitle>
                <CardDescription>Paste your script below or upload a file to get started.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="TITLE: My Awesome Film..."
                  className="min-h-[150px] bg-background/50 text-base"
                  value={localScript}
                  onChange={(e) => {
                    setLocalScript(e.target.value);
                    setFileName('');
                  }}
                />
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="script-file" className="cursor-pointer">
                            <Button asChild variant="outline" className="cursor-pointer bg-transparent hover:bg-white/10 text-white">
                            <span>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload File
                            </span>
                            </Button>
                            <Input id="script-file" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.md,text/plain,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                        </Label>
                        {fileName && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileCheck className="h-5 w-5 text-green-400" />
                            <span className="truncate">{fileName}</span>
                            </div>
                        )}
                    </div>
                  
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted} 
                    disabled={!isInputPresent || isLoading}
                    className="animated-button"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Started</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
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
    </div>
  );
}
