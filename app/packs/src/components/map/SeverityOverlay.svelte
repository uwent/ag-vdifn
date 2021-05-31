<script lang="ts">
  import { getContext } from 'svelte'
  import {
    mapKey,
    diseasePanelParams,
    insectPanelParams,
    customPanelParams,
    diseasePanelState,
    insectPanelState,
    customPanelState,
    selectedPanel,
    PANELS,
    overlayGradient,
    overlayLoading,
    mapMinMapMax,
    twoPointGradientState,
    threePointGradientState,
    customOverlaySubmitted,
  } from '../../store/store'
  import OverlayHelper from './overlayHelper'
  import { SeverityParams } from '../common/TypeScript/types'
  import { get } from 'svelte/store'

  const { getMap, getGoogle } = getContext(mapKey)
  const map = getMap()
  const google = getGoogle()
  const diseaseOverlay = new OverlayHelper(google, map)
  const insectOverlay = new OverlayHelper(google, map)
  const customOverlay = new OverlayHelper(google, map)
  
  let currentOverlay = insectOverlay

  selectedPanel.subscribe((selectedSeverity: string) => {
    let severities
    let severityParams
    let gradientStore
    currentOverlay.hideOverlay()
    currentOverlay.closeInfoWindow()
    overlayLoading.set(true)
    switch (selectedSeverity) {
      case PANELS.DISEASE:
        severities = get(diseasePanelState).severities
        severityParams = get(diseasePanelState).severityParams
        if (!severities && !severityParams) return
        currentOverlay = diseaseOverlay
        break
      case PANELS.INSECT:
        severities = get(insectPanelState).severities
        severityParams = get(insectPanelState).severityParams
        if (!severities && !severityParams) return
        currentOverlay = insectOverlay
        break
      case PANELS.CUSTOM:
        severities = get(customPanelState).severities
        severityParams = get(customPanelState).severityParams
        if (!severities && !severityParams) return
        let selectedGradient = get(customPanelState).selectedGradient
        currentOverlay = customOverlay
        if (customOverlaySubmitted)
          selectedGradient === 1
            ? (gradientStore = get(twoPointGradientState))
            : (gradientStore = get(threePointGradientState))
        currentOverlay.updateOverlayGradient(gradientStore.gradient)
        break
    }
    currentOverlay.showOverlay()
    overlayLoading.set(false)
  })

  diseasePanelParams.subscribe(async (severityParams: SeverityParams) => {
    await updateOverlay(diseaseOverlay, severityParams, PANELS.DISEASE)
    diseasePanelState.update((state) => ({
      ...state,
      severities: diseaseOverlay.severities,
      severityParams,
    }))
  })

  insectPanelParams.subscribe(async (severityParams: SeverityParams) => {
    await updateOverlay(insectOverlay, severityParams, PANELS.INSECT)
    insectPanelState.update((state) => ({
      ...state,
      severities: insectOverlay.severities,
      severityParams,
    }))
  })

  customPanelParams.subscribe(async (severityParams: SeverityParams) => {
    await updateOverlay(customOverlay, severityParams, PANELS.CUSTOM)
    mapMinMapMax.set({
      min: customOverlay.min || 0,
      max: customOverlay.max || 0,
    })
    customPanelState.update((state) => ({
      ...state,
      severities: customOverlay.severities,
      severityParams,
    }))
  })

  overlayGradient.subscribe((gradientMapping) => {
    if (Object.entries(gradientMapping).length === 0) return
    customOverlay.updateOverlayGradient(gradientMapping)
  })

  async function updateOverlay(
    overlayHelper: OverlayHelper,
    severityParams: SeverityParams,
    panelType,
  ) {
    if (Object.entries(severityParams).length === 0) return
    overlayLoading.set(true)
    await overlayHelper.updateOverlay(severityParams, panelType)
    overlayLoading.set(false)
  }
</script>
