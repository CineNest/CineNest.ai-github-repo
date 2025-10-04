
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const statusSchema = z.object({
  phase: z.string().min(1, 'Please select a production phase.'),
  summary: z.string().min(10, 'Please provide a meaningful summary.'),
});

interface ProductionStatus {
  id: string;
  date: string;
  phase: string;
  summary: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function StatusPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'statuses'), orderBy('createdAt', 'desc'));
  }, [firestore, user]);
  
  const { data: statuses, isLoading: areStatusesLoading } = useCollection<ProductionStatus>(statusesQuery);
  
  const form = useForm<z.infer<typeof statusSchema>>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      phase: '',
      summary: '',
    },
  });

  async function onSubmit(values: z.infer<typeof statusSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to log a status.',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const statusesRef = collection(firestore, 'statuses');
      await addDocumentNonBlocking(statusesRef, {
        ...values,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Status Logged',
        description: 'Your daily production status has been saved.',
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Logging Status',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLoading = areStatusesLoading || isUserLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Production Status</h1>
        <p className="text-muted-foreground">Log daily progress and view project history.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Daily Status</CardTitle>
          <CardDescription>
            Submit a brief report at the end of each production day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Phase</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select current phase..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pre-production">Pre-production</SelectItem>
                        <SelectItem value="Shooting">Shooting</SelectItem>
                        <SelectItem value="Post-production">Post-production</SelectItem>
                        <SelectItem value="Distribution">Distribution</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What was accomplished today? Any blockers or notes for tomorrow?"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting || isUserLoading}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log Status
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
          <CardDescription>A chronological log of all production status updates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[150px]">Phase</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : statuses && statuses.length > 0 ? (
                statuses.map((status) => (
                  <TableRow key={status.id}>
                    <TableCell className="font-medium">{status.date}</TableCell>
                    <TableCell>{status.phase}</TableCell>
                    <TableCell className="whitespace-pre-wrap">{status.summary}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                    No status logs yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
