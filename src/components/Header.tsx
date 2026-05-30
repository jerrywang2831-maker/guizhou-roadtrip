import styles from './Header.module.css';

interface HeaderProps {
  showMap: boolean;
  onToggleMap: () => void;
}

export function Header({ showMap, onToggleMap }: HeaderProps) {
  return (
    <div className={styles.header}>
      <h1>🚗 武汉 → 贵州 <span className={styles.accent}>15天深度自驾环线</span></h1>
      <div className={styles.headerRight}>
        <button className={styles.viewToggle} onClick={onToggleMap} title={showMap ? '切换到纯行程视图' : '切换到地图视图'}>
          {showMap ? '📋 纯行程' : '🗺️ 地图'}
        </button>
        <div className={styles.meta}>5月31日 — 6月14日 · 全程约3300km · 国道优先 · 5人同行</div>
      </div>
    </div>
  );
}
