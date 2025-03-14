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
} from '@types';

export const env = process.env.NODE_ENV || process.env.RAILS_ENV || 'production';
export const isDev = env === 'development';
export const baseURL = isDev ? '' : '/vdifn';
export const mapsApiKey = process.env.GOOGLE_MAPS_KEY;

// initial component states
export const defaults = {
  panel: 'disease',
  extent: 'wisconsin',
  disease: 'late-blight',
  insect: 'cpb',
  dd_model: 'dd_50_86',
  t_min: 50,
  t_max: 86,
  in_f: true,
};

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

export const userLocation = writable<LatLng | null>(null);

export const panelKey = {};
export const diseasePanelKey = {};
export const insectPanelKey = {};
export const customPanelKey = {};
export const mapKey = {};
export const interfaceKey = {};

export const selectedPanel = writable<PanelType>('disease');
export const startDate = writable('');
export const endDate = writable('');
export const pestId = writable();
export const pestAlias = writable('');
export const overlayGradient = writable({});
export const overlayLoading = writable(false);
export const loadStatus = writable('');
export const customOverlaySubmitted = writable(false);
export const pestParams = writable({});
export const diseasePanelParams = writable({});
export const insectPanelParams = writable({});
export const customPanelParams = writable({});
export const diseaseLegend = writable([] as SeverityLegend[]);
export const insectLegend = writable({
  legend: [] as SeverityLegend[],
  info: '',
});
export const customLegend = writable([] as GradientMapping[]);

// Affliction and DD model structures align with rails database
export const selectedPest = writable({} as Pest);
export const selectedDisease = writable({} as Pest);
export const selectedInsect = writable({} as Pest);
export const selectedDDModel = writable({} as DegreeDayModel);

// TminMaxDisplay
export const tMinTmax = writable({
  t_min: null,
  t_max: null,
  in_f: true,
} as TMinTmax);

// Map states
export const mapRange = writable({
  min: 0,
  max: 0,
});
export const mapExtent = writable(defaults.extent);

// Panel states
export const diseasePanelState = writable({
  loaded: false,
} as PestPanelState);
export const insectPanelState = writable({
  loaded: false,
} as PestPanelState);
export const customPanelState = writable({
  selectedGradient: 1,
  loaded: false,
} as CustomPanelState);

// Custom tab gradient states
export const twoPointGradientState = writable({} as GradientState);
export const threePointGradientState = writable({} as GradientState);
