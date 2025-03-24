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
  MapExtent,
  MapRange,
  ColorPaletteName,
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
};

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
};

// initial component states
export const defaults = {
  panel: 'disease' as PanelType,
  extent: 'wisconsin' as MapExtent,
  disease: 'late-blight',
  insect: 'cpb',
  dd_model: 'dd_50_86',
  gradientType: 'two-point' as GradientType,
  t_min: 50,
  t_max: 86,
  in_f: true,
  palette: 'classic' as ColorPaletteName,
};

export const selectedPalette = writable<ColorPaletteName>('classic');
export const userLocation = writable<LatLng | null>(null);
export const panelKey = {};
export const diseasePanelKey = {};
export const insectPanelKey = {};
export const customPanelKey = {};
export const mapKey = {};
export const interfaceKey = {};
export const selectedPanel = writable<PanelType>(defaults.panel);
export const diseasePanelParams = writable<SeverityParams>();
export const insectPanelParams = writable<SeverityParams>();
export const customPanelParams = writable<CustomPanelParams>();
// export const diseasePanelState = writable<PestPanelState>();
export const diseasePanelState = writable({
  loaded: false,
} as PestPanelState);
export const insectPanelState = writable({
  loaded: false,
} as PestPanelState);
export const customPanelState = writable({
  selectedGradient: defaults.gradientType,
  loaded: false,
} as CustomPanelState);
// export const diseaseLegend = writable<SeverityLegend[]>();
// export const insectLegend = writable<{ legend: SeverityLegend[]; info: string }>();
// export const customLegend = writable<GradientMapping[]>();

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
export const selectedDDModel = writable<DegreeDayModel>();

// TminMaxDisplay
export const tMinTmax = writable<TminTmax>({
  t_min: null,
  t_max: null,
  in_f: true,
});

// Map states
export const mapRange = writable<MapRange>();
export const mapExtent = writable<MapExtent>(defaults.extent);

// Custom tab gradient states
export const twoPointGradientState = writable<GradientState>();
export const threePointGradientState = writable<GradientState>();
