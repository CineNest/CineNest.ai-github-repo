'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SchedulingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shooting Schedule</h1>
        <p className="text-muted-foreground">
          Organize your shooting days, scenes, and resources.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduling Tool</CardTitle>
          <CardDescription>
            Drag and drop scenes to build your shooting schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Feature coming soon...</p>
          <Button disabled>Open Scheduler</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Day-out-of-Days Report</CardTitle>
           <CardDescription>
            Track talent and key resources across the schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Report will be generated from schedule.</p>
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
