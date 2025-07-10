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
  youtubeUrl: z
    .string()
    .describe('The URL of the best matching, embeddable YouTube lyric video for the song. This should be an empty string if no suitable video is found.'),
  isAccurate: z
    .boolean()
    .describe('Whether the YouTube result is an accurate match for the given song and artist.'),
  reason: z
    .string()
    .optional()
    .describe('If no video is found, a brief explanation of why (e.g., "No lyric video found.").'),
});
export type YoutubeSearchOutput = z.infer<typeof YoutubeSearchOutputSchema>;

export async function youtubeSearch(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
  return youtubeSearchFlow(input);
}

const youtubeSearchPrompt = ai.definePrompt({
  name: 'youtubeSearchPrompt',
  input: {schema: YoutubeSearchInputSchema},
  output: {schema: YoutubeSearchOutputSchema},
  prompt: `You are an AI assistant that finds the best YouTube lyric video for a song.

  Your task is to use a search engine to find the most popular and accurate lyric video for the following song:
  Song Title: {{{title}}}
  Artist: {{{artist}}}

  **CRITICAL INSTRUCTIONS:**
  - The video **MUST** be embeddable.
  - Prioritize lyric videos from reputable channels.
  - If you successfully find a video, set \`isAccurate\` to \`true\` and return the full YouTube URL.
  - If you cannot find a suitable lyric video, return an empty string for \`youtubeUrl\`, set \`isAccurate\` to \`false\`, and provide a brief \`reason\`.`,
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
