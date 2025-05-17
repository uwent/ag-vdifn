<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type { DegreeDayModel } from '@types';
  import { defaults, panelKey, customPanelState, selectedDDModel, tMinTmax } from '@store';

  const { getModels } = getContext<any>(panelKey);

  let ddModels = $state<DegreeDayModel[]>(getModels() || []);
  let defaultModel = $state(defaults.dd_model);
  let modelId = $state(0);

  function setDegreeDayModel(event: Event) {
    const id = parseInt((event.target as HTMLSelectElement).value);
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
    if ($selectedDDModel) return $selectedDDModel;
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
<fieldset id="model-selection" class="border border-gray-300 p-4 rounded-md">
  <legend class="font-semibold text-base mb-2">Degree Day Model</legend>
  <label for="dd-select" class="block mb-1 text-sm font-medium text-gray-700">Choose model</label>
  <div class="flex">
    <select
      title="Select model"
      id="dd-select"
      name="dd-select"
      class="w-full border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      value={modelId}
      onchange={setDegreeDayModel}
    >
      {#each ddModels as { id, name, name_c }}
        <option value={id}>{$tMinTmax.in_f ? name : name_c}</option>
      {/each}
    </select>
  </div>
</fieldset>
