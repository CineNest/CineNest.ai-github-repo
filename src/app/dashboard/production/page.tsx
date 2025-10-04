'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { estimateEquipmentCostAction } from '@/app/actions';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, ToyBrick, Users, Wrench, Loader2 } from 'lucide-react';

const budgetData = [
  { name: 'Equipment', value: 25000, fill: 'var(--color-equipment)' },
  { name: 'Crew', value: 45000, fill: 'var(--color-crew)' },
  { name: 'Props', value: 8000, fill: 'var(--color-props)' },
  { name: 'Locations', value: 12000, fill: 'var(--color-locations)' },
  { name: 'VFX', value: 30000, fill: 'var(--color-vfx)' },
  { name: 'Contingency', value: 15000, fill: 'var(--color-contingency)' },
];

const transactions = [
    {id: 'TXN001', date: '2024-07-28', description: 'Camera Package Rental', amount: -2500, category: 'Equipment'},
    {id: 'TXN002', date: '2024-07-28', description: 'Art Department Supplies', amount: -450, category: 'Props'},
    {id: 'TXN003', date: '2024-07-27', description: 'Location Fee: Downtown Loft', amount: -1200, category: 'Locations'},
    {id: 'TXN004', date: '2024-07-26', description: 'Catering: Day 1', amount: -800, category: 'Misc'},
];

const estimateEquipmentCostSchema = z.object({
  equipmentList: z
    .string()
    .min(10, 'Please enter a list of equipment.'),
});

function EstimateEquipmentCostForm() {
    const { toast } = useToast();
    const [isEstimating, setIsEstimating] = useState(false);
    const [estimationResult, setEstimationResult] = useState<{item: string, estimatedCost: string}[] | null>(null);
    const [totalCost, setTotalCost] = useState<string | null>(null);

    const form = useForm<z.infer<typeof estimateEquipmentCostSchema>>({
        resolver: zodResolver(estimateEquipmentCostSchema),
        defaultValues: { equipmentList: '' },
    });

    async function onSubmit(values: z.infer<typeof estimateEquipmentCostSchema>) {
        setIsEstimating(true);
        setEstimationResult(null);
        setTotalCost(null);

        const result = await estimateEquipmentCostAction(values);
        setIsEstimating(false);

        if (result.success && result.data) {
            setEstimationResult(result.data.costs);
            setTotalCost(result.data.totalEstimatedCost);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error Estimating Cost',
                description: result.error || 'An unexpected error occurred.',
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Equipment Cost Estimator</CardTitle>
                <CardDescription>Get AI-powered rental cost estimates for your equipment list.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="equipmentList"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Equipment List (comma-separated)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g., Arri Alexa Mini, set of Zeiss Supreme Primes..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isEstimating}>
                            {isEstimating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Estimate Costs
                        </Button>
                    </form>
                </Form>
                {estimationResult && (
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Estimated Rental Costs:</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Estimated Cost</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {estimationResult.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.item}</TableCell>
                                        <TableCell className="text-right">{item.estimatedCost}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {totalCost && <p className="text-right font-bold mt-4">{totalCost}</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function BudgetTrackingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Tracking</h1>
        <p className="text-muted-foreground">
          Monitor your production's financial health in real-time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Budget</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25,000</div>
            <p className="text-xs text-muted-foreground">Allocated for gear</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crew Salary</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,000</div>
            <p className="text-xs text-muted-foreground">Total for all personnel</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,750</div>
            <p className="text-xs text-muted-foreground">Average per shooting day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Props Budget</CardTitle>
            <ToyBrick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,000</div>
            <p className="text-xs text-muted-foreground">For art department & set dressing</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <EstimateEquipmentCostForm />
          </div>

          <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Budget Breakdown</CardTitle>
                    <CardDescription>Visual overview of your budget allocation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={budgetData} layout="vertical" margin={{ left: 10, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={80} />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                contentStyle={{
                                background: 'hsl(var(--background))',
                                borderColor: 'hsl(var(--border))',
                                }}
                            />
                            <Bar dataKey="value" background={{ fill: 'hsl(var(--muted))' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
          </div>
      </div>
      
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
                                <TableCell className="text-right font-mono">{t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    </div>
  );
}
