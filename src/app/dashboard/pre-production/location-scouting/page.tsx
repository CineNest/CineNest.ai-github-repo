'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { suggestLocationsAction } from '@/app/actions';
import type { SuggestLocationsOutput } from '@/ai/flows/suggest-locations-flow';
import { ArrowLeft, ExternalLink, Loader2, Search } from 'lucide-react';
import { useScript } from '@/context/script-context';
import { StarRating } from '@/components/app/star-rating';

const locationScoutSchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  sceneDescription: z.string().min(10, 'Please provide a more detailed scene description.'),
});

export default function LocationScoutingPage() {
  const { toast } = useToast();
  const { script } = useScript();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SuggestLocationsOutput | null>(null);

  const form = useForm<z.infer<typeof locationScoutSchema>>({
    resolver: zodResolver(locationScoutSchema),
    defaultValues: {
      country: '',
      state: '',
      sceneDescription: script ? `A key scene from the script: ${script.substring(0, 200)}...` : '',
    },
  });

  async function onSubmit(values: z.infer<typeof locationScoutSchema>) {
    setIsSearching(true);
    setSearchResult(null);
    const result = await suggestLocationsAction(values);
    setIsSearching(false);

    if (result.success && result.data) {
      setSearchResult(result.data);
      toast({
        title: 'Locations Found',
        description: `The AI has suggested ${result.data.locations.length} potential locations.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Finding Locations',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Location Scout</h1>
        <p className="text-muted-foreground">
          Find the perfect filming location with AI-powered suggestions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search for a Location</CardTitle>
          <CardDescription>
            Describe the scene and specify the geographical area. The AI will analyze your request and suggest suitable public or private locations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem><FormLabel>Country (Optional)</FormLabel><FormControl><Input placeholder="e.g., USA" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem><FormLabel>State / Province (Optional)</FormLabel><FormControl><Input placeholder="e.g., California" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="sceneDescription" render={({ field }) => (
                <FormItem><FormLabel>Scene Description</FormLabel><FormControl><Textarea placeholder="Describe the ideal location, e.g., 'A modern, bustling coffee shop with large windows' or 'A quiet, secluded beach at sunset'." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Scout Locations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isSearching && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-5/6 mt-1" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-9 w-32" />
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {searchResult && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Suggested Locations</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searchResult.locations.map((location, index) => (
              <Card key={`${location.name}-${index}`} className="overflow-hidden flex flex-col">
                <div className="relative h-48 w-full">
                    <Image src={location.imageUrl} alt={location.name} fill objectFit="cover" className="bg-muted" />
                </div>
                <CardHeader>
                  <CardTitle>{location.name}</CardTitle>
                  {location.rating && (
                    <div className="flex items-center gap-2">
                        <StarRating rating={location.rating} />
                        <span className="text-sm text-muted-foreground">{location.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <CardDescription>{location.description}</CardDescription>
                  {location.reviewsSummary && (
                     <p className="text-xs text-muted-foreground pt-2 italic">"{location.reviewsSummary}"</p>
                  )}
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between">
                   <a href={location.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
                    <Button variant="outline">
                        View on Google Maps
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/dashboard/pre-production">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pre-Production Hub
          </Button>
        </Link>
      </div>
    </div>
  );
}
