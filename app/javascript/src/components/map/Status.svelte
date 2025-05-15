<script lang="ts">
  import { insectPanelState, selectedPanel, diseasePanelState, customPanelState } from '@store';
  import type { CustomPanelState, PestPanelState } from '@types';

  const defaultStatus = 'No model submitted';

  function buildPestStatus(state: PestPanelState): string {
    return state.selectedPest ? state.selectedPest.name : defaultStatus;
  }

  function buildCustomStatus(state: CustomPanelState): string {
    if (state.loaded) {
      const units = state.params.in_f ? 'F' : 'C';
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

<div
  class="fixed left-[10px] top-[10px] p-2.5 bg-white rounded shadow-md max-w-[40%] md:left-[360px]"
>
  <div class="font-bold text-[15px]">
    {status()}
  </div>
</div>
