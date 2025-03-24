import DatabaseClient from '@ts/databaseClient';
import type { PointDetailsParams, SeverityParams } from '@types';
import { http, HttpResponse } from 'msw';
import { server } from '../msw_mocks/server';

// Setup handlers before tests
beforeEach(() => {
  server.use(
    http.get('/api/severities', ({ request }) => {
      const url = new URL(request.url);
      const pestId = url.searchParams.get('pest_id');

      if (pestId === '101') {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json([
        { lat: 5, long: 10, level: 10 },
        { lat: 50, long: 60, level: 5 },
      ]);
    }),
    // Add other endpoints here
  );
});

describe('fetchSeverities', () => {
  test('calls correct url and returns data', async () => {
    const start_date = new Date().toDateString();
    const end_date = new Date().toDateString();
    const pest_id = 1;
    const params = { start_date, end_date, pest_id } as SeverityParams;
    const database = new DatabaseClient();

    const response = await database.fetchSeverities(params);

    expect(response).toEqual([
      { lat: 5, long: 10, level: 10 },
      { lat: 50, long: 60, level: 5 },
    ]);
  });

  test('returns empty list if call fails', async () => {
    const start_date = new Date().toDateString();
    const end_date = new Date().toDateString();
    const pest_id = 101;
    const database = new DatabaseClient();
    const params = { start_date, end_date, pest_id } as SeverityParams;

    const response = await database.fetchSeverities(params);

    expect(response).toEqual([]);
  });
});

describe('fetchSeverityLegend', () => {
  test('calls correct url and returns data', async () => {
    const database = new DatabaseClient();
    const pestId = 1;
    const response = await database.fetchSeverityLegend(pestId);

    expect(response).toEqual([
      {
        value: 2,
        name: 'High',
        description: 'High likelihood of disease',
      },
      {
        value: 1,
        name: 'Medium',
        description: 'Medium likelihood of disease',
      },
      {
        value: 0,
        name: 'Low',
        description: 'Low likelihood of disease',
      },
    ]);
  });

  test('returns empty list on failure', async () => {
    const database = new DatabaseClient();
    const pestId = 101;

    const response = await database.fetchSeverityLegend(pestId);

    expect(response).toEqual([]);
  });
});

describe('fetchSeverityLegendInfo', () => {
  test('calls correct url and returns data', async () => {
    const database = new DatabaseClient();
    const pestId = 1;
    const response = await database.fetchSeverityLegendInfo(pestId);
    expect(response).toEqual('Alfalfa Weevil Info');
  });

  test('returns empty string failure', async () => {
    const database = new DatabaseClient();
    const pestId = 101;
    const response = await database.fetchSeverityLegendInfo(pestId);

    expect(response).toEqual('');
  });
});

describe('fetchPointDetails', () => {
  test('calls correct url and returns data', async () => {
    const database = new DatabaseClient();
    const latitude = 100;
    const longitude = 200;
    const start_date = new Date().toDateString();
    const end_date = new Date().toDateString();
    const pest_id = 1;
    const panel = 'disease';
    const params: PointDetailsParams = {
      latitude,
      longitude,
      start_date,
      end_date,
      pest_id,
      panel,
    };

    const response = await database.fetchPointDetails(params);

    expect(response).toEqual('string');
  });

  test('returns empty string on failure', async () => {
    const database = new DatabaseClient();
    const latitude = 100;
    const longitude = 200;
    const start_date = new Date().toDateString();
    const end_date = new Date().toDateString();
    const pest_id = 101;
    const panel = 'disease';
    const params: PointDetailsParams = {
      latitude,
      longitude,
      start_date,
      end_date,
      pest_id,
      panel,
    };

    const response = await database.fetchPointDetails(params);

    expect(response).toEqual('');
  });
});

describe('fetchDiseasePanel', () => {
  test('converts diseases into pests', async () => {
    const database = new DatabaseClient();

    const response = await database.fetchDiseasePanel();

    expect(response).toEqual([
      {
        id: 1,
        name: 'potato',
        pests: [
          { id: 1, name: 'late blight' },
          { id: 2, name: 'black death' },
        ],
      },
    ]);
  });
});

describe('fetchInsectPanel', () => {
  test('converts diseases into pests', async () => {
    const database = new DatabaseClient();

    const response = await database.fetchInsectPanel();

    expect(response).toEqual([
      {
        id: 1,
        name: 'potato',
        pests: [
          {
            id: 10,
            name: 'grasshopper',
            biofix_date: '2020-10-10',
            end_date_enabled: true,
            t_min: 2,
            t_max: 3,
          },
          {
            id: 45,
            name: 'caterpillar',
            biofix_date: '2020-11-10',
            end_date_enabled: false,
            t_min: 4,
            t_max: 5,
          },
        ],
      },
    ]);
  });
});
