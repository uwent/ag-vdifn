<script lang="ts">
  import { getContext } from 'svelte';
  import OverlayHelper from '@ts/map/overlayHelper';
  import type { SeverityParams } from '@types';
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
    customOverlaySubmitted,
  } from '@store';

  const { getMap, getGoogle } = getContext<any>(mapKey);
  const map = getMap();
  const google = getGoogle();
  const diseaseOverlay = new OverlayHelper(google, map);
  const insectOverlay = new OverlayHelper(google, map);
  const customOverlay = new OverlayHelper(google, map);

  let currentOverlay: OverlayHelper;

  async function closeInfoWindows() {
    diseaseOverlay.closeInfoWindow();
    insectOverlay.closeInfoWindow();
    customOverlay.closeInfoWindow();
  }

  async function updateOverlay(
    overlayHelper: OverlayHelper,
    severityParams: SeverityParams,
    panelType,
  ) {
    if (Object.entries(severityParams).length === 0) return;
    $overlayLoading = true;
    await overlayHelper.updateOverlay(severityParams, panelType);
    $overlayLoading = false;
  }

  // Handle switching panel overlays
  selectedPanel.subscribe((selectedSeverity: string) => {
    let severities;
    let severityParams;
    let gradientStore;

    if (!currentOverlay) {
      switch (selectedSeverity) {
        case 'insect':
          currentOverlay = insectOverlay;
          break;
        case 'custom':
          currentOverlay = customOverlay;
          break;
        default:
          selectedSeverity = 'disease';
          currentOverlay = diseaseOverlay;
          break;
      }
    }
    closeInfoWindows();
    currentOverlay.hideOverlay();

    switch (selectedSeverity) {
      case 'disease':
        severities = $diseasePanelState.severities;
        severityParams = $diseasePanelState.severityParams;
        if (!severities && !severityParams) return;
        currentOverlay = diseaseOverlay;
        break;
      case 'insect':
        severities = $insectPanelState.severities;
        severityParams = $insectPanelState.severityParams;
        if (!severities && !severityParams) return;
        currentOverlay = insectOverlay;
        break;
      case 'custom':
        severities = $customPanelState.severities;
        severityParams = $customPanelState.severityParams;
        if (!severities && !severityParams) return;
        currentOverlay = customOverlay;
        if (customOverlaySubmitted) {
          gradientStore =
            $customPanelState.selectedGradient == 1
              ? $twoPointGradientState
              : $threePointGradientState;
        }
        currentOverlay.updateOverlayGradient(gradientStore.gradient);
        break;
    }
    currentOverlay.showOverlay();
    $overlayLoading = false;
    // console.log("Switched to " + selectedSeverity + " panel in " + (new Date().getTime() - startTime) + "ms")
  });

  diseasePanelParams.subscribe(async (severityParams) => {
    await updateOverlay(diseaseOverlay, severityParams as SeverityParams, 'disease');
    diseasePanelState.update((state) => ({
      ...state,
      severities: diseaseOverlay.severities,
      severityParams,
    }));
  });

  insectPanelParams.subscribe(async (severityParams) => {
    await updateOverlay(insectOverlay, severityParams as SeverityParams, 'insect');
    insectPanelState.update((state) => ({
      ...state,
      severities: insectOverlay.severities,
      severityParams,
    }));
  });

  customPanelParams.subscribe(async (severityParams) => {
    await updateOverlay(customOverlay, severityParams as SeverityParams, 'custom');
    $mapRange = {
      min: customOverlay.min || 0,
      max: customOverlay.max || 0,
    };
    customPanelState.update((state) => ({
      ...state,
      severities: customOverlay.severities,
      severityParams,
    }));
  });

  overlayGradient.subscribe((gradientMapping) => {
    if (Object.entries(gradientMapping).length === 0) return;
    customOverlay.updateOverlayGradient(gradientMapping);
  });

  $: currentOverlay.showBounds(bounds[$mapExtent]);
</script>
