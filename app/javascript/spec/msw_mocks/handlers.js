import { rest } from "msw"
import ENDPOINTS from "../../src/components/common/ts/endpoints"

export const handlers = [
  rest.post(ENDPOINTS.SEVERITIES, async (req, res, ctx) => {
    const { pest_id } = await req.json()
    if (pest_id === 101) {
      return res(ctx.status(500))
    } else {
      return res(
        ctx.status(200),
        ctx.json([
          { lat: 5, long: 10, value: 10 },
          { lat: 50, long: 60, value: 5 },
        ]),
      )
    }
  }),

  rest.get(ENDPOINTS.POINT_DETAILS, async (req, res, ctx) => {
    const pest_id = parseInt(req.url.searchParams.get('pest_id'))

    if (pest_id === 101) return res(ctx.status(500))

    return res(ctx.status(200), ctx.json("string"))
  }),

  rest.get(ENDPOINTS.SEVERITY_LEGEND, async (req, res, ctx) => {
    const pest_id = parseInt(req.url.searchParams.get('pest_id'))

    if (pest_id === 101) return res(ctx.status(500))

    return res(
      ctx.status(200),
      ctx.json([
        {
          name: "High",
          slug: "very_high",
          description: "High likelihood of disease",
        },
        {
          name: "Medium",
          slug: "medium",
          description: "Medium likelihood of disease",
        },
        {
          name: "Low",
          slug: "very_low",
          description: "Low likelihood of disease",
        },
      ]),
    )
  }),

  rest.get(ENDPOINTS.SEVERITY_LEGEND_INFO, async (req, res, ctx) => {
    const pest_id = parseInt(req.url.searchParams.get('pest_id'))

    if (pest_id === 101) return res(ctx.status(500))

    return res(ctx.status(200), ctx.json("Alfalfa Weevil Info"))
  }),

  rest.get(ENDPOINTS.PEST_INFO, async (req, res, ctx) => {
    const pest_id = parseInt(req.url.searchParams.get('pest_id'))

    if (pest_id === 101) return res(ctx.status(500))

    return res(
      ctx.status(200),
      ctx.json({
        info: "info",
        name: "pest name",
        pest_link: "www.example.com",
        biofix_date: new Date().toDateString(),
        end_date_enabled: true,
        tmin: 0,
        tmax: 100,
      }),
    )
  }),

  rest.get(ENDPOINTS.DISEASE_PANEL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: "potato",
          diseases: [
            { id: 1, name: "late blight" },
            { id: 2, name: "black death" },
          ],
        },
      ]),
    )
  }),

  rest.get(ENDPOINTS.INSECT_PANEL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: "potato",
          insects: [
            {
              id: 10,
              name: "grasshopper",
              biofix_date: "2020-10-10",
              end_date_enabled: true,
              t_min: 2,
              t_max: 3,
            },
            {
              id: 45,
              name: "caterpillar",
              biofix_date: "2020-11-10",
              end_date_enabled: false,
              t_min: 4,
              t_max: 5,
            },
          ],
        },
      ]),
    )
  }),
]
