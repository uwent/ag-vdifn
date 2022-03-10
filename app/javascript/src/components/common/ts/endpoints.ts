import { baseURL } from '../../../store/store'

const ENDPOINTS = {
  DISEASE_PANEL: `${baseURL}/db/disease_panel`,
  INSECT_PANEL: `${baseURL}/db/insect_panel`,
  SEVERITIES: `${baseURL}/severities`,
  SEVERITY_LEGEND: `${baseURL}/db/severity_legend`,
  SEVERITY_LEGEND_INFO: `${baseURL}/db/severity_legend_info`,
  POINT_DETAILS: `${baseURL}/db/point_details`,
  PEST_INFO: `${baseURL}/db/pest_info`,
  STATION_DETAILS: `${baseURL}/db/station_details`
}

export default ENDPOINTS
