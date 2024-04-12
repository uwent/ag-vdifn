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
    overlayGradient,
    overlayLoading,
    mapRange,
    mapExtent,
    bounds,
    twoPointGradientState,
    threePointGradientState,
    customOverlaySubmitted
  } from '@store/store'
  import OverlayHelper from './ts/overlayHelper'
  import type { SeverityParams } from '../common/ts/types'

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

  // Handle switching panel overlays
  selectedPanel.subscribe((selectedSeverity: string) => {
    let severities
    let severityParams
    let gradientStore

    if (!currentOverlay) {
      switch(selectedSeverity) {
        case 'insect':
          currentOverlay = insectOverlay
          break
        case 'custom':
          currentOverlay = customOverlay
          break
        default:
          selectedSeverity = 'disease'
          currentOverlay = diseaseOverlay
          break
      }
    }
    closeInfoWindows()
    currentOverlay.hideOverlay()

    switch (selectedSeverity) {
      case 'disease':
        severities = $diseasePanelState.severities
        severityParams = $diseasePanelState.severityParams
        if (!severities && !severityParams) return
        currentOverlay = diseaseOverlay
        break
      case 'insect':
        severities = $insectPanelState.severities
        severityParams = $insectPanelState.severityParams
        if (!severities && !severityParams) return
        currentOverlay = insectOverlay
        break
      case 'custom':
        severities = $customPanelState.severities
        severityParams = $customPanelState.severityParams
        if (!severities && !severityParams) return
        currentOverlay = customOverlay
        if (customOverlaySubmitted) {
          gradientStore = ($customPanelState.selectedGradient == 1) ? 
            $twoPointGradientState :
            $threePointGradientState
        }
        currentOverlay.updateOverlayGradient(gradientStore.gradient)
        break
    }
    currentOverlay.showOverlay()
    overlayLoading.set(false)
    // console.log("Switched to " + selectedSeverity + " panel in " + (new Date().getTime() - startTime) + "ms")
  })

  diseasePanelParams.subscribe(async (severityParams: SeverityParams) => {
    await updateOverlay(diseaseOverlay, severityParams, 'disease')
    diseasePanelState.update(state => ({
      ...state,
      severities: diseaseOverlay.severities,
      severityParams
    }))
  })

  insectPanelParams.subscribe(async (severityParams: SeverityParams) => {
    await updateOverlay(insectOverlay, severityParams, 'insect')
    insectPanelState.update(state => ({
      ...state,
      severities: insectOverlay.severities,
      severityParams
    }))
  })

  customPanelParams.subscribe(async (severityParams: SeverityParams) => {
    await updateOverlay(customOverlay, severityParams, 'custom')
    mapRange.set({
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

  $: currentOverlay.showBounds(bounds[$mapExtent])
</script>
