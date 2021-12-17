const productionURL = process.env.NODE_ENV === 'production' ? '/vdifn' : ''
const ENDPOINTS = {
  DISEASE_PANEL: `${productionURL}/db/disease_panel`,
  INSECT_PANEL: `${productionURL}/db/insect_panel`,
  SEVERITIES: `${productionURL}/severities`,
  SEVERITY_LEGEND: `${productionURL}/db/severity_legend`,
  SEVERITY_LEGEND_INFO: `${productionURL}/db/severity_legend_info`,
  POINT_DETAILS: `${productionURL}/db/point_details`,
  PEST_INFO: `${productionURL}/db/pest_info`,
  STATION_DETAILS: `${productionURL}/db/station_details`
}

export default ENDPOINTS
