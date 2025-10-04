'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ScriptBreakdownPage() {
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
          <p className="text-muted-foreground mb-4">Feature coming soon...</p>
          <Button disabled>Start AI Analysis</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breakdown Reports</CardTitle>
          <CardDescription>
            View and export reports for each department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No reports generated yet.</p>
        </CardContent>
      </Card>
       <div className="mt-8">
          <Link href="/dashboard/pre-production">
            <Button variant="outline">Back to Pre-Production Hub</Button>
          </Link>
        </div>
    </div>
  );
}
