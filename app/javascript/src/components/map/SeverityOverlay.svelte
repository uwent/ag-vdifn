<script lang="ts">
  import { getContext } from "svelte";
  import {
    customOverlaySubmitted,
    mapKey,
    afflictionParams,
    customParams,
    overlayGradient,
    mapMinMapMax,
    overlayLoading,
  } from "../../store/store";
  import OverlayHelper from "./overlayHelper";
  import { SeverityParams } from "../common/TypeScript/types";
  const { getMap, getGoogle } = getContext(mapKey);
  const map = getMap();
  const google = getGoogle();
  const overlayHelper = new OverlayHelper(google, map);

  afflictionParams.subscribe(async (severityParams: SeverityParams) => {
    if (Object.entries(severityParams).length === 0) return;
    overlayLoading.set(true);
    customOverlaySubmitted.set(false);
    mapMinMapMax.set(null);
    await overlayHelper.updateOverlay(severityParams);
    overlayLoading.set(false);
  });

  customParams.subscribe(async (severityParams: SeverityParams) => {
    if (Object.entries(severityParams).length === 0) return;
    overlayLoading.set(true);
    await overlayHelper.updateOverlay(severityParams);
    mapMinMapMax.set({ min: overlayHelper.min, max: overlayHelper.max });
    overlayLoading.set(false);
  });

  overlayGradient.subscribe((gradientMapping) => {
    if (Object.entries(gradientMapping).length === 0) return;
    overlayHelper.updateOverlayGradient(gradientMapping);
  });
</script>
