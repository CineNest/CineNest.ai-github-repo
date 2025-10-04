
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useScript } from '@/context/script-context';
import { Loader2, ArrowRight, Upload, FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import mammoth from 'mammoth';
import Link from 'next/link';

export default function Home() {
  const { setScript } = useScript();
  const [localScript, setLocalScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileName, setFileName] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessingFile(true);
      setFileName(file.name);
      
      // Use a timeout to allow the UI to update before heavy processing
      setTimeout(async () => {
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
            setIsProcessingFile(false);
          };
          reader.readAsArrayBuffer(file);
          return; // Prevent setIsProcessingFile from being called too early
        } else {
          setFileName('');
          toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload a .txt, .md, or .docx file.',
          });
        }
        setIsProcessingFile(false);
      }, 50); // Small delay to show "Processing..."
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
    <div className="relative min-h-screen w-full bg-[#0a001a]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-end p-4">
          <Link href="/login">
            <Button variant="outline" className="bg-transparent text-white hover:bg-white/10 border-white/20">
              Login
            </Button>
          </Link>
      </header>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-10">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-pink-400 via-primary to-cyan-400 mb-8">
              CineNest.ai
          </h1>

          <Card className="w-full max-w-2xl shadow-2xl bg-[#140c26]/80 backdrop-blur-sm border-[#2a1a49]">
              <CardHeader>
                <CardTitle className="text-3xl font-headline tracking-tight text-white">Enter Your Script</CardTitle>
                <CardDescription>Paste your script below or upload a file to get started.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="TITLE: My Awesome Film..."
                  className="min-h-[150px] bg-[#0a001a] border-[#2a1a49] text-base text-gray-300"
                  value={localScript}
                  onChange={(e) => {
                    setLocalScript(e.target.value);
                    setFileName('');
                  }}
                />
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Input id="script-file" type="file" className="hidden" onChange={handleFileChange} disabled={isProcessingFile} accept=".txt,.md,text/plain,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                        <label htmlFor="script-file" className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${isProcessingFile ? 'cursor-not-allowed' : 'cursor-pointer'} bg-[#21143a] border-[#3a295f] text-white hover:bg-[#2a1a49]`}>
                            {isProcessingFile ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload File
                              </>
                            )}
                        </label>
                        {fileName && !isProcessingFile && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileCheck className="h-5 w-5 text-green-400" />
                            <span className="truncate">{fileName}</span>
                            </div>
                        )}
                    </div>
                  
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted} 
                    disabled={!isInputPresent || isLoading || isProcessingFile}
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
            CineNest.ai © 2025
        </footer>
      </div>
    </div>
  );
}
