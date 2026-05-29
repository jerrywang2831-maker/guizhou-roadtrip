import styles from './Header.module.css';

export function Header() {
  return (
    <div className={styles.header}>
      <h1>🚗 武汉 → 贵州 <span className={styles.accent}>15天深度自驾环线</span></h1>
      <div className={styles.meta}>5月30日 — 6月13日 · 全程约3300km · 国道优先 · 5人同行</div>
    </div>
  );
}
