import { useState, useCallback } from 'react';
import { ITINERARY } from '../data/itinerary';
import { useWeather } from '../hooks/useWeather';
import { useKeyboardNav } from '../hooks/useKeyboardNav';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MapContainer } from './MapContainer';
import styles from './App.module.css';

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [routeMode, setRouteMode] = useState<'g' | 's'>('g');
  const [showMap, setShowMap] = useState(true);
  const [overviewTrigger, setOverviewTrigger] = useState(0);
  const weatherCache = useWeather();

  const selectDay = useCallback((dayIndex: number) => {
    setActiveDay(dayIndex);
  }, []);

  const focusOverview = useCallback(() => {
    setOverviewTrigger(prev => prev + 1);
  }, []);

  const prevDay = useCallback(() => {
    setActiveDay(prev => (prev - 1 + ITINERARY.length) % ITINERARY.length);
  }, []);

  const nextDay = useCallback(() => {
    setActiveDay(prev => (prev + 1) % ITINERARY.length);
  }, []);

  const toggleRouteMode = useCallback(() => {
    setRouteMode(prev => prev === 'g' ? 's' : 'g');
  }, []);

  const toggleMapView = useCallback(() => {
    setShowMap(prev => !prev);
  }, []);

  useKeyboardNav(prevDay, nextDay);

  return (
    <div className={styles.app}>
      <Header showMap={showMap} onToggleMap={toggleMapView} />
      <div className={styles.main}>
        <Sidebar
          activeDay={activeDay}
          routeMode={routeMode}
          weatherCache={weatherCache}
          showMap={showMap}
          onSelectDay={selectDay}
          onPrevDay={prevDay}
          onNextDay={nextDay}
          onToggleRoute={toggleRouteMode}
          onFocusOverview={focusOverview}
        />
        {showMap && (
          <MapContainer
            activeDay={activeDay}
            routeMode={routeMode}
            onSelectDay={selectDay}
            onPrevDay={prevDay}
            onNextDay={nextDay}
            overviewTrigger={overviewTrigger}
          />
        )}
      </div>
    </div>
  );
}
