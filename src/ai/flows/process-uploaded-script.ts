'use server';

/**
 * @fileOverview Processes an uploaded script to generate a summary.
 *
 * - processUploadedScript - A function that handles the script analysis.
 * - ProcessUploadedScriptInput - The input type for the processUploadedScript function.
 * - ProcessUploadedScriptOutput - The return type for the processUploadedScript function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProcessUploadedScriptInputSchema = z.object({
  scriptContent: z.string().describe('The full text content of the uploaded film script.'),
});
export type ProcessUploadedScriptInput = z.infer<typeof ProcessUploadedScriptInputSchema>;

const ProcessUploadedScriptOutputSchema = z.object({
  status: z.string().describe("The status of the script processing ('success' or 'failed')."),
  summary: z.string().describe('A brief summary of the analyzed script.'),
});
// We only need the summary from the LLM, the status will be handled by the action.
const AISummarySchema = z.object({
    summary: z.string().describe('A brief, one-paragraph summary of the analyzed script.'),
})
export type ProcessUploadedScriptOutput = z.infer<typeof ProcessUploadedScriptOutputSchema>;

export async function processUploadedScript(input: ProcessUploadedScriptInput): Promise<{summary: string}> {
  return processUploadedScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processUploadedScriptPrompt',
  input: { schema: ProcessUploadedScriptInputSchema },
  output: { schema: AISummarySchema },
  prompt: `You are an AI assistant for film production. A script has been uploaded. Analyze the following script content and provide a short, one-paragraph summary.

Script Content:
{{{scriptContent}}}

Respond with the generated summary.`,
});

const processUploadedScriptFlow = ai.defineFlow(
  {
    name: 'processUploadedScriptFlow',
    inputSchema: ProcessUploadedScriptInputSchema,
    outputSchema: AISummarySchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
