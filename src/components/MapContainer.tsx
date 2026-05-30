import { useRef, useState, useEffect, useCallback } from 'react';
import { useAmap } from '../hooks/useAmap';
import { STOPS } from '../data/stops';
import { SEGMENTS } from '../data/segments';
import { ITINERARY } from '../data/itinerary';
import { MapControls } from './MapControls';
import { Legend } from './Legend';
import { DayArrows } from './DayArrows';
import styles from './MapContainer.module.css';

const DRIVING_COLORS = [
  '#3498db', '#2ecc71', '#1abc9c', '#9b59b6', '#e74c3c',
  '#f39c12', '#e91e63', '#00bcd4', '#ff5722', '#8bc34a',
  '#3f51b5', '#ff9800', '#009688', '#673ab7', '#cddc39',
  '#795548', '#e040fb', '#00e676',
];

interface MapContainerProps {
  activeDay: number;
  routeMode: 'g' | 's';
  onSelectDay: (day: number) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  overviewTrigger: number;
}

interface PolylineEntry {
  polyline: AMapPolyline;
  segIndex: number;
  color: string;
}

export function MapContainer({ activeDay, routeMode, onSelectDay, onPrevDay, onNextDay, overviewTrigger }: MapContainerProps) {
  const { loaded, error: loadError } = useAmap();
  const [initError, setInitError] = useState<string | null>(null);
  const mapRef = useRef<AMapMap | null>(null);
  const markersRef = useRef<Array<{
    marker: AMapMarker;
    infoWindow: AMapInfoWindow;
    stopIndex: number;
    element: HTMLElement | null;
  }>>([]);
  const routeLinesGRef = useRef<PolylineEntry[]>([]);
  const routeLinesSRef = useRef<PolylineEntry[]>([]);
  const routesReadyRef = useRef(false);
  // Store the latest routeMode in a ref so setTimeout callbacks read the current value
  const routeModeRef = useRef(routeMode);
  routeModeRef.current = routeMode;

  const highlightDay = useCallback((dayIndex: number) => {
    const day = ITINERARY[dayIndex];
    if (!day) return;
    const lines = routeModeRef.current === 'g' ? routeLinesGRef.current : routeLinesSRef.current;

    // Reset all lines to default style
    lines.forEach(p => {
      if (!p?.polyline) return;
      p.polyline.setOptions({
        strokeWeight: 4, strokeOpacity: 0.5,
        strokeColor: p.color, zIndex: 50,
      });
    });

    // Reset all markers
    markersRef.current.forEach(m => {
      if (m.element) m.element.classList.remove(styles.markerHighlight);
    });

    // Highlight current segment
    if (day.segIndex >= 0 && lines[day.segIndex]) {
      lines[day.segIndex].polyline.setOptions({
        strokeWeight: 8, strokeOpacity: 1,
        strokeColor: '#f39c12', zIndex: 90,
      });
    }

    // Highlight current stop markers
    [day.stopFrom, day.stopTo].forEach(si => {
      const m = markersRef.current.find(mk => mk.stopIndex === si);
      if (m?.element) m.element.classList.add(styles.markerHighlight);
    });
  }, []);

  // Initialize map once Amap SDK is ready
  useEffect(() => {
    if (!loaded || mapRef.current) return;

    try {
      const map = new window.AMap.Map('map', {
        center: [110.5, 29.5],
        zoom: 7,
      });
      mapRef.current = map;

      // Create markers
      STOPS.forEach((stop, i) => {
        const color = stop.type === 'start' ? '#27ae60' :
                      stop.type === 'highlight' ? '#e94560' : '#2980b9';
        const startClass = stop.type === 'start' ? styles.markerStart : '';
        const endClass = stop.type === 'highlight' ? styles.markerEnd : '';

        const content = `<div class="${styles.customMarker} ${startClass} ${endClass}" style="background:${color}" id="marker-${i}">${i + 1}</div>`;

        const marker = new window.AMap.Marker({
          position: [stop.lng, stop.lat],
          content,
          anchor: 'center',
          offset: new window.AMap.Pixel(0, 0),
          zIndex: stop.type === 'start' ? 110 : stop.type === 'highlight' ? 105 : 100,
        });

        const relevantDays = ITINERARY.filter(d => d.stopTo === i || (d.stopFrom === i && i > 0));
        let infoHTML = `<div class="amap-info-content"><h4>${stop.name}</h4>`;
        relevantDays.forEach(d => {
          infoHTML += `<p>📅 Day ${d.day}：${d.title}<br>🏞 ${d.sights.join('、')}<br>🍜 ${d.food.slice(0, 3).join('、')}</p>`;
        });
        infoHTML += '</div>';

        const infoWindow = new window.AMap.InfoWindow({
          content: infoHTML,
          offset: new window.AMap.Pixel(0, -35),
        });

        marker.on('click', () => {
          infoWindow.open(map, marker.getPosition());
          const firstDay = ITINERARY.findIndex(d => d.stopTo === i || d.stopFrom === i);
          if (firstDay >= 0) onSelectDay(firstDay);
        });

        marker.setMap(map);
        markersRef.current.push({
          marker, infoWindow, stopIndex: i,
          element: document.getElementById(`marker-${i}`),
        });
      });

    // Draw all routes
    window.AMap.plugin('AMap.Driving', () => {
      let completedG = 0, completedS = 0;
      const total = SEGMENTS.length;

      function createPolyline(path: [number, number][], color: string, style: string) {
        return new window.AMap.Polyline({
          path, strokeColor: color, strokeWeight: 4,
          strokeOpacity: 0.5, lineJoin: 'round', zIndex: 50,
          strokeStyle: style,
        });
      }

      function extractPath(result: AMapDrivingResult): [number, number][] | null {
        if (result?.routes?.length > 0) {
          const steps = result.routes[0].steps;
          let path: [number, number][] = [];
          steps.forEach(s => { path = path.concat(s.path); });
          return path;
        }
        return null;
      }

      function straightFallback(segIdx: number): [number, number][] {
        const seg = SEGMENTS[segIdx];
        return [[STOPS[seg.from].lng, STOPS[seg.from].lat], [STOPS[seg.to].lng, STOPS[seg.to].lat]];
      }

      SEGMENTS.forEach((seg, idx) => {
        const origin = new window.AMap.LngLat(STOPS[seg.from].lng, STOPS[seg.from].lat);
        const dest = new window.AMap.LngLat(STOPS[seg.to].lng, STOPS[seg.to].lat);
        const color = DRIVING_COLORS[idx % DRIVING_COLORS.length];
        const fbPath = straightFallback(idx);

        // 国道: LEAST_FEE → LEAST_TIME → LEAST_DISTANCE (3-level fallback)
        setTimeout(() => {
          function setG(p: [number, number][], s: string) {
            const pl = createPolyline(p, color, s);
            pl.setMap(routeModeRef.current === 'g' ? map : null);
            routeLinesGRef.current[idx] = { polyline: pl, segIndex: idx, color };
            completedG++;
            if (completedG >= total && completedS >= total) {
              routesReadyRef.current = true;
              highlightDay(0);
            }
          }
          function searchG(policyVal: number, cb: (path: [number, number][] | null) => void) {
            const d = new window.AMap.Driving({ policy: policyVal });
            d.search(origin, dest, (status, result) => {
              cb(status === 'complete' ? extractPath(result) : null);
            });
          }
          searchG(window.AMap.DrivingPolicy.LEAST_FEE, (path) => {
            if (path) { setG(path, 'solid'); return; }
            searchG(window.AMap.DrivingPolicy.LEAST_TIME, (path2) => {
              if (path2) { setG(path2, 'solid'); return; }
              searchG(window.AMap.DrivingPolicy.LEAST_DISTANCE, (path3) => {
                setG(path3 || fbPath, path3 ? 'solid' : 'dashed');
              });
            });
          });
        }, idx * 500);

        // 高速: LEAST_TIME → LEAST_DISTANCE → LEAST_FEE (3-level fallback, same as 国道)
        setTimeout(() => {
          function setS(p: [number, number][], s: string) {
            const pl = createPolyline(p, color, s);
            pl.setMap(routeModeRef.current === 's' ? map : null);
            routeLinesSRef.current[idx] = { polyline: pl, segIndex: idx, color };
            completedS++;
            if (completedG >= total && completedS >= total) {
              routesReadyRef.current = true;
              highlightDay(0);
            }
          }
          function searchS(policyVal: number, cb: (path: [number, number][] | null) => void) {
            const d = new window.AMap.Driving({ policy: policyVal });
            d.search(origin, dest, (status, result) => {
              cb(status === 'complete' ? extractPath(result) : null);
            });
          }
          searchS(window.AMap.DrivingPolicy.LEAST_TIME, (path) => {
            if (path) { setS(path, 'solid'); return; }
            searchS(window.AMap.DrivingPolicy.LEAST_DISTANCE, (path2) => {
              if (path2) { setS(path2, 'solid'); return; }
              searchS(window.AMap.DrivingPolicy.LEAST_FEE, (path3) => {
                setS(path3 || fbPath, path3 ? 'solid' : 'dashed');
              });
            });
          });
        }, idx * 800 + 400);
      });
    });
    } catch (e) {
      console.error('Map init error:', e);
      setInitError(e instanceof Error ? e.message : '地图初始化失败');
    }
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh marker element references after mount
  useEffect(() => {
    if (!loaded) return;
    markersRef.current.forEach(m => {
      m.element = document.getElementById(`marker-${m.stopIndex}`);
    });
  }, [loaded]);

  // Handle activeDay changes
  useEffect(() => {
    if (!mapRef.current || !routesReadyRef.current) return;
    const day = ITINERARY[activeDay];
    if (!day) return;
    const destStop = STOPS[day.stopTo];
    mapRef.current.panTo([destStop.lng, destStop.lat]);
    mapRef.current.setZoom(10);
    highlightDay(activeDay);
  }, [activeDay, highlightDay]);

  // Handle route mode changes
  useEffect(() => {
    if (!mapRef.current) return;
    const hideLines = routeMode === 'g' ? routeLinesSRef.current : routeLinesGRef.current;
    const showLines = routeMode === 'g' ? routeLinesGRef.current : routeLinesSRef.current;
    hideLines.forEach(p => { if (p?.polyline) p.polyline.setMap(null); });
    showLines.forEach(p => { if (p?.polyline) p.polyline.setMap(mapRef.current); });
    if (routesReadyRef.current) highlightDay(activeDay);
  }, [routeMode, activeDay, highlightDay]);

  // Handle overview trigger from sidebar 全景 button
  useEffect(() => {
    if (overviewTrigger > 0 && mapRef.current) {
      mapRef.current.setZoomAndCenter(7, [108.5, 28.0]);
      [routeLinesGRef, routeLinesSRef].forEach(lines => {
        lines.current.forEach(p => {
          if (p?.polyline) {
            p.polyline.setOptions({ strokeWeight: 4, strokeOpacity: 0.5, strokeColor: p.color, zIndex: 50 });
          }
        });
      });
      markersRef.current.forEach(m => {
        if (m.element) m.element.classList.remove(styles.markerHighlight);
      });
    }
  }, [overviewTrigger]);

  const handleZoomIn = useCallback(() => mapRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => mapRef.current?.zoomOut(), []);

  const handleFocusOverview = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.setZoomAndCenter(7, [108.5, 28.0]);
    [routeLinesGRef, routeLinesSRef].forEach(lines => {
      lines.current.forEach(p => {
        if (p?.polyline) {
          p.polyline.setOptions({ strokeWeight: 4, strokeOpacity: 0.5, strokeColor: p.color, zIndex: 50 });
        }
      });
    });
    markersRef.current.forEach(m => {
      if (m.element) m.element.classList.remove(styles.markerHighlight);
    });
  }, []);

  if (loadError || initError) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.errorOverlay}>
          <p>❌ {initError || 'Amap SDK 未加载'}</p>
          <p className={styles.errorHint}>{loadError || '请检查网络或 API Key 配置'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <div id="map" className={styles.map} />
      <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onFocusOverview={handleFocusOverview} />
      <Legend />
      <DayArrows activeDay={activeDay} onPrev={onPrevDay} onNext={onNextDay} />
    </div>
  );
}
