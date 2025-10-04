'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Film, Milestone, CheckCircle, Clock } from 'lucide-react';
import { useScript } from '@/context/script-context';
import { useState, useEffect } from 'react';

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
  const [goalBudget, setGoalBudget] = useState(2000000);

  useEffect(() => {
    const savedBudget = localStorage.getItem('goalBudget');
    if (savedBudget) {
      setGoalBudget(Number(savedBudget));
    }
  }, []);

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
    </div>
  );
}
