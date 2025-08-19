import { http, HttpResponse } from 'msw';
import ENDPOINTS from '@ts/endpoints';

// helper to get pest_id from the URL
function getPestId(url: URL): number {
  return parseInt(url.searchParams.get('pest_id') || '');
}

// Mock data for the API responses
export const mockData = {
  diseasePanel: [
    {
      id: 1,
      name: 'potato',
      diseases: [
        { id: 1, name: 'late blight' },
        { id: 2, name: 'black death' },
      ],
    },
  ],

  insectPanel: [
    {
      id: 1,
      name: 'potato',
      insects: [
        {
          id: 10,
          name: 'grasshopper',
          biofix_date: '2020-10-10',
          t_min: 2,
          t_max: 3,
        },
        {
          id: 45,
          name: 'caterpillar',
          biofix_date: '2020-11-10',
          t_min: 4,
          t_max: 5,
        },
      ],
    },
  ],

  customPanel: [
    {
      id: 0,
      name: 'base 50',
      name_c: 'base 10',
      remote_name: 'base_50',
      t_min: 10,
      t_max: 20,
    },
  ],

  severityLegend: {
    legend: [
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
    ],
    info: 'It is a very deadly disease',
  },

  severities: [
    { lat: 1, lng: 1, value: 1 },
    { lat: 2, lng: 2, value: 2 },
  ],

  pointDetails: '<html>Point details</html>',
};

// Mock API handlers
export const handlers = [
  http.get(ENDPOINTS.DISEASE_PANEL, () => {
    return HttpResponse.json(mockData.diseasePanel, { status: 200 });
  }),
  http.get(ENDPOINTS.INSECT_PANEL, () => {
    return HttpResponse.json(mockData.insectPanel, { status: 200 });
  }),
  http.get(ENDPOINTS.DD_MODELS, () => {
    return HttpResponse.json(mockData.customPanel, { status: 200 });
  }),
  http.get(ENDPOINTS.SEVERITY_LEGEND, ({ request }) => {
    const url = new URL(request.url);
    const pest_id = getPestId(url);
    if (pest_id === 999) return HttpResponse.json(null, { status: 500 });
    return HttpResponse.json(mockData.severityLegend, { status: 200 });
  }),
  http.get(ENDPOINTS.SEVERITIES, ({ request }) => {
    const url = new URL(request.url);
    const pest_id = getPestId(url);
    if (pest_id === 999) return HttpResponse.json(null, { status: 500 });
    return HttpResponse.json(mockData.severities, { status: 200 });
  }),
  http.get(ENDPOINTS.POINT_DETAILS, ({ request }) => {
    const url = new URL(request.url);
    const pest_id = getPestId(url);
    if (pest_id === 999) return HttpResponse.json(null, { status: 500 });
    return HttpResponse.json(mockData.pointDetails, { status: 200 });
  }),
];
