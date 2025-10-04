'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { suggestCrewAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface CrewMember {
  name: string;
  role: string;
  status: string;
  contact: string;
}

const initialCrewMembers: CrewMember[] = [
  { name: 'Alex Ray', role: 'Director', status: 'Confirmed', contact: 'alex.ray@cinenest.ai' },
  { name: 'Sam Jones', role: 'Director of Photography', status: 'Confirmed', contact: 'sam.jones@cinenest.ai' },
];

const suggestCrewSchema = z.object({
  roles: z.string().min(3, { message: 'Please list at least one role.' }),
});

export default function CrewAssignmentPage() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>(initialCrewMembers);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof suggestCrewSchema>>({
    resolver: zodResolver(suggestCrewSchema),
    defaultValues: {
      roles: 'Production Designer, Sound Mixer, Gaffer, Editor',
    },
  });

  const handleSuggestCrew = async (values: z.infer<typeof suggestCrewSchema>) => {
    setIsSuggesting(true);
    const result = await suggestCrewAction({ roles: values.roles.split(',').map(r => r.trim()) });
    setIsSuggesting(false);

    if (result.success && result.data) {
      const newCrewMembers = result.data.crew.map(member => ({ ...member, status: 'Suggested' }));
      setCrewMembers(prev => [...prev, ...newCrewMembers]);
      toast({
        title: 'Crew Suggested',
        description: 'AI has suggested new crew members.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Suggest Crew',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crew Assignment</h1>
        <p className="text-muted-foreground">
          Build and manage your production crew with AI assistance.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Crew Suggestion</CardTitle>
          <CardDescription>Get AI-powered suggestions for your crew based on roles you need to fill.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSuggestCrew)} className="space-y-4">
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roles to Fill (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gaffer, Best Boy, Key Grip" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSuggesting}>
                {isSuggesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Suggest Crew
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Crew Roster</CardTitle>
                    <CardDescription>
                        Track the status of all crew members for your project.
                    </CardDescription>
                </div>
                <Button>Add Crew Member</Button>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crewMembers.map((member, index) => (
                <TableRow key={`${member.name}-${index}`}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                     <span className={`px-2 py-1 text-xs rounded-full ${
                        member.status === 'Confirmed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        member.status === 'Suggested' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                        member.status === 'Pending' || member.status === 'Offer Sent' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                     }`}>
                        {member.status}
                    </span>
                  </TableCell>
                  <TableCell>{member.contact}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                        <span className="sr-only">Edit</span>
                        ...
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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