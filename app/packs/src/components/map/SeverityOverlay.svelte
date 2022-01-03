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
    panelNames,
    overlayGradient,
    overlayLoading,
    mapMinMapMax,
    twoPointGradientState,
    threePointGradientState,
    customOverlaySubmitted
  } from '../../store/store'
  import OverlayHelper from './ts/overlayHelper'
  import { SeverityParams } from '../common/ts/types'
  import { get } from 'svelte/store'

  const { getMap, getGoogle } = getContext(mapKey)
  const map = getMap()
  const google = getGoogle()
  const diseaseOverlay = new OverlayHelper(google, map)
  const insectOverlay = new OverlayHelper(google, map)
  const customOverlay = new OverlayHelper(google, map)

  let currentOverlay: OverlayHelper

  async function closeInfoWindows() {
    diseaseOverlay.closeInfoWindow()
    insectOverlay.closeInfoWindow()
    customOverlay.closeInfoWindow()
  }

  async function updateOverlay(
    overlayHelper: OverlayHelper,
    severityParams: SeverityParams,
    panelType
  ) {
    if (Object.entries(severityParams).length === 0) return
    overlayLoading.set(true)
    await overlayHelper.updateOverlay(severityParams, panelType)
    overlayLoading.set(false)
  }

  // TODO: switching panels that already have loaded data takes a long time
  selectedPanel.subscribe((selectedSeverity: string) => {
    let severities
    let severityParams
    let gradientStore
    // let startTime = new Date().getTime()
    console.log("Selected severity: " + selectedSeverity)
    if (!currentOverlay) {
      if (selectedSeverity == panelNames.insect) {
        currentOverlay = insectOverlay
      } else if (selectedSeverity == panelNames.custom) {
        currentOverlay = customOverlay
      } else {
        selectedSeverity = panelNames.disease
        currentOverlay = diseaseOverlay
      }
    }
    closeInfoWindows()
    currentOverlay.hideOverlay()
    switch (selectedSeverity) {
      case panelNames.disease:
        severities = get(diseasePanelState).severities
        severityParams = get(diseasePanelState).severityParams
        if (!severities && !severityParams) return
        currentOverlay = diseaseOverlay
        break
      case panelNames.insect:
        severities = get(insectPanelState).severities
        severityParams = get(insectPanelState).severityParams
        if (!severities && !severityParams) return
        currentOverlay = insectOverlay
        break
      case panelNames.custom:
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
    // console.log("Switched to " + selectedSeverity + " panel in " + (new Date().getTime() - startTime) + "ms")
  })

  diseasePanelParams.subscribe(async (severityParams: SeverityParams) => {
    await updateOverlay(diseaseOverlay, severityParams, panelNames.disease)
    diseasePanelState.update(state => ({
      ...state,
      severities: diseaseOverlay.severities,
      severityParams
    }))
  })

  insectPanelParams.subscribe(async (severityParams: SeverityParams) => {
    await updateOverlay(insectOverlay, severityParams, panelNames.insect)
    insectPanelState.update(state => ({
      ...state,
      severities: insectOverlay.severities,
      severityParams
    }))
  })

  customPanelParams.subscribe(async (severityParams: SeverityParams) => {
    await updateOverlay(customOverlay, severityParams, panelNames.custom)
    mapMinMapMax.set({
      min: customOverlay.min || 0,
      max: customOverlay.max || 0
    })
    customPanelState.update(state => ({
      ...state,
      severities: customOverlay.severities,
      severityParams
    }))
  })

  overlayGradient.subscribe(gradientMapping => {
    if (Object.entries(gradientMapping).length === 0) return
    customOverlay.updateOverlayGradient(gradientMapping)
  })
</script>
