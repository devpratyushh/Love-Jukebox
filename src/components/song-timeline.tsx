
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, Calendar } from "lucide-react";
import React from "react";
import { format, parseISO } from 'date-fns';


type SortOrder = "newest-first" | "oldest-first";

interface SongTimelineProps {
  songs: Song[];
  sortOrder: SortOrder;
  setSortOrder: Dispatch<SetStateAction<SortOrder>>;
}

export function SongTimeline({ songs, sortOrder, setSortOrder }: SongTimelineProps) {

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
            </SelectContent>
          </Select>
        )}
      </div>

      {groupedAndSortedSongs.length > 0 ? (
        <Accordion type="multiple" defaultValue={groupedAndSortedSongs.map(g => g.date)} className="w-full space-y-4">
           {groupedAndSortedSongs.map(({ date, songs }) => (
            <AccordionItem key={date} value={date} className="border-b-0">
               <AccordionTrigger className="bg-card text-card-foreground rounded-lg border shadow-sm px-6 py-4 hover:no-underline data-[state=open]:rounded-b-none">
                 <div className="flex items-center gap-3 text-lg font-medium">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <time dateTime={date}>{format(parseISO(date), "dd MMMM yyyy")}</time>
                 </div>
               </AccordionTrigger>
               <AccordionContent className="bg-card text-card-foreground rounded-b-lg border border-t-0 shadow-sm p-6 pt-0">
                  <div className="space-y-6 pt-6 border-t">
                    {songs.map((song) => (
                      <SongCard key={song.id} song={song} />
                    ))}
                  </div>
               </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
