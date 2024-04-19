import type {
  Severity,
  // PestInfo,
  SeverityLegend,
  PointDetailsParams,
  SeverityParams,
  CropWithPests,
  CropWithDiseases,
  CropWithInsects,
  DegreeDayModel,
} from '../types';
import { env } from '@store';
import axios from 'axios';
import type DatabaseClientInterface from './databaseClientInterface';
import ENDPOINTS from './endpoints';

// const logging = env === 'development';
const logging = false;

export default class DatabaseClient implements DatabaseClientInterface {
  constructor() {
    const token = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
  }

  async fetchDiseasePanel(): Promise<CropWithPests[]> {
    const endpoint = ENDPOINTS.DISEASE_PANEL;
    try {
      let cropsWithPests: CropWithPests[] = [];
      const response = await axios.get(endpoint);
      if (logging)
        console.log('DB >> fetchDiseasePanel', '\nEndpoint:', endpoint, '\nResponse:', response);
      cropsWithPests = response.data.map((cropWithDisease: CropWithDiseases) => {
        const { diseases, ...newData } = {
          ...cropWithDisease,
          pests: cropWithDisease.diseases,
        };
        return newData;
      });
      return cropsWithPests;
    } catch (e) {
      return [];
    }
  }

  async fetchInsectPanel(): Promise<CropWithPests[]> {
    const endpoint = ENDPOINTS.INSECT_PANEL;
    try {
      let cropsWithPests: CropWithPests[] = [];
      const response = await axios.get(endpoint);
      if (logging)
        console.log('DB >> fetchInsectPanel', '\nEndpoint:', endpoint, '\nResponse:', response);
      cropsWithPests = response.data.map((cropWithInsect: CropWithInsects) => {
        const { insects, ...newData } = {
          ...cropWithInsect,
          pests: cropWithInsect.insects,
        };
        return newData;
      });
      return cropsWithPests;
    } catch (e) {
      return [];
    }
  }

  async fetchCustomPanel(): Promise<DegreeDayModel[]> {
    const endpoint = ENDPOINTS.DD_MODELS;
    try {
      const response = await axios.get(endpoint);
      if (logging)
        console.log('DB >> fetchDDModels', '\nEndpoint:', endpoint, '\nResponse:', response);
      let ddModels: DegreeDayModel[] = [];
      ddModels = response.data.map((ddModel: DegreeDayModel) => {
        return ddModel;
      });
      return ddModels;
    } catch (e) {
      return [];
    }
  }

  async fetchSeverities(severityParams: SeverityParams): Promise<Severity[]> {
    const endpoint = ENDPOINTS.SEVERITIES;
    const params = severityParams;
    const severities: Severity[] = [];
    try {
      const response = await axios.post(endpoint, params);
      if (logging)
        console.log(
          'DB >> fetchSeverities',
          '\nEndpoint:',
          endpoint,
          '\nParams:',
          params,
          '\nResponse:',
          response,
        );
      if (response.data) {
        response.data.forEach((data) => {
          severities.push({
            lat: data.lat,
            long: data.long,
            level: data.value,
          });
        });
        return severities;
      } else {
        return response.data.map(({ severity: severityLevel, ...data }) => ({
          ...data,
          level: severityLevel,
        }));
      }
    } catch (e) {
      return [];
    }
  }

  async fetchSeverityLegend(pestId: number): Promise<SeverityLegend[]> {
    const endpoint = ENDPOINTS.SEVERITY_LEGEND;
    const params = { pest_id: pestId };

    try {
      const response = await axios.get(endpoint, { params: params });
      if (logging)
        console.log(
          'DB >> fetchSeverityLegend',
          '\nEndpoint:',
          endpoint,
          '\nParams:',
          params,
          '\nResponse:',
          response,
        );
      return response.data;
    } catch (e) {
      return [];
    }
  }

  async fetchSeverityLegendInfo(pestId: number): Promise<string> {
    const endpoint = ENDPOINTS.SEVERITY_LEGEND_INFO;
    const params = { pest_id: pestId };

    try {
      const response = await axios.get(endpoint, { params: params });
      if (logging)
        console.log(
          'DB >> fetchSeverityLegendInfo',
          '\nEndpoint:',
          endpoint,
          '\nParams:',
          params,
          '\nResponse:',
          response,
        );
      return response.data;
    } catch (e) {
      return '';
    }
  }

  async fetchPointDetails(pointDetailsParams: PointDetailsParams): Promise<string> {
    const endpoint = ENDPOINTS.POINT_DETAILS;
    const params = { ...pointDetailsParams };
    try {
      const response = await axios.get(endpoint, { params: params });
      if (logging)
        console.log(
          'DB >> fetchPointDetails',
          '\nEndpoint:',
          endpoint,
          '\nParams:',
          params,
          '\nResponse:',
          response,
        );
      return response.data;
    } catch (e) {
      return '';
    }
  }

  // async fetchPestInfo(pestId: number, inFahrenheit: boolean): Promise<PestInfo> {
  //   const endpoint = ENDPOINTS.PEST_INFO
  //   const params = {
  //     pest_id: pestId,
  //     in_f: inFahrenheit
  //   }
  //   try {
  //     const response = await axios.post(endpoint, params)
  //     if (isDev) console.log('DB >> fetchPestInfo', '\nEndpoint:', endpoint, '\nParams:', params, '\nResponse:', response)
  //     return response.data
  //   } catch (e) {
  //     return {
  //       info: null,
  //       name: null,
  //       pest_link: null,
  //       biofix_date: null,
  //       biofix_label: null,
  //       end_date_enabled: null,
  //       tmin: null,
  //       tmax: null
  //     }
  //   }
  // }

  // Weather station display is not implemented
  // async fetchStationDetails(
  //   stationDetailsParams: StationDetailsParams,
  // ): Promise<string> {
  //   try {
  //     const response = await axios.post(ENDPOINTS.STATION_DETAILS, {
  //       ...stationDetailsParams,
  //     })
  //     return response.data
  //   } catch (e) {
  //     return ''
  //   }
  // }
}
