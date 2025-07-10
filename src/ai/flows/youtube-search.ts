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
    .describe('The URL of the best matching, embeddable YouTube video for the song. This should be an empty string if no suitable video is found.'),
  isAccurate: z
    .boolean()
    .describe('Whether the YouTube result is an accurate match for the given song and artist.'),
  reason: z
    .string()
    .optional()
    .describe('If no video is found, a brief explanation of why (e.g., "No official video found.").'),
});
export type YoutubeSearchOutput = z.infer<typeof YoutubeSearchOutputSchema>;

export async function youtubeSearch(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
  return youtubeSearchFlow(input);
}

const youtubeSearchPrompt = ai.definePrompt({
  name: 'youtubeSearchPrompt',
  input: {schema: YoutubeSearchInputSchema},
  output: {schema: YoutubeSearchOutputSchema},
  prompt: `You are a highly accurate music video search assistant. Your task is to find the best embeddable YouTube video for a given song.

  Song Title: {{{title}}}
  Artist: {{{artist}}}

  Follow these steps precisely:
  1.  **Search for an OFFICIAL MUSIC VIDEO** from the artist's official channel or VEVO channel. This is the highest priority.
  2.  If an official music video is not found, **search for an OFFICIAL AUDIO or ART TRACK** from the artist's official channel. These are often named "[Song Title] (Official Audio)".
  3.  If neither of the above is found, **search for a high-quality lyric video** from a reputable channel.
  4.  The video **MUST** be embeddable. Do not return videos that have embedding disabled.

  - If you find a suitable video, set \`isAccurate\` to \`true\` and return the full YouTube URL in \`youtubeUrl\`.
  - If you cannot find any suitable video after trying all steps, set \`isAccurate\` to \`false\`, return an empty string for \`youtubeUrl\`, and provide a brief \`reason\` (e.g., "No embeddable official video or audio found.").`,
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
