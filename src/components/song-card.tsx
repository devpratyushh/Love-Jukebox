
"use client";

import type { Song } from "@/types";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Mic, Youtube, FileText } from "lucide-react";
import Image from "next/image";

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
            <div className="space-y-2">
                <h4 className="font-semibold">Lyrics</h4>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{song.lyrics}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
