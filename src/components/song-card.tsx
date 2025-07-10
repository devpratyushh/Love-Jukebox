"use client";

import type { Song } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { format, parseISO } from "date-fns";
import { Calendar, MessageSquare, Music } from "lucide-react";

export function SongCard({ song }: { song: Song }) {
  const embedUrl = getYoutubeEmbedUrl(song.youtubeUrl);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
      {embedUrl && (
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={`YouTube video player for ${song.title}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-tight text-primary">{song.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-foreground/80">
          <Music className="h-4 w-4" />
          {song.artist}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <time dateTime={song.date}>{format(parseISO(song.date), "MMMM d, yyyy")}</time>
        </div>
        {song.message && (
          <div className="flex items-start gap-2 text-sm">
            <MessageSquare className="h-4 w-4 mt-1 shrink-0 text-accent-foreground/80" />
            <p className="italic text-foreground/90 whitespace-pre-wrap">{song.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
