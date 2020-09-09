const productionURL = process.env.NODE_ENV === `production` ? `/vdifn` : ``;
const ENDPOINTS = {
    DISEASE_PANEL: `${productionURL}/db/disease_panel`,
    INSECT_PANEL: `${productionURL}/db/insect_panel`,
    SEVERITIES: `${productionURL}/db/severities`,
    SEVERITY_LEGEND: `${productionURL}/db/severity_legend`,
    POINT_DETAILS: `${productionURL}/db/point_details`,
    PEST_INFO: `${productionURL}/db/pest_info`,
    STATION_DETAILS: `${productionURL}/db/station_details`, 
}

export default ENDPOINTS;