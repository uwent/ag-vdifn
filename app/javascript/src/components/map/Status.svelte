<style lang="scss">
  @import '../../scss/settings.scss';

  .model-status {
    font-style: italic;
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 10;
    padding: 5px 10px;
    border-bottom-right-radius: 0.2em;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 4px 0px 8px rgba(0, 0, 0, 0.3);
    @media #{$medium-up} {
      left: 350px;
    }
  }
</style>

<script lang="ts">
  import { insectPanelState, selectedPanel, diseasePanelState, customPanelState } from '@store';
  import type { CustomPanelState, PestPanelState } from '@types';

  let defaultStatus = 'No model submitted';
  let status = defaultStatus;

  function getStatus(state: PestPanelState) {
    if (state.selectedPest) return state.selectedPest.name;
    return defaultStatus;
  }

  function getDDStatus(state: CustomPanelState) {
    if (state.loaded) {
      let units = state.params.in_f ? '\u2109' : '\u2103';
      let tMaxText = state.params.t_max ? `/${state.params.t_max}` : '';
      return 'Degree day model: ' + state.params.t_min + tMaxText + units;
    }
    return defaultStatus;
  }

  $: {
    switch ($selectedPanel) {
      case 'disease':
        status = getStatus($diseasePanelState);
        break;
      case 'insect':
        status = getStatus($insectPanelState);
        break;
      case 'custom':
        status = getDDStatus($customPanelState);
        break;
    }
  }
</script>

<div class="model-status">
  {status}
</div>
