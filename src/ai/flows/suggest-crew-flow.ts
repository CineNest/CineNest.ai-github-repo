'use server';

/**
 * @fileOverview An AI agent that suggests potential crew members for a film production.
 *
 * - suggestCrew - A function that suggests crew members based on required roles.
 * - SuggestCrewInput - The input type for the suggestCrew function.
 * - SuggestCrewOutput - The return type for the suggestCrew function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestCrewInputSchema = z.object({
  roles: z.array(z.string()).describe('A list of production roles that need to be filled.'),
});
export type SuggestCrewInput = z.infer<typeof SuggestCrewInputSchema>;

const CrewMemberSchema = z.object({
  name: z.string().describe('The full name of the suggested crew member.'),
  role: z.string().describe('The role they would fill.'),
  contact: z.string().email().describe('A fictional contact email for the crew member.'),
});

const SuggestCrewOutputSchema = z.object({
  crew: z.array(CrewMemberSchema).describe('A list of suggested crew members.'),
});
export type SuggestCrewOutput = z.infer<typeof SuggestCrewOutputSchema>;

export async function suggestCrew(input: SuggestCrewInput): Promise<SuggestCrewOutput> {
  return suggestCrewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCrewPrompt',
  input: { schema: SuggestCrewInputSchema },
  output: { schema: SuggestCrewOutputSchema },
  prompt: `You are a line producer for a film production, and your task is to build a list of potential crew members.

  Based on the following list of required roles, generate a list of fictional people who could fill these positions. For each person, provide their full name, their assigned role, and a plausible but fake email address for them.

  Required Roles:
  {{#each roles}}- {{{this}}}
  {{/each}}

  Provide the output as a JSON object containing a 'crew' array.`,
});

const suggestCrewFlow = ai.defineFlow(
  {
    name: 'suggestCrewFlow',
    inputSchema: SuggestCrewInputSchema,
    outputSchema: SuggestCrewOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);