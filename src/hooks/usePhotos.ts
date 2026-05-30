import { useState, useEffect, useCallback } from 'react';

export interface Photo {
  id: number;
  src: string;
  thumb: string;
  alt: string;
}

/**
 * Generate 10 Picsum photo URLs (free, no API key, works globally).
 * Picsum serves random CC-licensed photos.
 */
function generateUrls(_query: string): Photo[] {
  return Array.from({ length: 10 }, (_, i) => {
    const seed = i * 53 + 7;
    return {
      id: i,
      src: `https://picsum.photos/seed/${seed}/800/600`,
      thumb: `https://picsum.photos/seed/${seed}/400/300`,
      alt: _query,
    };
  });
}

export function usePhotos(query: string, enabled: boolean) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchPhotos = useCallback(() => {
    if (!enabled || loaded) return;
    setLoading(true);
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

  return {
    photos,
    loading,
    error: '',
    retry: () => { setLoaded(false); setPhotos([]); },
  };
}
