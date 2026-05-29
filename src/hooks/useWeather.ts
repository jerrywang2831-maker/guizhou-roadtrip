import { useState, useEffect } from 'react';
import type { WeatherDay } from '../types';
import { STOPS } from '../data/stops';
import { ITINERARY } from '../data/itinerary';

export function useWeather(): Record<number, WeatherDay[]> {
  const [weatherCache, setWeatherCache] = useState<Record<number, WeatherDay[]>>({});

  useEffect(() => {
    const stopsToFetch: number[] = [];
    const seen = new Set<number>();
    ITINERARY.forEach(d => {
      if (d.stopTo >= 0 && !seen.has(d.stopTo) && d.stopTo !== d.stopFrom) {
        seen.add(d.stopTo);
        stopsToFetch.push(d.stopTo);
      }
    });

    let cancelled = false;

    async function fetchAll() {
      for (const stopId of stopsToFetch) {
        if (cancelled) break;
        const stop = STOPS[stopId];
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${stop.lat}&longitude=${stop.lng}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Asia/Shanghai&forecast_days=16`;
        try {
          const resp = await fetch(url);
          const data = await resp.json();
          const days: WeatherDay[] = data.daily.time.map((t: string, i: number) => ({
            date: t,
            max: Math.round(data.daily.temperature_2m_max[i]),
            min: Math.round(data.daily.temperature_2m_min[i]),
            code: data.daily.weather_code[i],
            precip: data.daily.precipitation_probability_max[i],
          }));
          if (!cancelled) {
            setWeatherCache(prev => ({ ...prev, [stopId]: days }));
          }
        } catch (e) {
          console.warn('Weather fetch failed for', stop.name, e);
        }
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return weatherCache;
}
