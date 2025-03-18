<script lang="ts">
  import { getContext } from 'svelte';
  import OverlayHelper from '@components/map/ts/overlayHelper';
  import type { PanelType, SeverityParams } from '@types';
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

  // Helper functions
  function closeInfoWindows() {
    diseaseOverlay.closeInfoWindow();
    insectOverlay.closeInfoWindow();
    customOverlay.closeInfoWindow();
  }

  async function updateOverlay(
    overlayHelper: OverlayHelper,
    severityParams: SeverityParams,
    panelType: string,
  ) {
    if (!severityParams) return;
    overlayLoading.set(true);
    await overlayHelper.updateOverlay(severityParams, panelType);
    overlayLoading.set(false);
  }

  function getOverlayForPanelType(panelType: PanelType): OverlayHelper {
    switch (panelType) {
      case 'insect':
        return insectOverlay;
      case 'custom':
        return customOverlay;
      default:
        return diseaseOverlay;
    }
  }

  function updatePanelState(
    panelType: PanelType,
    overlay: OverlayHelper,
    severityParams: SeverityParams,
  ) {
    switch (panelType) {
      case 'disease':
        $diseasePanelState = {
          ...$diseasePanelState,
          severities: overlay.severities,
          severityParams,
        };
        break;
      case 'insect':
        $insectPanelState = {
          ...$insectPanelState,
          severities: overlay.severities,
          severityParams,
        };
        break;
      case 'custom':
        $mapRange = {
          min: overlay.min || 0,
          max: overlay.max || 0,
        };
        $customPanelState = {
          ...$customPanelState,
          severities: overlay.severities,
          severityParams,
        };
        break;
    }
  }

  function handleCustomGradient(overlay: OverlayHelper) {
    if (!$customOverlaySubmitted) return;

    const customState = $customPanelState;
    const gradientState =
      customState.selectedGradient === 'two-point'
        ? $twoPointGradientState
        : $threePointGradientState;

    console.log('gradient state', gradientState);
    if (gradientState?.gradient) overlay.updateOverlayGradient(gradientState.gradient);
  }

  function switchOverlay(panelType: PanelType) {
    // Set current overlay based on panel type
    const newOverlay = getOverlayForPanelType(panelType);

    // Hide previous overlay and close info windows
    if (currentOverlay) {
      currentOverlay.hideOverlay();
    }
    closeInfoWindows();

    // Get state for the selected panel
    let severities;
    let severityParams: SeverityParams;

    switch (panelType) {
      case 'disease':
        const diseaseState = $diseasePanelState;
        severities = diseaseState.severities;
        severityParams = diseaseState.severityParams;
        break;
      case 'insect':
        const insectState = $insectPanelState;
        severities = insectState.severities;
        severityParams = insectState.severityParams;
        break;
      case 'custom':
        const customState = $customPanelState;
        severities = customState.severities;
        severityParams = customState.severityParams;
        handleCustomGradient(newOverlay);
        break;
    }

    // Only proceed if we have data
    if (!severities && !severityParams) return;

    // Update current overlay and show it
    currentOverlay = newOverlay;
    currentOverlay.showOverlay();
    overlayLoading.set(false);
  }

  // Effect for mapExtent changes
  $effect(() => {
    if (currentOverlay) {
      currentOverlay.showBounds(bounds[$mapExtent]);
    }
  });

  // Effect for selectedPanel changes
  $effect(() => {
    const panelType = $selectedPanel;
    switchOverlay(panelType);
  });

  // Effect for diseasePanelParams changes
  $effect(() => {
    const params = $diseasePanelParams;
    const severityParams = params as SeverityParams;

    (async () => {
      await updateOverlay(diseaseOverlay, severityParams, 'disease');
      updatePanelState('disease', diseaseOverlay, severityParams);
    })();
  });

  // Effect for insectPanelParams changes
  $effect(() => {
    const params = $insectPanelParams;
    const severityParams = params as SeverityParams;

    (async () => {
      await updateOverlay(insectOverlay, severityParams, 'insect');
      updatePanelState('insect', insectOverlay, severityParams);
    })();
  });

  // Effect for customPanelParams changes
  $effect(() => {
    const params = $customPanelParams;
    const severityParams = params as SeverityParams;

    (async () => {
      await updateOverlay(customOverlay, severityParams, 'custom');
      updatePanelState('custom', customOverlay, severityParams);
    })();
  });

  // Effect for overlayGradient changes
  $effect(() => {
    const gradientMapping = $overlayGradient;
    if (!gradientMapping) return;
    customOverlay.updateOverlayGradient(gradientMapping);
  });
</script>
