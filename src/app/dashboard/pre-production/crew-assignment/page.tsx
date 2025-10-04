'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const crewMembers = [
  { name: 'Alex Ray', role: 'Director', status: 'Confirmed', contact: 'alex.ray@cinenest.ai' },
  { name: 'Sam Jones', role: 'Director of Photography', status: 'Confirmed', contact: 'sam.jones@cinenest.ai' },
  { name: 'Casey Smith', role: 'Production Designer', status: 'Pending', contact: 'casey.smith@cinenest.ai' },
  { name: 'Jordan Lee', role: 'Sound Mixer', status: 'Confirmed', contact: 'jordan.lee@cinenest.ai' },
  { name: 'Taylor Kim', role: 'Editor', status: 'Declined', contact: 'taylor.kim@cinenest.ai' },
  { name: 'Morgan Davis', role: 'Gaffer', status: 'Offer Sent', contact: 'morgan.davis@cinenest.ai' },
];

export default function CrewAssignmentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crew Assignment</h1>
        <p className="text-muted-foreground">
          Build and manage your production crew.
        </p>
      </div>

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
              {crewMembers.map((member) => (
                <TableRow key={member.name}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                     <span className={`px-2 py-1 text-xs rounded-full ${
                        member.status === 'Confirmed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
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
