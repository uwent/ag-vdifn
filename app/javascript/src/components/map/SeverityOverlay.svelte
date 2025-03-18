<script lang="ts">
  import { getContext, untrack } from 'svelte';
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
  } from '@store';

  const { getMap, getGoogle } = getContext<any>(mapKey);
  const map = getMap();
  const google = getGoogle();
  const diseaseOverlay = new OverlayHelper(google, map);
  const insectOverlay = new OverlayHelper(google, map);
  const customOverlay = new OverlayHelper(google, map);

  let currentOverlay = $derived.by(() => {
    switch ($selectedPanel) {
      case 'disease':
        return diseaseOverlay;
      case 'insect':
        return insectOverlay;
      case 'custom':
        return customOverlay;
    }
  });

  let currentParams = $derived.by(() => {
    switch ($selectedPanel) {
      case 'disease':
        return $diseasePanelParams;
      case 'insect':
        return $insectPanelParams;
      case 'custom':
        return $customPanelParams as SeverityParams;
    }
  });

  $effect(() => {
    const overlay = currentOverlay;
    const params = currentParams;

    if (overlay && params) {
      untrack(async () => {
        await updateOverlay(overlay, params, $selectedPanel);
      });
    }
  });

  // Effect for mapExtent changes
  $effect(() => {
    if (currentOverlay) currentOverlay.showBounds(bounds[$mapExtent]);
  });

  // Helper functions
  function closeInfoWindows() {
    diseaseOverlay.closeInfoWindow();
    insectOverlay.closeInfoWindow();
    customOverlay.closeInfoWindow();
  }

  async function updateOverlay(
    overlay: OverlayHelper,
    severityParams: SeverityParams,
    panelType: PanelType,
  ) {
    if (!severityParams) return;

    if (currentOverlay) currentOverlay.hideOverlay();
    closeInfoWindows();

    $overlayLoading = true;

    // fetch data and update overlay
    await overlay.updateOverlay(panelType, severityParams);

    // update panel state
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
        break;
    }

    $mapRange = {
      min: overlay.min || 0,
      max: overlay.max || 0,
    };
    overlay.showOverlay();
    $overlayLoading = false;
  }

  $effect(() => {
    const gradient = $overlayGradient;
    if ($selectedPanel !== 'custom' || !gradient) return;
    customOverlay.updateOverlayGradient(gradient);
  });
</script>
