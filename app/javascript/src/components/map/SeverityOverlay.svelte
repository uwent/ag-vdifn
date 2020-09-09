<script lang="ts">
  import { getContext } from "svelte";
  import { mapKey, submitParams } from "../../store/store";
  import GoogleWrapper from "./TypeScript/googleWrapper";
  import OverlayHelper from './overlayHelper'
  const { getMap, getGoogle } = getContext(mapKey)
  const map = getMap();
  const google = getGoogle();
  const overlayHelper = new OverlayHelper(google, map)

  submitParams.subscribe(async (severityParams) => {
    if (Object.entries(severityParams).length === 0)
      return;
      await overlayHelper.updateOverlay(severityParams);
  })
  
</script>




