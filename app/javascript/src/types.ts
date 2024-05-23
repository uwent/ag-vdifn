export type PanelType = 'disease' | 'insect' | 'custom';

export type SeverityLegend = {
  name: string;
  slug: string;
  description: string;
};

export type LegendMapping = {
  color: string;
  text: string;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type GradientMapping = {
  color: string;
  number: number;
};

export type Pest = {
  id: number;
  name: string;
  local_name: string;
  biofix_mm: number;
  biofix_dd: number;
  biofix_date: string;
  biofix_label: string;
  end_date_enabled: boolean;
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
  end_date_enabled: boolean;
  tmin: number;
  tmax: number;
};

export type PointDetailsParams = {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  pest_id: number;
  t_max?: number;
  t_min?: number;
  in_f?: boolean;
  panel: string;
};

export type TMinTmax = {
  t_min: number | null;
  t_max: number | null;
  in_f: boolean;
};

export type Severity = {
  lat: number;
  long: number;
  level: number;
};

export type SeverityParams = {
  pest_id: number;
  start_date: string;
  end_date: string;
  t_max: number;
  t_min: number;
  in_f: boolean;
  lat_range: string;
  long_range: string;
};

export type PestPanelState = {
  selectedPest: Pest;
  severities: Severity[];
  severityParams: SeverityParams;
  mapExtent: string;
  loaded: boolean;
};

export type CustomPanelParams = {
  start_date: string;
  end_date: string;
  t_min: number;
  t_max: number | null;
  in_f: boolean;
};

export type CustomPanelState = {
  selectedModel: DegreeDayModel;
  selectedExtent: string;
  severities: Severity[];
  severityParams: SeverityParams;
  params: Partial<CustomPanelParams>;
  selectedGradient: number;
  loaded: boolean;
};

export type GradientState = {
  severityLevels: number;
  userValues: number[];
  mapMin: number;
  mapMax: number;
  gradient: {
    [key: number]: string;
  };
};

// export type StationDetailsParams = {
//   name: string;
//   start_date: Date;
//   end_date: Date;
// };

export type Crop = {
  id: number;
  name: string;
};

export type CropWithDiseases = {
  id: number;
  name: string;
  diseases: Pest[];
};

export type CropWithInsects = {
  id: number;
  name: string;
  insects: Pest[];
};

export type CropWithPests = {
  id: number;
  name: string;
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
