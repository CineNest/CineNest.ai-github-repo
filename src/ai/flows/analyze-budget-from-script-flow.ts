'use server';

/**
 * @fileOverview An AI agent that analyzes a film script to identify costly props and equipment,
 * then estimates their costs in Indian Rupees (INR).
 *
 * - analyzeBudgetFromScript - A function that handles the analysis and estimation.
 * - AnalyzeBudgetFromScriptInput - The input type for the function.
 * - AnalyzeBudgetFromScriptOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeBudgetFromScriptInputSchema = z.object({
  script: z.string().describe('The full text of the film script.'),
});
export type AnalyzeBudgetFromScriptInput = z.infer<typeof AnalyzeBudgetFromScriptInputSchema>;

const BudgetItemSchema = z.object({
  item: z.string().describe('The name of the prop or equipment item.'),
  estimatedCost: z.string().describe('The estimated average rental or purchase price for the item in Indian Rupees (e.g., "₹40,000/day", "₹1,20,000 purchase", "Varies").'),
  reasoning: z.string().describe('A brief explanation for why this item was identified as a key budget item.'),
});

const AnalyzeBudgetFromScriptOutputSchema = z.object({
  budgetItems: z.array(BudgetItemSchema).describe('An array of identified high-cost props and equipment with their estimated costs.'),
  summary: z.string().describe('A brief summary of the overall findings for props and equipment budget.'),
});
export type AnalyzeBudgetFromScriptOutput = z.infer<typeof AnalyzeBudgetFromScriptOutputSchema>;

export async function analyzeBudgetFromScript(input: AnalyzeBudgetFromScriptInput): Promise<AnalyzeBudgetFromScriptOutput> {
  return analyzeBudgetFromScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBudgetFromScriptPrompt',
  input: { schema: AnalyzeBudgetFromScriptInputSchema },
  output: { schema: AnalyzeBudgetFromScriptOutputSchema },
  prompt: `You are a film production budget expert specializing in the Indian market. Your task is to analyze a film script, identify the most significant and costly props and equipment, and estimate their rental or purchase cost in Indian Rupees (INR), using Google Shopping as your primary price reference.

  Read the script below and identify items that would represent a notable cost. Do not list every single item, only the ones that are expensive or crucial for the production (e.g., specialized vehicles, period-specific furniture, high-end cameras, stunt equipment).

  For each item you identify:
  1.  Provide a brief reasoning for why it's a key budget item.
  2.  Search for its typical rental or purchase price on Google Shopping in India.
  3.  Provide a plausible, estimated price in INR. Specify if it's a rental (e.g., per day) or purchase price.
  4.  Provide a final summary of your findings.

  Script:
  {{{script}}}

  Provide the output as a JSON object.`,
});

const analyzeBudgetFromScriptFlow = ai.defineFlow(
  {
    name: 'analyzeBudgetFromScriptFlow',
    inputSchema: AnalyzeBudgetFromScriptInputSchema,
    outputSchema: AnalyzeBudgetFromScriptOutputSchema,
  },
  async (input) => {
    if (!input.script || input.script.trim().length < 50) {
        return {
            budgetItems: [],
            summary: "The script provided is too short to analyze. Please provide a more complete script."
        }
    }
    const { output } = await prompt(input);
    return output!;
  }
);
