import styles from './MapContainer.module.css';

export function Legend() {
  return (
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <span className={styles.legendDot} style={{ background: '#27ae60' }} /> 起点 · 武汉
      </div>
      <div className={styles.legendItem}>
        <span className={styles.legendDot} style={{ background: '#2980b9' }} /> 每日目的地
      </div>
      <div className={styles.legendItem}>
        <span className={styles.legendDot} style={{ background: '#e94560' }} /> 终点 · 武汉
      </div>
      <div className={styles.legendItem}>
        <span className={styles.legendLine} /> 当前选中段
      </div>
    </div>
  );
}
