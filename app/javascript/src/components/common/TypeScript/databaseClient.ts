import { Severity, PestInfo, SeverityLegend, PointDetailsParams, SeverityParams, StationDetailsParams, PestsForCrops, CropWithAfflictions, CropWithDiseases, CropWithInsects } from "../../common/TypeScript/types"
import axios from 'axios'
import DatabaseClientInterface from './interfaces/databaseClientInterface';
import ENDPOINTS from './endpoints';

export default class DatabaseClient implements DatabaseClientInterface {
  constructor() {
    const token = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token
  }

  async fetchDiseasePanel(): Promise<CropWithAfflictions[]> {
    try {
      let cropsWithAfflictions: CropWithAfflictions[] = [];
      const response = await axios.get(ENDPOINTS.DISEASE_PANEL);
      cropsWithAfflictions = response.data.map((cropWithDisease: CropWithDiseases) => {
        const { diseases, ...newData } = { ...cropWithDisease, afflictions: cropWithDisease.diseases }
        return newData;
      })
      return cropsWithAfflictions;
    } catch (e) {
      return [];
    }
  }

  async fetchInsectPanel(): Promise<CropWithAfflictions[]> {
    try {
      let cropsWithAfflictions: CropWithAfflictions[] = [];
      const response = await axios.get(ENDPOINTS.INSECT_PANEL);
      cropsWithAfflictions = response.data.map((cropWithInsect: CropWithInsects) => {
        const { insects, ...newData } = { ...cropWithInsect, afflictions: cropWithInsect.insects }
        return newData;
      })
      return cropsWithAfflictions;
    } catch (e) {
      return [];
    }
  }

  async fetchSeverities(severityParams: SeverityParams): Promise<Severity[]> {
    const severities: Severity[] = []
    try {
      const response = await axios.post(ENDPOINTS.SEVERITIES, severityParams);
      if (response.data.results) {
        response.data.results.forEach((result) => {
          severities.push({
            level: result.total,
            lat: result.lat,
            long: result.long,
            min: response.data.min,
            max: response.data.max
          })
        })
        return severities;
      } else {
        return response.data.map(({ severity: severityLevel, ...data }) => ({ ...data, level: severityLevel }));
      }
    } catch (e) {
      return [];
    }
  }

  async fetchSeverityLegend(pestId: number): Promise<SeverityLegend[]> {
    try {
      const response = await axios.post(ENDPOINTS.SEVERITY_LEGEND, { pest_id: pestId })
      return response.data;
    } catch (e) {
      return []
    }
  }

  async fetchPointDetails(pointDetailsParams: PointDetailsParams): Promise<string> {
    try {
      const response = await axios.post(ENDPOINTS.POINT_DETAILS, { ...pointDetailsParams })
      return response.data;
    } catch (e) {
      return ""
    }
  }

  async fetchPestInfo(pestId: number, inFahrenheit: boolean): Promise<PestInfo> {
    try {
      const response = await axios.post(ENDPOINTS.PEST_INFO, { pest_id: pestId, in_fahrenheit: inFahrenheit })
      return response.data;
    } catch (e) {
      return { info: null, name: null, pest_link: null, biofix_date: null, end_date_enabled: null, tmin: null, tmax: null }
    }
  }

  async fetchStationDetails(stationDetailsParams: StationDetailsParams): Promise<string> {
    try {
      const response = await axios.post(ENDPOINTS.STATION_DETAILS, { ...stationDetailsParams });
      return response.data;
    } catch (e) {
      return ""
    }
  }
}
