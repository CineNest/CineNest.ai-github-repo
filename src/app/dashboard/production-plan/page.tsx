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
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { estimateEquipmentCostAction } from '@/app/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const planSchema = z.object({
  shootingDates: z.object({
    from: z.date(),
    to: z.date(),
  }),
  location: z.string().min(1, 'Please select a location.'),
  equipmentList: z.string().min(10, 'Please enter a list of equipment.'),
});

interface EquipmentCost {
  item: string;
  estimatedCost: string;
}

export default function ProductionPlanPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>();
  const [isEstimating, setIsEstimating] = useState(false);
  const [equipmentCosts, setEquipmentCosts] = useState<{ costs: EquipmentCost[]; total: string } | null>(null);

  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: { location: '', equipmentList: '' },
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

  async function onSubmit(values: z.infer<typeof planSchema>) {
    setIsEstimating(true);
    setEquipmentCosts(null);
    const result = await estimateEquipmentCostAction({ equipmentList: values.equipmentList });
    setIsEstimating(false);

    if (result.success && result.data) {
      setEquipmentCosts({ costs: result.data.costs, total: result.data.totalEstimatedCost });
      toast({
        title: 'Cost Estimation Complete',
        description: 'AI has estimated the equipment rental costs.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Estimating Costs',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Production Plan</h1>
        <p className="text-muted-foreground">Define your shooting schedule, location, and equipment needs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planning Form</CardTitle>
          <CardDescription>Fill out the details below to generate your production plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
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
                              fromYear={new Date().getFullYear()}
                              toYear={new Date().getFullYear() + 10}
                            />
                          </PopoverContent>
                        </Popover>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </div>

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

              <FormField
                control={form.control}
                name="equipmentList"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment List</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Arri Alexa Mini, set of Zeiss Supreme Prime lenses, 2x 1TB Codex cards, O'Connor 2575D tripod..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isEstimating}>
                {isEstimating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <DollarSign className="mr-2 h-4 w-4"/> Estimate Equipment Cost
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {equipmentCosts && (
        <Card>
            <CardHeader>
                <CardTitle>AI Equipment Cost Estimation</CardTitle>
                <CardDescription>Estimated rental prices for your equipment list.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Estimated Cost</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {equipmentCosts.costs.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.item}</TableCell>
                                <TableCell className="text-right">{item.estimatedCost}</TableCell>
                            </TableRow>
                        ))}
                         <TableRow className="font-bold border-t-2">
                            <TableCell>Total Estimated Cost</TableCell>
                            <TableCell className="text-right">{equipmentCosts.total}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
