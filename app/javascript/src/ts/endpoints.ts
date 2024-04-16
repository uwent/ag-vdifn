import { baseURL } from '@store';

const ENDPOINTS = {
  DISEASE_PANEL: `${baseURL}/db/disease_panel`,
  INSECT_PANEL: `${baseURL}/db/insect_panel`,
  DD_MODELS: `${baseURL}/db/dd_models`,
  PEST_INFO: `${baseURL}/db/pest_info`,
  SEVERITY_LEGEND: `${baseURL}/db/severity_legend`,
  SEVERITY_LEGEND_INFO: `${baseURL}/db/severity_legend_info`,
  SEVERITIES: `${baseURL}/severities`,
  POINT_DETAILS: `${baseURL}/point_details`,
};

export default ENDPOINTS;
