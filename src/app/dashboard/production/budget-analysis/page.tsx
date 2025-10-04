'use client';

import { useState, useEffect, useMemo } from 'react';
import { useScript, type Transaction } from '@/context/script-context';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function BudgetAnalysisPage() {
  const { transactions } = useScript();
  const [goalBudget, setGoalBudget] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('goalBudget') || '2000000');
    }
    return 2000000;
  });
  const [tempGoal, setTempGoal] = useState(goalBudget.toString());

  useEffect(() => {
    localStorage.setItem('goalBudget', goalBudget.toString());
  }, [goalBudget]);

  const handleGoalChange = () => {
    const newGoal = Number(tempGoal);
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoalBudget(newGoal);
    }
  };

  const totalSpent = transactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const remainingBudget = goalBudget - totalSpent;
  const budgetProgress = (totalSpent / goalBudget) * 100;

  const dailySpending = useMemo(() => {
    const spendingByDay: { [date: string]: number } = {};
    transactions.forEach(t => {
      const date = new Date(t.date).toISOString().split('T')[0];
      spendingByDay[date] = (spendingByDay[date] || 0) + Math.abs(t.amount);
    });
    return Object.entries(spendingByDay)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions]);
  
  const spendingByCategory = useMemo(() => {
    const spending: { [category: string]: number } = {};
    transactions.forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(spending).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Analysis</h1>
        <p className="text-muted-foreground">Analyze your spending against your goals.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Set Your Goal Budget</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="goal-budget">Goal Budget (INR)</Label>
            <Input
              id="goal-budget"
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              placeholder="e.g. 2000000"
              className="mt-1"
            />
          </div>
          <Button onClick={handleGoalChange} className="mt-5">Set Goal</Button>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Goal Budget</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">
            {goalBudget.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Spent</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">
             {totalSpent.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </CardContent>
        </Card>
         <Card>
          <CardHeader><CardTitle>Remaining</CardTitle></CardHeader>
          <CardContent className={`text-3xl font-bold ${remainingBudget < 0 ? 'text-destructive' : 'text-green-500'}`}>
            {remainingBudget.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Budget Progress</CardTitle></CardHeader>
        <CardContent>
            <Progress value={budgetProgress} className="h-4" />
            <p className="text-right text-sm mt-2 text-muted-foreground">{budgetProgress.toFixed(2)}% of budget spent.</p>
             {budgetProgress > 100 && <p className="text-center text-destructive font-medium mt-4">Warning: You are over budget!</p>}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Spending</CardTitle>
            <CardDescription>How much you're spending each day.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis tickFormatter={(val) => `₹${(val as number) / 1000}k`} />
                <Tooltip 
                    formatter={(value) => [`₹${(value as number).toLocaleString('en-IN')}`, 'Spent']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                />
                <Legend />
                <Bar dataKey="amount" fill="hsl(var(--primary))" name="Daily Spend" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Where your money is going.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={spendingByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                         {spendingByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${(value as number).toLocaleString('en-IN')}`}/>
                    <Legend />
                </PieChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
