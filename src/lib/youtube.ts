export function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  let videoId: string | null = null;
  
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.substring(1).split('?')[0];
    }
  } catch (error) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
    const match = url.match(regex);
    if(match) videoId = match[1];
  }

  // Sanitize to prevent potential XSS
  return videoId ? videoId.replace(/[^a-zA-Z0-9_-]/g, '') : null;
}


export function getYoutubeEmbedUrl(url: string): string | null {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export function createYoutubePlaylistUrl(urls: string[]): string | null {
  if (!urls || urls.length === 0) return null;

  const videoIds = urls.map(getYoutubeVideoId).filter(Boolean) as string[];

  if (videoIds.length === 0) return null;

  const firstVideoId = videoIds[0];
  const playlistIds = videoIds.slice(1);

  let playlistUrl = `https://www.youtube.com/embed/${firstVideoId}`;

  if (playlistIds.length > 0) {
    playlistUrl += `?playlist=${playlistIds.join(',')}`;
  }

  return playlistUrl;
}
