import { useState, useEffect } from 'react';

interface UseAmapResult {
  loaded: boolean;
  error: string | null;
}

export function useAmap(): UseAmapResult {
  // Immediate check: static <script> tag in index.html loads SDK synchronously,
  // so window.AMap should already be available by the time React mounts.
  const [loaded, setLoaded] = useState(() => !!window.AMap);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loaded) return;

    let cancelled = false;
    let attempts = 0;

    function check() {
      if (cancelled) return;
      if (window.AMap) {
        setLoaded(true);
        return;
      }
      attempts++;
      if (attempts > 100) {
        setError('Amap SDK 加载超时，请检查网络连接');
        return;
      }
      setTimeout(check, 100);
    }

    check();

    return () => { cancelled = true; };
  }, [loaded]);

  return { loaded, error };
}
