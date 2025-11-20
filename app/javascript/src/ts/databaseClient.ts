import type {
  Severity,
  PointDetailsParams,
  SeverityParams,
  CropWithPests,
  DegreeDayModel,
  LegendData,
} from '../types';
import { dev } from '@store';
import axios from 'axios';
import type DatabaseClientInterface from './databaseClientInterface';
import ENDPOINTS from './endpoints';

export default class DatabaseClient implements DatabaseClientInterface {
  constructor() {
    const token = this.getCsrfToken();
    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
  }

  private getCsrfToken(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }
    const metaElement = document.querySelector('[name=csrf-token]') as HTMLMetaElement;
    return metaElement?.content || null;
  }

  // log activity in development mode
  private log(
    fn: string,
    args: {
      endpoint: string;
      response: any;
      params?: any;
      data?: any;
    },
  ): void {
    if (dev) {
      const { endpoint, response, params, data } = args;
      console.log(
        `DB >> ${fn}`,
        '\nEndpoint:',
        endpoint,
        params ? '\nParams:' : '',
        params,
        '\nResponse:',
        response,
        data ? '\nData:' : '',
        data,
      );
    }
  }

  // get list of crops with diseases for model selection
  async fetchDiseasePanel(): Promise<CropWithPests[]> {
    const endpoint = ENDPOINTS.DISEASE_PANEL;
    let data: CropWithPests[] = [];
    try {
      const response = await axios.get(endpoint);
      data = response.data;
      this.log('fetchDiseasePanel', { endpoint, response, data });
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
      this.log('fetchInsectPanel', { endpoint, response, data });
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
      this.log('fetchCustomPanel', { endpoint, response, data });
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
      this.log('fetchSeverityLegend', { endpoint, response, params, data });
    } catch (e) {
      console.log('Error fetching severity legend:', e);
    }
    return data;
  }

  async fetchSeverities(params: SeverityParams): Promise<Severity[]> {
    const endpoint = ENDPOINTS.SEVERITIES;
    let data: Severity[] = [];
    try {
      const response = await axios.get(endpoint, { params: params });
      data = response.data;
      this.log('fetchSeverities', { endpoint, response, params, data });
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
      this.log('fetchPointDetails', { endpoint, response, params });
      return response.data;
    } catch (e) {
      console.log('Error fetching point details:', e);
      return 'Unable to get data for this location.';
    }
  }
}
