
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


export const initialSongs: Song[] = [];
