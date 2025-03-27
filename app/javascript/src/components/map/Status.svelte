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
    max-width: 40%;

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

  const defaultStatus = 'No model submitted';

  function buildPestStatus(state: PestPanelState): string {
    return state.selectedPest ? state.selectedPest.name : defaultStatus;
  }

  function buildCustomStatus(state: CustomPanelState): string {
    if (state.loaded) {
      const units = state.params.in_f ? 'F' : 'C'; // Fixed bug: second unit was 'F', changed to 'C'
      const tMaxText = state.params.t_max ? `/${state.params.t_max}` : '';
      return `Degree day model: ${state.params.t_min}${tMaxText}°${units}`;
    }
    return defaultStatus;
  }

  let status = $derived(() => {
    const currentPanel = $selectedPanel;
    switch (currentPanel) {
      case 'disease':
        return buildPestStatus($diseasePanelState);
      case 'insect':
        return buildPestStatus($insectPanelState);
      case 'custom':
        return buildCustomStatus($customPanelState);
      default:
        return defaultStatus;
    }
  });
</script>

<div class="status-container">
  <div class="status">
    {status()}
  </div>
</div>
