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
import { ExternalLink, Loader2, PlusCircle, Mail, Pencil, Trash2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CrewMember {
  name: string;
  role: string;
  status: string;
  contact: string;
  dates: string;
}

const initialCrewMembers: CrewMember[] = [
  { name: 'Alex Ray', role: 'Director', status: 'Confirmed', contact: 'alex.ray@cinenest.ai', dates: 'Aug 1 - Aug 30' },
  { name: 'Sam Jones', role: 'Director of Photography', status: 'Confirmed', contact: 'sam.jones@cinenest.ai', dates: 'Aug 1 - Aug 30' },
  { name: 'Casey Smith', role: 'Production Designer', status: 'Pending', contact: 'casey.smith@cinenest.ai', dates: 'July 25 - Aug 30' },
  { name: 'Jordan Lee', role: 'Sound Mixer', status: 'Offer Sent', contact: 'jordan.lee@cinenest.ai', dates: 'Aug 1 - Aug 30' },
  { name: 'Taylor Kim', role: 'Editor', status: 'Confirmed', contact: 'taylor.kim@cinenest.ai', dates: 'Sep 1 - Oct 15' },
];

const suggestCrewSchema = z.object({
  roles: z.string().min(3, { message: 'Please list at least one role.' }),
});

export default function CrewAssignmentPage() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>(initialCrewMembers);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof suggestCrewSchema>>({
    resolver: zodResolver(suggestCrewSchema),
    defaultValues: {
      roles: 'Gaffer, Best Boy, Key Grip',
    },
  });

  const handleSuggestCrew = async (values: z.infer<typeof suggestCrewSchema>) => {
    setIsSuggesting(true);
    const result = await suggestCrewAction({ roles: values.roles.split(',').map(r => r.trim()) });
    setIsSuggesting(false);

    if (result.success && result.data) {
      const newCrewMembers = result.data.crew.map(member => ({ ...member, status: 'Suggested', dates: 'TBD' }));
      setCrewMembers(prev => [...prev, ...newCrewMembers]);
      toast({
        title: 'Crew Suggested',
        description: 'AI has suggested new crew members for the vacant positions.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Suggest Crew',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  };

  const handleSendSchedule = (crewMemberName: string) => {
    toast({
      title: 'Schedule Sent',
      description: `Daily schedule has been sent to ${crewMemberName}.`,
    });
  };
  
  const handleInputChange = (index: number, field: keyof CrewMember, value: string) => {
    const updatedCrew = [...crewMembers];
    updatedCrew[index] = { ...updatedCrew[index], [field]: value };
    setCrewMembers(updatedCrew);
  };
  
  const addCrewMember = () => {
    setCrewMembers([...crewMembers, { name: '', role: '', status: 'Pending', contact: '', dates: '' }]);
  };

  const removeCrewMember = (index: number) => {
    setCrewMembers(crewMembers.filter((_, i) => i !== index));
  };
  
  const saveChanges = () => {
    // In a real app, this would save to a DB. Here we just update state and exit edit mode.
    setIsEditMode(false);
    toast({
      title: "Crew Roster Updated",
      description: "Your changes have been saved locally."
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crew Assignment & Coordination</h1>
        <p className="text-muted-foreground">
          Post vacant positions, get AI suggestions, and manage your production crew.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Vacant Positions</CardTitle>
          <CardDescription>
            List the vacant roles for actors, crew, or artists. The AI will suggest candidates for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSuggestCrew)} className="space-y-4">
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vacant Positions (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lead Actor, Gaffer, Concept Artist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSuggesting}>
                {isSuggesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Talent
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
                        Track the status of all artists and crew members for your project.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {isEditMode && (
                        <>
                        <Button onClick={addCrewMember} size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Manually
                        </Button>
                        <Button onClick={saveChanges} size="sm" variant="outline">
                            Save Changes
                        </Button>
                        </>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setIsEditMode(!isEditMode)}>
                        <Pencil className="h-5 w-5" />
                        <span className="sr-only">Toggle Edit Mode</span>
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Required Dates</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crewMembers.map((member, index) => (
                <TableRow key={`${member.name}-${index}`}>
                  <TableCell>
                    {isEditMode ? <Input value={member.name} onChange={e => handleInputChange(index, 'name', e.target.value)} /> : member.name}
                  </TableCell>
                  <TableCell>
                    {isEditMode ? <Input value={member.role} onChange={e => handleInputChange(index, 'role', e.target.value)} /> : member.role}
                  </TableCell>
                  <TableCell>
                     {isEditMode ? (
                        <Select value={member.status} onValueChange={value => handleInputChange(index, 'status', value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Suggested">Suggested</SelectItem>
                                <SelectItem value="Offer Sent">Offer Sent</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Declined">Declined</SelectItem>
                            </SelectContent>
                        </Select>
                     ) : (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            member.status === 'Confirmed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            member.status === 'Suggested' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                            member.status === 'Pending' || member.status === 'Offer Sent' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                            {member.status}
                        </span>
                     )}
                  </TableCell>
                  <TableCell>
                    {isEditMode ? <Input value={member.dates} onChange={e => handleInputChange(index, 'dates', e.target.value)} /> : member.dates}
                  </TableCell>
                  <TableCell>
                    {isEditMode ? <Input value={member.contact} onChange={e => handleInputChange(index, 'contact', e.target.value)} /> : member.contact}
                  </TableCell>
                  <TableCell className="text-right">
                     {isEditMode ? (
                        <Button variant="ghost" size="icon" onClick={() => removeCrewMember(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Remove {member.name}</span>
                        </Button>
                     ) : (
                        <Button variant="ghost" size="icon" onClick={() => handleSendSchedule(member.name)}>
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Send schedule to {member.name}</span>
                        </Button>
                     )}
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
