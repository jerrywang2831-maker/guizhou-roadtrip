import { useCallback } from 'react';
import type { ItineraryDay, WeatherDay } from '../types';
import { ITINERARY } from '../data/itinerary';
import { DayCard } from './DayCard';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeDay: number;
  routeMode: 'g' | 's';
  weatherCache: Record<number, WeatherDay[]>;
  onSelectDay: (day: number) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToggleRoute: () => void;
}

export function Sidebar({
  activeDay, routeMode, weatherCache,
  onSelectDay, onPrevDay, onNextDay, onToggleRoute,
}: SidebarProps) {
  const getWeatherForDay = useCallback((dayObj: ItineraryDay): WeatherDay | null => {
    const stopId = dayObj.stopTo >= 0 ? dayObj.stopTo : (dayObj.stopFrom >= 0 ? dayObj.stopFrom : -1);
    if (stopId < 0 || !weatherCache[stopId]) return null;
    const dayIdx = dayObj.day - 1;
    if (dayIdx >= weatherCache[stopId].length) return null;
    return weatherCache[stopId][dayIdx];
  }, [weatherCache]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>📋 行程总览</h2>
        <p>武汉→常德→凤凰→梵净山→西江→荔波→贵阳→黄果树→遵义→茅台→恩施→武汉</p>
        <div className={styles.routeModeToggle}>
          <span className={`${styles.toggleLabel} ${routeMode === 'g' ? styles.active : ''}`}>🛣 国道优先</span>
          <label className={styles.toggleSwitch}>
            <input type="checkbox" checked={routeMode === 's'} onChange={onToggleRoute} />
            <span className={styles.toggleSlider} />
          </label>
          <span className={`${styles.toggleLabel} ${routeMode === 's' ? styles.active : ''}`}>🚀 高速优先</span>
        </div>
      </div>
      <div className={styles.dayNav}>
        <button onClick={onPrevDay} title="上一天">◀ 上一天</button>
        <button onClick={onNextDay} title="下一天">下一天 ▶</button>
        <button onClick={() => onSelectDay(0)} style={{ flex: 0.6 }}>🗺 全景</button>
      </div>
      <div className={styles.dayList}>
        {ITINERARY.map((day, i) => (
          <DayCard
            key={day.day}
            day={day}
            isActive={i === activeDay}
            routeMode={routeMode}
            weather={getWeatherForDay(day)}
            onClick={() => onSelectDay(i)}
          />
        ))}
      </div>
    </div>
  );
}
