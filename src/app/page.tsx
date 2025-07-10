
"use client";

import { useState } from "react";
import type { Song } from "@/types";
import { initialSongs } from "@/lib/static-data";
import { SongForm } from "@/components/song-form";
import { SongTimeline } from "@/components/song-timeline";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Music, PlusCircle } from "lucide-react";
import { YoutubePlaylist } from "@/components/youtube-playlist";
import { FlyingHearts } from "@/components/flying-hearts";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

type TimelineSortOrder = "newest-first" | "oldest-first";
export type PlaylistSortOrder = "newest-first" | "oldest-first" | "title-az" | "favorites-first";
export type TimelineFilter = "all" | "favorites";


export default function Home() {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [timelineSortOrder, setTimelineSortOrder] = useState<TimelineSortOrder>("newest-first");
  const [playlistSortOrder, setPlaylistSortOrder] = useState<PlaylistSortOrder>("favorites-first");
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const isMobile = useIsMobile();


  const addSong = (newSong: Song) => {
    setSongs([newSong, ...songs]);
    setIsFormOpen(false); // Close dialog on successful submission
  };

  const deleteSong = (id: string) => {
    setSongs(songs.filter((song) => song.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setSongs(songs.map(song => 
      song.id === id ? { ...song, isFavorite: !song.isFavorite } : song
    ));
  }

  const playSong = (song: Song) => {
    setActiveSong(song);
    if (isMobile) {
      setIsPlaylistOpen(true);
    }
  };

  const toggleDateFavorite = (date: string, shouldBeFavorite: boolean) => {
    setSongs(songs.map(song => {
      const songDate = new Date(song.date).toISOString().split('T')[0];
      if (songDate === date) {
        return { ...song, isFavorite: shouldBeFavorite };
      }
      return song;
    }));
  };
  
  const filteredTimelineSongs = timelineFilter === 'favorites'
    ? songs.filter(song => song.isFavorite)
    : songs;

  const sortedTimelineSongs = [...filteredTimelineSongs].sort((a, b) => {
    if (timelineSortOrder === 'oldest-first') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    // newest-first is default
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const favoriteSongs = songs.filter(s => s.isFavorite).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const otherSongs = [...songs].filter(s => !s.isFavorite).sort((a, b) => {
    switch (playlistSortOrder) {
      case 'oldest-first':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'title-az':
        return a.title.localeCompare(b.title);
      case 'newest-first':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'favorites-first':
      default: // Also default to favorites first
         return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
  
  const sortedOtherSongs = [...otherSongs]; // Already sorted by date as a fallback

  const allPlaylistSongs = [
      ...favoriteSongs, 
      ...(playlistSortOrder === 'favorites-first' 
          ? sortedOtherSongs 
          : [...favoriteSongs, ...otherSongs].sort((a, b) => {
              if (playlistSortOrder === 'oldest-first') return new Date(a.date).getTime() - new Date(b.date).getTime();
              if (playlistSortOrder === 'title-az') return a.title.localeCompare(b.title);
              return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
      )
  ];


  return (
    <div className="relative bg-background h-screen overflow-hidden flex flex-col">
      <FlyingHearts />
      <main className="relative z-20 font-body text-foreground flex flex-col flex-1 min-h-0">
        <div className="container mx-auto px-4 pt-8">
          <header className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-4">
              <Heart className="h-10 w-10 text-primary animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Love Jukebox
              </h1>
              <Music className="h-10 w-10 text-accent" />
            </div>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A daily mixtape of the songs that tell our story.
            </p>
          </header>
        </div>
        
        <div className="flex-1 container mx-auto px-4 pb-8 grid grid-cols-1 lg:grid-cols-6 lg:gap-8 min-h-0">
          <section className="lg:col-span-4 flex flex-col min-h-0">
             <SongTimeline 
                songs={sortedTimelineSongs} 
                sortOrder={timelineSortOrder} 
                setSortOrder={setTimelineSortOrder}
                timelineFilter={timelineFilter}
                setTimelineFilter={setTimelineFilter}
                onDeleteSong={deleteSong}
                onToggleDateFavorite={toggleDateFavorite}
                onPlaySong={playSong}
              />
          </section>
          <aside className="lg:col-span-2 hidden lg:flex flex-col">
             <div className="flex flex-col h-full">
                <YoutubePlaylist 
                  favoriteSongs={favoriteSongs}
                  otherSongs={otherSongs}
                  sortOrder={playlistSortOrder}
                  setSortOrder={setPlaylistSortOrder}
                  onToggleFavorite={toggleFavorite}
                  activeSong={activeSong}
                  setActiveSong={setActiveSong}
                />
             </div>
          </aside>
        </div>

      </main>

      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <Sheet open={isPlaylistOpen} onOpenChange={setIsPlaylistOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg h-16 w-16 p-0 lg:hidden">
              <Music className="h-8 w-8" />
              <span className="sr-only">Open Playlist</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="w-full h-[80vh] p-0">
             <YoutubePlaylist 
                favoriteSongs={favoriteSongs}
                otherSongs={otherSongs}
                sortOrder={playlistSortOrder}
                setSortOrder={setPlaylistSortOrder}
                onToggleFavorite={toggleFavorite}
                activeSong={activeSong}
                setActiveSong={setActiveSong}
              />
          </SheetContent>
        </Sheet>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg h-16 w-16 p-0">
              <PlusCircle className="h-8 w-8" />
              <span className="sr-only">Add New Song</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
             <SongForm onSongAdded={addSong} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
