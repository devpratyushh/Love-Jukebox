
"use client";

import type { Song } from "@/types";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare, FileText, Trash2, PlayCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

const LyricsDisplay = ({ lyrics }: { lyrics: string }) => {
    if (!lyrics) {
        return null;
    }

    const lines = lyrics.split('\n').filter(line => line.trim() !== '');
    const lineCount = lines.length;

    if (lineCount === 0) {
        return null;
    }
    
    const isSnippet = lines.length > 2 && lines.length <= 10; 

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


export function SongCard({ song, onDelete, onPlay }: { song: Song; onDelete: (id: string) => void; onPlay: (song: Song) => void; }) {
  const embedUrl = getYoutubeEmbedUrl(song.youtubeUrl, song.start);

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative w-full aspect-video bg-muted group">
        {song.photoUrl && (
          <>
            <Image
              src={song.photoUrl}
              alt={song.title}
              fill
              className="object-cover"
              data-ai-hint="song lovers"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <Button 
                variant="ghost"
                size="icon"
                className="w-20 h-20 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
                onClick={() => onPlay(song)}
                >
                <PlayCircle className="w-16 h-16" />
                <span className="sr-only">Play Song</span>
              </Button>
            </div>
          </>
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
      </div>

      <div className="flex flex-col flex-grow">
        <CardHeader>
          <CardTitle>{song.title}</CardTitle>
          <CardDescription>by {song.artist}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
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
        <CardFooter>
            <Button variant="ghost" size="sm" onClick={() => onDelete(song.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Song</span>
            </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
