import DatabaseClient from '../../src/components/common/TypeScript/databaseClient'
import {
  PointDetailsParams,
  SeverityParams,
  StationDetailsParams,
} from '../../src/components/common/TypeScript/types'

describe('fetchSeverities', () => {
  it('calls correct url and returns data', async () => {
    const start_date = new Date().toDateString()
    const end_date = new Date().toDateString()
    const pest_id = 1
    const params: SeverityParams = { start_date, end_date, pest_id }
    const database = new DatabaseClient()

    const response = await database.fetchSeverities(params)

    expect(response).toEqual([
      { lat: 5, long: 10, level: 10 },
      { lat: 50, long: 60, level: 5 },
    ])
  })

  it('returns empty list if call fails', async () => {
    const start_date = new Date().toDateString()
    const end_date = new Date().toDateString()
    const pest_id = 101
    const database = new DatabaseClient()
    const params: SeverityParams = { start_date, end_date, pest_id }

    const response = await database.fetchSeverities(params)

    expect(response).toEqual([])
  })
})

describe('fetchSeverityLegend', () => {
  it('calls correct url and returns data', async () => {
    const database = new DatabaseClient()
    const pestId = 1
    const response = await database.fetchSeverityLegend(pestId)

    expect(response).toEqual([
      {
        name: 'High',
        slug: 'very_high',
        description: 'High likelihood of disease\n(widespread outbreak observed OR 7-day accumulated DSVs ≥ 21 or isolated outbreak observed)',
      },
      {
        name: 'Medium',
        slug: 'medium',
        description: 'Medium likelihood of disease\n(7-day accumulated DSVs ≥ 3 or season accumulated DSVs \u003e 30)',
      },
      {
        name: 'Low',
        slug: 'very_low',
        description: 'Low likelihood of disease\n(7-day accumulated DSVs ≤ 3 and season accumulated DSVs \u003c 30)',
      },
    ])
  })

  it('returns empty list on failure', async () => {
    const database = new DatabaseClient()
    const pestId = 101

    const response = await database.fetchSeverityLegend(pestId)

    expect(response).toEqual([])
  })
})

describe('fetchSeverityLegendInfo', () => {
  it('calls correct url and returns data', async () => {
    const database = new DatabaseClient()
    const pestId = 1
    const response = await database.fetchSeverityLegendInfo(pestId)
    console.log(response)
    expect(response).toEqual('Alfalfa Weevil Info')
  })

  it('returns empty string failure', async () => {
    const database = new DatabaseClient()
    const pestId = 101
    const response = await database.fetchSeverityLegendInfo(pestId)

    expect(response).toEqual('')
  })
})

describe('fetchPointDetails', () => {
  it('calls correct url and returns data', async () => {
    const database = new DatabaseClient()
    const latitude = 100
    const longitude = 200
    const start_date = new Date().toDateString()
    const end_date = new Date().toDateString()
    const pest_id = 1
    const panel = 'disease'
    const params: PointDetailsParams = {
      latitude,
      longitude,
      start_date,
      end_date,
      pest_id,
      panel,
    }

    const response = await database.fetchPointDetails(params)

    expect(response).toEqual('string')
  })

  it('returns empty string on failure', async () => {
    const database = new DatabaseClient()
    const latitude = 100
    const longitude = 200
    const start_date = new Date().toDateString()
    const end_date = new Date().toDateString()
    const pest_id = 101
    const panel = 'disease'
    const params: PointDetailsParams = {
      latitude,
      longitude,
      start_date,
      end_date,
      pest_id,
      panel,
    }

    const response = await database.fetchPointDetails(params)

    expect(response).toEqual('')
  })
})

describe('fetchPestInfo', () => {
  it('calls correct url and returns data', async () => {
    const database = new DatabaseClient()
    const pestId = 1
    const inFahrenheit = true

    const response = await database.fetchPestInfo(pestId, inFahrenheit)

    expect(response).toEqual({
      info: 'info',
      name: 'pest name',
      pest_link: 'www.example.com',
      biofix_date: new Date().toString(),
      end_date_enabled: true,
      tmin: 0,
      tmax: 100,
    })
  })

  it('returns empty object on failure', async () => {
    const database = new DatabaseClient()
    const pestId = 101
    const inFahrenheit = true

    const response = await database.fetchPestInfo(pestId, inFahrenheit)

    expect(response).toEqual({
      info: null,
      name: null,
      pest_link: null,
      biofix_date: null,
      end_date_enabled: null,
      tmin: null,
      tmax: null,
    })
  })
})

// describe('fetchStationDetails', () => {
//   it('calls correct url and returns data', async () => {
//     const database = new DatabaseClient()
//     const name = 'name'
//     const start_date = new Date()
//     const end_date = new Date()
//     const params: StationDetailsParams = { name, start_date, end_date }

//     const response = await database.fetchStationDetails(params)

//     expect(response).toEqual('string')
//   })

//   it('returns empty string on failure', async () => {
//     const database = new DatabaseClient()
//     const name = 'error'
//     const start_date = new Date()
//     const end_date = new Date()
//     const params: StationDetailsParams = { name, start_date, end_date }

//     const response = await database.fetchStationDetails(params)

//     expect(response).toEqual('')
//   })
// })

describe('fetchDiseasePanel', () => {
  it('converts diseases into afflictions', async () => {
    const database = new DatabaseClient()

    const response = await database.fetchDiseasePanel()

    expect(response).toEqual([
      {
        id: 1,
        name: 'potatoes',
        afflictions: [{ id: 2, name: 'late blight' }],
      },
    ])
  })
})

describe('fetchInsectPanel', () => {
  it('converts diseases into afflictions', async () => {
    const database = new DatabaseClient()

    const response = await database.fetchInsectPanel()

    expect(response).toEqual([
      {
        id: 1,
        name: 'potato',
        afflictions: [
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
    ])
  })
})
