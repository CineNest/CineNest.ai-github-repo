'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useScript } from '@/context/script-context';
import { scriptBreakdownAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Film, MapPin, PlusCircle, Trash2, Pencil } from 'lucide-react';
import type { ScriptBreakdownOutput } from '@/ai/flows/script-breakdown-flow';
import { Input } from '@/components/ui/input';

function AnalysisResults({ results }: { results: ScriptBreakdownOutput }) {
  const { setBreakdown } = useScript();
  const { toast } = useToast();
  
  const [localCharacters, setLocalCharacters] = useState(results.characters);
  const [localLocations, setLocalLocations] = useState(results.locations);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setLocalCharacters(results.characters);
    setLocalLocations(results.locations);
  }, [results]);

  const handleCharacterChange = (index: number, value: string) => {
    const newCharacters = [...localCharacters];
    newCharacters[index] = value;
    setLocalCharacters(newCharacters);
  };

  const handleLocationChange = (index: number, value: string) => {
    const newLocations = [...localLocations];
    newLocations[index] = value;
    setLocalLocations(newLocations);
  };
  
  const addCharacter = () => setLocalCharacters([...localCharacters, '']);
  const removeCharacter = (index: number) => setLocalCharacters(localCharacters.filter((_, i) => i !== index));

  const addLocation = () => setLocalLocations([...localLocations, '']);
  const removeLocation = (index: number) => setLocalLocations(localLocations.filter((_, i) => i !== index));

  const handleSaveChanges = () => {
    const updatedBreakdown = {
      characters: localCharacters.filter(c => c.trim() !== ''),
      locations: localLocations.filter(l => l.trim() !== ''),
      props: results.props // Props are not editable in this UI
    };
    setBreakdown(updatedBreakdown);
    setIsEditMode(false);
    toast({
      title: 'Changes Saved',
      description: 'Your updates to the script breakdown have been saved.'
    });
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Film /> Characters</span>
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <Button variant="ghost" size="sm" onClick={addCharacter}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add
                  </Button>
                )}
                 <Button variant="ghost" size="icon" onClick={() => setIsEditMode(!isEditMode)}>
                    <Pencil className="h-5 w-5" />
                    <span className="sr-only">Toggle Edit Mode</span>
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {localCharacters.map((char, i) => (
                <li key={i} className="flex items-center gap-2">
                  {isEditMode ? (
                    <>
                      <Input value={char} onChange={(e) => handleCharacterChange(i, e.target.value)} />
                      <Button variant="ghost" size="icon" onClick={() => removeCharacter(i)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  ) : (
                    <span className="p-2 w-full">{char}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><MapPin /> Locations</span>
                 <div className="flex items-center gap-2">
                    {isEditMode && (
                    <Button variant="ghost" size="sm" onClick={addLocation}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                    </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setIsEditMode(!isEditMode)}>
                        <Pencil className="h-5 w-5" />
                        <span className="sr-only">Toggle Edit Mode</span>
                    </Button>
                </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {localLocations.map((loc, i) => (
                <li key={i} className="flex items-center gap-2">
                  {isEditMode ? (
                    <>
                      <Input value={loc} onChange={(e) => handleLocationChange(i, e.target.value)} />
                      <Button variant="ghost" size="icon" onClick={() => removeLocation(i)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  ) : (
                     <span className="p-2 w-full">{loc}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      {isEditMode && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      )}
    </>
  );
}

export default function ScriptBreakdownPage() {
  const { script, breakdown, setBreakdown, isLoading: isScriptLoading } = useScript();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    setBreakdown(null); // Clear previous results
    const result = await scriptBreakdownAction({ script });
    setIsAnalyzing(false);

    if (result.success && result.data) {
      setBreakdown(result.data);
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
          Analyze your script to identify production elements. Use the pencil icon to edit the results.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automated Script Analysis</CardTitle>
          <CardDescription>
            Use AI to automatically tag characters and locations from your script.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isScriptLoading ? (
            <p className="text-muted-foreground">Loading script...</p>
          ) : (
            <Button onClick={handleAnalysis} disabled={isAnalyzing || !script}>
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Start AI Analysis
            </Button>
          )}
        </CardContent>
      </Card>

      {isAnalyzing && (
        <div className="text-center p-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Analyzing your script...</p>
        </div>
      )}

      {breakdown && <AnalysisResults results={breakdown} />}

       <div className="mt-8">
          <Link href="/dashboard/pre-production">
            <Button variant="outline">Back to Pre-Production Hub</Button>
          </Link>
        </div>
    </div>
  );
}
