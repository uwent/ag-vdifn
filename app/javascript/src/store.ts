import { writable } from 'svelte/store';
import type {
  Pest,
  DegreeDayModel,
  Severity,
  SeverityLegend,
  PestInfo,
  GradientMapping,
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
  t_min: 50,
  t_max: 86,
  in_f: true,
  tMaxDisabled: false,
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

export const panelKey = {};
export const diseasePanelKey = {};
export const insectPanelKey = {};
export const customPanelKey = {};
export const mapKey = {};
export const interfaceKey = {};

export const selectedPanel = writable('');
export const startDate = writable('');
export const endDate = writable('');
export const afflictionValue = writable();
export const afflictionAlias = writable('');
export const overlayGradient = writable({});
export const overlayLoading = writable(false);
export const customOverlaySubmitted = writable(false);
export const afflictionParams = writable({});
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
export const selectedAffliction = writable({} as Pest);
export const selectedDDModel = writable({} as DegreeDayModel);

interface TMinTmax {
  t_min: number | null;
  t_max: number | null;
  in_fahrenheit: boolean;
}
export const tMinTmax = writable<TMinTmax>({
  t_min: null,
  t_max: null,
  in_fahrenheit: true,
});

export const mapRange = writable({
  min: 0,
  max: 0,
});

export const mapExtent = writable(defaults.extent);

// Panel states
interface AfflictionPanelState {
  currentAffliction: Pest;
  selectedExtent: string;
  severities: Severity[];
  severityParams: object;
  loaded: boolean;
}
export const diseasePanelState = writable({
  loaded: false,
} as AfflictionPanelState);
export const insectPanelState = writable({
  loaded: false,
} as AfflictionPanelState);

interface CustomPanelParams {
  start_date: string;
  end_date: string;
  t_min: number;
  t_max: number | null;
  in_fahrenheit: boolean;
}
interface CustomPanelState {
  selectedModel: DegreeDayModel;
  selectedExtent: string;
  severities: Severity[];
  severityParams: object;
  params: Partial<CustomPanelParams>;
  selectedGradient: number;
  loaded: boolean;
}
export const customPanelState = writable({
  selectedGradient: 1,
  loaded: false,
} as CustomPanelState);

// Custom tab gradient states
interface GradientState {
  severityLevels: number;
  userValues: number[];
  mapMin: number;
  mapMax: number;
  gradient: object;
}
export const twoPointGradientState = writable({} as GradientState);
export const threePointGradientState = writable({} as GradientState);
