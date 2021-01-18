import { stringify } from 'querystring'
import { writable } from 'svelte/store'

export const startDate = writable('')
export const endDate = writable('')
export const afflictionValue = writable()
export const selectedAffliction = writable({})
export const overlayGradient = writable({})
export const overlayLoading = writable(false)
export const customOverlaySubmitted = writable(false)

export const twoPointGradientState = writable({})
export const threePointGradientState = writable({})
export const tMinTmax = writable({})
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

export const diseasePanelState = writable({})
export const insectPanelState = writable({})
export const customPanelState = writable({ selectedGradient: 1 })

export const selectedPanel = writable('')

export const PANELS = {
  INSECT: 'insect',
  DISEASE: 'disease',
  CUSTOM: 'custom',
}
