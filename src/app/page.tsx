
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useScript } from '@/context/script-context';
import { Loader2, ArrowRight, Upload, FileCheck, Sparkle } from 'lucide-react';
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

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}


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

    if (aiResult) {
      setIsLoading(true);
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
        description: 'A shot list has been generated from your script.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'AI Analysis Failed',
        description: result.error || 'Could not process the script.',
      });
    }
  };
  
  const isInputPresent = localScript.trim() !== '' || fileName !== '';

  return (
    <div className="relative flex flex-col min-h-screen">
      <Image
        src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop"
        alt="Background"
        fill
        className="object-cover -z-10"
      />
      <div className="absolute inset-0 bg-black/70 -z-10" />
       <Header />
       <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="relative mb-8 flex items-center justify-center">
            <Image 
                src="https://storage.googleapis.com/project-spark-308117-21959.appspot.com/c63955a5-e633-4b45-8123-28f090b83075.png"
                alt="Glowing Ellipse"
                width={600}
                height={400}
                className="object-contain"
            />
            <h1 className="absolute text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-yellow-300 via-primary to-white">
                CineNest.ai
            </h1>
        </div>

        <Card className="w-full max-w-2xl shadow-2xl bg-card/80 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-3xl font-headline tracking-tight">Enter Your Script</CardTitle>
              <CardDescription>Paste your script below or upload a file to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="TITLE: My Awesome Film..."
                className="min-h-[120px] bg-background/50 text-base"
                value={localScript}
                onChange={(e) => {
                  setLocalScript(e.target.value);
                  setFileName('');
                  setAiResult('');
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='flex items-center space-x-2'>
                  <Label htmlFor="script-file" className="flex-1">
                    <Button asChild variant="outline" className="w-full cursor-pointer rounded-full">
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                      </span>
                    </Button>
                    <Input id="script-file" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.md,text/plain,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                  </Label>
                  {fileName && <FileCheck className="h-5 w-5 text-green-400" />}
                </div>
                <Button 
                  size="lg" 
                  onClick={handleGetStarted} 
                  disabled={!isInputPresent || isLoading || isAiProcessing} 
                  className={cn("w-full rounded-full", isInputPresent && "animated-button")}
                >
                  {isInputPresent && (
                    <>
                      <Sparkle className="sparkle sparkle-1" />
                      <PlusIcon className="sparkle sparkle-2" />
                      <Sparkle className="sparkle sparkle-3" />
                      <PlusIcon className="sparkle sparkle-4" />
                    </>
                  )}
                  {isAiProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>{aiResult ? 'Go to Dashboard' : 'Get Started'}</span>
                      {!isAiProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
                    </>
                  )}
                </Button>
              </div>
              {fileName && <p className="text-sm text-muted-foreground truncate">Uploaded: {fileName}</p>}

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
  );
}
