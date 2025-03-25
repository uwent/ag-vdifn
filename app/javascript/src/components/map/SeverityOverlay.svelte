<script lang="ts">
  import { getContext, untrack } from 'svelte';
  import OverlayHelper from '@components/map/ts/overlayHelper';
  import type { CustomPanelState, PanelType, PestPanelState, SeverityParams } from '@types';
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
    selectedPalette,
  } from '@store';
  import GradientHelper from './ts/gradientHelper';

  const { getMap, getGoogle } = getContext<any>(mapKey);
  const map = getMap();
  const google = getGoogle();
  const diseaseOverlay = new OverlayHelper(google, map);
  const insectOverlay = new OverlayHelper(google, map);
  const customOverlay = new OverlayHelper(google, map);

  let severityGradient = $derived.by(() => {
    const gradientHelper = new GradientHelper($selectedPalette);
    return gradientHelper.mapRangeToColors({
      min: 0,
      max: 3, // a final 'infinity' level is automatically added to the gradient
      totalLevels: 5,
    });
  });

  let selected = $derived.by<{
    overlay: OverlayHelper;
    state: PestPanelState | CustomPanelState;
    params: SeverityParams;
  }>(() => {
    const panel = $selectedPanel;
    switch (panel) {
      case 'disease':
        return {
          overlay: diseaseOverlay,
          state: $diseasePanelState,
          params: $diseasePanelParams,
        };
      case 'insect':
        return { overlay: insectOverlay, state: $insectPanelState, params: $insectPanelParams };
      case 'custom':
        return {
          overlay: customOverlay,
          state: $customPanelState,
          params: $customPanelParams as SeverityParams,
        };
    }
  });

  function closeInfoWindows() {
    diseaseOverlay.closeInfoWindow();
    insectOverlay.closeInfoWindow();
    customOverlay.closeInfoWindow();
  }

  function hideOverlays() {
    diseaseOverlay.hideOverlay();
    insectOverlay.hideOverlay();
    customOverlay.hideOverlay();
  }

  async function updateOverlay(
    overlay: OverlayHelper,
    severityParams: SeverityParams,
    panelType: PanelType,
  ) {
    if (!severityParams) return;

    // check if overlay is already loaded
    if (selected.state.severities && selected.state.severityParams === severityParams)
      return overlay.showOverlay();

    // fetch data and update overlay
    $overlayLoading = true;
    await overlay.updateOverlay(panelType, severityParams);

    // update panel state with severities and params
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
        $customPanelState = {
          ...$customPanelState,
          severities: overlay.severities,
          severityParams,
        };
        $mapRange = {
          min: overlay.min || 0,
          max: overlay.max || 0,
        };
        break;
    }

    overlay.showOverlay();
    $overlayLoading = false;
  }

  // Effect for panel changes
  $effect(() => {
    const overlay = selected.overlay;
    const params = selected.params;

    closeInfoWindows();
    hideOverlays();

    if (overlay && params) {
      untrack(async () => {
        await updateOverlay(overlay, params, $selectedPanel);
      });
    }
  });

  // Show and update bounds when map extent changes
  $effect(() => {
    if (selected.overlay) selected.overlay.showBounds(bounds[$mapExtent]);
  });

  // For custom panel, no colors are initially drawn on the map because the gradient is not set
  $effect(() => {
    const gradient = $selectedPanel === 'custom' ? $overlayGradient : severityGradient;
    selected.overlay.updateOverlayGradient(gradient);
  });
</script>
