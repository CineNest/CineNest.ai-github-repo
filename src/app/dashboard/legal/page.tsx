'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateContractAction, legalAdvisorAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScript } from '@/context/script-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';


const generateContractSchema = z.object({
  locationName: z.string().min(1, 'Location name is required.'),
  locationAddress: z.string().min(1, 'Location address is required.'),
  ownerName: z.string().min(1, 'Owner name is required.'),
  ownerContact: z.string().min(1, 'Owner contact is required.'),
  filmCompanyName: z.string().min(1, 'Film company name is required.'),
  productionDates: z.string().min(1, 'Production dates are required.'),
  bookingFee: z.coerce.number().min(1, 'A booking fee is required.'),
  specificTerms: z.string().optional(),
});

export function GenerateContractForm({ prefilledLocation }: { prefilledLocation?: string }) {
  const { toast } = useToast();
  const { addTransaction } = useScript();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState('');
  const [bookingDetails, setBookingDetails] = useState<{ fee: number; location: string } | null>(null);
  const [password, setPassword] = useState('');
  const [date, setDate] = useState<DateRange | undefined>();


  const form = useForm<z.infer<typeof generateContractSchema>>({
    resolver: zodResolver(generateContractSchema),
    defaultValues: {
      locationName: prefilledLocation || '',
      locationAddress: '',
      ownerName: '',
      ownerContact: '',
      filmCompanyName: 'CineNest Productions',
      productionDates: '',
      bookingFee: 0,
      specificTerms: '',
    },
  });
  
    const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      const dateString = `${format(newDate.from, 'PPP')} - ${format(newDate.to, 'PPP')}`;
      form.setValue('productionDates', dateString);
      form.clearErrors('productionDates');
    } else {
      form.setValue('productionDates', '');
    }
  };

  async function onSubmit(values: z.infer<typeof generateContractSchema>) {
    setIsGenerating(true);
    setGeneratedContract('');
    setBookingDetails(null);
    const result = await generateContractAction(values);
    setIsGenerating(false);

    if (result.success && result.data) {
      setGeneratedContract(result.data.contractText);
      setBookingDetails({ fee: values.bookingFee, location: values.locationName });
      toast({
        title: 'Contract Generated',
        description: 'The location contract has been successfully generated.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Contract',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  }

  const handlePayment = () => {
    if (password === 'password') { // Simple password check
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        description: `Booking fee for ${bookingDetails?.location}`,
        category: 'Locations',
        amount: -(bookingDetails?.fee || 0),
      });
      toast({
        title: 'Payment Successful',
        description: `Location ${bookingDetails?.location} booked for ₹${bookingDetails?.fee}.`,
      });
      setPassword('');
      setBookingDetails(null); // Hide button after booking
    } else {
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: 'Incorrect password. Please try again.',
      });
    }
  };


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="locationName" render={({ field }) => (
              <FormItem><FormLabel>Location Name</FormLabel><FormControl><Input placeholder="e.g., Urban Loft on Main" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="locationAddress" render={({ field }) => (
              <FormItem><FormLabel>Location Address</FormLabel><FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="ownerName" render={({ field }) => (
              <FormItem><FormLabel>Owner Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="ownerContact" render={({ field }) => (
              <FormItem><FormLabel>Owner Contact</FormLabel><FormControl><Input placeholder="john.doe@email.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="filmCompanyName" render={({ field }) => (
              <FormItem><FormLabel>Film Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField
              control={form.control}
              name="productionDates"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Production Dates</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          id="date"
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, 'LLL dd, y')} -{' '}
                                {format(date.to, 'LLL dd, y')}
                              </>
                            ) : (
                              format(date.from, 'LLL dd, y')
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="bookingFee" render={({ field }) => (
                <FormItem><FormLabel>Booking Fee (INR)</FormLabel><FormControl><Input type="number" placeholder="e.g., 50000" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="specificTerms" render={({ field }) => (
            <FormItem><FormLabel>Specific Terms (Optional)</FormLabel><FormControl><Textarea placeholder="Any additional terms..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" disabled={isGenerating}>
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Contract
          </Button>
        </form>
      </Form>
      {generatedContract && (
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Generated Contract:</h3>
            <Textarea readOnly value={generatedContract} className="min-h-[300px] bg-muted font-mono text-sm" />
          </div>

          {bookingDetails && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Book & Pay ₹{bookingDetails.fee.toLocaleString('en-IN')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Booking Payment</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to pay a non-refundable booking fee of ₹{bookingDetails.fee.toLocaleString('en-IN')} for {bookingDetails.location}. Please enter your password to authorize this transaction. (Hint: use 'password')
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-2">
                <Input 
                    type="password" 
                    placeholder="Enter password to confirm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setPassword('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handlePayment}>Confirm Payment</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          )}
        </div>
      )}
    </>
  );
}

const legalAdviceSchema = z.object({
  query: z.string().min(10, 'Please enter a more detailed query.'),
});

function LegalAdvisorForm() {
  const { toast } = useToast();
  const [isAdvising, setIsAdvising] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const form = useForm<z.infer<typeof legalAdviceSchema>>({
    resolver: zodResolver(legalAdviceSchema),
    defaultValues: { query: '' },
  });

  async function onSubmit(values: z.infer<typeof legalAdviceSchema>) {
    setIsAdvising(true);
    setAdvice(null);
    const result = await legalAdvisorAction(values);
    setIsAdvising(false);

    if (result.success && result.data) {
      setAdvice(result.data.advice);
      toast({
        title: "Legal Advice Received",
        description: "The AI has provided its legal analysis.",
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Getting Advice',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="query" render={({ field }) => (
            <FormItem>
              <FormLabel>Your Legal Question</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ask a question about Indian film law, e.g., 'What are the key clauses for a co-production agreement?' or 'Outline the process for obtaining a filming permit in Mumbai.'" 
                  className="min-h-[150px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isAdvising}>
            {isAdvising ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Get Legal Advice
          </Button>
        </form>
      </Form>
      {advice && (
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">AI Legal Advisor's Response:</h3>
            <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">{advice}</div>
          </div>
        </div>
      )}
    </>
  );
}


export default function LegalPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Legal & Contracts</h1>
        <p className="text-muted-foreground">
          Automate legal paperwork and ensure compliance with AI-powered tools.
        </p>
      </div>
      <Tabs defaultValue="contract-generation">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contract-generation">AI Contract Generation</TabsTrigger>
          <TabsTrigger value="legal-advisor">AI Legal Advisor</TabsTrigger>
        </TabsList>
        <TabsContent value="contract-generation">
          <Card>
            <CardHeader>
              <CardTitle>AI Location Contract Generator</CardTitle>
              <CardDescription>
                Automatically generate location contracts based on your requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenerateContractForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="legal-advisor">
          <Card>
            <CardHeader>
              <CardTitle>AI Legal Advisor</CardTitle>
              <CardDescription>
                Get expert advice on Indian film industry law based on your questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LegalAdvisorForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
