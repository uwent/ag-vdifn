<script lang="ts">
  import { getContext } from 'svelte';
  import OverlayHelper from '@components/map/ts/overlayHelper';
  import type { PanelType, SeverityParams, GradientState } from '@types';
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

  // Using $state for reactive variables
  let currentOverlay = $state<OverlayHelper | null>(null);

  async function closeInfoWindows() {
    diseaseOverlay.closeInfoWindow();
    insectOverlay.closeInfoWindow();
    customOverlay.closeInfoWindow();
  }

  async function updateOverlay(
    overlayHelper: OverlayHelper,
    severityParams: SeverityParams,
    panelType: string,
  ) {
    if (Object.entries(severityParams).length === 0) return;
    overlayLoading.set(true);
    await overlayHelper.updateOverlay(severityParams, panelType);
    overlayLoading.set(false);
  }

  // Setup effect for mapExtent changes
  $effect(() => {
    if (currentOverlay) {
      currentOverlay.showBounds(bounds[$mapExtent]);
    }
  });

  // Handle switching panel overlays
  selectedPanel.subscribe((panelType: PanelType) => {
    let severities;
    let severityParams: SeverityParams;
    let gradientStore: GradientState;

    if (!currentOverlay) {
      switch (panelType) {
        case 'insect':
          currentOverlay = insectOverlay;
          break;
        case 'custom':
          currentOverlay = customOverlay;
          break;
        default:
          panelType = 'disease';
          currentOverlay = diseaseOverlay;
          break;
      }
    }
    closeInfoWindows();
    currentOverlay.hideOverlay();

    switch (panelType) {
      case 'disease':
        const diseaseState = $diseasePanelState;
        severities = diseaseState.severities;
        severityParams = diseaseState.severityParams as SeverityParams;
        if (!severities && !severityParams) return;
        currentOverlay = diseaseOverlay;
        break;
      case 'insect':
        const insectState = $insectPanelState;
        severities = insectState.severities;
        severityParams = insectState.severityParams as SeverityParams;
        if (!severities && !severityParams) return;
        currentOverlay = insectOverlay;
        break;
      case 'custom':
        const customState = $customPanelState;
        severities = customState.severities;
        severityParams = customState.severityParams as SeverityParams;
        if (!severities && !severityParams) return;
        currentOverlay = customOverlay;
        if ($customOverlaySubmitted) {
          gradientStore =
            customState.selectedGradient === 'two-point'
              ? $twoPointGradientState
              : $threePointGradientState;
          currentOverlay.updateOverlayGradient(gradientStore.gradient);
        }
        break;
    }
    currentOverlay.showOverlay();
    overlayLoading.set(false);
  });

  diseasePanelParams.subscribe(async (params) => {
    const severityParams = params as SeverityParams;
    await updateOverlay(diseaseOverlay, severityParams, 'disease');
    diseasePanelState.update((state) => ({
      ...state,
      severities: diseaseOverlay.severities,
      severityParams,
    }));
  });

  insectPanelParams.subscribe(async (params) => {
    const severityParams = params as SeverityParams;
    await updateOverlay(insectOverlay, severityParams, 'insect');
    insectPanelState.update((state) => ({
      ...state,
      severities: insectOverlay.severities,
      severityParams,
    }));
  });

  customPanelParams.subscribe(async (params) => {
    const severityParams = params as SeverityParams;
    await updateOverlay(customOverlay, severityParams, 'custom');
    mapRange.set({
      min: customOverlay.min || 0,
      max: customOverlay.max || 0,
    });
    console.log($mapRange);
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
</script>
