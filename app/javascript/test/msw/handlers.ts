import { http, HttpResponse } from 'msw';
import ENDPOINTS from '@ts/endpoints';

function getPestId(url): number {
  return parseInt(url.searchParams.get('pest_id') || '');
}

export const diseasePanelData = [
  {
    id: 1,
    name: 'potato',
    diseases: [
      { id: 1, name: 'late blight' },
      { id: 2, name: 'black death' },
    ],
  },
];

export const insectPanelData = [
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
];

export const customPanelData = [
  {
    id: 0,
    name: 'base 50',
    name_c: 'base 10',
    remote_name: 'base_50',
    t_min: 10,
    t_max: 20,
  },
];

export const severityLegendData = {
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
};

export const severitiesData = [
  { lat: 1, lng: 1, value: 1 },
  { lat: 2, lng: 2, value: 2 },
];

export const pointDetailsData = '<html>Point details</html>';

export const handlers = [
  http.get(ENDPOINTS.DISEASE_PANEL, () => {
    return HttpResponse.json(diseasePanelData, { status: 200 });
  }),
  http.get(ENDPOINTS.INSECT_PANEL, () => {
    return HttpResponse.json(insectPanelData, { status: 200 });
  }),
  http.get(ENDPOINTS.DD_MODELS, () => {
    return HttpResponse.json(customPanelData, { status: 200 });
  }),
  http.get(ENDPOINTS.SEVERITY_LEGEND, ({ request }) => {
    const url = new URL(request.url);
    const pest_id = getPestId(url);
    if (pest_id === 999) return HttpResponse.json(null, { status: 500 });
    return HttpResponse.json(severityLegendData, { status: 200 });
  }),
  http.get(ENDPOINTS.SEVERITIES, ({ request }) => {
    const url = new URL(request.url);
    const pest_id = getPestId(url);
    if (pest_id === 999) return HttpResponse.json(null, { status: 500 });
    return HttpResponse.json(severitiesData, { status: 200 });
  }),
  http.get(ENDPOINTS.POINT_DETAILS, ({ request }) => {
    const url = new URL(request.url);
    const pest_id = getPestId(url);
    if (pest_id === 999) return HttpResponse.json(null, { status: 500 });
    return HttpResponse.json(pointDetailsData, { status: 200 });
  }),
];
