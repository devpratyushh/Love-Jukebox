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
  prompt: `You are an AI assistant that is an expert at finding songs on YouTube.

  Your goal is to find the best possible, playable YouTube video for a given song.

  Song Title: {{{title}}}
  Artist: {{{artist}}}

  Please prioritize your search in this order:
  1. The official music video.
  2. An official "art track" or "audio" version from the artist's channel.
  3. A high-quality upload from a reputable music channel.
  
  Do NOT return a link to a "lyric video" unless it is the only option available. The video must be embeddable.

  Return the YouTube URL and a boolean indicating whether the result is accurate.
  If you cannot find a suitable song, return an empty YouTube URL and set isAccurate to false.`,
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
