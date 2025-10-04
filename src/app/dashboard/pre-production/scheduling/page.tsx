
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Cloud, DollarSign, Loader2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const planSchema = z.object({
  shootingDates: z.object({
    from: z.date({ required_error: 'A start date is required.' }),
    to: z.date({ required_error: 'An end date is required.' }),
  }),
  location: z.string().min(1, 'Please select a location.'),
});

export default function ProductionPlanPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>();

  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: { location: '' },
  });

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      form.setValue('shootingDates', { from: newDate.from, to: newDate.to });
      form.clearErrors('shootingDates');
    } else {
      form.setError('shootingDates', { type: 'manual', message: 'Please select a full date range.' });
    }
  };

  function onSubmit(values: z.infer<typeof planSchema>) {
    // This is where you would handle the form submission, e.g., saving the schedule.
    toast({
        title: "Schedule Saved",
        description: `Scheduled shoot at ${values.location} from ${format(values.shootingDates.from, 'PPP')} to ${format(values.shootingDates.to, 'PPP')}.`
    });
    console.log(values);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shooting Schedule & Plan</h1>
        <p className="text-muted-foreground">Define your shooting schedule and location.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduling Form</CardTitle>
          <CardDescription>Fill out the details below to generate your production schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
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
                
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Cloud/> Weather Forecast</CardTitle>
                        <CardDescription>Real-time weather data for the selected location and dates (placeholder).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground py-8">Weather data will appear here.</p>
                    </CardContent>
                </Card>
              </div>

              <Button type="submit">
                Save Schedule
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
