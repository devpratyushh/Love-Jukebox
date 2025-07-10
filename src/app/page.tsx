
"use client";

import { useState } from "react";
import type { Song } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SongForm } from "@/components/song-form";
import { SongTimeline } from "@/components/song-timeline";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Music, PlusCircle } from "lucide-react";
import { YoutubePlaylist } from "@/components/youtube-playlist";

type SortOrder = "newest-first" | "oldest-first";

export default function Home() {
  const [songs, setSongs] = useLocalStorage<Song[]>("love-jukebox-songs", []);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest-first");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addSong = (newSong: Song) => {
    setSongs([newSong, ...songs]);
    setIsFormOpen(false); // Close dialog on successful submission
  };

  return (
    <>
      <main className="min-h-screen bg-background font-body text-foreground">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            <section className="lg:col-span-2 mb-12">
              <SongTimeline songs={songs} sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </section>
            <aside className="lg:col-span-1">
               <YoutubePlaylist songs={songs} />
            </aside>
          </div>

          <footer className="text-center mt-16 text-sm text-muted-foreground">
            <p>Made with &hearts; for my one and only.</p>
          </footer>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
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
    </>
  );
}
