// import { stringify } from 'querystring'
import { writable } from 'svelte/store'

export const startDate = writable('')
export const endDate = writable('')
export const afflictionValue = writable()
export const overlayGradient = writable({})
export const overlayLoading = writable(false)
export const customOverlaySubmitted = writable(false)

export const selectedAffliction = writable({
  id: undefined,
  name: undefined,
  photo: undefined,
  info: undefined,
  link: undefined,
  biofix_date: undefined,
  end_date_enabled: undefined,
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
})
export const insectPanelState = writable({
  currentAffliction: undefined,
  severities: undefined,
  severityParams: undefined,
})
export const customPanelState = writable({
  severities: undefined,
  severityParams: undefined,
  selectedGradient: 1,
  t_min: undefined,
  t_max: undefined,
  in_fahrenheit: undefined,
 })

export const selectedPanel = writable('')

export const PANELS = {
  INSECT: 'insect',
  DISEASE: 'disease',
  CUSTOM: 'custom',
}
