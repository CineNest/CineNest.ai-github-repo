'use server';
/**
 * @fileOverview Automates pre and post production tasks using AI.
 *
 * - automatePrePostProductionTasks - A function that automates pre and post production tasks.
 * - AutomatePrePostProductionTasksInput - The input type for the automatePrePostProductionTasks function.
 * - AutomatePrePostProductionTasksOutput - The return type for the automatePrePostProductionTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatePrePostProductionTasksInputSchema = z.object({
  task: z.string().describe('The pre or post production task to automate.'),
  scriptSummary: z.string().describe('A summary of the film script.'),
  filmGenre: z.string().describe('The genre of the film.'),
});
export type AutomatePrePostProductionTasksInput = z.infer<typeof AutomatePrePostProductionTasksInputSchema>;

const AutomatePrePostProductionTasksOutputSchema = z.object({
  details: z.string().describe('Generated details for the specified pre or post production task.'),
});
export type AutomatePrePostProductionTasksOutput = z.infer<typeof AutomatePrePostProductionTasksOutputSchema>;

export async function automatePrePostProductionTasks(input: AutomatePrePostProductionTasksInput): Promise<AutomatePrePostProductionTasksOutput> {
  return automatePrePostProductionTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatePrePostProductionTasksPrompt',
  input: {schema: AutomatePrePostProductionTasksInputSchema},
  output: {schema: AutomatePrePostProductionTasksOutputSchema},
  prompt: `You are an AI assistant specialized in filmmaking. Your role is to assist filmmakers in automating pre and post production tasks.

Given the task, script summary, and film genre, generate detailed guidance, suggestions, or plans to help automate the specified task.

Task: {{{task}}}
Script Summary: {{{scriptSummary}}}
Film Genre: {{{filmGenre}}}

Provide details that can be directly implemented by the filmmaker to streamline their workflow.`, 
});

const automatePrePostProductionTasksFlow = ai.defineFlow(
  {
    name: 'automatePrePostProductionTasksFlow',
    inputSchema: AutomatePrePostProductionTasksInputSchema,
    outputSchema: AutomatePrePostProductionTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
