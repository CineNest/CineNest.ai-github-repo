'use server';

/**
 * @fileOverview An AI agent that generates a film shooting schedule.
 *
 * - generateSchedule - A function that creates a schedule based on a script and shooting days.
 * - GenerateScheduleInput - The input type for the generateSchedule function.
 * - GenerateScheduleOutput - The return type for the generateSchedule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateScheduleInputSchema = z.object({
  script: z.string().describe('The film script to be analyzed for scheduling.'),
  shootingDays: z.number().int().positive().describe('The total number of available shooting days.'),
});
export type GenerateScheduleInput = z.infer<typeof GenerateScheduleInputSchema>;

const ScheduleDaySchema = z.object({
  day: z.number().int().describe('The shooting day number.'),
  date: z.string().describe('A placeholder for the calendar date, e.g., "Day 1" or "TBD".'),
  scenes: z.string().describe('The scene numbers or a summary of scenes to be shot.'),
  location: z.string().describe('The primary location for the day\'s shoot.'),
  notes: z.string().describe('Important notes for the day, such as required cast, key props, or special considerations.'),
});

const GenerateScheduleOutputSchema = z.object({
  schedule: z.array(ScheduleDaySchema).describe('The generated shooting schedule, ordered by day.'),
});
export type GenerateScheduleOutput = z.infer<typeof GenerateScheduleOutputSchema>;

export async function generateSchedule(input: GenerateScheduleInput): Promise<GenerateScheduleOutput> {
  return generateScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSchedulePrompt',
  input: { schema: GenerateScheduleInputSchema },
  output: { schema: GenerateScheduleOutputSchema },
  prompt: `You are an expert 1st Assistant Director responsible for creating efficient shooting schedules.

  Analyze the provided script and generate a logical shooting schedule based on the given number of shooting days.

  Your goal is to group scenes logically by location and actors to minimize company moves and maximize efficiency. Schedule scenes at the same location on the same day or on consecutive days.

  Script:
  {{{script}}}

  Total Shooting Days: {{{shootingDays}}}

  Provide the output as a JSON object containing a 'schedule' array. Each item in the array should represent one shooting day and include the day number, a placeholder date, scenes to be shot, the primary location, and any relevant notes.`,
});

const generateScheduleFlow = ai.defineFlow(
  {
    name: 'generateScheduleFlow',
    inputSchema: GenerateScheduleInputSchema,
    outputSchema: GenerateScheduleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
