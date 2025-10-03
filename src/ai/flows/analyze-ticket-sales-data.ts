'use server';

/**
 * @fileOverview An AI agent that analyzes ticket sales data to predict movie collection trends.
 *
 * - analyzeTicketSalesData - A function that handles the ticket sales data analysis process.
 * - AnalyzeTicketSalesDataInput - The input type for the analyzeTicketSalesData function.
 * - AnalyzeTicketSalesDataOutput - The return type for the analyzeTicketSalesData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTicketSalesDataInputSchema = z.object({
  ticketSalesData: z
    .string()
    .describe("Ticket sales data from BookMyShow.  Should be in CSV format with headers: 'Date', 'Region', 'ScreenCount', and 'Sales'. Date should be in ISO 8601 format. Sales should be numeric."),
});
export type AnalyzeTicketSalesDataInput = z.infer<typeof AnalyzeTicketSalesDataInputSchema>;

const AnalyzeTicketSalesDataOutputSchema = z.object({
  predictedTrends: z
    .string()
    .describe("A detailed analysis of the ticket sales data, including predicted movie collection trends and actionable insights for distribution strategies. This analysis should identify key patterns, potential risks, and opportunities, and provide a clear, concise summary that enables informed decision-making."),
});
export type AnalyzeTicketSalesDataOutput = z.infer<typeof AnalyzeTicketSalesDataOutputSchema>;

export async function analyzeTicketSalesData(input: AnalyzeTicketSalesDataInput): Promise<AnalyzeTicketSalesDataOutput> {
  return analyzeTicketSalesDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTicketSalesDataPrompt',
  input: {schema: AnalyzeTicketSalesDataInputSchema},
  output: {schema: AnalyzeTicketSalesDataOutputSchema},
  prompt: `You are an expert data analyst specializing in the film industry.

You will analyze the ticket sales data to predict movie collection trends and provide actionable insights for distribution strategies.

Analyze the following ticket sales data and provide a detailed report:

Ticket Sales Data:
{{ticketSalesData}}

Based on this data, predict the movie collection trends and suggest optimal distribution strategies. Identify key patterns, potential risks, and opportunities.

Your analysis should be clear, concise, and actionable for a film distributor.`,
});

const analyzeTicketSalesDataFlow = ai.defineFlow(
  {
    name: 'analyzeTicketSalesDataFlow',
    inputSchema: AnalyzeTicketSalesDataInputSchema,
    outputSchema: AnalyzeTicketSalesDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
