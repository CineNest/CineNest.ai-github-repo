'use client';

import { useScript } from '@/context/script-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

export default function DashboardPage() {
  const { script, isLoading, setScript } = useScript();

  return (
    <div className="container mx-auto">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to CineFlow AI. Here's an overview of your project.
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
            <Textarea
              className="min-h-[400px] font-mono text-sm"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="No script loaded. Go to the landing page to enter one, or start typing here."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
