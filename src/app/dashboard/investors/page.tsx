'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Film, Milestone, CheckCircle, Clock, Mail, PlusCircle, Trash2 } from 'lucide-react';
import { useScript } from '@/context/script-context';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const projectDetails = {
  title: 'CineNest Project',
  logline: 'An epic journey of discovery and adventure powered by AI.',
  genre: 'Sci-Fi / Adventure',
  status: 'In Production',
};

const keyMilestones = [
    { name: 'Script Locked', status: 'Completed' },
    { name: 'Pre-Production', status: 'Completed' },
    { name: 'Principal Photography', status: 'In Progress' },
    { name: 'Post-Production', status: 'Pending' },
    { name: 'Final Cut Delivered', status: 'Pending' },
];

export default function InvestorsPage() {
  const { transactions } = useScript();
  const { toast } = useToast();
  const [goalBudget, setGoalBudget] = useState(2000000);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState('');
  const [subscribers, setSubscribers] = useState(['investor1@example.com', 'investor2@example.com']);

  useEffect(() => {
    const savedBudget = localStorage.getItem('goalBudget');
    if (savedBudget) {
      setGoalBudget(Number(savedBudget));
    }
  }, []);
  
  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubscriberEmail && !subscribers.includes(newSubscriberEmail)) {
        if (/^\S+@\S+\.\S+$/.test(newSubscriberEmail)) {
            setSubscribers([...subscribers, newSubscriberEmail]);
            setNewSubscriberEmail('');
            toast({
                title: 'Subscriber Added',
                description: `${newSubscriberEmail} will now receive weekly reports.`,
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid Email',
                description: 'Please enter a valid email address.',
            });
        }
    }
  };

  const handleRemoveSubscriber = (emailToRemove: string) => {
    setSubscribers(subscribers.filter(email => email !== emailToRemove));
  };


  const totalSpent = transactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const projectedROI = (goalBudget * 1.5 - totalSpent) / totalSpent * 100;

  const productionPhase = 'Production'; // This could be dynamic later
  const progressPercentage = {
    'Pre-production': 25,
    'Production': 50,
    'Post-production': 75,
    'Distribution': 100,
  }[productionPhase] || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investor Dashboard</h1>
        <p className="text-muted-foreground">
          A high-level overview of the project's progress and financial health.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Project Title</CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{projectDetails.title}</div>
                <p className="text-xs text-muted-foreground">{projectDetails.logline}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {goalBudget.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-muted-foreground">vs. {totalSpent.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} spent</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projected ROI</CardTitle>
                 <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${projectedROI >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                    {isFinite(projectedROI) ? `${projectedROI.toFixed(1)}%` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">Based on current spend</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Production Progress</CardTitle>
          <CardDescription>Current phase: <span className="font-semibold">{productionPhase}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-3" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Pre-production</span>
            <span>Production</span>
            <span>Post-production</span>
            <span>Distribution</span>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Key Milestones</CardTitle>
          <CardDescription>Tracking major project deliverables.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {keyMilestones.map((milestone) => (
                    <div key={milestone.name} className="flex items-center">
                        {milestone.status === 'Completed' ? <CheckCircle className="h-5 w-5 mr-3 text-green-500" /> : <Clock className="h-5 w-5 mr-3 text-yellow-500" />}
                        <span className={`flex-1 ${milestone.status === 'Completed' ? 'text-muted-foreground line-through' : 'font-medium'}`}>
                            {milestone.name}
                        </span>
                        <span className={`text-sm font-semibold ${
                            milestone.status === 'Completed' ? 'text-green-500' : 
                            milestone.status === 'In Progress' ? 'text-blue-500' : 'text-muted-foreground'
                        }`}>
                            {milestone.status}
                        </span>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Investor Communication</CardTitle>
            <CardDescription>Manage automated weekly reports for investors.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2"><Mail className="h-4 w-4" /> Weekly Spending Reports</h3>
                    <p className="text-sm text-muted-foreground">Automatically send a summary of weekly expenses to subscribed investors for transparency. The backend for email sending is not yet implemented.</p>
                </div>
                <form onSubmit={handleAddSubscriber} className="flex items-end gap-2">
                    <div className="flex-1">
                        <Label htmlFor="subscriber-email">Investor Email</Label>
                        <Input 
                            id="subscriber-email"
                            type="email"
                            placeholder="investor@email.com"
                            value={newSubscriberEmail}
                            onChange={(e) => setNewSubscriberEmail(e.target.value)}
                        />
                    </div>
                    <Button type="submit">
                        <PlusCircle className="mr-2 h-4 w-4" /> Subscribe
                    </Button>
                </form>

                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Current Subscribers</h4>
                    <div className="max-h-40 overflow-y-auto rounded-md border p-2 space-y-2">
                         {subscribers.map(email => (
                            <div key={email} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                                <span className="text-sm font-mono">{email}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveSubscriber(email)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {subscribers.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground py-4">No subscribers yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
