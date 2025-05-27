import { writable } from 'svelte/store';
import type {
  CustomPanelState,
  DegreeDayModel,
  GradientState,
  PanelType,
  Pest,
  PestPanelState,
  TminTmax,
  LatLng,
  GradientHash,
  SeverityParams,
  CustomPanelParams,
  GradientType,
  MapRange,
  ColorPaletteName,
  MapBounds,
  MapExtents,
  MapExtentOption,
} from '@types';

export const env = process.env.NODE_ENV || process.env.RAILS_ENV || 'production';
export const dev = env === 'development';
export const baseURL = dev ? '' : '/vdifn';
export const mapsApiKey = process.env.GOOGLE_MAPS_KEY;

// for AgWeather queries
export const extents = {
  wisconsin: {
    lat_range: '42.4,47.1',
    lng_range: '-93.0,-86.8',
  },
  midwest: {
    lat_range: '38,50',
    lng_range: '-82,-98',
  },
} satisfies MapExtents;

// for drawing google map shapes
export const bounds = {
  wisconsin: {
    north: 47.1 + 0.05,
    south: 42.4 - 0.05,
    east: -86.8 + 0.05,
    west: -93.0 - 0.05,
  },
  midwest: {
    north: 50 + 0.05,
    south: 38 - 0.05,
    east: -82 + 0.05,
    west: -98 - 0.05,
  },
} satisfies MapBounds;

// initial component states
export const defaults: {
  panel: PanelType;
  extent: MapExtentOption;
  disease: string;
  insect: string;
  dd_model: string;
  gradientType: GradientType;
  t_min: number;
  t_max: number;
  in_f: boolean;
  palette: ColorPaletteName;
} = {
  panel: 'disease',
  extent: 'wisconsin',
  disease: 'late-blight',
  insect: 'cpb',
  dd_model: 'dd_50_86',
  gradientType: 'two-point',
  t_min: 50,
  t_max: 86,
  in_f: true,
  palette: 'spectral',
};

export const selectedPalette = writable<ColorPaletteName>(defaults.palette);
export const userLocation = writable<LatLng | null>(null);
export const panelKey = {};
export const diseasePanelKey = {};
export const insectPanelKey = {};
// export const customPanelKey = {};
export const mapKey = {};
export const interfaceKey = {};

export const selectedPanel = writable<PanelType>(defaults.panel);

export const diseasePanelParams = writable<SeverityParams>();
export const insectPanelParams = writable<SeverityParams>();

export const showLegend = writable(false);

export const diseasePanelState = writable({
  loaded: false,
} as PestPanelState);
export const insectPanelState = writable({
  loaded: false,
} as PestPanelState);

export const startDate = writable<string>('');
export const endDate = writable<string>('');
export const pestId = writable<number>();
export const pestAlias = writable<string>('');
export const overlayGradient = writable<GradientHash>();
export const overlayLoading = writable<boolean>(false);
export const loadStatus = writable<string>('');
export const customOverlaySubmitted = writable<boolean>(false);
// export const pestParams = writable({});

// Affliction and DD model structures align with rails database
export const selectedPest = writable<Pest>();
export const selectedDisease = writable<Pest>();
export const selectedInsect = writable<Pest>();

// TminMaxDisplay
export const tMinTmax = writable<TminTmax>({
  t_min: null,
  t_max: null,
  in_f: true,
});

// Map states
export const mapRange = writable<MapRange>();
export const mapExtent = writable<MapExtentOption>(defaults.extent);

// Custom tab gradient states
export const customPanelState = writable({
  selectedGradient: defaults.gradientType,
  loaded: false,
} as CustomPanelState);
export const selectedDDModel = writable<DegreeDayModel>();
export const customPanelParams = writable<CustomPanelParams>();
export const twoPointGradientState = writable<GradientState>();
export const threePointGradientState = writable<GradientState>();

// Sidebar state
export const sidebarOpen = writable<boolean>(false); 