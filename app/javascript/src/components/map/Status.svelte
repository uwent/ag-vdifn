<style lang="scss">
  @use '../../scss/variables.scss' as vars;

  .status-container {
    position: fixed;
    left: 10px;
    top: 10px;
    padding: 5px 10px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    @media #{vars.$medium-up} {
      left: 360px;
    }
  }

  .status {
    font-weight: bold;
    font-size: 15px;
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
      let units = state.params.in_f ? 'F' : 'F';
      let tMaxText = state.params.t_max ? `/${state.params.t_max}` : '';
      return 'Degree day model: ' + state.params.t_min + tMaxText + '°' + units;
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

<div class="status-container">
  <div class="status">
    {status}
  </div>
</div>
