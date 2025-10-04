'use server';

/**
 * @fileOverview An AI agent that analyzes a script and breaks it down into production elements.
 *
 * - scriptBreakdown - A function that handles the script breakdown process.
 * - ScriptBreakdownInput - The input type for the scriptBreakdown function.
 * - ScriptBreakdownOutput - The return type for the scriptBreakdown function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScriptBreakdownInputSchema = z.object({
  script: z.string().describe('The film script to be analyzed.'),
});
export type ScriptBreakdownInput = z.infer<typeof ScriptBreakdownInputSchema>;

const ScriptBreakdownOutputSchema = z.object({
  characters: z.array(z.string()).describe('A list of all characters identified in the script.'),
  locations: z.array(z.string()).describe('A list of all locations or settings identified in the script.'),
  props: z.array(z.string()).describe('A list of all props or key objects identified in the script.'),
});
export type ScriptBreakdownOutput = z.infer<typeof ScriptBreakdownOutputSchema>;

export async function scriptBreakdown(input: ScriptBreakdownInput): Promise<ScriptBreakdownOutput> {
  return scriptBreakdownFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scriptBreakdownPrompt',
  input: { schema: ScriptBreakdownInputSchema },
  output: { schema: ScriptBreakdownOutputSchema },
  prompt: `You are an expert script reader and production assistant. Analyze the following film script and extract the key production elements.

  Your task is to identify and list all the characters, all the distinct locations or settings, and all the important props mentioned in the script.

  Script:
  {{{script}}}

  Provide the output as a JSON object with three arrays: 'characters', 'locations', and 'props'.`,
});

const scriptBreakdownFlow = ai.defineFlow(
  {
    name: 'scriptBreakdownFlow',
    inputSchema: ScriptBreakdownInputSchema,
    outputSchema: ScriptBreakdownOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
