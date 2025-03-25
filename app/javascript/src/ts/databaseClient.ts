import type {
  Severity,
  PointDetailsParams,
  SeverityParams,
  CropWithPests,
  DegreeDayModel,
  LegendEntry,
  Pest,
  LegendData,
} from '../types';
import { dev } from '@store';
import axios from 'axios';
import type DatabaseClientInterface from './databaseClientInterface';
import ENDPOINTS from './endpoints';

export default class DatabaseClient implements DatabaseClientInterface {
  constructor() {
    const token = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
  }

  // get list of crops with diseases for model selection
  async fetchDiseasePanel(): Promise<CropWithPests[]> {
    const endpoint = ENDPOINTS.DISEASE_PANEL;
    let data: CropWithPests[] = [];
    try {
      const response = await axios.get(endpoint);
      data = response.data;
      if (dev)
        console.log(
          'DB >> fetchDiseasePanel',
          '\nEndpoint:',
          endpoint,
          '\nResponse:',
          response,
          '\nData:',
          data,
        );
    } catch (e) {
      console.log('Error fetching disease panel:', e);
    }
    return data;
  }

  // get list of crops with insects for model selection
  async fetchInsectPanel(): Promise<CropWithPests[]> {
    const endpoint = ENDPOINTS.INSECT_PANEL;
    let data: CropWithPests[] = [];
    try {
      const response = await axios.get(endpoint);
      data = response.data;
      if (dev)
        console.log(
          'DB >> fetchInsectPanel',
          '\nEndpoint:',
          endpoint,
          '\nResponse:',
          response,
          '\nData:',
          data,
        );
    } catch (e) {
      console.log('Error fetching insect panel:', e);
    }
    return data;
  }

  // get list of degree day models for model selection
  async fetchCustomPanel(): Promise<DegreeDayModel[]> {
    const endpoint = ENDPOINTS.DD_MODELS;
    let data: DegreeDayModel[] = [];
    try {
      const response = await axios.get(endpoint);
      data = response.data;
      if (dev)
        console.log(
          'DB >> fetchDDModels',
          '\nEndpoint:',
          endpoint,
          '\nResponse:',
          response,
          '\nData:',
          data,
        );
    } catch (e) {
      console.log('Error fetching custom panel:', e);
    }
    return data;
  }

  // severity legend levels, eg low, medium, high
  async fetchSeverityLegend(pestId: number): Promise<LegendData> {
    const endpoint = ENDPOINTS.SEVERITY_LEGEND;
    const params = { pest_id: pestId };
    let data: LegendData = { legend: [], info: null };
    try {
      const response = await axios.get(endpoint, { params: params });
      data = response.data;
      if (dev)
        console.log(
          'DB >> fetchSeverityLegend',
          '\nEndpoint:',
          endpoint,
          '\nParams:',
          params,
          '\nResponse:',
          response,
          '\nData:',
          data,
        );
    } catch (e) {
      console.log('Error fetching severity legend levels:', e);
    }
    return data;
  }

  async fetchSeverities(params: SeverityParams): Promise<Severity[]> {
    const endpoint = ENDPOINTS.SEVERITIES;
    let data: Severity[] = [];
    try {
      const response = await axios.get(endpoint, { params: params });
      data = response.data;
      if (dev)
        console.log(
          'DB >> fetchSeverities',
          '\nEndpoint:',
          endpoint,
          '\nParams:',
          params,
          '\nResponse:',
          response,
        );
    } catch (e) {
      console.log('Error fetching severities:', e);
    }
    return data;
  }

  async fetchPointDetails(pointDetailsParams: PointDetailsParams): Promise<string> {
    const endpoint = ENDPOINTS.POINT_DETAILS;
    const params = { ...pointDetailsParams };
    try {
      const response = await axios.get(endpoint, { params: params });
      if (dev)
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
}
