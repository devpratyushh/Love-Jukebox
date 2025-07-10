
"use client";

import type { Song } from "@/types";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Music2, Youtube, Heart } from "lucide-react";
import { format } from "date-fns";
import type { PlaylistSortOrder } from "@/app/page";

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

interface YoutubePlaylistProps {
    songs: Song[];
    sortOrder: PlaylistSortOrder;
    setSortOrder: Dispatch<SetStateAction<PlaylistSortOrder>>;
    onToggleFavorite: (id: string) => void;
}

export function YoutubePlaylist({ songs, sortOrder, setSortOrder, onToggleFavorite }: YoutubePlaylistProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    // Set the first song as current when the component loads or songs change
    if (songs.length > 0 && !currentSong) {
      setCurrentSong(songs[0]);
    }
    // If the current song is no longer in the list, clear it
    if (currentSong && !songs.find(s => s.id === currentSong.id)) {
        setCurrentSong(songs[0] || null);
    }
  }, [songs, currentSong]);


  if (songs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-muted/50 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 shrink-0">
        <h2 className="text-3xl font-headline font-bold text-primary shrink-0">Our Playlist</h2>
        <Select onValueChange={(value) => setSortOrder(value as PlaylistSortOrder)} defaultValue={sortOrder}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest-first">Newest First</SelectItem>
            <SelectItem value="oldest-first">Oldest First</SelectItem>
            <SelectItem value="title-az">Title (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="shrink-0 mb-4">
        <YoutubePlayer song={currentSong} />
      </div>

      <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4 -mr-4">
            <div className="space-y-2">
              {songs.map((song) => (
                  <div key={song.id} className="group flex items-center gap-2">
                    <button
                        onClick={() => setCurrentSong(song)}
                        className={cn(
                            "flex-1 text-left p-2 rounded-md flex items-center gap-4 transition-colors",
                            currentSong?.id === song.id ? "bg-primary/20" : "hover:bg-primary/10"
                        )}
                    >
                        <div className="w-12 h-12 bg-muted rounded-md shrink-0 flex items-center justify-center relative">
                            {song.thumbnailUrl ? (
                                <Image src={song.thumbnailUrl} alt={song.title} width={48} height={48} className="w-full h-full object-cover rounded-md" />
                            ) : song.photoUrl ? (
                                <Image src={song.photoUrl} alt={song.title} width={48} height={48} className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <Music2 className="w-6 h-6 text-muted-foreground" />
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold truncate text-foreground">{song.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                            <p className="text-xs text-muted-foreground/80 truncate">{format(new Date(song.date), "dd MMMM yyyy")}</p>
                        </div>
                    </button>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="rounded-full w-8 h-8"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(song.id);
                        }}
                    >
                        <Heart className={cn("w-4 h-4", song.isFavorite ? "text-primary fill-current" : "text-muted-foreground")} />
                        <span className="sr-only">Toggle Favorite</span>
                    </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
      </div>

    </div>
  );
}
