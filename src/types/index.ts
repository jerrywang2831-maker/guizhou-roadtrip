export type StopType = 'start' | 'stop' | 'highlight';

export interface Stop {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: StopType;
}

export interface Segment {
  from: number;
  to: number;
}

export interface RouteInfo {
  path: string;
  dist: string;
  time: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  route_g: RouteInfo;
  route_s: RouteInfo;
  sights: string[];
  food: string[];
  hotel: string;
  stopFrom: number;
  stopTo: number;
  segIndex: number;
  note: string;
}

export interface WeatherDay {
  date: string;
  max: number;
  min: number;
  code: number;
  precip: number;
}
