'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateContractAction, checkComplianceAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const generateContractSchema = z.object({
  locationName: z.string().min(1, 'Location name is required.'),
  locationAddress: z.string().min(1, 'Location address is required.'),
  ownerName: z.string().min(1, 'Owner name is required.'),
  ownerContact: z.string().min(1, 'Owner contact is required.'),
  filmCompanyName: z.string().min(1, 'Film company name is required.'),
  productionDates: z.string().min(1, 'Production dates are required.'),
  specificTerms: z.string().optional(),
});

export function GenerateContractForm({ prefilledLocation }: { prefilledLocation?: string }) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState('');

  const form = useForm<z.infer<typeof generateContractSchema>>({
    resolver: zodResolver(generateContractSchema),
    defaultValues: {
      locationName: prefilledLocation || '',
      locationAddress: '',
      ownerName: '',
      ownerContact: '',
      filmCompanyName: 'CineNest Productions',
      productionDates: '',
      specificTerms: '',
    },
  });

  async function onSubmit(values: z.infer<typeof generateContractSchema>) {
    setIsGenerating(true);
    setGeneratedContract('');
    const result = await generateContractAction(values);
    setIsGenerating(false);

    if (result.success && result.data) {
      setGeneratedContract(result.data.contractText);
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
            <FormField control={form.control} name="productionDates" render={({ field }) => (
              <FormItem><FormLabel>Production Dates</FormLabel><FormControl><Input placeholder="Start Date - End Date" {...field} /></FormControl><FormMessage /></FormItem>
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
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Generated Contract:</h3>
          <Textarea readOnly value={generatedContract} className="min-h-[300px] bg-muted font-mono text-sm" />
        </div>
      )}
    </>
  );
}


const legalComplianceSchema = z.object({
  contractText: z.string().min(50, 'Contract text is too short.'),
  docusignTemplateId: z.string().min(1, 'DocuSign Template ID is required.'),
  signerName: z.string().min(1, 'Signer name is required.'),
  signerEmail: z.string().email('Please enter a valid email.'),
});

function LegalComplianceForm() {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [complianceResult, setComplianceResult] = useState<{ summary: string; envelopeId: string } | null>(null);

  const form = useForm<z.infer<typeof legalComplianceSchema>>({
    resolver: zodResolver(legalComplianceSchema),
    defaultValues: { contractText: '', docusignTemplateId: '', signerName: '', signerEmail: '' },
  });

  async function onSubmit(values: z.infer<typeof legalComplianceSchema>) {
    setIsChecking(true);
    setComplianceResult(null);
    const result = await checkComplianceAction(values);
    setIsChecking(false);

    if (result.success && result.data) {
      setComplianceResult({
        summary: result.data.legalComplianceCheck,
        envelopeId: result.data.docusignEnvelopeId,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Checking Compliance',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="contractText" render={({ field }) => (
            <FormItem><FormLabel>Contract Text</FormLabel><FormControl><Textarea placeholder="Paste the full contract text here for analysis..." className="min-h-[200px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="signerName" render={({ field }) => (
              <FormItem><FormLabel>Signer Name</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="signerEmail" render={({ field }) => (
              <FormItem><FormLabel>Signer Email</FormLabel><FormControl><Input placeholder="jane.smith@email.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="docusignTemplateId" render={({ field }) => (
              <FormItem><FormLabel>DocuSign Template ID</FormLabel><FormControl><Input placeholder="e.g., a1b2c3d4-..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <Button type="submit" disabled={isChecking}>
            {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Check Compliance & Send
          </Button>
        </form>
      </Form>
      {complianceResult && (
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Compliance Summary:</h3>
            <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">{complianceResult.summary}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">DocuSign Status:</h3>
            <p className="text-sm text-muted-foreground">Envelope created with ID: <code className="font-mono bg-muted p-1 rounded">{complianceResult.envelopeId}</code></p>
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
          <TabsTrigger value="legal-compliance">Legal Compliance & E-Sign</TabsTrigger>
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
        <TabsContent value="legal-compliance">
          <Card>
            <CardHeader>
              <CardTitle>Legal Compliance Module</CardTitle>
              <CardDescription>
                Analyze contracts for legal compliance and manage digital signatures with DocuSign.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LegalComplianceForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
