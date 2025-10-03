'use server';

/**
 * @fileOverview An AI agent for ensuring legal compliance and managing digital signatures using DocuSign.
 *
 * - ensureLegalCompliance - A function that handles the legal compliance process.
 * - EnsureLegalComplianceInput - The input type for the ensureLegalCompliance function.
 * - EnsureLegalComplianceOutput - The return type for the ensureLegalCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnsureLegalComplianceInputSchema = z.object({
  contractText: z.string().describe('The text content of the contract.'),
  docusignTemplateId: z.string().describe('The ID of the DocuSign template to use.'),
  signerName: z.string().describe('The name of the contract signer.'),
  signerEmail: z.string().describe('The email of the contract signer.'),
});
export type EnsureLegalComplianceInput = z.infer<typeof EnsureLegalComplianceInputSchema>;

const EnsureLegalComplianceOutputSchema = z.object({
  legalComplianceCheck: z.string().describe('Summary of legal compliance check.'),
  docusignEnvelopeId: z.string().describe('The ID of the DocuSign envelope created.'),
});
export type EnsureLegalComplianceOutput = z.infer<typeof EnsureLegalComplianceOutputSchema>;

export async function ensureLegalCompliance(input: EnsureLegalComplianceInput): Promise<EnsureLegalComplianceOutput> {
  return ensureLegalComplianceFlow(input);
}

const legalCompliancePrompt = ai.definePrompt({
  name: 'legalCompliancePrompt',
  input: {schema: EnsureLegalComplianceInputSchema},
  output: {schema: EnsureLegalComplianceOutputSchema},
  prompt: `You are a legal expert specializing in contract law.

You will review the contract text and provide a summary of any potential legal issues, risks, or areas of concern.

Contract Text: {{{contractText}}}

You will then use DocuSign to send the contract for digital signature.

DocuSign Template ID: {{{docusignTemplateId}}}
Signer Name: {{{signerName}}}
Signer Email: {{{signerEmail}}}`,
});

const ensureLegalComplianceFlow = ai.defineFlow(
  {
    name: 'ensureLegalComplianceFlow',
    inputSchema: EnsureLegalComplianceInputSchema,
    outputSchema: EnsureLegalComplianceOutputSchema,
  },
  async input => {
    // TODO: Integrate with DocuSign API to create an envelope from the template and send for signature.
    // This is a placeholder for the DocuSign integration.
    const docusignEnvelopeId = 'PLACEHOLDER_ENVELOPE_ID';

    const {output} = await legalCompliancePrompt(input);
    return {
      legalComplianceCheck: output!.legalComplianceCheck,
      docusignEnvelopeId: docusignEnvelopeId,
    };
  }
);
