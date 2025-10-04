'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function LocationScoutingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Location Scouting</h1>
        <p className="text-muted-foreground">
          Manage and visualize potential filming locations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suggested Locations</CardTitle>
          <CardDescription>
            Based on your script, here are some AI-suggested location types.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PlaceHolderImages.map((location) => (
            <div key={location.id} className="group relative">
              <Image
                src={location.imageUrl}
                alt={location.description}
                width={600}
                height={400}
                data-ai-hint={location.imageHint}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 rounded-b-lg">
                <p className="text-sm font-semibold">{location.description}</p>
              </div>
            </div>
          ))}
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
