import {
  Severity,
  PestInfo,
  SeverityLegend,
  PointDetailsParams,
  SeverityParams,
  StationDetailsParams,
  PestsForCrops,
  CropWithAfflictions,
  CropWithDiseases,
  CropWithInsects,
} from './types'
import axios from 'axios'
import DatabaseClientInterface from './interfaces/databaseClientInterface'
import ENDPOINTS from './endpoints'

export default class DatabaseClient implements DatabaseClientInterface {
  constructor() {
    const token = (document.querySelector(
      '[name=csrf-token]',
    ) as HTMLMetaElement).content
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token
  }

  async fetchDiseasePanel(): Promise<CropWithAfflictions[]> {
    console.log("DB >> Fetching disease data")
    try {
      let cropsWithAfflictions: CropWithAfflictions[] = []
      const response = await axios.get(ENDPOINTS.DISEASE_PANEL)
      console.log("DB >> Response received")
      console.log(response)
      cropsWithAfflictions = response.data.map(
        (cropWithDisease: CropWithDiseases) => {
          const { diseases, ...newData } = {
            ...cropWithDisease,
            afflictions: cropWithDisease.diseases,
          }
          return newData
        },
      )
      return cropsWithAfflictions
    } catch (e) {
      return []
    }
  }

  async fetchInsectPanel(): Promise<CropWithAfflictions[]> {
    console.log("DB >> Fetching insect data")
    try {
      let cropsWithAfflictions: CropWithAfflictions[] = []
      const response = await axios.get(ENDPOINTS.INSECT_PANEL)
      console.log("DB >> Response received")
      console.log(response)
      cropsWithAfflictions = response.data.map(
        (cropWithInsect: CropWithInsects) => {
          const { insects, ...newData } = {
            ...cropWithInsect,
            afflictions: cropWithInsect.insects,
          }
          return newData
        },
      )
      return cropsWithAfflictions
    } catch (e) {
      return []
    }
  }

  async fetchSeverities(severityParams: SeverityParams): Promise<Severity[]> {
    console.log("DB >> Fetching custom data")
    const severities: Severity[] = []
    try {
      const response = await axios.post(ENDPOINTS.SEVERITIES, severityParams)
      console.log("DB >> Response received")
      console.log(response)
      if (response.data.data) {
        response.data.data.forEach((data) => {
          severities.push({
            level: data.total,
            lat: data.lat,
            long: data.long,
            min: response.data.info.min_value,
            max: response.data.info.max_value,
          })
        })
        return severities
      } else {
        return response.data.map(({ severity: severityLevel, ...data }) => ({
          ...data,
          level: severityLevel,
        }))
      }
    } catch (e) {
      return []
    }
  }

  async fetchSeverityLegend(pestId: number): Promise<SeverityLegend[]> {
    try {
      const response = await axios.post(ENDPOINTS.SEVERITY_LEGEND, {
        pest_id: pestId,
      })
      return response.data
    } catch (e) {
      return []
    }
  }

  async fetchSeverityLegendInfo(pestId: number): Promise<string> {
    try {
      const response = await axios.post(ENDPOINTS.SEVERITY_LEGEND_INFO, {
        pest_id: pestId,
      })
      return response.data
    } catch (e) {
      return ''
    }
  }

  async fetchPointDetails(
    pointDetailsParams: PointDetailsParams,
  ): Promise<string> {
    try {
      const response = await axios.post(ENDPOINTS.POINT_DETAILS, {
        ...pointDetailsParams,
      })
      return response.data
    } catch (e) {
      return ''
    }
  }

  async fetchPestInfo(
    pestId: number,
    inFahrenheit: boolean,
  ): Promise<PestInfo> {
    try {
      const response = await axios.post(ENDPOINTS.PEST_INFO, {
        pest_id: pestId,
        in_fahrenheit: inFahrenheit,
      })
      return response.data
    } catch (e) {
      return {
        info: null,
        name: null,
        pest_link: null,
        biofix_date: null,
        end_date_enabled: null,
        tmin: null,
        tmax: null,
      }
    }
  }

  // Weather station display is not implemented
  // async fetchStationDetails(
  //   stationDetailsParams: StationDetailsParams,
  // ): Promise<string> {
  //   try {
  //     const response = await axios.post(ENDPOINTS.STATION_DETAILS, {
  //       ...stationDetailsParams,
  //     })
  //     return response.data
  //   } catch (e) {
  //     return ''
  //   }
  // }
}
