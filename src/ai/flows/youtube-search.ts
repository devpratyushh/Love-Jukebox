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
    .describe('If no video is found, a brief explanation of why (e.g., "No official audio or video found.").'),
});
export type YoutubeSearchOutput = z.infer<typeof YoutubeSearchOutputSchema>;

export async function youtubeSearch(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
  return youtubeSearchFlow(input);
}

const youtubeSearchPrompt = ai.definePrompt({
  name: 'youtubeSearchPrompt',
  input: {schema: YoutubeSearchInputSchema},
  output: {schema: YoutubeSearchOutputSchema},
  prompt: `You are a highly intelligent AI assistant specializing in finding the most suitable, embeddable YouTube video for a given song.

  Your task is to find the best possible video for the following song:
  Song Title: {{{title}}}
  Artist: {{{artist}}}

  You must adhere to the following priority list for your search. Stop at the first successful match:
  1.  **Official Music Video:** The highest priority is the official music video from the artist's official VEVO or primary channel.
  2.  **Official Audio/Art Track:** If an official video isn't available, find an "Official Audio" or "Art Track" uploaded by the artist or their label. These are often on a topic channel or the artist's main channel.
  3.  **High-Quality Album Version:** If neither of the above can be found, locate a high-quality audio upload of the studio/album version of the song from a reputable music channel.

  **CRITICAL INSTRUCTIONS:**
  - The video **MUST** be embeddable.
  - **DO NOT** return a lyric video, a live performance, a cover version, or a remix unless it is the *only* available option and is from an official artist channel.
  - If you successfully find a video, set \`isAccurate\` to \`true\` and return the full YouTube URL.
  - If you cannot find any suitable video after an exhaustive search, return an empty string for \`youtubeUrl\`, set \`isAccurate\` to \`false\`, and provide a brief \`reason\`.`,
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
