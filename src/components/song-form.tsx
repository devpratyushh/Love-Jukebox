"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { youtubeSearch } from "@/ai/flows/youtube-search";
import { lyricSearch } from "@/ai/flows/lyric-search";
import type { Song } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Music, PlusCircle, Image as ImageIcon } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Song title is required."),
  artist: z.string().min(1, "Artist name is required."),
  message: z.string().optional(),
  date: z.date({ required_error: "A date is required." }),
  photo: z.instanceof(File).optional(),
  start: z.string().optional(),
  end: z.string().optional(),
});

type SongFormValues = z.infer<typeof formSchema>;

interface SongFormProps {
  onSongAdded: (song: Song) => void;
}

export function SongForm({ onSongAdded }: SongFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<SongFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "",
      message: "",
      date: new Date(),
      start: "",
      end: "",
    },
  });
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: SongFormValues) {
    setIsLoading(true);
    try {
      const [searchResult, lyricResult] = await Promise.all([
         youtubeSearch({
          title: values.title,
          artist: values.artist,
        }),
        lyricSearch({
          title: values.title,
          artist: values.artist,
          start: values.start,
          end: values.end,
        })
      ]);


      if (!searchResult || !searchResult.isAccurate || !searchResult.youtubeUrl) {
        throw new Error("Could not find an accurate match on YouTube.");
      }

      let photoUrl: string | undefined = undefined;
      if (values.photo) {
        photoUrl = photoPreview!; 
      }

      const newSong: Song = {
        id: crypto.randomUUID(),
        title: values.title,
        artist: values.artist,
        message: values.message,
        date: values.date.toISOString(),
        youtubeUrl: searchResult.youtubeUrl,
        photoUrl: photoUrl,
        lyrics: lyricResult?.lyrics,
      };

      onSongAdded(newSong);
      form.reset();
      setPhotoPreview(null);
      toast({
        title: "Song Added!",
        description: `${values.title} by ${values.artist} has been added to your jukebox.`,
      });
    } catch (error) {
      console.error("Error adding song:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error instanceof Error ? error.message : "There was a problem adding your song.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Music className="text-primary"/>
            Add a New Song
        </DialogTitle>
        <DialogDescription>Enter the details of the song you want to share.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Song Title</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., Lover" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., Taylor Swift" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
          </div>

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full md:w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Message (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., You looked like sunshine today"
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Lyric Snippet (optional)</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">Start Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 0:35" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">End Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1:15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo (optional)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" asChild>
                        <label htmlFor="photo-upload" className="cursor-pointer flex items-center gap-2">
                           <ImageIcon className="h-4 w-4" />
                            Upload Image
                        </label>
                    </Button>
                    <Input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                     {photoPreview && <img src={photoPreview} alt="Preview" className="h-16 w-16 object-cover rounded-md" />}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Song to Jukebox
              </>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
