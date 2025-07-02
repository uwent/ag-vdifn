// Rails types
export type Pest = {
  id: number;
  name: string;
  local_name: string;
  biofix_mm: number;
  biofix_dd: number;
  biofix_date: string;
  biofix_label: string;
  t_min: number;
  t_max: number | null;
  info: string;
  severity_info: string;
  photo: string;
  link: string;
  created_at: Date;
  updated_at: Date;
};

export type PestInfo = {
  info: string;
  name: string;
  pest_link: string;
  biofix_date: string;
  biofix_label: string;
  tmin: number;
  tmax: number;
};

export type Crop = {
  id: number;
  name: string;
};

export type CropWithPests = Crop & {
  pests: Pest[];
};

export type DegreeDayModel = {
  id: number;
  name: string;
  name_c: string;
  remote_name: string;
  t_min: number;
  t_max: number | null;
};

export type PestsForCrops = {
  pests: Pest[];
  crops: Crop[];
};

export type PanelType = 'disease' | 'insect' | 'custom';
export const PANEL_TYPES = ['disease', 'insect', 'custom'] as PanelType[];

export type GradientType = 'two-point' | 'three-point';
export type ColorPaletteName = 'spectral' | 'viridis';
export type ColorPalette = {
  low: string;
  med: string;
  high: string;
  grey: string;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type MapRange = {
  min: number;
  max: number;
};

export type MapExtentOption = 'wisconsin' | 'midwest';
export type MapExtents = Record<MapExtentOption, MapExtent>;
export type MapExtent = {
  lat_range: string;
  lng_range: string;
};
export type MapBounds = Record<MapExtentOption, MapBoundary>;
export type MapBoundary = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type LegendEntry = {
  value: number;
  color: string;
  name: string;
  description: string;
};

export type LegendData = {
  legend: LegendEntry[];
  info: string | null;
};

// used to create the custom legend
export type GradientMapping = {
  color: string;
  number: number;
};

// used to fill the rectangles on the map where the key is the upper cutoff value and the value is the color hex string
export type GradientHash = {
  [key: number]: string;
};

export type PointDetailsParams = {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  pest_id: number;
  panel: string;
} & Partial<TminTmax>;

export type Severity = {
  lat: number;
  lng: number;
  value: number;
};

export type TminTmax = {
  t_min: number | null;
  t_max: number | null;
  in_f: boolean;
};

type PanelParams = {
  start_date: string;
  end_date: string;
  lat_range?: string;
  lng_range?: string;
};

export type CustomPanelParams = PanelParams & TminTmax;

export type SeverityParams = PanelParams & {
  pest_id: number;
} & Partial<TminTmax>;

type PanelState = {
  severities: Severity[];
  severityParams: SeverityParams;
  selectedExtent: MapExtentOption;
  mapExtent: MapExtent;
  loaded: boolean;
};

export type PestPanelState = PanelState & {
  selectedPest: Pest;
};

export type CustomPanelState = PanelState & {
  selectedModel: DegreeDayModel;
  selectedGradient: GradientType;
  params: Partial<CustomPanelParams>;
};

export type GradientState = {
  levels: number;
  values: number[];
  inputs: number[];
  inputElements: HTMLInputElement[];
  range?: MapRange;
};
