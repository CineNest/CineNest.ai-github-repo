'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

export default function PreProductionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pre-Production Hub</h1>
        <p className="text-muted-foreground">
          Plan and organize every detail before the cameras start rolling.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Script Breakdown</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <p className="text-xs text-muted-foreground mb-4 mt-auto">
              Analyze your script for scenes, characters, props, and locations.
            </p>
            <Link href="/dashboard/pre-production/script-breakdown">
              <Button className="w-full">Breakdown Script</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location Scouting & Scheduling</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <p className="text-xs text-muted-foreground mb-4 mt-auto">
              Find and schedule potential filming locations.
            </p>
            <Link href="/dashboard/pre-production/location-scouting">
              <Button className="w-full">Scout & Schedule</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crew Assignment</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <p className="text-xs text-muted-foreground mb-4 mt-auto">
              Assign roles and manage your production crew.
            </p>
            <Link href="/dashboard/pre-production/crew-assignment">
             <Button className="w-full">Assign Crew</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
