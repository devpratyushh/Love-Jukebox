'use server';

/**
 * @fileOverview A YouTube search AI agent.
 *
 * - youtubeSearch - A function that handles the YouTube search process.
 * - YoutubeSearchInput - The input type for the youtubeSearch function.
 * - YoutubeSearchOutput - The return type for the youtubeSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YoutubeSearchInputSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
});
export type YoutubeSearchInput = z.infer<typeof YoutubeSearchInputSchema>;

const YoutubeSearchOutputSchema = z.object({
  youtubeUrl: z.string().describe('The URL of the song on YouTube.'),
  isAccurate: z.boolean().describe('Whether the YouTube result is accurate for the given song and artist.'),
});
export type YoutubeSearchOutput = z.infer<typeof YoutubeSearchOutputSchema>;

export async function youtubeSearch(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
  return youtubeSearchFlow(input);
}

const youtubeSearchPrompt = ai.definePrompt({
  name: 'youtubeSearchPrompt',
  input: {schema: YoutubeSearchInputSchema},
  output: {schema: YoutubeSearchOutputSchema},
  prompt: `You are an AI assistant that searches for songs on YouTube.

  Given the song title and artist, find the most relevant YouTube URL and determine if the result is accurate.

  Song Title: {{{title}}}
  Artist: {{{artist}}}

  Return the YouTube URL and a boolean indicating whether the result is accurate.
  If you cannot find the song, return an empty YouTube URL and set isAccurate to false.`,
});

const youtubeSearchFlow = ai.defineFlow(
  {
    name: 'youtubeSearchFlow',
    inputSchema: YoutubeSearchInputSchema,
    outputSchema: YoutubeSearchOutputSchema,
  },
  async input => {
    const {output} = await youtubeSearchPrompt(input);
    return output!;
  }
);
