<style>
  .dd-container {
    display: flex;
  }

  fieldset {
    margin-bottom: 10px;
    padding: 10px;
  }

  legend {
    color: #242424;
    font-size: 0.85em;
    padding: 0 5px;
  }

  label {
    color: #484848;
    font-size: 0.75em;
    padding: 0 5px;
  }

  select {
    padding: 5px 8px;
    text-indent: 0.01px;
    width: 99%;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 0;
    border: 1px solid #d0d0d0;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  select::-ms-expand {
    display: none;
  }
</style>

<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type { DegreeDayModel } from '../common/ts/types';
  import { panelKey, customPanelState, selectedDDModel, tMinTmax } from '../../store/store';

  const { getModels } = getContext(panelKey);

  let ddModels: DegreeDayModel[] = getModels();
  let defaultModel = 'dd_50_86';
  let modelId = 0;

  function setDegreeDayModel(event) {
    const id = parseInt(event.target.value);
    const model = ddModels.find((model) => {
      return model.id === id;
    });
    if (model) selectedDDModel.set(model);
  }

  function getCurrentModel(): DegreeDayModel {
    // If loaded select the loaded model
    if ($customPanelState.loaded && $customPanelState.selectedModel)
      return $customPanelState.selectedModel;
    // If not loaded, select the model that was last selected
    if ($selectedDDModel.id) return $selectedDDModel;
    // Try to find the default model
    let match = ddModels.find((model) => {
      return model.remote_name === defaultModel;
    });
    return match || ddModels[0];
  }

  onMount(() => {
    ddModels = getModels();
    let model = getCurrentModel();
    if (model) {
      selectedDDModel.set(model);
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
        <option value={id}>{$tMinTmax.in_fahrenheit ? name : name_c}</option>
      {/each}
    </select>
  </div>
</fieldset>
