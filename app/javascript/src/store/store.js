// import { stringify } from 'querystring'
import { writable } from 'svelte/store'

export const startDate = writable('')
export const endDate = writable('')
export const afflictionValue = writable()
export const afflictionAlias = writable('')
export const overlayGradient = writable({})
export const overlayLoading = writable(false)
export const customOverlaySubmitted = writable(false)
export const env = process.env.NODE_ENV
export const dev = process.env.NODE_ENV === "development"
export const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY

export const selectedAffliction = writable({
  id: undefined,
  name: undefined,
  local_name: undefined,
  biofix_mm: undefined,
  biofix_dd: undefined,
  end_date_enabled: undefined,
  t_max: undefined,
  t_min: undefined,
  info: undefined,
  severity_info: undefined,
  photo: undefined,
  link: undefined,
})

export const twoPointGradientState = writable({
  severityLevels: undefined,
  userValues: undefined,
  mapMax: undefined,
  mapMin: undefined,
  gradient: undefined,
})

export const threePointGradientState = writable({
  severityLevels: undefined,
  userValues: undefined,
  mapMax: undefined,
  mapMin: undefined,
  gradient: undefined,
})

export const tMinTmax = writable({
  t_min: undefined,
  t_max: undefined,
  in_fahrenheit: undefined,
})

export const mapMinMapMax = writable({
  min: 0,
  max: 0,
})

export const panelKey = {}
export const diseasePanelKey = {}
export const insectPanelKey = {}
export const customPanelKey = {}
export const mapKey = {}
export const interfaceKey = {}

export const afflictionParams = writable({})
export const diseasePanelParams = writable({})
export const insectPanelParams = writable({})
export const customPanelParams = writable({})

export const diseasePanelState = writable({
  currentAffliction: undefined,
  severities: undefined,
  severityParams: undefined,
  loaded: false,
})
export const insectPanelState = writable({
  currentAffliction: undefined,
  severities: undefined,
  severityParams: undefined,
  loaded: false,
})
export const customPanelState = writable({
  severities: undefined,
  severityParams: undefined,
  selectedGradient: 1,
  t_min: undefined,
  t_max: undefined,
  in_fahrenheit: undefined,
  loaded: false,
 })

export const selectedPanel = writable('')
// export const selectedPanelName = writable('')
export const panelNames = {
  disease: 'disease',
  insect: 'insect',
  custom: 'custom',
  all: ['disease', 'insect', 'custom']
}

export const defaults = {
  panel: 'disease',
  disease: 'late-blight',
  insect: 'cpb',
  t_min: 50,
  t_max: null,
  in_f: true
}
