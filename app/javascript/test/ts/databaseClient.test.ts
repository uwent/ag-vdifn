import { server } from '../msw/server';
import { http, HttpResponse } from 'msw';
import { vi } from 'vitest';
import ENDPOINTS from '@ts/endpoints';
import { mockData } from '../msw/handlers';
import DatabaseClient from '@ts/databaseClient';
import type { PointDetailsParams, SeverityParams } from '@types';

const db = new DatabaseClient();
const consoleSpy = vi.spyOn(console as Console, 'log');
const store = await import('@store');

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Disease panel
describe('.fetchDiseasePanel', () => {
  test('returns array of crops with pests', async () => {
    const response = await db.fetchDiseasePanel();
    expect(response).toEqual(mockData.diseasePanel);
  });

  test('handles error gracefully', async () => {
    server.use(
      http.get(ENDPOINTS.DISEASE_PANEL, () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );
    const response = await db.fetchDiseasePanel();
    expect(response).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching disease panel:', expect.any(Error));
  });

  test('logs debug messages in dev mode', async () => {
    Object.defineProperty(store, 'dev', {
      get: () => true,
    });
    await db.fetchDiseasePanel();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

// Insect panel
describe('.fetchInsectPanel', () => {
  test('returns array of crops with pests', async () => {
    const response = await db.fetchInsectPanel();
    expect(response).toEqual(mockData.insectPanel);
  });

  test('handles error gracefully', async () => {
    server.use(
      http.get(ENDPOINTS.INSECT_PANEL, () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );
    const response = await db.fetchInsectPanel();
    expect(response).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching insect panel:', expect.any(Error));
  });

  test('logs debug messages in dev mode', async () => {
    Object.defineProperty(store, 'dev', {
      get: () => true,
    });
    await db.fetchInsectPanel();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('.fetchCustomPanel', () => {
  test('returns array of degree day models', async () => {
    const response = await db.fetchCustomPanel();
    expect(response).toEqual(mockData.customPanel);
  });

  test('handles error gracefully', async () => {
    server.use(
      http.get(ENDPOINTS.DD_MODELS, () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );
    const response = await db.fetchCustomPanel();
    expect(response).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching custom panel:', expect.any(Error));
  });

  test('logs debug messages in dev mode', async () => {
    Object.defineProperty(store, 'dev', {
      get: () => true,
    });
    await db.fetchCustomPanel();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('.fetchSeverityLegend', () => {
  test('calls correct url and returns legend', async () => {
    const pestId = 1;
    const response = await db.fetchSeverityLegend(pestId);
    expect(response).toEqual(mockData.severityLegend);
  });

  test('returns empty legend on invalid pest id', async () => {
    const pestId = 999;
    const response = await db.fetchSeverityLegend(pestId);
    expect(response).toEqual({
      legend: [],
      info: null,
    });
  });

  test('returns empty legend object on server error', async () => {
    server.use(
      http.get(ENDPOINTS.SEVERITY_LEGEND, () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );
    const response = await db.fetchSeverityLegend(1);
    expect(response).toEqual({
      legend: [],
      info: null,
    });
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching severity legend:', expect.any(Error));
  });

  test('logs debug messages in dev mode', async () => {
    Object.defineProperty(store, 'dev', {
      get: () => true,
    });
    await db.fetchSeverityLegend(1);
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('.fetchSeverities', () => {
  const validParams: SeverityParams = {
    start_date: new Date().toDateString(),
    end_date: new Date().toDateString(),
    pest_id: 1,
  };

  const invalidParams: SeverityParams = {
    start_date: new Date().toDateString(),
    end_date: new Date().toDateString(),
    pest_id: 999,
  };

  test('calls correct url and returns data', async () => {
    const response = await db.fetchSeverities(validParams);
    expect(response).toEqual(mockData.severities);
  });

  test('returns empty array on invalid pest id', async () => {
    const response = await db.fetchSeverities(invalidParams);
    expect(response).toEqual([]);
  });

  test('returns empty array on server error', async () => {
    server.use(
      http.get(ENDPOINTS.SEVERITIES, () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );
    const response = await db.fetchSeverities(validParams);
    expect(response).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching severities:', expect.any(Error));
  });

  test('logs debug messages in dev mode', async () => {
    Object.defineProperty(store, 'dev', {
      get: () => true,
    });
    await db.fetchSeverities(validParams);
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('.fetchPointDetails', () => {
  const validParams: PointDetailsParams = {
    latitude: 1,
    longitude: 2,
    start_date: new Date().toDateString(),
    end_date: new Date().toDateString(),
    pest_id: 1,
    panel: 'disease',
  };

  const invalidParams: PointDetailsParams = {
    latitude: 1,
    longitude: 2,
    start_date: new Date().toDateString(),
    end_date: new Date().toDateString(),
    pest_id: 999,
    panel: 'disease',
  };

  test('calls correct url and returns data', async () => {
    const response = await db.fetchPointDetails(validParams);
    expect(response).toEqual(mockData.pointDetails);
  });

  test('returns empty string on failure', async () => {
    const response = await db.fetchPointDetails(invalidParams);
    expect(response).toEqual('Unable to get data for this location.');
  });

  test('returns empty array on server error', async () => {
    server.use(
      http.get(ENDPOINTS.POINT_DETAILS, () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );
    const response = await db.fetchPointDetails(validParams);
    expect(response).toEqual('Unable to get data for this location.');
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching point details:', expect.any(Error));
  });

  test('logs debug messages in dev mode', async () => {
    Object.defineProperty(store, 'dev', {
      get: () => true,
    });
    await db.fetchPointDetails(validParams);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
