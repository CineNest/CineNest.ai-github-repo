'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating location contracts and paperwork using AI.
 *
 * It includes:
 * - generateLocationContract: An async function that takes location details and generates a contract.
 * - GenerateLocationContractInput: The input type for the generateLocationContract function.
 * - GenerateLocationContractOutput: The output type for the generateLocationContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocationContractInputSchema = z.object({
  locationName: z.string().describe('The name of the location.'),
  locationAddress: z.string().describe('The full address of the location.'),
  ownerName: z.string().describe('The name of the location owner.'),
  ownerContact: z.string().describe('The contact information of the location owner (phone/email).'),
  filmCompanyName: z.string().describe('The name of the film production company.'),
  productionDates: z.string().describe('The start and end dates of the filming production.'),
  specificTerms: z.string().optional().describe('Any specific terms or conditions for the location usage.'),
});

export type GenerateLocationContractInput = z.infer<typeof GenerateLocationContractInputSchema>;

const GenerateLocationContractOutputSchema = z.object({
  contractText: z.string().describe('The generated location contract text.'),
});

export type GenerateLocationContractOutput = z.infer<typeof GenerateLocationContractOutputSchema>;

export async function generateLocationContract(input: GenerateLocationContractInput): Promise<GenerateLocationContractOutput> {
  return generateLocationContractFlow(input);
}

const generateLocationContractPrompt = ai.definePrompt({
  name: 'generateLocationContractPrompt',
  input: {schema: GenerateLocationContractInputSchema},
  output: {schema: GenerateLocationContractOutputSchema},
  prompt: `You are an AI assistant specialized in generating legal contracts for film productions.
  Based on the provided location details, owner information, and production terms, create a comprehensive location contract.
  Include standard legal clauses and ensure the contract is tailored to the specific details provided.
  Make sure that both parties, the location owner, and the film company are protected.

  Location Name: {{{locationName}}}
  Location Address: {{{locationAddress}}}
  Owner Name: {{{ownerName}}}
  Owner Contact: {{{ownerContact}}}
  Film Company Name: {{{filmCompanyName}}}
  Production Dates: {{{productionDates}}}
  Specific Terms: {{{specificTerms}}}

  Contract:
`,
});

const generateLocationContractFlow = ai.defineFlow(
  {
    name: 'generateLocationContractFlow',
    inputSchema: GenerateLocationContractInputSchema,
    outputSchema: GenerateLocationContractOutputSchema,
  },
  async input => {
    const {output} = await generateLocationContractPrompt(input);
    return output!;
  }
);
