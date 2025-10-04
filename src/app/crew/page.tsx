'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CrewPage() {
  const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/11EqidisBCYvDv1hMolIZTJWOTiXs-jbfZAAfw0mSVx4/edit?usp=sharing';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-[#0a192f] via-[#123a66] to-[#00c6ff]">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-white/20">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-3xl font-headline tracking-tight">Production Planning</CardTitle>
            <CardDescription className="max-w-md">
              Access the central planning document to manage all aspects of your production, from budget to distribution.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-card-foreground/80">
              Use the following Google Sheet to input and track your project's details. The information you provide will be used to power the CineNest.ai dashboard.
            </p>
            <a href={googleSheetUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                Open Production Sheet
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <div className="mt-8">
              <Link href="/">
                <Button variant="link">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
