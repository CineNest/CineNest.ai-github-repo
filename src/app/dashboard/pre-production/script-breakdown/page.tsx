'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useScript } from '@/context/script-context';
import { scriptBreakdownAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Film, MapPin, ToyBrick } from 'lucide-react';
import type { ScriptBreakdownOutput } from '@/ai/flows/script-breakdown-flow';

function AnalysisResults({ results }: { results: ScriptBreakdownOutput }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Film /> Characters</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm list-disc pl-5">
            {results.characters.map((char, i) => <li key={i}>{char}</li>)}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin /> Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm list-disc pl-5">
            {results.locations.map((loc, i) => <li key={i}>{loc}</li>)}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ToyBrick /> Props</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm list-disc pl-5">
            {results.props.map((prop, i) => <li key={i}>{prop}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ScriptBreakdownPage() {
  const { script, isLoading: isScriptLoading } = useScript();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScriptBreakdownOutput | null>(null);

  const handleAnalysis = async () => {
    if (!script) {
      toast({
        variant: 'destructive',
        title: 'No Script Found',
        description: 'Please add a script on the main dashboard page before analyzing.',
      });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const result = await scriptBreakdownAction({ script });
    setIsAnalyzing(false);

    if (result.success && result.data) {
      setAnalysisResult(result.data);
      toast({
        title: 'Analysis Complete',
        description: 'Script elements have been identified.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Script Breakdown</h1>
        <p className="text-muted-foreground">
          Analyze your script to identify all production elements.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automated Script Analysis</CardTitle>
          <CardDescription>
            Use AI to automatically tag characters, locations, props, and other elements from your script.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isScriptLoading ? (
            <p className="text-muted-foreground">Loading script...</p>
          ) : (
            <Button onClick={handleAnalysis} disabled={isAnalyzing}>
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Start AI Analysis
            </Button>
          )}
        </CardContent>
      </Card>

      {analysisResult && <AnalysisResults results={analysisResult} />}

       <div className="mt-8">
          <Link href="/dashboard/pre-production">
            <Button variant="outline">Back to Pre-Production Hub</Button>
          </Link>
        </div>
    </div>
  );
}
