import { ITINERARY } from '../data/itinerary';
import styles from './MapContainer.module.css';

interface DayArrowsProps {
  activeDay: number;
  onPrev: () => void;
  onNext: () => void;
}

export function DayArrows({ activeDay, onPrev, onNext }: DayArrowsProps) {
  return (
    <div className={styles.dayArrows}>
      <button onClick={onPrev}>◀ 上一天</button>
      <span className={styles.dayLabel}>Day {ITINERARY[activeDay]?.day ?? activeDay + 1}</span>
      <button onClick={onNext}>下一天 ▶</button>
    </div>
  );
}
