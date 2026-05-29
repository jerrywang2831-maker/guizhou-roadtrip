/* eslint-disable @typescript-eslint/no-explicit-any */

interface AMapLngLat {
  getLng(): number;
  getLat(): number;
}

interface AMapPixel {
  new(x: number, y: number): AMapPixel;
}

interface AMapMarkerOptions {
  position: [number, number];
  content: string;
  anchor: string;
  offset: AMapPixel;
  zIndex: number;
}

interface AMapMarker {
  setMap(map: any): void;
  getPosition(): [number, number];
  on(event: string, handler: () => void): void;
}

interface AMapInfoWindowOptions {
  content: string;
  offset: AMapPixel;
}

interface AMapInfoWindow {
  open(map: any, position: [number, number]): void;
}

interface AMapPolylineOptions {
  path: [number, number][];
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity: number;
  lineJoin: string;
  zIndex: number;
  strokeStyle: string;
}

interface AMapPolyline {
  setMap(map: any): void;
  setOptions(opts: Partial<AMapPolylineOptions>): void;
}

interface AMapDrivingResult {
  routes: Array<{
    steps: Array<{ path: [number, number][] }>;
  }>;
}

interface DrivingPolicy {
  LEAST_TIME: number;
  LEAST_FEE: number;
  LEAST_DISTANCE: number;
}

interface AMapDrivingOptions {
  policy: number;
}

interface AMapDriving {
  search(
    origin: AMapLngLat,
    dest: AMapLngLat,
    callback: (status: string, result: AMapDrivingResult) => void
  ): void;
}

interface AMapMapOptions {
  center: [number, number];
  zoom: number;
}

interface AMapMap {
  setZoomAndCenter(zoom: number, center: [number, number]): void;
  panTo(pos: [number, number]): void;
  setZoom(zoom: number): void;
  zoomIn(): void;
  zoomOut(): void;
}

interface AMapStatic {
  Map: new (container: string, opts: AMapMapOptions) => AMapMap;
  Marker: new (opts: AMapMarkerOptions) => AMapMarker;
  InfoWindow: new (opts: AMapInfoWindowOptions) => AMapInfoWindow;
  Polyline: new (opts: AMapPolylineOptions) => AMapPolyline;
  LngLat: new (lng: number, lat: number) => AMapLngLat;
  Pixel: new (x: number, y: number) => AMapPixel;
  Driving: new (opts: AMapDrivingOptions) => AMapDriving;
  DrivingPolicy: DrivingPolicy;
  plugin(name: string, callback: () => void): void;
}

interface Window {
  AMap: AMapStatic;
  _AMapSecurityConfig: { securityJsCode: string };
}
