import { useState, useCallback } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import styles from './PhotoGallery.module.css';

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #f5576c 0%, #ff6f00 100%)',
  'linear-gradient(135deg, #667eea 0%, #2af598 100%)',
];

function FallbackThumb({ label, index }: { label: string; index: number }) {
  return (
    <div className={styles.fallback} style={{ background: GRADIENTS[index % GRADIENTS.length] }}>
      {label.slice(0, 8)}
    </div>
  );
}

interface PhotoGalleryProps {
  query: string;
  enabled: boolean;
}

export function PhotoGallery({ query, enabled }: PhotoGalleryProps) {
  const { photos, loading, error, retry } = usePhotos(query, enabled);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const openLightbox = useCallback((idx: number) => {
    if (!failed.has(idx)) setLightboxIndex(idx);
  }, [failed]);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null)),
    [photos.length]
  );
  const nextImage = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null)),
    [photos.length]
  );

  const handleImgError = useCallback((idx: number) => {
    setFailed((prev) => new Set(prev).add(idx));
  }, []);

  if (loading) {
    return (
      <div className={styles.gallery}>
        <div className={styles.loading}>
          <span className={styles.loadingSpinner} />
          正在搜索「{query}」的真实照片...
        </div>
      </div>
    );
  }

  // Show error with retry or API key hint
  if (error && photos.length === 0) {
    const isKeyHint = error.includes('Pexels');
    return (
      <div className={styles.gallery}>
        <div className={styles.error}>
          {isKeyHint ? (
            <>📷 {error} — 注册地址：<a href="https://www.pexels.com/api/" target="_blank" rel="noopener">pexels.com/api</a></>
          ) : (
            <>📷 {error} <button onClick={retry}>重试</button></>
          )}
        </div>
      </div>
    );
  }

  if (photos.length === 0) return null;

  const loadedPhotos = photos.filter((_, i) => !failed.has(i));

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryHeader}>
        <span className={styles.galleryTitle}>📷 {query}</span>
        <span className={styles.galleryCount}>{photos.length}张真实照片</span>
      </div>
      <div className={styles.scroll}>
        {photos.map((p, i) =>
          failed.has(i) ? (
            <FallbackThumb key={p.id} label={query} index={i} />
          ) : (
            <img
              key={p.id}
              src={p.thumb}
              alt={p.alt}
              className={styles.thumb}
              loading="lazy"
              onClick={() => openLightbox(i)}
              onError={() => handleImgError(i)}
            />
          )
        )}
      </div>

      {lightboxIndex !== null && !failed.has(lightboxIndex) && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>×</button>
          {loadedPhotos.length > 1 && (
            <>
              <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={(e) => { e.stopPropagation(); prevImage(); }}>◀</button>
              <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={(e) => { e.stopPropagation(); nextImage(); }}>▶</button>
            </>
          )}
          <img
            src={photos[lightboxIndex].src}
            alt={photos[lightboxIndex].alt}
            onClick={(e) => e.stopPropagation()}
            onError={() => handleImgError(lightboxIndex)}
          />
          <div className={styles.lightboxInfo}>
            {lightboxIndex + 1} / {photos.length} · Photo by {photos[lightboxIndex]?.photographer || 'Pexels'}
          </div>
        </div>
      )}
    </div>
  );
}
