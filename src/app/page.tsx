
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
import { Header } from '@/components/app/header';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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

    if (aiResult) {
      router.push('/dashboard');
      return;
    }

    setIsAiProcessing(true);
    setAiResult('');
    const result = await automateTaskAction({
      task: 'Generate a shot list',
      scriptSummary: localScript.slice(0, 5000) + (localScript.length > 5000 ? '...' : ''),
      filmGenre: 'Drama',
    });
    setIsAiProcessing(false);

    if (result.success && result.data) {
      setAiResult(result.data.details);
      toast({
        title: 'AI Analysis Complete',
        description: 'Redirecting to dashboard...',
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'AI Analysis Failed',
        description: result.error || 'Could not process the script.',
      });
      setIsLoading(false);
    }
  };
  
  const isInputPresent = localScript.trim() !== '' || fileName !== '';

  return (
    <>
      <div 
        className="fixed inset-0 bg-cover bg-center -z-10" 
        style={{ backgroundImage: 'url(https://storage.googleapis.com/project-spark-308117-21959.appspot.com/e5f2b842-8822-4f36-a36c-9426689d13c7.png)' }}
      />
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="relative z-10 text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-pink-400 via-primary to-cyan-400 mb-8">
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
                    setAiResult('');
                  }}
                />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start">
                      <Label htmlFor="script-file" className="cursor-pointer">
                        <Button asChild variant="outline" className="cursor-pointer">
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File
                          </span>
                        </Button>
                        <Input id="script-file" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.md,text/plain,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                      </Label>
                      {fileName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pl-4 mt-2">
                          <FileCheck className="h-5 w-5 text-green-400" />
                          <span className="truncate">{fileName}</span>
                        </div>
                      )}
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted} 
                    disabled={!isInputPresent || isLoading || isAiProcessing}
                  >
                    {isAiProcessing || isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>{isAiProcessing ? 'Generating...' : 'Redirecting...'}</span>
                      </>
                    ) : (
                      <>
                        <span>Get Started</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                {aiResult && (
                  <div className="mt-6 text-left">
                    <h3 className="font-semibold mb-2 text-foreground">AI Generated Shot List:</h3>
                    <Textarea readOnly value={aiResult} className="min-h-[200px] bg-muted/50 font-mono text-sm" />
                  </div>
                )}
              </CardContent>
            </Card>

        </main>
        <footer className="w-full text-center p-4 text-white/60 text-sm">
            CineNest.ai &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </>
  );
}
