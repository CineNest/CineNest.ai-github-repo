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
  country: z.string().optional().describe('The country to search for locations in. (Optional)'),
  state: z.string().optional().describe('The state, province, or region to search for locations in. (Optional)'),
  sceneDescription: z.string().describe('A description of the scene or the type of location needed (e.g., "a modern, bustling coffee shop" or "a quiet, secluded beach at sunset").'),
});
export type SuggestLocationsInput = z.infer<typeof SuggestLocationsInputSchema>;

const LocationSuggestionSchema = z.object({
  name: z.string().describe('The name of the suggested location (e.g., "Griffith Observatory", "Jane\'s Coffee Corner").'),
  description: z.string().describe('A brief, concise explanation of why this location is a good fit for the scene.'),
  imageUrl: z.string().url().describe('A URL for a representative photo of the location.'),
  googleMapsUrl: z.string().url().describe('A direct URL to the location on Google Maps.'),
  rating: z.number().optional().describe('The average star rating from Google reviews (e.g., 4.5).'),
  reviewsSummary: z.string().optional().describe('A brief summary of what people are saying in reviews.'),
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
  prompt: `You are an expert location scout for the film industry. Your task is to find and suggest potential filming locations based on a scene description, as if you are analyzing photos from Google Reviews and Google Ads.

For each suggestion, provide a name, a **brief and concise** description of why it fits, a publicly accessible image URL, a Google Maps link, its Google review rating, and a review summary.

Include a mix of location types like resorts, private properties, and public landmarks that fit the scene. If country and state are not provided, suggest interesting locations from around the world.

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
