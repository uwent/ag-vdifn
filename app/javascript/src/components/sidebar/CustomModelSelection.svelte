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
    const model = ddModels.find((model) => model.id === id);
    if (model) $selectedDDModel = model;
  }

  function getCurrentModel(): DegreeDayModel {
    if ($customPanelState.loaded) return $customPanelState.selectedModel;
    if ($selectedDDModel) return $selectedDDModel;
    let match = ddModels.find((model) => model.remote_name === defaultModel);
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

<fieldset id="model-selection" class="mb-4">
  <legend class="text-sm font-semibold text-gray-700 mb-2">Degree Day Model</legend>
  <label for="dd-select" class="block text-sm text-gray-600 mb-1">Choose model</label>
  <div class="flex">
    <select
      title="Select model"
      class="block w-full max-w-xs px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      id="dd-select"
      name="dd-select"
      value={modelId}
      onchange={setDegreeDayModel}
    >
      {#each ddModels as { id, name, name_c }}
        <option value={id}>{$tMinTmax.in_f ? name : name_c}</option>
      {/each}
    </select>
  </div>
</fieldset>
