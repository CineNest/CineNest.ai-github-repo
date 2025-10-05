'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft, ExternalLink, Loader2, Search } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { suggestLocationsAction } from '@/app/actions';
import type { SuggestLocationsOutput } from '@/ai/flows/suggest-locations-flow';
import { useScript } from '@/context/script-context';
import { StarRating } from '@/components/app/star-rating';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const locationScoutSchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  sceneDescription: z.string().min(10, 'Please provide a more detailed scene description.'),
});

const planSchema = z.object({
  shootingDates: z.object({
    from: z.date({ required_error: 'A start date is required.' }),
    to: z.date({ required_error: 'An end date is required.' }),
  }),
  location: z.string().min(1, 'Please select a location.'),
});

interface ScheduleItem {
  date: string;
  scenes: string;
  characters: string;
  notes: string;
}


export default function LocationScoutingAndSchedulingPage() {
  const { toast } = useToast();
  const { script } = useScript();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SuggestLocationsOutput | null>(null);
  const [date, setDate] = useState<DateRange | undefined>();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [scheduleDetails, setScheduleDetails] = useState<{ location: string; dateRange: string } | null>(null);

  const scoutForm = useForm<z.infer<typeof locationScoutSchema>>({
    resolver: zodResolver(locationScoutSchema),
    defaultValues: {
      country: '',
      state: '',
      sceneDescription: script ? `A key scene from the script: ${script.substring(0, 200)}...` : '',
    },
  });

  const scheduleForm = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: { location: '' },
  });

  async function onScoutSubmit(values: z.infer<typeof locationScoutSchema>) {
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
  
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      scheduleForm.setValue('shootingDates', { from: newDate.from, to: newDate.to });
      scheduleForm.clearErrors('shootingDates');
    } else {
      scheduleForm.setError('shootingDates', { type: 'manual', message: 'Please select a full date range.' });
    }
  };

  function onScheduleSubmit(values: z.infer<typeof planSchema>) {
    const { from, to } = values.shootingDates;
    const dayArray = eachDayOfInterval({ start: from, end: to });
    
    const newSchedule = dayArray.map(day => ({
        date: format(day, 'EEE, dd MMM yyyy'),
        scenes: '', 
        characters: '', 
        notes: '', 
    }));

    setSchedule(newSchedule);
    setScheduleDetails({
        location: values.location,
        dateRange: `${format(from, 'PPP')} to ${format(to, 'PPP')}`
    });

    toast({
        title: "Schedule Generated",
        description: `Created a schedule for ${values.location} from ${format(values.shootingDates.from, 'PPP')} to ${format(values.shootingDates.to, 'PPP')}.`
    });
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Location Scout & Scheduler</h1>
        <p className="text-muted-foreground">
          Find the perfect filming location with AI-powered suggestions and create a schedule.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Search for a Location</CardTitle>
          <CardDescription>
            Describe the scene and specify the geographical area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...scoutForm}>
            <form onSubmit={scoutForm.handleSubmit(onScoutSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={scoutForm.control} name="country" render={({ field }) => (
                  <FormItem><FormLabel>Country (Optional)</FormLabel><FormControl><Input placeholder="e.g., USA" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={scoutForm.control} name="state" render={({ field }) => (
                  <FormItem><FormLabel>State / Province (Optional)</FormLabel><FormControl><Input placeholder="e.g., California" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={scoutForm.control} name="sceneDescription" render={({ field }) => (
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
        <Card>
          <CardHeader>
            <CardTitle>Suggested Locations</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>2. Create Shooting Schedule</CardTitle>
          <CardDescription>Select one of the scouted locations and define your shooting dates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...scheduleForm}>
            <form onSubmit={scheduleForm.handleSubmit(onScheduleSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={scheduleForm.control}
                  name="shootingDates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Shooting Dates</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={'outline'}
                            className={cn('justify-start text-left font-normal', !date && 'text-muted-foreground')}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                                </>
                              ) : (
                                format(date.from, 'LLL dd, y')
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={handleDateChange}
                            numberOfMonths={2}
                            captionLayout="dropdown-nav"
                            fromYear={new Date().getFullYear() - 5}
                            toYear={new Date().getFullYear() + 5}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={scheduleForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a scouted location..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PlaceHolderImages.map(loc => (
                            <SelectItem key={loc.id} value={loc.description}>{loc.description}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">
                Generate Schedule
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {schedule.length > 0 && scheduleDetails && (
        <Card>
            <CardHeader>
                <CardTitle>Daily Shooting Plan: {scheduleDetails.location}</CardTitle>
                <CardDescription>
                    Schedule for {scheduleDetails.dateRange}. Fill in the details for each day.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Date</TableHead>
                            <TableHead>Scene(s) to Shoot</TableHead>
                            <TableHead>Characters Involved</TableHead>
                            <TableHead>Notes / Equipment</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schedule.map((day, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{day.date}</TableCell>
                                <TableCell>{/* Add Textarea/Input here if needed */}</TableCell>
                                <TableCell>{/* Add Textarea/Input here if needed */}</TableCell>
                                <TableCell>{/* Add Textarea/Input here if needed */}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
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
