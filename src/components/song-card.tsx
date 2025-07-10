
"use client";

import type { Song } from "@/types";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare, FileText } from "lucide-react";
import Image from "next/image";

const LyricsDisplay = ({ lyrics }: { lyrics: string }) => {
    if (!lyrics) {
        return null;
    }

    const lines = lyrics.split('\n').filter(line => line.trim() !== '');
    const lineCount = lines.length;

    if (lineCount === 0) {
        return null;
    }
    
    // This logic distinguishes a snippet by looking for a specific structure (context, main, context).
    const isSnippet = lines.length > 2 && lines.length <= 10; // Heuristic for snippets

    const prelude = isSnippet ? lines.slice(0, 1) : [];
    const mainSnippet = isSnippet ? lines.slice(1, -1) : lines;
    const postlude = isSnippet ? lines.slice(-1) : [];

    const content = (
        <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {prelude.length > 0 && <p>{prelude.join('\n')}</p>}
            <blockquote className="my-2">
                <p className="text-lg font-bold text-primary">
                    {mainSnippet.join('\n')}
                </p>
            </blockquote>
            {postlude.length > 0 && <p>{postlude.join('\n')}</p>}
        </div>
    );
    
    if (lineCount > 5) {
        return (
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline p-0 text-muted-foreground">Show Lyrics</AccordionTrigger>
                    <AccordionContent className="pt-2">
                        {content}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    }

    return content;
};


export function SongCard({ song }: { song: Song }) {
  const embedUrl = getYoutubeEmbedUrl(song.youtubeUrl);

  return (
    <Card className="overflow-hidden">
      <div className="relative w-full aspect-video bg-muted">
        {song.photoUrl && (
          <Image
            src={song.photoUrl}
            alt={song.title}
            fill
            className="object-cover"
            data-ai-hint="song lovers"
          />
        )}
        
        {!song.photoUrl && embedUrl && (
          <iframe
            src={embedUrl}
            title={song.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        )}

        {song.photoUrl && embedUrl && (
            <div className="absolute bottom-2 right-2 z-10" style={{ width: '30%', paddingBottom: '16.875%' /* 16:9 of 30% width */ }}>
                 <iframe
                    src={embedUrl}
                    title={`${song.title} preview`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-md shadow-lg"
                ></iframe>
            </div>
        )}
      </div>

      <CardHeader>
        <CardTitle>{song.title}</CardTitle>
        <CardDescription>by {song.artist}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {song.message && (
          <div className="flex items-start gap-4">
            <MessageSquare className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
            <p className="italic text-muted-foreground">"{song.message}"</p>
          </div>
        )}

        {song.lyrics && (
          <div className="flex items-start gap-4">
            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
            <div className="w-full">
                <LyricsDisplay lyrics={song.lyrics} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
