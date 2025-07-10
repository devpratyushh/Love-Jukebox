
import type { Song } from "@/types";

export const initialSongs: Song[] = [
  {
    id: "1",
    title: "Perfect",
    artist: "Ed Sheeran",
    date: "2023-10-26T00:00:00.000Z",
    message: "For the one who makes everything perfect.",
    youtubeUrl: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
    photoUrl: "https://placehold.co/600x400.png",
    lyrics: `I found a love for me
Darling, just dive right in and follow my lead
Well, I found a girl, beautiful and sweet
Oh, I never knew you were the someone waiting for me`,
    start: "0:55",
  },
  {
    id: "2",
    title: "All of Me",
    artist: "John Legend",
    date: "2023-10-27T00:00:00.000Z",
    message: "Because you love all my curves and all my edges.",
    youtubeUrl: "https://www.youtube.com/watch?v=450p7goxZqg",
    photoUrl: "https://placehold.co/600x400.png",
    lyrics: `'Cause all of me
Loves all of you
Love your curves and all your edges
All your perfect imperfections`,
    start: "1:05",
  },
  {
    id: "3",
    title: "A Thousand Years",
    artist: "Christina Perri",
    date: "2023-10-27T00:00:00.000Z",
    message: "I have loved you for a thousand years, I'll love you for a thousand more.",
    youtubeUrl: "https://www.youtube.com/watch?v=rtOvBOTyX00",
    photoUrl: "https://placehold.co/600x400.png",
    lyrics: `Darling, don't be afraid
I have loved you for a thousand years
I'll love you for a thousand more`,
    start: "1:25"
  }
];
