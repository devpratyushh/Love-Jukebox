
"use client";

import type { Song } from "@/types";
import { createYoutubePlaylistUrl } from "@/lib/youtube";
import { Youtube } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getYoutubeEmbedUrl } from "@/lib/youtube";


export function YoutubePlaylist({ songs }: { songs: Song[] }) {
  const playlistUrl = createYoutubePlaylistUrl(songs.map(s => s.youtubeUrl));

  if (songs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-headline font-bold text-primary mb-4 shrink-0">Our Playlist</h2>
      
      {/* Desktop View: Iframe Playlist */}
      <div className="hidden lg:block flex-1 min-h-0">
        {playlistUrl ? (
          <div className="h-full rounded-lg overflow-hidden border shadow-sm">
            <iframe
              width="560"
              height="315"
              src={playlistUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-card rounded-lg border">
            <p className="text-muted-foreground">Could not load playlist.</p>
          </div>
        )}
      </div>

      {/* Mobile View: Horizontal Scroll */}
      <div className="block lg:hidden">
         <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {songs.map((song) => {
              const embedUrl = getYoutubeEmbedUrl(song.youtubeUrl);
              return (
                <CarouselItem key={song.id} className="basis-11/12 md:basis-1/2">
                  <div className="p-1">
                     {embedUrl ? (
                      <div className="aspect-video rounded-lg overflow-hidden border shadow-sm">
                        <iframe
                          src={embedUrl}
                          title={song.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    ) : (
                       <div className="aspect-video flex items-center justify-center h-full bg-card rounded-lg border">
                          <p className="text-muted-foreground text-sm">Video not available</p>
                        </div>
                    )}
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
