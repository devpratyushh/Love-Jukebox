
"use client";

import type { Song } from "@/types";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Music2, Youtube } from "lucide-react";

const YoutubePlayer = ({ song }: { song: Song | null }) => {
  const embedUrl = song ? getYoutubeEmbedUrl(song.youtubeUrl, song.start) : null;

  return (
    <div className="aspect-video w-full bg-card rounded-lg overflow-hidden border shadow-sm">
      {embedUrl ? (
        <iframe
          key={song?.id} // Add key to force re-render
          src={embedUrl + '&autoplay=1'}
          title={song?.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
                <Youtube className="mx-auto h-12 w-12" />
                <p className="mt-2">Select a song to play</p>
            </div>
        </div>
      )}
    </div>
  );
};

export function YoutubePlaylist({ songs }: { songs: Song[] }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    // Set the first song as current when the component loads or songs change
    if (songs.length > 0 && !currentSong) {
      setCurrentSong(songs[0]);
    }
  }, [songs, currentSong]);


  if (songs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-muted/50 rounded-lg p-4">
      <h2 className="text-3xl font-headline font-bold text-primary mb-4 shrink-0">Our Playlist</h2>
      
      <div className="shrink-0 mb-4">
        <YoutubePlayer song={currentSong} />
      </div>

      <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4 -mr-4">
            <div className="space-y-2">
              {songs.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => setCurrentSong(song)}
                    className={cn(
                        "w-full text-left p-2 rounded-md flex items-center gap-4 transition-colors",
                        currentSong?.id === song.id ? "bg-primary/20 text-primary-foreground" : "hover:bg-primary/10"
                    )}
                  >
                    <div className="w-12 h-12 bg-muted rounded-md shrink-0 flex items-center justify-center">
                        {song.photoUrl ? (
                            <Image src={song.photoUrl} alt={song.title} width={48} height={48} className="w-full h-full object-cover rounded-md" />
                        ) : (
                            <Music2 className="w-6 h-6 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-semibold truncate text-foreground">{song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                    </div>
                  </button>
              ))}
            </div>
          </ScrollArea>
      </div>

    </div>
  );
}
