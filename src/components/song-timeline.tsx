
"use client";

import type { Song } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import { SongCard } from "./song-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { format, parseISO } from 'date-fns';
import { cn } from "@/lib/utils";
import { TimelineFilter } from "@/app/page";


type SortOrder = "newest-first" | "oldest-first";

interface SongTimelineProps {
  songs: Song[];
  sortOrder: SortOrder;
  setSortOrder: Dispatch<SetStateAction<SortOrder>>;
  timelineFilter: TimelineFilter;
  setTimelineFilter: Dispatch<SetStateAction<TimelineFilter>>;
  onDeleteSong: (id: string) => void;
  onToggleDateFavorite: (date: string, shouldBeFavorite: boolean) => void;
  onPlaySong: (song: Song) => void;
}

export function SongTimeline({ songs, sortOrder, setSortOrder, timelineFilter, setTimelineFilter, onDeleteSong, onToggleDateFavorite, onPlaySong }: SongTimelineProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const groupedAndSortedSongs = React.useMemo(() => {
    // Group songs by date
    const grouped = songs.reduce((acc, song) => {
      const date = format(parseISO(song.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(song);
      return acc;
    }, {} as Record<string, Song[]>);

    // Sort the dates
    const sortedDates = Object.keys(grouped).sort((a, b) => {
        if (sortOrder === 'oldest-first') {
            return new Date(a).getTime() - new Date(b).getTime();
        }
        // newest-first
        return new Date(b).getTime() - new Date(a).getTime();
    });

    // Sort songs within each group by artist A-Z
    sortedDates.forEach(date => {
        grouped[date].sort((a, b) => a.artist.localeCompare(b.artist));
    });

    return sortedDates.map(date => ({
      date,
      songs: grouped[date]
    }));

  }, [songs, sortOrder]);


  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/80 backdrop-blur-sm z-20 shrink-0">
        <h2 className="text-3xl font-headline font-bold text-primary">Our Mixtape</h2>
        {isClient && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Tabs value={timelineFilter} onValueChange={(value) => setTimelineFilter(value as TimelineFilter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
            </Tabs>
            {songs.length > 1 && (
              <Select onValueChange={(value) => setSortOrder(value as SortOrder)} defaultValue={sortOrder}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest-first">Newest First</SelectItem>
                  <SelectItem value="oldest-first">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {groupedAndSortedSongs.length > 0 ? (
          <Accordion type="multiple" defaultValue={groupedAndSortedSongs.map(g => g.date)} className="w-full space-y-4 p-4">
            {groupedAndSortedSongs.map(({ date, songs }) => {
              const allFavorited = songs.every(s => s.isFavorite);
              return (
                <AccordionItem key={date} value={date} className="border-b-0">
                  <div className="sticky top-0 z-10 flex items-center bg-card text-card-foreground rounded-lg border shadow-sm data-[state=open]:rounded-b-none">
                     <div className="flex-1 px-6 py-4">
                      <div className="flex items-center gap-3 text-lg font-medium">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <time dateTime={date}>{format(parseISO(date), "dd MMMM yyyy")}</time>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full w-8 h-8 shrink-0 mr-2"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent accordion from toggling
                        onToggleDateFavorite(date, !allFavorited);
                      }}
                    >
                      <Heart className={cn("w-5 h-5", allFavorited ? "text-primary fill-current" : "text-muted-foreground/50")} />
                      <span className="sr-only">Favorite this date</span>
                    </Button>
                     <AccordionTrigger className="p-2 hover:bg-accent/50 rounded-md">
                        <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                     </AccordionTrigger>
                  </div>
                  <AccordionContent className="bg-muted/50 rounded-b-lg border border-t-0 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {songs.map((song) => (
                          <SongCard key={song.id} song={song} onDelete={onDeleteSong} onPlay={onPlaySong} />
                        ))}
                      </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="text-center py-20 px-6 rounded-lg border-2 border-dashed border-border bg-card m-4">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-headline font-medium text-foreground">
              {timelineFilter === 'favorites' ? 'No favorites yet' : 'No songs yet'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {timelineFilter === 'favorites' ? 'Click the heart on a song to add it here.' : 'Add a song to start your shared jukebox!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
