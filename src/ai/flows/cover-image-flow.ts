'use server';

/**
 * @fileOverview An AI agent to generate song cover images.
 *
 * - generateCoverImage - A function that handles the image generation process.
 * - CoverImageInput - The input type for the generateCoverImage function.
 * - CoverImageOutput - The return type for the generateCoverImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CoverImageInputSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
});
export type CoverImageInput = z.infer<typeof CoverImageInputSchema>;

const CoverImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('The data URI of the generated cover image.'),
});
export type CoverImageOutput = z.infer<typeof CoverImageOutputSchema>;

export async function generateCoverImage(
  input: CoverImageInput
): Promise<CoverImageOutput> {
  return coverImageFlow(input);
}

const coverImageFlow = ai.defineFlow(
  {
    name: 'coverImageFlow',
    inputSchema: CoverImageInputSchema,
    outputSchema: CoverImageOutputSchema,
  },
  async ({ title, artist }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a beautiful, artistic, and abstract song cover image for the song "${title}" by ${artist}. The image should evoke the mood of the song without using any text or direct representations of the title or artist. Focus on colors, shapes, and textures that match the song's feeling. Style: Digital painting, slightly abstract.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
