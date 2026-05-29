import styles from './MapContainer.module.css';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFocusOverview: () => void;
}

export function MapControls({ onZoomIn, onZoomOut, onFocusOverview }: MapControlsProps) {
  return (
    <div className={styles.mapCtrl}>
      <button onClick={onZoomIn} title="放大">+</button>
      <button onClick={onZoomOut} title="缩小">−</button>
      <button onClick={onFocusOverview} title="查看全景" style={{ fontSize: 14 }}>🏠</button>
    </div>
  );
}
