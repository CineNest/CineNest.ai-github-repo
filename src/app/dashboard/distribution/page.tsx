'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { analyzeSalesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const salesAnalysisSchema = z.object({
  ticketSalesData: z.string().min(10, 'Please enter valid CSV data.'),
});

const sampleSalesData = [
  { region: 'North', sales: 4000 },
  { region: 'South', sales: 3000 },
  { region: 'East', sales: 2000 },
  { region: 'West', sales: 2780 },
  { region: 'Central', sales: 1890 },
];

const distributionTransactions = [
  { id: 'TRN001', distributor: 'Global Films', amount: '₹40,00,000', status: 'Paid', date: '2024-07-15' },
  { id: 'TRN002', distributor: 'Indie Streamers', amount: '₹12,00,000', status: 'Pending', date: '2024-07-20' },
  { id: 'TRN003', distributor: 'EU Cinema Group', amount: '₹1,00,00,000', status: 'Paid', date: '2024-07-10' },
  { id: 'TRN004', distributor: 'Asia Pacific VOD', amount: '₹25,00,000', status: 'Paid', date: '2024-06-28' },
];

const distributionStages = [
  { name: 'Theatrical Release', status: 'Completed', details: 'Domestic circuits' },
  { name: 'Streaming (PVOD)', status: 'Active', details: 'Major platforms' },
  { name: 'International Distribution', status: 'Negotiating', details: 'Europe & Asia' },
  { name: 'Broadcast & TV', status: 'Planned', details: 'Q4 2024' },
];

export default function DistributionPage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const form = useForm<z.infer<typeof salesAnalysisSchema>>({
    resolver: zodResolver(salesAnalysisSchema),
    defaultValues: {
      ticketSalesData: `Date,Region,ScreenCount,Sales\n2024-07-01,North,500,120000\n2024-07-01,South,450,95000\n2024-07-02,North,500,150000\n2024-07-02,South,450,110000`,
    },
  });

  async function onSubmit(values: z.infer<typeof salesAnalysisSchema>) {
    setIsAnalyzing(true);
    setAnalysisResult('');
    const result = await analyzeSalesAction(values);
    setIsAnalyzing(false);

    if (result.success && result.data) {
      setAnalysisResult(result.data.predictedTrends);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Analyzing Sales',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Distribution & Sales</h1>
        <p className="text-muted-foreground">Analyze sales, collections, and distribution.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>AI Ticket Sales Analysis</CardTitle>
                    <CardDescription>
                    Input BookMyShow CSV data to predict movie collection trends.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="ticketSalesData"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Ticket Sales Data (CSV format)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Paste your CSV data here" className="min-h-[150px] font-mono text-xs" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isAnalyzing}>
                        {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Analyze Trends
                        </Button>
                    </form>
                    </Form>
                    {analysisResult && (
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Analysis & Predicted Trends:</h3>
                        <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">{analysisResult}</div>
                    </div>
                    )}
                </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Distribution Transactions</CardTitle>
                <CardDescription>Real-time transactions from your distributors.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Distributor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {distributionTransactions.map((t) => (
                    <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs">{t.id}</TableCell>
                        <TableCell>{t.distributor}</TableCell>
                        <TableCell>{t.amount}</TableCell>
                        <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${t.status === 'Paid' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}>
                            {t.status}
                        </span>
                        </TableCell>
                        <TableCell>{t.date}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Sales Snapshot</CardTitle>
              <CardDescription>Regional performance summary.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sampleSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribution Pipeline</CardTitle>
              <CardDescription>Current state of your distribution.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributionStages.map((stage, index) => (
                  <div key={stage.name} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${stage.status === 'Completed' || stage.status === 'Active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {index + 1}
                      </div>
                      {index < distributionStages.length - 1 && <div className="h-12 w-px bg-border" />}
                    </div>
                    <div>
                      <h4 className="font-semibold">{stage.name}</h4>
                      <p className="text-sm text-muted-foreground">{stage.details}</p>
                      <p className="text-xs font-medium">{stage.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
