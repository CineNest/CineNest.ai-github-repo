'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { analyzeBudgetFromScriptAction } from '@/app/actions';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useScript } from '@/context/script-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, ToyBrick, Users, Wrench, Loader2, Sparkles, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const budgetData = [
  { name: 'Equipment', value: 250000, fill: 'var(--color-equipment)' },
  { name: 'Crew', value: 450000, fill: 'var(--color-crew)' },
  { name: 'Props', value: 80000, fill: 'var(--color-props)' },
  { name: 'Locations', value: 120000, fill: 'var(--color-locations)' },
  { name: 'VFX', value: 300000, fill: 'var(--color-vfx)' },
  { name: 'Contingency', value: 150000, fill: 'var(--color-contingency)' },
];

const initialTransactions = [
    {id: 'TXN001', date: '2024-07-28', description: 'Camera Package Rental', amount: -25000, category: 'Equipment'},
    {id: 'TXN002', date: '2024-07-28', description: 'Art Department Supplies', amount: -4500, category: 'Props'},
    {id: 'TXN003', date: '2024-07-27', description: 'Location Fee: Downtown Loft', amount: -12000, category: 'Locations'},
    {id: 'TXN004', date: '2024-07-26', description: 'Catering: Day 1', amount: -8000, category: 'Misc'},
];

interface BudgetItem {
    item: string;
    estimatedCost: string;
}

const transactionSchema = z.object({
  date: z.string().min(1, { message: 'Date is required' }),
  description: z.string().min(3, { message: 'Description is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  amount: z.coerce.number().refine(val => val !== 0, { message: 'Amount cannot be zero' }),
});

type Transaction = z.infer<typeof transactionSchema> & { id: string };

function AIBudgetAnalyzer() {
    const { toast } = useToast();
    const { script } = useScript();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{items: BudgetItem[], summary: string} | null>(null);

    const handleAnalysis = async () => {
        if (!script || script.trim().length === 0) {
            toast({
                variant: "destructive",
                title: "Script not found",
                description: "Please add a script on the main dashboard page before analyzing.",
            });
            return;
        }

        setIsAnalyzing(true);
        setAnalysisResult(null);

        const result = await analyzeBudgetFromScriptAction({ script });
        setIsAnalyzing(false);

        if (result.success && result.data) {
            setAnalysisResult({ items: result.data.budgetItems, summary: result.data.summary });
             toast({
                title: "Analysis Complete",
                description: "AI has identified and estimated key budget items from your script.",
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Error Analyzing Budget',
                description: result.error || 'An unexpected error occurred.',
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Prop Budget Analyzer</CardTitle>
                <CardDescription>Automatically analyze your script to estimate costs for props and equipment in INR.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleAnalysis} disabled={isAnalyzing || !script}>
                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Analyze Script for Costs
                </Button>

                {analysisResult && (
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Analysis Results:</h3>
                         <p className="text-sm text-muted-foreground mb-4 italic">{analysisResult.summary}</p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Estimated Cost (INR)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analysisResult.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.item}</TableCell>
                                        <TableCell className="text-right font-mono">{item.estimatedCost}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                 {!script && (
                    <div className="text-center text-muted-foreground py-4 mt-4">
                        <p>No script loaded. Go to the dashboard to add one.</p>
                        <Link href="/dashboard">
                           <Button variant="link">Go to Dashboard</Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function AddTransactionForm({ onAddTransaction }: { onAddTransaction: (data: Omit<Transaction, 'id'>) => void }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      amount: 0,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof transactionSchema>> = (data) => {
    onAddTransaction(data);
    toast({
        title: "Transaction Added",
        description: `Logged ${data.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} for ${data.description}.`
    });
    form.reset({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        amount: 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Transaction</CardTitle>
        <CardDescription>Log a new expense to keep your budget updated.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem><FormLabel>Amount (INR)</FormLabel><FormControl><Input type="number" placeholder="e.g., -5000" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="e.g., Prop rental" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem><FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Crew">Crew</SelectItem>
                    <SelectItem value="Props">Props</SelectItem>
                    <SelectItem value="Locations">Locations</SelectItem>
                    <SelectItem value="VFX">VFX</SelectItem>
                    <SelectItem value="Catering">Catering</SelectItem>
                    <SelectItem value="Misc">Misc</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default function BudgetTrackingPage() {
  const { crewSalaries } = useScript();
  const [totalCrewCost, setTotalCrewCost] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  useEffect(() => {
    const total = crewSalaries.reduce((acc, member) => acc + (member.dailyRate * member.days), 0);
    setTotalCrewCost(total);
  }, [crewSalaries]);
  
  const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
        ...data,
        id: `TXN${(Date.now() + Math.random()).toString(36)}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Tracking</h1>
        <p className="text-muted-foreground">
          Monitor your production's financial health in real-time. All figures in INR.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Budget</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,50,000</div>
            <p className="text-xs text-muted-foreground">Allocated for gear</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crew Salary</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {totalCrewCost.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                })}
            </div>
            <p className="text-xs text-muted-foreground mb-2">Total for all personnel</p>
            <Link href="/dashboard/production/crew-salary">
                <Button size="sm" variant="outline">Manage Salaries</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,000</div>
            <p className="text-xs text-muted-foreground">Average per shooting day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Props Budget</CardTitle>
            <ToyBrick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹80,000</div>
            <p className="text-xs text-muted-foreground">For art department & set dressing</p>
          </CardContent>
        </Card>
      </div>

        <AIBudgetAnalyzer />

        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>A log of the latest expenses.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map(t => (
                            <TableRow key={t.id}>
                                <TableCell>{t.date}</TableCell>
                                <TableCell className="font-medium">{t.description}</TableCell>
                                <TableCell>{t.category}</TableCell>
                                <TableCell className="text-right font-mono">{t.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        <AddTransactionForm onAddTransaction={handleAddTransaction} />

        <Card>
            <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
                <CardDescription>Visual overview of your budget allocation.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetData} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide tickFormatter={(value) => `₹${Number(value) / 100000}L`} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={80} />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            contentStyle={{
                            background: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            }}
                            formatter={(value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)}
                        />
                        <Bar dataKey="value" background={{ fill: 'hsl(var(--muted))' }} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

    </div>
  );
}
    
