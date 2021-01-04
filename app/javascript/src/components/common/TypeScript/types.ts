export type Severity = {
    lat: number;
    long: number;
    level: number;
    min?: number;
    max?: number;
}

export type SeverityLegend = {
    name: string;
    slug: string;
    description: string;
}

export type PestInfo = {
    info: string;
    name: string;
    pest_link: string;
    biofix_date: string;
    end_date_enabled: boolean;
    tmin: number;
    tmax: number
}

export type PointDetailsParams = {
    latitude: number;
    longitude: number;
    start_date: string;
    end_date: string;
    pest_id: number;
    t_max?: string;
    t_min?: string;
    in_fahrenheit?: boolean;
    panel: string;
}

export type SeverityParams = {
    start_date: string;
    end_date: string;
    pest_id?: number;
    t_max?: string;
    t_min?: string;
    in_fahrenheit?: boolean;
}

export type StationDetailsParams = {
    name: string;
    start_date: Date;
    end_date: Date;
}

export type Crop = {
    id: number;
    name: string;
}

export type CropWithDiseases = {
    id: number;
    name: string;
    diseases: Pest[]
}

export type CropWithInsects = {
    id: number;
    name: string;
    insects: Pest[]
}

export type CropWithAfflictions = {
    id: number;
    name: string;
    afflictions: Pest[]
}

export type Pest = {
    id: number;
    name: string;
    info: string;
    link: string;
    biofix_mm: number;
    biofix_dd: 1;
    critical_value: 0;
    created_at: Date;
    updated_at: Date;
    photo: string;
    t_max: number;
    t_min: number;
    end_date_enabled: boolean
}

export type PestsForCrops = {
    pests: Pest[],
    crops: Crop[]
}
