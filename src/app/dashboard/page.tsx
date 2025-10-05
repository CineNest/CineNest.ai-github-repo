'use client';

import { useState, useEffect } from 'react';
import { useScript } from '@/context/script-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { script: contextScript, isLoading, setScript: setContextScript } = useScript();
  const [localScript, setLocalScript] = useState(contextScript);
  const { toast } = useToast();

  useEffect(() => {
    setLocalScript(contextScript);
  }, [contextScript]);

  const handleSave = () => {
    setContextScript(localScript);
    toast({
      title: 'Script Saved',
      description: 'Your script has been successfully saved.',
    });
  };

  const isScriptChanged = localScript !== contextScript;

  return (
    <div className="container mx-auto">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to CineNest.ai. Here's an overview of your project.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Script</CardTitle>
          <CardDescription>
            This is the script you're currently working with. You can edit it here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                className="min-h-[400px] font-mono text-sm"
                value={localScript}
                onChange={(e) => setLocalScript(e.target.value)}
                placeholder="No script loaded. Go to the landing page to enter one, or start typing here."
              />
               {!localScript && (
                    <div className="text-center text-muted-foreground py-4">
                        <p>No script has been provided yet.</p>
                        <Link href="/">
                           <Button variant="link">Go to Homepage to add a script</Button>
                        </Link>
                    </div>
                )}
              <Button onClick={handleSave} disabled={!isScriptChanged}>
                <Save className="mr-2 h-4 w-4" />
                Save Script
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
