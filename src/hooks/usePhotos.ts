import { useState, useEffect, useCallback } from 'react';

interface Photo {
  id: number;
  src: string;
  thumb: string;
  alt: string;
}

/**
 * Fetches photos from LoremFlickr (free, no API key).
 * Each call returns one random CC-licensed Flickr image for the given tags.
 * We make 10 parallel requests to get 10 different images.
 */
async function fetchFromLoremFlickr(query: string): Promise<Photo[]> {
  const tags = query
    .replace(/[()（）]/g, '')
    .replace(/\s+/g, ',')
    .split(',')
    .filter(Boolean)
    .slice(0, 3)
    .join(',');

  const promises = Array.from({ length: 10 }, (_, i) =>
    fetch(`https://loremflickr.com/json/400/300/${encodeURIComponent(tags || 'china,landscape')}?random=${i}`)
      .then((r) => r.json())
      .then((data: any) => ({
        id: i,
        src: `https://loremflickr.com/800/600/${encodeURIComponent(tags || 'china,landscape')}?random=${i}`,
        thumb: data.file || `https://loremflickr.com/400/300/${encodeURIComponent(tags || 'china,landscape')}?random=${i}`,
        alt: query,
      }))
      .catch(() => ({
        id: i,
        src: `https://loremflickr.com/800/600/${encodeURIComponent(tags || 'china,landscape')}?random=${i}`,
        thumb: `https://loremflickr.com/400/300/${encodeURIComponent(tags || 'china,landscape')}?random=${i}`,
        alt: query,
      }))
  );

  return Promise.all(promises);
}

export function usePhotos(query: string, enabled: boolean) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPhotos = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    try {
      const results = await fetchFromLoremFlickr(query);
      setPhotos(results);
    } catch (e: any) {
      setError(e.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, [query, enabled]);

  useEffect(() => {
    if (enabled) fetchPhotos();
  }, [fetchPhotos, enabled]);

  return { photos, loading, error, retry: fetchPhotos };
}
