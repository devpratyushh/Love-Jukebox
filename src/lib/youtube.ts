export function getYoutubeEmbedUrl(url: string): string | null {
  let videoId: string | null = null;
  
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.substring(1);
    }
  } catch (error) {
    // a non-url string might be passed
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
    if(match) videoId = match[1];
  }

  if (videoId) {
    // Sanitize to prevent potential XSS
    const sanitizedVideoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
    return `https://www.youtube.com/embed/${sanitizedVideoId}`;
  }

  return null;
}
