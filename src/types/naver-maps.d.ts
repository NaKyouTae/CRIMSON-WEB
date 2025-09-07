declare namespace naver.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class Map {
    constructor(element: string | HTMLElement, options?: MapOptions);
    setCenter(latlng: LatLng): void;
    getCenter(): LatLng;
    setZoom(zoom: number): void;
    getZoom(): number;
    setSize(size: Size): void;
    getSize(): Size;
    panTo(latlng: LatLng): void;
    panBy(offset: Point): void;
    fitBounds(bounds: LatLngBounds): void;
    getBounds(): LatLngBounds;
    setMap(map: Map | null): void;
    addListener(eventName: string, listener: Function): void;
    removeListener(eventName: string, listener: Function): void;
  }

  interface MapOptions {
    center?: LatLng;
    zoom?: number;
    size?: Size;
    minZoom?: number;
    maxZoom?: number;
    mapTypeId?: string;
    mapTypeControl?: boolean;
    mapTypeControlOptions?: MapTypeControlOptions;
    zoomControl?: boolean;
    zoomControlOptions?: ZoomControlOptions;
    scaleControl?: boolean;
    scaleControlOptions?: ScaleControlOptions;
    logoControl?: boolean;
    logoControlOptions?: LogoControlOptions;
    mapDataControl?: boolean;
    mapDataControlOptions?: MapDataControlOptions;
    draggable?: boolean;
    scrollWheel?: boolean;
    disableDoubleClickZoom?: boolean;
    disableDoubleClickDelay?: boolean;
    keyboardShortcuts?: boolean;
    tileTransition?: boolean;
    overlayZoomEffect?: boolean;
    overlayZoomEffectOptions?: OverlayZoomEffectOptions;
  }

  interface Size {
    width: number;
    height: number;
  }

  interface Point {
    x: number;
    y: number;
  }

  class LatLngBounds {
    constructor(sw: LatLng, ne: LatLng);
    extend(latlng: LatLng): LatLngBounds;
    isEmpty(): boolean;
    toString(): string;
    getSW(): LatLng;
    getNE(): LatLng;
  }

  interface MapTypeControlOptions {
    position?: string;
    style?: string;
    mapTypeIds?: string[];
  }

  interface ZoomControlOptions {
    position?: string;
  }

  interface ScaleControlOptions {
    position?: string;
  }

  interface LogoControlOptions {
    position?: string;
  }

  interface MapDataControlOptions {
    position?: string;
  }

  interface OverlayZoomEffectOptions {
    duration?: number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getMap(): Map | null;
    setPosition(latlng: LatLng): void;
    getPosition(): LatLng;
    setVisible(visible: boolean): void;
    getVisible(): boolean;
    setIcon(icon: string | MarkerIcon): void;
    getIcon(): string | MarkerIcon;
    setTitle(title: string): void;
    getTitle(): string;
    setZIndex(zIndex: number): void;
    getZIndex(): number;
    addListener(eventName: string, listener: Function): void;
    removeListener(eventName: string, listener: Function): void;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    title?: string;
    icon?: string | MarkerIcon;
    zIndex?: number;
    visible?: boolean;
    clickable?: boolean;
    draggable?: boolean;
    animation?: number;
  }

  interface MarkerIcon {
    content: string;
    size?: Size;
    anchor?: Point;
    origin?: Point;
  }

  class InfoWindow {
    constructor(options?: InfoWindowOptions);
    open(map: Map, marker?: Marker): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
    getContent(): string | HTMLElement;
    setPosition(latlng: LatLng): void;
    getPosition(): LatLng;
    setZIndex(zIndex: number): void;
    getZIndex(): number;
    getMap(): Map | null;
    addListener(eventName: string, listener: Function): void;
    removeListener(eventName: string, listener: Function): void;
  }

  interface InfoWindowOptions {
    content?: string | HTMLElement;
    position?: LatLng;
    zIndex?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    anchorSize?: Size;
    anchorColor?: string;
    pixelOffset?: Point;
  }

  namespace Event {
    function addListener(instance: any, eventName: string, listener: Function): void;
    function removeListener(instance: any, eventName: string, listener: Function): void;
    function addDOMListener(instance: any, eventName: string, listener: Function): void;
    function removeDOMListener(instance: any, eventName: string, listener: Function): void;
  }

  namespace Position {
    const TOP_LEFT: string;
    const TOP_CENTER: string;
    const TOP_RIGHT: string;
    const LEFT_TOP: string;
    const LEFT_CENTER: string;
    const LEFT_BOTTOM: string;
    const RIGHT_TOP: string;
    const RIGHT_CENTER: string;
    const RIGHT_BOTTOM: string;
    const BOTTOM_LEFT: string;
    const BOTTOM_CENTER: string;
    const BOTTOM_RIGHT: string;
  }
}

declare const naver: {
  maps: typeof naver.maps & {
    Position: typeof naver.maps.Position;
  };
};

// 전역 함수 타입 정의
declare global {
  interface Window {
    navermap_authFailure?: () => void;
  }
}
