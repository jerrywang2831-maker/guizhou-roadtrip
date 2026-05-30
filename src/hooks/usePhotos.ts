import { useState, useEffect, useCallback } from 'react';

interface Photo {
  id: number;
  src: string;
  thumb: string;
  alt: string;
}

/**
 * Generate 10 Unsplash Source image URLs using the search query.
 * No API calls — images load directly as <img> sources.
 * Each URL gets a unique cache-busting seed to ensure different images.
 */
function generateUrls(query: string): Photo[] {
  const tags = query
    .replace(/[()（）]/g, '')
    .trim() || 'china,landscape';

  return Array.from({ length: 10 }, (_, i) => {
    const seed = i * 37 + 11;
    const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(tags)}&sig=${seed}`;
    const thumb = `https://source.unsplash.com/400x300/?${encodeURIComponent(tags)}&sig=${seed}`;
    return { id: i, src: url, thumb, alt: query };
  });
}

export function usePhotos(query: string, enabled: boolean) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchPhotos = useCallback(() => {
    if (!enabled || loaded) return;
    setLoading(true);
    // Generate URLs synchronously — no network call needed
    const results = generateUrls(query);
    setPhotos(results);
    setLoading(false);
    setLoaded(true);
  }, [query, enabled, loaded]);

  useEffect(() => {
    if (enabled) fetchPhotos();
  }, [fetchPhotos, enabled]);

  // Reset when query changes
  useEffect(() => {
    setPhotos([]);
    setLoaded(false);
    setLoading(false);
  }, [query]);

  return { photos, loading, error: '', retry: () => { setLoaded(false); setPhotos([]); } };
}
