import { server } from '../msw/server';
import {
  diseasePanelData,
  insectPanelData,
  customPanelData,
  severityLegendData,
  severitiesData,
  pointDetailsData,
} from '../msw/handlers';
import DatabaseClient from '@ts/databaseClient';
import type { PointDetailsParams, SeverityParams } from '@types';

const db = new DatabaseClient();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Disease panel
describe('.fetchDiseasePanel', () => {
  test('returns array of crops with pests', async () => {
    const response = await db.fetchDiseasePanel();
    expect(response).toEqual(diseasePanelData);
  });
});

// Insect panel
describe('.fetchInsectPanel', () => {
  test('returns array of crops with pests', async () => {
    const response = await db.fetchInsectPanel();
    expect(response).toEqual(insectPanelData);
  });
});

describe('.fetchCustomPanel', () => {
  test('returns array of degree day models', async () => {
    const response = await db.fetchCustomPanel();
    expect(response).toEqual(customPanelData);
  });
});

describe('.fetchSeverityLegend', () => {
  test('calls correct url and returns data', async () => {
    const pestId = 1;
    const response = await db.fetchSeverityLegend(pestId);
    expect(response).toEqual(severityLegendData);
  });

  test('returns empty legend on failure', async () => {
    const pestId = 999;
    const response = await db.fetchSeverityLegend(pestId);
    expect(response).toEqual({
      legend: [],
      info: null,
    });
  });
});

describe('.fetchSeverities', () => {
  test('calls correct url and returns data', async () => {
    const params = {
      start_date: new Date().toDateString(),
      end_date: new Date().toDateString(),
      pest_id: 1,
    } as SeverityParams;
    const response = await db.fetchSeverities(params);
    expect(response).toEqual(severitiesData);
  });

  test('returns empty list if call fails', async () => {
    const params = {
      start_date: new Date().toDateString(),
      end_date: new Date().toDateString(),
      pest_id: 999,
    } as SeverityParams;
    const response = await db.fetchSeverities(params);
    expect(response).toEqual([]);
  });
});

describe('.fetchPointDetails', () => {
  test('calls correct url and returns data', async () => {
    const params: PointDetailsParams = {
      latitude: 1,
      longitude: 2,
      start_date: new Date().toDateString(),
      end_date: new Date().toDateString(),
      pest_id: 1,
      panel: 'disease',
    };
    const response = await db.fetchPointDetails(params);
    expect(response).toEqual(pointDetailsData);
  });

  test('returns empty string on failure', async () => {
    const params: PointDetailsParams = {
      latitude: 1,
      longitude: 2,
      start_date: new Date().toDateString(),
      end_date: new Date().toDateString(),
      pest_id: 999,
      panel: 'disease',
    };
    const response = await db.fetchPointDetails(params);
    expect(response).toEqual('');
  });
});
