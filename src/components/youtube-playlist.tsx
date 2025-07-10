
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Music2, Youtube, Heart, Star } from "lucide-react";
import { format, parseISO } from "date-fns";
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

const SongItem = ({ song, currentSong, onSelectSong, onToggleFavorite }: {
    song: Song;
    currentSong: Song | null;
    onSelectSong: (song: Song) => void;
    onToggleFavorite: (id: string) => void;
}) => (
    <div key={song.id} className="group flex items-center gap-2">
      <button
          onClick={() => onSelectSong(song)}
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                <p className="truncate">{song.artist}</p>
                <span className="text-muted-foreground/80">&middot;</span>
                <p className="text-xs text-muted-foreground/80 truncate shrink-0">{format(parseISO(song.date), "MMM d, yyyy")}</p>
              </div>
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
);


interface YoutubePlaylistProps {
    favoriteSongs: Song[];
    otherSongs: Song[];
    sortOrder: PlaylistSortOrder;
    setSortOrder: Dispatch<SetStateAction<PlaylistSortOrder>>;
    onToggleFavorite: (id: string) => void;
    activeSong: Song | null;
    setActiveSong: (song: Song | null) => void;
}

export function YoutubePlaylist({ favoriteSongs, otherSongs, sortOrder, setSortOrder, onToggleFavorite, activeSong, setActiveSong }: YoutubePlaylistProps) {
  const allSongs = [...favoriteSongs, ...otherSongs];

  useEffect(() => {
    // If an active song is set from outside, use it.
    // Otherwise, default to the first song if nothing is playing.
    if (activeSong) return;

    if (allSongs.length > 0 && !activeSong) {
      setActiveSong(allSongs[0]);
    }
  }, [allSongs, activeSong, setActiveSong]);


  if (allSongs.length === 0) {
    return (
        <div className="flex flex-col h-full bg-muted/50 rounded-lg p-4 items-center justify-center">
             <div className="text-center text-muted-foreground">
                <Music2 className="mx-auto h-12 w-12" />
                <p className="mt-2">Your playlist is empty.</p>
                <p className="text-sm">Add a song to get started!</p>
            </div>
        </div>
    );
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
        <YoutubePlayer song={activeSong} />
      </div>

      <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4 -mr-4">
            <div className="space-y-2">
                {favoriteSongs.length > 0 && (
                    <>
                        <div className="flex items-center gap-2 px-2 pt-2">
                           <Star className="h-4 w-4 text-amber-400 fill-current" />
                           <h3 className="text-sm font-semibold text-muted-foreground">Favorites</h3>
                        </div>
                        {favoriteSongs.map((song) => (
                           <SongItem key={`fav-${song.id}`} song={song} currentSong={activeSong} onSelectSong={setActiveSong} onToggleFavorite={onToggleFavorite} />
                        ))}
                       {otherSongs.length > 0 && <Separator className="my-4" />}
                    </>
                )}

              {otherSongs.map((song) => (
                 <SongItem key={song.id} song={song} currentSong={activeSong} onSelectSong={setActiveSong} onToggleFavorite={onToggleFavorite} />
              ))}
            </div>
          </ScrollArea>
      </div>

    </div>
  );
}
