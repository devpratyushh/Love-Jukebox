'use server';

/**
 * @fileOverview An AI agent to find song lyrics.
 *
 * - lyricSearch - A function that handles the lyric search process.
 * - LyricSearchInput - The input type for the lyricSearch function.
 * - LyricSearchOutput - The return type for the lyricSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LyricSearchInputSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
  start: z.string().optional().describe('The start timestamp for the lyrics snippet (e.g., "0:35").'),
  end: z.string().optional().describe('The end timestamp for the lyrics snippet (e.g., "1:15").'),
});
export type LyricSearchInput = z.infer<typeof LyricSearchInputSchema>;

const LyricSearchOutputSchema = z.object({
  lyrics: z.string().describe('The lyrics of the song. If no lyrics are found, this should be an empty string.'),
});
export type LyricSearchOutput = z.infer<typeof LyricSearchOutputSchema>;

export async function lyricSearch(input: LyricSearchInput): Promise<LyricSearchOutput> {
  return lyricSearchFlow(input);
}

const lyricSearchPrompt = ai.definePrompt({
  name: 'lyricSearchPrompt',
  input: {schema: LyricSearchInputSchema},
  output: {schema: LyricSearchOutputSchema},
  prompt: `You are an AI assistant that finds song lyrics using a search engine.

  Given the song title and artist, find the lyrics for the song.

  Song Title: {{{title}}}
  Artist: {{{artist}}}

  {{#if start}}
  The user wants the lyrics starting from {{{start}}}{{#if end}} and ending at {{{end}}}{{/if}}. Please return only the lyrics for this specific time range.
  {{else}}
  Return the full lyrics as a string.
  {{/if}}
  
  If you cannot find the lyrics, return an empty string.`,
});

const lyricSearchFlow = ai.defineFlow(
  {
    name: 'lyricSearchFlow',
    inputSchema: LyricSearchInputSchema,
    outputSchema: LyricSearchOutputSchema,
  },
  async input => {
    const {output} = await lyricSearchPrompt(input);
    return output!;
  }
);
