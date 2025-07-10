
import type { Song } from "@/types";
import { getYoutubeThumbnailUrl } from "./youtube";

const songsWithThumbnails = (songs: Omit<Song, 'id' | 'thumbnailUrl'>[]): Song[] => {
    return songs.map((song, index) => ({
        ...song,
        id: `${index + 1}`,
        thumbnailUrl: getYoutubeThumbnailUrl(song.youtubeUrl) ?? undefined,
        isFavorite: song.isFavorite || false,
    }));
}


export const initialSongs: Song[] = songsWithThumbnails([
    {
        title: "A Thousand Years",
        artist: "Christina Perri",
        message: "For my dearest love",
        date: new Date().toISOString(), // Today's date
        youtubeUrl: "https://www.youtube.com/watch?v=QgaTQ5-XfAs",
        photoUrl: undefined, // or a photo URL if you have one
        lyrics: undefined, // or lyrics if you have them
        start: "0:35",
        end: "1:15",
        isFavorite: true,
    },
    // Add more initial songs here
]);
