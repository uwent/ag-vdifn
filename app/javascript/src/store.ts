import { writable } from 'svelte/store';
import type {
  CustomPanelState,
  DegreeDayModel,
  GradientMapping,
  GradientState,
  PanelType,
  Pest,
  PestPanelState,
  SeverityLegend,
  TMinTmax,
  LatLng,
  GradientHash,
  SeverityParams,
  CustomPanelParams,
} from '@types';

export const env = process.env.NODE_ENV || process.env.RAILS_ENV || 'production';
export const isDev = env === 'development';
export const baseURL = isDev ? '' : '/vdifn';
export const mapsApiKey = process.env.GOOGLE_MAPS_KEY;

// for AgWeather queries
export const extents = {
  wisconsin: {
    lat_range: '42.4,47.1',
    long_range: '-93.0,-86.8',
  },
  midwest: {
    lat_range: '38,50',
    long_range: '-82,-98',
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
  extent: 'wisconsin',
  disease: 'late-blight',
  insect: 'cpb',
  dd_model: 'dd_50_86',
  t_min: 50,
  t_max: 86,
  in_f: true,
};

export const userLocation = writable<LatLng | null>(null);

export const panelKey = {};
export const diseasePanelKey = {};
export const insectPanelKey = {};
export const customPanelKey = {};
export const mapKey = {};
export const interfaceKey = {};

export const selectedPanel = writable<PanelType>(defaults.panel);
export const startDate = writable('');
export const endDate = writable('');
export const pestId = writable();
export const pestAlias = writable('');
export const overlayGradient = writable<GradientHash>();
export const overlayLoading = writable(false);
export const loadStatus = writable('');
export const customOverlaySubmitted = writable(false);
export const pestParams = writable({});
export const diseasePanelParams = writable<SeverityParams>();
export const insectPanelParams = writable<SeverityParams>();
export const customPanelParams = writable<CustomPanelParams>();
export const diseaseLegend = writable<SeverityLegend[]>();
export const insectLegend = writable<{ legend: SeverityLegend[]; info: string }>();
export const customLegend = writable<GradientMapping[]>();

// Affliction and DD model structures align with rails database
export const selectedPest = writable<Pest>();
export const selectedDisease = writable<Pest>();
export const selectedInsect = writable<Pest>();
export const selectedDDModel = writable<DegreeDayModel>();

// TminMaxDisplay
export const tMinTmax = writable({
  t_min: null,
  t_max: null,
  in_f: true,
} as TMinTmax);

// Map states
export const mapRange = writable<{ min: number; max: number }>();
export const mapExtent = writable(defaults.extent);

// Panel states
export const diseasePanelState = writable({
  loaded: false,
} as PestPanelState);
export const insectPanelState = writable({
  loaded: false,
} as PestPanelState);
export const customPanelState = writable({
  selectedGradient: 'two-point',
  loaded: false,
} as CustomPanelState);

// Custom tab gradient states
export const twoPointGradientState = writable<GradientState>();
export const threePointGradientState = writable<GradientState>();
