'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft, ExternalLink, Loader2, Search, PlusCircle, X, Pencil } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { suggestLocationsAction } from '@/app/actions';
import type { SuggestLocationsOutput, LocationSuggestion } from '@/ai/flows/suggest-locations-flow';
import { useScript } from '@/context/script-context';
import { StarRating } from '@/components/app/star-rating';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const locationScoutSchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  sceneDescription: z.string().min(10, 'Please provide a more detailed scene description.'),
});

const manualLocationSchema = z.object({
    name: z.string().min(1, 'Location name is required.'),
    description: z.string().min(1, 'Description is required.'),
});

const scheduleGenerationSchema = z.object({
  shootingDates: z.object({
    from: z.date({ required_error: 'A start date is required.' }),
    to: z.date({ required_error: 'An end date is required.' }),
  }),
});

interface ScheduleItem {
  date: string;
  location: string;
  scenes: string;
  characters: string;
  notes: string;
}

const scheduleFormSchema = z.object({
  schedule: z.array(z.object({
    date: z.string(),
    location: z.string().min(1, "Location is required"),
    scenes: z.string().min(1, "Scene is required"),
    characters: z.string().min(1, "Characters are required"),
    notes: z.string(),
  }))
});

export default function LocationScoutingAndSchedulingPage() {
  const { toast } = useToast();
  const { script, breakdown } = useScript();
  const [isSearching, setIsSearching] = useState(false);
  const [locations, setLocations] = useState<LocationSuggestion[]>([]);
  const [date, setDate] = useState<DateRange | undefined>();
  const [scheduleDetails, setScheduleDetails] = useState<{ dateRange: string } | null>(null);

  const scoutForm = useForm<z.infer<typeof locationScoutSchema>>({
    resolver: zodResolver(locationScoutSchema),
    defaultValues: {
      country: '',
      state: '',
      sceneDescription: script ? `A key scene from the script: ${script.substring(0, 200)}...` : '',
    },
  });
  
  const manualLocationForm = useForm<z.infer<typeof manualLocationSchema>>({
    resolver: zodResolver(manualLocationSchema),
    defaultValues: { name: '', description: '' },
  });

  const scheduleGenerationForm = useForm<z.infer<typeof scheduleGenerationSchema>>({
    resolver: zodResolver(scheduleGenerationSchema),
  });

  const editableScheduleForm = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: { schedule: [] },
  });

  const { fields: scheduleFields, update: updateScheduleField } = useFieldArray({
    control: editableScheduleForm.control,
    name: 'schedule',
  });

  async function onScoutSubmit(values: z.infer<typeof locationScoutSchema>) {
    setIsSearching(true);
    setLocations([]);
    const result = await suggestLocationsAction(values);
    setIsSearching(false);

    if (result.success && result.data) {
      setLocations(result.data.locations);
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

  function handleAddManualLocation(values: z.infer<typeof manualLocationSchema>) {
    const newLocation: LocationSuggestion = {
        name: values.name,
        description: values.description,
        imageUrl: `https://picsum.photos/seed/${values.name.replace(/\s/g, '')}/600/400`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(values.name)}`,
    };
    setLocations(prev => [...prev, newLocation]);
    toast({
        title: "Location Added",
        description: `${values.name} has been added to your list.`
    });
    manualLocationForm.reset();
  }

  const removeLocation = (index: number) => {
    setLocations(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      scheduleGenerationForm.setValue('shootingDates', { from: newDate.from, to: newDate.to });
      scheduleGenerationForm.clearErrors('shootingDates');
    } else {
      scheduleGenerationForm.setError('shootingDates', { type: 'manual', message: 'Please select a full date range.' });
    }
  };

  function onScheduleGenerate(values: z.infer<typeof scheduleGenerationSchema>) {
    const { from, to } = values.shootingDates;
    const dayArray = eachDayOfInterval({ start: from, end: to });
    
    const availableLocations = locations.length > 0 
      ? locations.map(l => l.name) 
      : PlaceHolderImages.map(p => p.description);

    const characters = breakdown?.characters && breakdown.characters.length > 0
      ? breakdown.characters
      : ['Character 1', 'Character 2'];
    
    const newSchedule = dayArray.map((day, index) => ({
        date: format(day, 'EEE, dd MMM yyyy'),
        location: availableLocations[index % availableLocations.length],
        scenes: `Scene ${index * 2 + 1}, ${index * 2 + 2}`,
        characters: `${characters[index % characters.length]}, ${characters[(index + 1) % characters.length]}`, 
        notes: index % 3 === 0 ? 'Exterior day shoot' : 'Interior night shoot, requires generator', 
    }));

    editableScheduleForm.reset({ schedule: newSchedule });
    setScheduleDetails({
        dateRange: `${format(from, 'PPP')} to ${format(to, 'PPP')}`
    });

    toast({
        title: "Schedule Generated",
        description: `Created a schedule from ${format(values.shootingDates.from, 'PPP')} to ${format(values.shootingDates.to, 'PPP')}. You can now edit the details.`
    });
  }

  function handleSaveSchedule(values: z.infer<typeof scheduleFormSchema>) {
    // In a real app, you'd save this to a database. For now, we just show a toast.
    // The user mentioned training the AI; this `values.schedule` data would be the input for that process.
    console.log("Saving schedule:", values.schedule);
    toast({
        title: "Schedule Saved",
        description: "Your changes to the shooting plan have been saved successfully."
    });
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Location Scout & Scheduler</h1>
        <p className="text-muted-foreground">
          Find filming locations with AI and create an editable shooting schedule.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Search for a Location</CardTitle>
          <CardDescription>
            Describe the scene and let the AI suggest locations, or add your own manually.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...scoutForm}>
            <form onSubmit={scoutForm.handleSubmit(onScoutSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={scoutForm.control} name="country" render={({ field }) => (
                  <FormItem><FormLabel>Country (Optional)</FormLabel><FormControl><Input placeholder="e.g., India" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={scoutForm.control} name="state" render={({ field }) => (
                  <FormItem><FormLabel>State / Province (Optional)</FormLabel><FormControl><Input placeholder="e.g., Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>
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

      {locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Locations</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location, index) => (
              <Card key={`${location.name}-${index}`} className="overflow-hidden flex flex-col relative group">
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeLocation(index)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove location</span>
                </Button>
                <div className="relative h-48 w-full">
                    <Image src={location.imageUrl} alt={location.name} fill style={{objectFit: "cover"}} className="bg-muted" />
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
              <CardTitle>Add a Location Manually</CardTitle>
          </CardHeader>
          <CardContent>
              <Form {...manualLocationForm}>
                  <form onSubmit={manualLocationForm.handleSubmit(handleAddManualLocation)} className="flex items-end gap-4">
                      <FormField control={manualLocationForm.control} name="name" render={({ field }) => (
                          <FormItem className="flex-1"><FormLabel>Location Name</FormLabel><FormControl><Input placeholder="e.g., My Uncle's Farm" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={manualLocationForm.control} name="description" render={({ field }) => (
                           <FormItem className="flex-1"><FormLabel>Description</FormLabel><FormControl><Input placeholder="A rustic barn with a large field" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                  </form>
              </Form>
          </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>2. Create Shooting Schedule</CardTitle>
          <CardDescription>Define your shooting dates to generate a plan across available locations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...scheduleGenerationForm}>
            <form onSubmit={scheduleGenerationForm.handleSubmit(onScheduleGenerate)} className="space-y-8">
                <FormField
                  control={scheduleGenerationForm.control}
                  name="shootingDates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Shooting Dates</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={'outline'}
                            className={cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
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
              <Button type="submit" disabled={locations.length === 0 && !breakdown}>
                Generate Schedule
              </Button>
              {locations.length === 0 && !breakdown && <p className="text-sm text-muted-foreground">Please add at least one location to generate a schedule.</p>}
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {scheduleFields.length > 0 && scheduleDetails && (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Daily Shooting Plan</CardTitle>
                        <CardDescription>
                           Schedule for {scheduleDetails.dateRange}. Edit the details for each day below.
                        </CardDescription>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button>
                               <Pencil className="mr-2 h-4 w-4" />
                                Save Schedule
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Schedule Changes</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to save the changes to the schedule? This action cannot be undone. In the future, this data can be used to improve AI suggestions.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={editableScheduleForm.handleSubmit(handleSaveSchedule)}>
                                    Confirm & Save
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...editableScheduleForm}>
                 <form>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Date</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Scene(s) to Shoot</TableHead>
                                <TableHead>Characters Involved</TableHead>
                                <TableHead>Notes / Equipment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scheduleFields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell className="font-medium">{field.date}</TableCell>
                                    <TableCell>
                                        <FormField control={editableScheduleForm.control} name={`schedule.${index}.location`} render={({ field }) => <Input {...field} className="bg-muted/50 border-border" />} />
                                    </TableCell>
                                    <TableCell>
                                        <FormField control={editableScheduleForm.control} name={`schedule.${index}.scenes`} render={({ field }) => <Input {...field} className="bg-muted/50 border-border" />} />
                                    </TableCell>
                                    <TableCell>
                                        <FormField control={editableScheduleForm.control} name={`schedule.${index}.characters`} render={({ field }) => <Input {...field} className="bg-muted/50 border-border" />} />
                                    </TableCell>
                                    <TableCell>
                                        <FormField control={editableScheduleForm.control} name={`schedule.${index}.notes`} render={({ field }) => <Textarea {...field} className="bg-muted/50 border-border min-h-0" />} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </form>
                </Form>
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
