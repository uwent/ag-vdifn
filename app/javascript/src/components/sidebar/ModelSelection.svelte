<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import Modal from '../common/Modal.svelte';
  import type { CropWithPests, PanelType, Pest } from '@types';
  import {
    panelKey,
    selectedDisease,
    selectedInsect,
    pestId,
    defaults,
    dev,
    baseURL,
  } from '@store';

  const { initialModel } = $props<{ initialModel?: string }>();

  const { panelType, getCrops, getPestName } = getContext<{
    panelType: PanelType;
    getCrops: () => CropWithPests[];
    getPestName: () => string;
  }>(panelKey);

  const defaultModel = panelType === 'disease' ? defaults.disease : defaults.insect;
  const selectedPest = panelType === 'disease' ? selectedDisease : selectedInsect;

  let crops = $state<CropWithPests[]>([]);
  let selectedCropValue = $state(0);
  let pestsForCrop = $state<Pest[]>([]);
  let pestName = $state(getPestName());
  let modelId = $state<number | null>(null);
  let showModal = $state(false);

  function getPestsForCrop(event) {
    const cropId = parseInt(event.target.value);
    const cropWithPests = crops.find((crop) => crop.id === cropId);
    if (cropWithPests) {
      pestsForCrop = cropWithPests.pests;
      $pestId = pestsForCrop[0].id;
      $selectedPest = pestsForCrop[0];
    }
  }

  function getCurrentPest(pestId) {
    const pest = pestsForCrop.find((pest) => pest.id === pestId);
    return pest || crops[0].pests[0] || ({} as Pest);
  }

  function setPestValue(event) {
    const value = parseInt(event.target.value);
    $pestId = value;
    $selectedPest = getCurrentPest(value);
  }

  function getPestId(alias: string) {
    const pest = pestsForCrop.find((pest) => pest.local_name === alias);
    return pest ? pest.id : null;
  }

  function selectInitialModel() {
    if (initialModel) {
      let matched = getPestId(initialModel);
      modelId = matched || getPestId(defaultModel);
      if (dev) {
        matched
          ? console.log(`Model selection >> Matched model '${initialModel} (id ${modelId})'`)
          : console.log(`Model selection >> Failed to match model name '${initialModel}'`);
      }
    } else {
      modelId = getPestId(defaultModel) || pestsForCrop[0].id;
      if (dev)
        console.log(`Model selection >> Loaded default model ${defaultModel} (id: ${modelId})`);
    }
  }

  onMount(() => {
    crops = getCrops();
    if (crops.length <= 0) return;
    selectedCropValue = crops[0].id;
    pestsForCrop = crops[0].pests;
    selectInitialModel();
    $selectedPest = getCurrentPest(modelId);
    $pestId = $selectedPest.id;
  });
</script>

<fieldset id="model-selection" class="border border-gray-300 rounded-md p-4 space-y-4">
  <legend class="text-sm font-medium text-gray-700 mb-2">Model Selection</legend>

  <!-- Crop/Host -->
  <label for="crop-select" class="block text-sm font-medium text-gray-700 mb-1">Crop/Host</label>
  <select
    id="crop-select"
    name="crop-select"
    title="Select crop"
    class="w-full border border-gray-300 rounded bg-white bg-opacity-70 px-2 py-1 text-sm focus:outline-none"
    bind:value={selectedCropValue}
    on:change={getPestsForCrop}
    data-testid="crop-select"
  >
    {#each crops as { id, name }}
      <option value={id}>{name}</option>
    {/each}
  </select>

  <!-- Pest -->
  <label for="pest-select" class="block text-sm font-medium text-gray-700 mt-4 mb-1">{pestName}</label>
  <div class="flex items-center gap-2">
    <select
      id="pest-select"
      name="pest-select"
      title="Select model"
      class="flex-1 border border-gray-300 rounded bg-white bg-opacity-70 px-2 py-1 text-sm focus:outline-none"
      value={$pestId}
      on:change={setPestValue}
      data-testid="pest-select"
    >
      {#each pestsForCrop as { id, name }}
        <option value={id}>{name}</option>
      {/each}
    </select>
    {#if crops.length > 0}
      <button
        class="ml-2 px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
        title="Show model information"
        on:click={() => (showModal = true)}
      >
        ?
      </button>
    {/if}
  </div>
</fieldset>

{#if showModal}
  <Modal close={() => (showModal = false)} name={$selectedPest.name}>
    <div class="overflow-hidden break-words mb-4">
      {#if $selectedPest.photo}
        <img
          class="w-[150px] float-left mt-4 mr-4 rounded"
          src="{baseURL}/images/pests/{$selectedPest.photo}"
          alt="pest icon"
        />
      {/if}
      {@html $selectedPest.info}
      {#if $selectedPest.link}
        <div class="mt-2">
          <b>More information:</b>
          <a href={$selectedPest.link} target="_blank" class="text-blue-600 underline">
            {$selectedPest.link}
          </a>
        </div>
      {/if}
    </div>
  </Modal>
{/if}
