# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A React + TypeScript interactive road-trip map app for a 15-day Wuhan→Guizhou self-driving tour. Renders dual route overlays (国道/高速) on an Amap instance with day-by-day itinerary cards, live weather, and keyboard navigation.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (default http://localhost:5173)
npm run build        # Type-check + production build to dist/
npm run lint         # ESLint
npm run preview      # Preview production build
```

## Architecture

React 19 + TypeScript + Vite + CSS Modules. Amap SDK loaded dynamically via `useAmap` hook.

### Directory structure

```
src/
  types/index.ts         # Stop, Segment, ItineraryDay, RouteInfo, WeatherDay
  types/amap.d.ts        # Amap SDK ambient type declarations
  data/                  # STOPS, SEGMENTS, ITINERARY, weather icons
  hooks/
    useAmap.ts           # Dynamic Amap SDK loading with security config
    useWeather.ts        # Open-Meteo 16-day forecasts
    useKeyboardNav.ts    # Arrow key navigation
  components/
    App.tsx              # Root: owns activeDay, routeMode state
    Header.tsx           # Static title bar
    Sidebar.tsx          # Day list + route toggle
    DayCard.tsx          # Single expandable day card
    MapContainer.tsx     # Map instance, markers, route drawing (imperative Amap)
    MapControls.tsx      # Zoom buttons
    Legend.tsx           # Color legend
    DayArrows.tsx        # Prev/next arrows on map
```

### Data model

Three arrays in `src/data/` (types in `src/types/index.ts`):

- **`STOPS`** (14 entries) — `{ id, name, lat, lng, type }`. `type`: `'start'` | `'highlight'` | `'stop'`.
- **`SEGMENTS`** (15 entries) — `{ from, to }` edges between consecutive stops.
- **`ITINERARY`** (15 entries) — `{ day, date, title, route_g, route_s, sights[], food[], hotel, stopFrom, stopTo, segIndex, note }`. `segIndex: -1` means rest day.

### State flow

`App.tsx` owns `activeDay`, `routeMode` ('g'/'s') and passes them down as props. No context/Redux — prop drilling is sufficient for this scale. `MapContainer` manages all imperative Amap objects (map, markers, polylines) in refs.

### Amap SDK loading

`useAmap.ts` sets `window._AMapSecurityConfig` before dynamically appending the SDK `<script>` tag. Returns `{ loaded, error }`. `MapContainer` waits for `loaded` before calling `new AMap.Map()`.

### Route drawing

3-level fallback in `MapContainer.tsx`:
- 国道: `LEAST_FEE` → `LEAST_TIME` → `LEAST_DISTANCE` → dashed straight line
- 高速: `LEAST_TIME` → `LEAST_DISTANCE` → dashed straight line
- Segments are staggered at 500ms intervals to avoid API rate limiting

### Weather

`useWeather` fetches Open-Meteo 16-day forecasts for unique overnight stops, keyed by `stopId`. No API key required.

## Editing the itinerary

Edit files in `src/data/`:
- `stops.ts` — add/remove waypoints
- `segments.ts` — edge list connecting stops
- `itinerary.ts` — daily details; `stopFrom`/`stopTo` reference stop IDs, `segIndex` references segments

All three arrays must be consistent. The original single-file `index.original.html` is preserved for reference.
