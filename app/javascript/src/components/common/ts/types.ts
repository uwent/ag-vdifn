export type Severity = {
  lat: number
  long: number
  level: number
  min?: number
  max?: number
}

export type SeverityLegend = {
  name: string
  slug: string
  description: string
}

export type PestInfo = {
  info: string
  name: string
  pest_link: string
  biofix_date: string
  biofix_label: string
  end_date_enabled: boolean
  tmin: number
  tmax: number
}

export type PointDetailsParams = {
  latitude: number
  longitude: number
  start_date: string
  end_date: string
  pest_id: number
  t_max?: number
  t_min?: number
  in_fahrenheit?: boolean
  panel: string
}

export type SeverityParams = {
  start_date: string
  end_date: string
  pest_id?: number
  t_max?: number
  t_min?: number
  in_fahrenheit?: boolean
  lat_range?: string,
  long_range?: string
}

export type StationDetailsParams = {
  name: string
  start_date: Date
  end_date: Date
}

export type Crop = {
  id: number
  name: string
}

export type CropWithDiseases = {
  id: number
  name: string
  diseases: Pest[]
}

export type CropWithInsects = {
  id: number
  name: string
  insects: Pest[]
}

export type CropWithAfflictions = {
  id: number
  name: string
  afflictions: Pest[]
}

export type Pest = {
  id: number
  name: string
  local_name: string
  biofix_mm: number
  biofix_dd: number
  end_date_enabled: boolean
  t_max: number
  t_min: number
  info: string
  severity_info: string
  photo: string
  link: string
  created_at: Date
  updated_at: Date
}

export type PestsForCrops = {
  pests: Pest[]
  crops: Crop[]
}
