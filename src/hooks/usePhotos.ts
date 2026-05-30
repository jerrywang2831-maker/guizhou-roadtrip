import { useState, useEffect, useCallback } from 'react';

export interface Photo {
  id: number;
  src: string;
  thumb: string;
  alt: string;
  photographer: string;
}

// Get a free API key at https://www.pexels.com/api/
const PEXELS_KEY = 'GbDJcx9JvHHxgwLq7ESkDgzeLUdbgsTvV39Cd9TerCj0w6H8e9ICRFln';

/**
 * Build a search query optimized for finding real photos of Chinese attractions.
 * Adds "China scenery" context to improve relevance.
 */
function buildSearchQuery(attractionName: string): string {
  const name = attractionName.replace(/[()（）]/g, '').trim();
  // For well-known attractions, use the name directly
  const famous = ['黄果树瀑布', '千户苗寨', '小七孔', '梵净山', '凤凰古城',
    '龙宫', '织金洞', '茅台镇', '恩施', '洪崖洞', '甲秀楼'];
  const isFamous = famous.some(f => name.includes(f));
  return isFamous ? name : `${name} 中国风景`;
}

async function fetchFromPexels(query: string): Promise<Photo[]> {
  const searchQuery = buildSearchQuery(query);
  const resp = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=10&locale=zh-CN`,
    { headers: { Authorization: PEXELS_KEY } }
  );
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  if (!data.photos?.length) throw new Error('NO_RESULTS');
  return data.photos.map((p: any) => ({
    id: p.id,
    src: p.src.large,
    thumb: p.src.medium,
    alt: p.alt || query,
    photographer: p.photographer,
  }));
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
      const results = await fetchFromPexels(query);
      setPhotos(results);
    } catch (e: any) {
      if (e.message === 'NO_RESULTS') {
        setError(`未找到 "${query}" 的相关照片`);
      } else {
        setError(e.message || '加载失败');
      }
    } finally {
      setLoading(false);
    }
  }, [query, enabled]);

  useEffect(() => {
    if (enabled) fetchPhotos();
  }, [fetchPhotos, enabled]);

  // Reset when query changes
  useEffect(() => {
    setPhotos([]);
    setError('');
    setLoading(false);
  }, [query]);

  return { photos, loading, error, retry: () => { setPhotos([]); setError(''); } };
}
