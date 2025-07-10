"use client";

import { useState } from "react";
import type { Song } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SongForm } from "@/components/song-form";
import { SongTimeline } from "@/components/song-timeline";
import { Heart, Music } from "lucide-react";

type SortOrder = "newest-first" | "oldest-first" | "artist-az";

export default function Home() {
  const [songs, setSongs] = useLocalStorage<Song[]>("love-jukebox-songs", []);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest-first");

  const addSong = (newSong: Song) => {
    setSongs([newSong, ...songs]);
  };

  return (
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

        <section className="mb-12 max-w-4xl mx-auto">
          <SongForm onSongAdded={addSong} />
        </section>

        <section>
          <SongTimeline songs={songs} sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </section>

        <footer className="text-center mt-16 text-sm text-muted-foreground">
            <p>Made with &hearts; for my one and only.</p>
        </footer>
      </div>
    </main>
  );
}
