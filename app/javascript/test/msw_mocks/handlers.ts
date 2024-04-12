import { http, HttpResponse } from 'msw';
import ENDPOINTS from '@ts/endpoints';

function getPestId(url): number {
  return parseInt(url.searchParams.get('pest_id') || '');
}

export const handlers = [
  http.post(ENDPOINTS.SEVERITIES, async ({ request }) => {
    const { pest_id } = (await request.json()) as any;
    if (pest_id === 101) {
      return HttpResponse.json(null, { status: 500 });
    } else {
      return HttpResponse.json(
        [
          { lat: 5, long: 10, value: 10 },
          { lat: 50, long: 60, value: 5 },
        ],
        { status: 200 },
      );
    }
  }),

  http.get(ENDPOINTS.POINT_DETAILS, async ({ request }) => {
    const url = new URL(request.url);
    const pest_id = getPestId(url);

    if (pest_id === 101) return HttpResponse.json(null, { status: 500 });

    return HttpResponse.json('string', { status: 200 });
  }),

  http.get(ENDPOINTS.SEVERITY_LEGEND, async ({ request }) => {
    const url = new URL(request.url);
    const pest_id = getPestId(url);

    if (pest_id === 101) return HttpResponse.json(null, { status: 500 });

    return HttpResponse.json(
      [
        {
          name: 'High',
          slug: 'very_high',
          description: 'High likelihood of disease',
        },
        {
          name: 'Medium',
          slug: 'medium',
          description: 'Medium likelihood of disease',
        },
        {
          name: 'Low',
          slug: 'very_low',
          description: 'Low likelihood of disease',
        },
      ],
      { status: 200 },
    );
  }),

  http.get(ENDPOINTS.SEVERITY_LEGEND_INFO, async ({ request }) => {
    const url = new URL(request.url);
    const pest_id = getPestId(url);

    if (pest_id === 101) return HttpResponse.json(null, { status: 500 });

    return HttpResponse.json('Alfalfa Weevil Info', { status: 200 });
  }),

  http.get(ENDPOINTS.PEST_INFO, async ({ request }) => {
    const url = new URL(request.url);
    const pest_id = getPestId(url);

    if (pest_id === 101) return HttpResponse.json(null, { status: 500 });

    return HttpResponse.json(
      {
        info: 'info',
        name: 'pest name',
        pest_link: 'www.example.com',
        biofix_date: new Date().toDateString(),
        end_date_enabled: true,
        tmin: 0,
        tmax: 100,
      },
      { status: 200 },
    );
  }),

  http.get(ENDPOINTS.DISEASE_PANEL, () => {
    return HttpResponse.json(
      [
        {
          id: 1,
          name: 'potato',
          diseases: [
            { id: 1, name: 'late blight' },
            { id: 2, name: 'black death' },
          ],
        },
      ],
      { status: 200 },
    );
  }),

  http.get(ENDPOINTS.INSECT_PANEL, () => {
    return HttpResponse.json(
      [
        {
          id: 1,
          name: 'potato',
          insects: [
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
      ],
      { status: 200 },
    );
  }),
];
