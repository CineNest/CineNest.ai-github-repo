'use server';

/**
 * @fileOverview An AI agent that suggests film locations based on user criteria.
 *
 * - suggestLocations - A function that suggests locations.
 * - SuggestLocationsInput - The input type for the suggestLocations function.
 * - SuggestLocationsOutput - The return type for the suggestLocations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestLocationsInputSchema = z.object({
  country: z.string().describe('The country to search for locations in.'),
  state: z.string().describe('The state, province, or region to search for locations in.'),
  sceneDescription: z.string().describe('A description of the scene or the type of location needed (e.g., "a modern, bustling coffee shop" or "a quiet, secluded beach at sunset").'),
});
export type SuggestLocationsInput = z.infer<typeof SuggestLocationsInputSchema>;

const LocationSuggestionSchema = z.object({
  name: z.string().describe('The name of the suggested location (e.g., "Griffith Observatory", "Jane\'s Coffee Corner").'),
  description: z.string().describe('A brief explanation of why this location is a good fit for the scene.'),
  imageUrl: z.string().url().describe('A URL for a representative photo of the location.'),
  googleMapsUrl: z.string().url().describe('A direct URL to the location on Google Maps.'),
});

const SuggestLocationsOutputSchema = z.object({
  locations: z.array(LocationSuggestionSchema).describe('A list of suggested filming locations.'),
});
export type SuggestLocationsOutput = z.infer<typeof SuggestLocationsOutputSchema>;


export async function suggestLocations(input: SuggestLocationsInput): Promise<SuggestLocationsOutput> {
  return suggestLocationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLocationsPrompt',
  input: { schema: SuggestLocationsInputSchema },
  output: { schema: SuggestLocationsOutputSchema },
  prompt: `You are an expert location scout for the film industry. Your task is to find and suggest potential filming locations based on a scene description and geographical constraints.

For each suggestion, you must provide a name, a brief description of why it's a good fit, a publicly accessible image URL, and a Google Maps link. The location can be a public landmark or a generic type of place (like "a suburban two-story house").

Scene Description: {{{sceneDescription}}}
Country: {{{country}}}
State/Province: {{{state}}}

Based on this, generate a list of 3 diverse and interesting locations. For the image URL, use a realistic photo from a service like Unsplash. For the Google Maps link, create a search-based URL.`,
});

const suggestLocationsFlow = ai.defineFlow(
  {
    name: 'suggestLocationsFlow',
    inputSchema: SuggestLocationsInputSchema,
    outputSchema: SuggestLocationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
