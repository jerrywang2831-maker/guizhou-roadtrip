import type { ItineraryDay, WeatherDay } from '../types';
import { W_ICONS, W_TEXT } from '../data/weather-icons';
import styles from './DayCard.module.css';

interface DayCardProps {
  day: ItineraryDay;
  isActive: boolean;
  routeMode: 'g' | 's';
  weather: WeatherDay | null;
  onClick: () => void;
}

export function DayCard({ day, isActive, routeMode, weather, onClick }: DayCardProps) {
  const r = routeMode === 'g' ? day.route_g : day.route_s;
  const icon = routeMode === 'g' ? '🛣' : '🚀';
  const routeStr = r.dist === '—' ? r.path : `${r.path} · ${r.dist} · ${r.time}`;

  return (
    <div className={`${styles.card} ${isActive ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.topRow}>
        <span className={`${styles.dayNum} ${isActive ? styles.dayNumActive : ''}`}>Day {day.day}</span>
        <span className={styles.date}>
          {day.date}
          {weather && (
            <span className={styles.weather} title={`${W_TEXT[weather.code] || '?'} ${weather.min}~${weather.max}°C 降水${weather.precip}%`}>
              {W_ICONS[weather.code] || '🌤'} {weather.min}°~{weather.max}°
            </span>
          )}
        </span>
      </div>
      <div className={styles.title}>{day.title}</div>
      <div className={styles.route}>{icon} {routeStr}</div>
      <div className={styles.meta}>
        <span>🏞 {day.sights.length}个景点</span>
        <span>🍜 {day.food.length}个美食</span>
      </div>
      <div className={styles.detail}>
        <div className={styles.detailSection}><strong>🏞 景点：</strong>{day.sights.join('、')}</div>
        <div className={styles.detailSection}><strong>🍜 美食：</strong>{day.food.join('、')}</div>
        <div className={styles.detailSection}><strong>🏨 住宿：</strong>{day.hotel}</div>
        {day.note && <div className={styles.detailSection}><strong>💡 提示：</strong>{day.note}</div>}
      </div>
    </div>
  );
}
