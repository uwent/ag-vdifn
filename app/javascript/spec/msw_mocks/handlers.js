import { rest } from 'msw'

export const handlers = [
    rest.post('/db/disease_panel', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                { id: 1, name: 'potatoes', diseases: [{ id: 2, name: 'late blight' }] }
            ])
        )
    }),

    rest.post('/db/severities', (req, res, ctx) => {
        const { pest_id } = req.body
        if (pest_id === 101) {
            return res(
                ctx.status(500)
            )
        } else {
            return res(
                ctx.status(200),
                ctx.json([
                    { "lat": 5, "long": 10, "severity": 10 },
                    { "lat": 50, "long": 60, "severity": 5 }
                ])
            )
        }
    }),

    rest.post('/db/severity_legend', (req, res, ctx) => {
        const { pest_id } = req.body
        if (pest_id === 101) {
            return res(
                ctx.status(500)
            )
        } else {
            return res(
                ctx.status(200),
                ctx.json([
                    { "name": "High", "slug": "very_high", "description": "High likelihood of disease\n(widespread outbreak observed OR 7-day accumulated DSVs ≥ 21 or isolated outbreak observed)" },
                    { "name": "Medium", "slug": "medium", "description": "Medium likelihood of disease\n(7-day accumulated DSVs ≥ 3 or season accumulated DSVs \u003e 30)" },
                    { "name": "Low", "slug": "very_low", "description": "Low likelihood of disease\n(7-day accumulated DSVs ≤ 3 and season accumulated DSVs \u003c 30)" }
                ])
            )
        }
    }),

    rest.post('/db/point_details', (req, res, ctx) => {
        const { pest_id } = req.body
        if (pest_id === 101) {
            return res(
                ctx.status(500)
            )
        } else {
            return res(
                ctx.status(200),
                ctx.json("string")
            )
        }
    }),

    rest.post('/db/pest_info', (req, res, ctx) => {
        const { pest_id } = req.body
        if (pest_id === 101) {
            return res(
                ctx.status(500)
            )
        } else {
            return res(
                ctx.status(200),
                ctx.json({
                    info: "info",
                    name: "pest name",
                    pest_link: "www.example.com",
                    biofix_date: new Date().toString(),
                    end_date_enabled: true,
                    tmin: 0,
                    tmax: 100
                })
            )
        }
    }),

    rest.post('/db/station_details', (req, res, ctx) => {
        const { name } = req.body
        if (name === 'error') {
            return res(
                ctx.status(500)
            )
        } else {
            return res(
                ctx.status(200),
                ctx.json("string")
            )
        }
    }),

    rest.get('/db/disease_panel', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    id: 1, name: "potato", diseases: [
                        { id: 5, name: "late blight", t_min: null, t_max: null, end_date_enabled: true },
                        { id: 10, name: "black death", t_min: null, t_max: null, end_date_enabled: true }
                    ]
                }
            ])
        )
    }),

    rest.get('/db/insect_panel', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    id: 1, name: "potato", insects: [
                        { id: 10, name: "grasshopper", biofix_date: "2020-10-10", end_date_enabled: true, t_min: 2, t_max: 3 },
                        { id: 45, name: "caterpillar", biofix_date: "2020-11-10", end_date_enabled: false, t_min: 4, t_max: 5,  }
                    ]
                }
            ])
        )
    })
]

