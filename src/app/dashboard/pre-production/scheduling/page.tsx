'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useScript } from '@/context/script-context';
import { generateScheduleAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const scheduleSchema = z.object({
  shootingDays: z.coerce.number().min(1, { message: 'Must be at least 1 day.' }),
});

interface ScheduleDay {
  day: number;
  date: string;
  scenes: string;
  location: string;
  notes: string;
}

export default function SchedulingPage() {
  const { script, isLoading: isScriptLoading } = useScript();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleDay[] | null>(null);

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { shootingDays: 10 },
  });

  const handleGenerateSchedule = async (values: z.infer<typeof scheduleSchema>) => {
    if (!script) {
      toast({
        variant: 'destructive',
        title: 'No Script Found',
        description: 'Please add a script on the dashboard before generating a schedule.',
      });
      return;
    }
    setIsGenerating(true);
    setSchedule(null);
    const result = await generateScheduleAction({
      script,
      shootingDays: values.shootingDays,
    });
    setIsGenerating(false);

    if (result.success && result.data) {
      setSchedule(result.data.schedule);
      toast({
        title: 'Schedule Generated',
        description: 'The AI has created a draft shooting schedule.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Generate Schedule',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shooting Schedule</h1>
        <p className="text-muted-foreground">
          Organize your shooting days, scenes, and resources with AI assistance.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Scheduling Tool</CardTitle>
          <CardDescription>
            Provide the number of shooting days, and the AI will generate a schedule based on your script.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateSchedule)} className="space-y-4">
              <FormField
                control={form.control}
                name="shootingDays"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel>Number of Shooting Days</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isGenerating || isScriptLoading}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isScriptLoading ? 'Loading Script...' : 'Generate Schedule'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {schedule && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Shooting Schedule</CardTitle>
            <CardDescription>
              This is a draft schedule created by the AI. Review and adjust as needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Scenes</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((day) => (
                  <TableRow key={day.day}>
                    <TableCell className="font-medium">{day.day}</TableCell>
                    <TableCell>{day.date}</TableCell>
                    <TableCell>{day.scenes}</TableCell>
                    <TableCell>{day.location}</TableCell>
                    <TableCell>{day.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

       <div className="mt-8">
          <Link href="/dashboard/pre-production">
            <Button variant="outline">Back to Pre-Production Hub</Button>
          </Link>
        </div>
    </div>
  );
}