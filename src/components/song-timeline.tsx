"use client";

import type { Song } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import { SongCard } from "./song-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart } from "lucide-react";
import React from "react";

type SortOrder = "newest-first" | "oldest-first" | "artist-az";

interface SongTimelineProps {
  songs: Song[];
  sortOrder: SortOrder;
  setSortOrder: Dispatch<SetStateAction<SortOrder>>;
}

export function SongTimeline({ songs, sortOrder, setSortOrder }: SongTimelineProps) {
  
  const sortedSongs = React.useMemo(() => {
    return [...songs].sort((a, b) => {
      switch (sortOrder) {
        case "oldest-first":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "artist-az":
          return a.artist.localeCompare(b.artist);
        case "newest-first":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [songs, sortOrder]);


  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-headline font-bold text-primary">Our Mixtape</h2>
        {songs.length > 1 && (
          <Select onValueChange={(value) => setSortOrder(value as SortOrder)} defaultValue={sortOrder}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest-first">Newest First</SelectItem>
              <SelectItem value="oldest-first">Oldest First</SelectItem>
              <SelectItem value="artist-az">Artist A-Z</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {sortedSongs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 rounded-lg border-2 border-dashed border-border bg-card">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-headline font-medium text-foreground">No songs yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Add a song to start your shared jukebox!</p>
        </div>
      )}
    </div>
  );
}
