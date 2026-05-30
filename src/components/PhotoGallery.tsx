import { useState, useCallback } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import styles from './PhotoGallery.module.css';

interface PhotoGalleryProps {
  /** Search query — typically the main attraction name */
  query: string;
  /** Only fetch when the day card is expanded */
  enabled: boolean;
}

export function PhotoGallery({ query, enabled }: PhotoGalleryProps) {
  const { photos, loading, error, retry } = usePhotos(query, enabled);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null)),
    [photos.length]
  );
  const nextImage = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null)),
    [photos.length]
  );

  if (loading) {
    return (
      <div className={styles.gallery}>
        <div className={styles.loading}>
          <span className={styles.loadingSpinner} />
          正在加载 {query} 的照片...
        </div>
      </div>
    );
  }

  if (error && photos.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.error}>
          📷 {error}
          <button onClick={retry}>重试</button>
        </div>
      </div>
    );
  }

  if (photos.length === 0) return null;

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryHeader}>
        <span className={styles.galleryTitle}>📷 {query}</span>
        <span className={styles.galleryCount}>{photos.length}张</span>
      </div>
      <div className={styles.scroll}>
        {photos.map((p, i) => (
          <img
            key={p.id}
            src={p.thumb}
            alt={p.alt}
            className={styles.thumb}
            loading="lazy"
            onClick={() => openLightbox(i)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>×</button>
          {photos.length > 1 && (
            <>
              <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={(e) => { e.stopPropagation(); prevImage(); }}>◀</button>
              <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={(e) => { e.stopPropagation(); nextImage(); }}>▶</button>
            </>
          )}
          <img
            src={photos[lightboxIndex].src}
            alt={photos[lightboxIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <div className={styles.lightboxInfo}>
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
