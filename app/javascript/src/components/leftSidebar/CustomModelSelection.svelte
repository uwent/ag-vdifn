<style lang="scss">
  .dd-container {
    display: flex;
  }
</style>

<script lang="ts">
  import { getContext, onMount } from 'svelte';

  import type { DegreeDayModel } from '@types';
  import { panelKey, customPanelState, selectedDDModel, tMinTmax } from '@store';

  const { getModels } = getContext<any>(panelKey);

  let ddModels: DegreeDayModel[] = getModels();
  let defaultModel = 'dd_50_86';
  let modelId = 0;

  function setDegreeDayModel(event) {
    const id = parseInt(event.target.value);
    const model = ddModels.find((model) => {
      return model.id === id;
    });
    if (model) $selectedDDModel = model;
  }

  // If loaded select the loaded model
  // If not loaded, select the model that was last selected
  // Try to find the default model
  function getCurrentModel(): DegreeDayModel {
    if ($customPanelState.loaded) return $customPanelState.selectedModel;
    if ($selectedDDModel.id) return $selectedDDModel;
    let match = ddModels.find((model) => {
      return model.remote_name === defaultModel;
    });
    return match || ddModels[0];
  }

  onMount(() => {
    ddModels = getModels();
    let model = getCurrentModel();
    if (model) {
      $selectedDDModel = model;
      modelId = model.id;
    }
  });
</script>

<fieldset id="model-selection">
  <legend>Degree Day Model</legend>
  <label for="dd-select">Choose model</label>
  <div class="dd-container">
    <select
      on:change={setDegreeDayModel}
      class="dd-select"
      id="dd-select"
      name="dd-select"
      title="Select model"
      value={modelId}
    >
      {#each ddModels as { id, name, name_c }}
        <option value={id}>{$tMinTmax.in_f ? name : name_c}</option>
      {/each}
    </select>
  </div>
</fieldset>
