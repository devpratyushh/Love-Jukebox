"use client";

import type { Song } from "@/types";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { format, parseISO } from "date-fns";
import { Calendar, MessageSquare, Music, Youtube, Mic, Camera, FileText } from "lucide-react";
import { Separator } from "./ui/separator";
import Image from "next/image";

export function SongCard({ song }: { song: Song }) {
  const embedUrl = getYoutubeEmbedUrl(song.youtubeUrl);

  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 text-lg font-medium">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <time dateTime={song.date}>{format(parseISO(song.date), "dd MMMM yyyy")}</time>
      </div>
      <Separator />

      <div className="flex items-center gap-3">
        <Music className="h-5 w-5 text-muted-foreground" />
        <span>
          Song {song.id.substring(0, 1)}: <i>{song.title} by {song.artist}</i>
        </span>
      </div>
      <Separator />

      {song.message && (
        <>
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-1" />
            <p className="italic">"{song.message}"</p>
          </div>
          <Separator />
        </>
      )}

      {song.photoUrl && (
        <>
        <div className="flex items-start gap-3">
            <Camera className="h-5 w-5 text-muted-foreground" />
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Image
                    src={song.photoUrl}
                    alt={song.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="song lovers"
                />
            </div>
        </div>
        <Separator />
        </>
      )}

      {embedUrl && (
          <>
            <div className="flex items-center gap-3">
                <Youtube className="h-5 w-5 text-muted-foreground" />
                <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    [YouTube Link]
                </a>
            </div>
            <Separator/>
          </>
      )}

      {song.lyrics && (
        <>
            <div className="flex items-start gap-3">
                <Mic className="h-5 w-5 text-muted-foreground mt-1" />
                <p className="whitespace-pre-wrap">{song.lyrics}</p>
            </div>
            <Separator />
        </>
      )}
    </div>
  );
}
