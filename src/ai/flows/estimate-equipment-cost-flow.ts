'use server';

/**
 * @fileOverview An AI agent that estimates the average cost of film equipment.
 *
 * - estimateEquipmentCost - A function that provides cost estimations.
 * - EstimateEquipmentCostInput - The input type for the function.
 * - EstimateEquipmentCostOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EstimateEquipmentCostInputSchema = z.object({
  equipmentList: z.string().describe('A comma-separated list of film equipment (e.g., "Arri Alexa Mini, set of Zeiss Supreme Prime lenses, 2x 1TB Codex cards").'),
});
export type EstimateEquipmentCostInput = z.infer<typeof EstimateEquipmentCostInputSchema>;

const EquipmentCostSchema = z.object({
  item: z.string().describe('The name of the equipment item.'),
  estimatedCost: z.string().describe('The estimated average rental price for the item in Indian Rupees (e.g., "₹40,000/day", "Varies").'),
});

const EstimateEquipmentCostOutputSchema = z.object({
  costs: z.array(EquipmentCostSchema).describe('An array of equipment items and their estimated costs.'),
  totalEstimatedCost: z.string().describe('A summary of the total estimated cost for all items in Indian Rupees (INR).'),
});
export type EstimateEquipmentCostOutput = z.infer<typeof EstimateEquipmentCostOutputSchema>;

export async function estimateEquipmentCost(input: EstimateEquipmentCostInput): Promise<EstimateEquipmentCostOutput> {
  return estimateEquipmentCostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateEquipmentCostPrompt',
  input: { schema: EstimateEquipmentCostInputSchema },
  output: { schema: EstimateEquipmentCostOutputSchema },
  prompt: `You are a film production budget expert specializing in the Indian market. Your task is to provide an estimated average rental cost in Indian Rupees (INR) for a list of film equipment.

  Analyze the following list and provide a plausible, estimated rental price in INR for each item. The price can be per day or a general note. Also provide a total summary.

  Equipment List:
  {{{equipmentList}}}

  Provide the output as a JSON object with 'costs' and 'totalEstimatedCost'. Ensure all currency is in INR.`,
});

const estimateEquipmentCostFlow = ai.defineFlow(
  {
    name: 'estimateEquipmentCostFlow',
    inputSchema: EstimateEquipmentCostInputSchema,
    outputSchema: EstimateEquipmentCostOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
