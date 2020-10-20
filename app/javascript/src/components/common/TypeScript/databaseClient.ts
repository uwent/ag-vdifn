import { Severity, PestInfo, SeverityLegend, PointDetailsParams, SeverityParams, StationDetailsParams, PestsForCrops, CropWithAfflictions, CropWithDiseases, CropWithInsects } from "../../common/TypeScript/types"
import axios from 'axios'
import DatabaseClientInterface from './interfaces/databaseClientInterface';

export default class DatabaseClient implements DatabaseClientInterface {
    constructor() {
      const token = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token
    }

    async fetchDiseasePanel(): Promise<CropWithAfflictions[]> {
      try {
        let cropsWithAfflictions: CropWithAfflictions[] = [];
        const response = await axios.get('/db/disease_panel');
        cropsWithAfflictions = response.data.map((cropWithDisease: CropWithDiseases) => {
          const {diseases, ...newData} = {...cropWithDisease, afflictions: cropWithDisease.diseases}
          return newData;
        })
        return cropsWithAfflictions;
      } catch(e) {
        return [];
      }
    }

    async fetchInsectPanel(): Promise<CropWithAfflictions[]> {
      try {
        let cropsWithAfflictions: CropWithAfflictions[] = [];
        const response = await axios.get('/db/insect_panel');
        cropsWithAfflictions = response.data.map((cropWithInsect: CropWithInsects) => {
          const {insects, ...newData} = {...cropWithInsect, afflictions: cropWithInsect.insects}
          return newData;
        })
        return cropsWithAfflictions;
      } catch(e) {
        return [];
      }
    }
    async fetchSeverities(severityParams: SeverityParams): Promise<Severity[]> {
      try {
        const response = await axios.post('/db/severities', severityParams);
        return response.data;
      } catch(e) {
        return [];
      }
    }

    async fetchSeverityLegend(pestId: number): Promise<SeverityLegend[]> {
      try {
        const response = await axios.post('/db/severity_legend', {pest_id: pestId})
        return response.data;
      } catch(e) {
        return []
      }
    }

    async fetchPointDetails(pointDetailsParams: PointDetailsParams): Promise<string> {
      try {
        const response = await axios.post('/db/point_details', {...pointDetailsParams})
        return response.data;
      } catch(e) {
        return ""
      }
    }

    async fetchPestInfo(pestId: number, inFahrenheit: boolean): Promise<PestInfo> {
      try {
        const response = await axios.post('/db/pest_info', { pest_id: pestId, in_fahrenheit: inFahrenheit})
        return response.data;
      } catch(e) {
        return {info: null, name: null, pest_link: null, biofix_date: null, end_date_enabled: null, tmin: null, tmax: null}
      }
    }

    async fetchStationDetails(stationDetailsParams: StationDetailsParams): Promise<string> {
      try {
        const response = await axios.post('/db/station_details', {...stationDetailsParams});
        return response.data;
      } catch(e) {
        return ""
      }
    }

    async fetchSidebarInfo(interfaceName: string): Promise<PestsForCrops> {
      try {
        const response = await axios.post('/db/sidebar_info', {interface: interfaceName});
        return response.data
      } catch(e) {
        return { pests: [], crops: [] }
      }
    }
  }
