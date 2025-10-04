'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useScript } from '@/context/script-context';
import { automateTaskAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { GenerateContractForm } from '../legal/page';

const crewMembers = [
  { name: 'Alex Ray', role: 'Director', contact: 'alex.ray@cinenest.ai' },
  { name: 'Sam Jones', role: 'Director of Photography', contact: 'sam.jones@cinenest.ai' },
  { name: 'Casey Smith', role: 'Production Designer', contact: 'casey.smith@cinenest.ai' },
  { name: 'Jordan Lee', role: 'Sound Mixer', contact: 'jordan.lee@cinenest.ai' },
  { name: 'Taylor Kim', role: 'Editor', contact: 'taylor.kim@cinenest.ai' },
];

const automateTaskSchema = z.object({
  task: z.string().min(1, 'Please select a task.'),
  filmGenre: z.string().min(1, 'Please enter a film genre.'),
});

function AutomateTaskForm() {
  const { script } = useScript();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDetails, setGeneratedDetails] = useState('');

  const form = useForm<z.infer<typeof automateTaskSchema>>({
    resolver: zodResolver(automateTaskSchema),
    defaultValues: { task: '', filmGenre: '' },
  });

  async function onSubmit(values: z.infer<typeof automateTaskSchema>) {
    setIsGenerating(true);
    setGeneratedDetails('');
    const result = await automateTaskAction({
      ...values,
      scriptSummary: script.slice(0, 4000) + (script.length > 4000 ? '...' : ''),
    });
    setIsGenerating(false);

    if (result.success && result.data) {
      setGeneratedDetails(result.data.details);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Details',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automate Production Tasks</CardTitle>
        <CardDescription>Use AI to generate assets for pre and post-production.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task to Automate</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a task..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Generate a shot list">Generate a shot list</SelectItem>
                      <SelectItem value="Create a call sheet for tomorrow's shoot">Create a call sheet</SelectItem>
                      <SelectItem value="Suggest a color grading palette">Suggest a color grading palette</SelectItem>
                      <SelectItem value="Draft a marketing synopsis">Draft a marketing synopsis</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filmGenre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Film Genre</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sci-Fi, Drama, Comedy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGenerating}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </form>
        </Form>
        {generatedDetails && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Generated Details:</h3>
            <Textarea readOnly value={generatedDetails} className="min-h-[200px] bg-muted" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default function ProductionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Production</h1>
        <p className="text-muted-foreground">
          Manage your crew, locations, and automate production tasks.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crew Coordination</CardTitle>
            <CardDescription>An overview of your production crew.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crewMembers.map((member) => (
                  <TableRow key={member.name}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.contact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Scouting</CardTitle>
            <CardDescription>Manage and secure filming locations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PlaceHolderImages.map((location: ImagePlaceholder) => (
                <Dialog key={location.id}>
                  <DialogTrigger asChild>
                    <div className="group cursor-pointer">
                      <div className="overflow-hidden rounded-lg">
                        <Image
                          src={location.imageUrl}
                          alt={location.description}
                          width={600}
                          height={400}
                          data-ai-hint={location.imageHint}
                          className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <h3 className="mt-2 font-semibold">{location.description}</h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Generate Contract for: {location.description}</DialogTitle>
                      <DialogDescription>
                        Fill in the details below to generate a location contract.
                      </DialogDescription>
                    </DialogHeader>
                    <GenerateContractForm prefilledLocation={location.description} />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AutomateTaskForm />

    </div>
  );
}
