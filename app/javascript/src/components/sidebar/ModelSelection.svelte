<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

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

  const { initialModel } = $props<{
    initialModel?: string;
  }>();

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

  function getPestsForCrop(event: Event) {
    const cropId = parseInt((event.target as HTMLSelectElement).value);
    const cropWithPests = crops.find((crop) => crop.id === cropId);
    if (cropWithPests) {
      pestsForCrop = cropWithPests.pests;
      $pestId = pestsForCrop[0].id;
      $selectedPest = pestsForCrop[0];
    }
  }

  function getCurrentPest(pestId: number | null) {
    const pest = pestsForCrop.find((pest) => pest.id === pestId);
    return pest ?? crops[0].pests[0] ?? ({} as Pest);
  }

  function setPestValue(event: Event) {
    const value = parseInt((event.target as HTMLSelectElement).value);
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
      if (dev) console.log(`Model selection >> Loaded default model ${defaultModel} (id: ${modelId})`);
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

<fieldset
  id="model-selection"
  class="w-full border border-gray-300 p-6 rounded-xl mb-6 max-w-2xl mx-auto shadow-sm"
>
  <legend class="font-semibold text-xl mb-4">Model Selection</legend>

  <label for="crop-select" class="block mb-2 text-base font-medium">Crop/Host</label>
  <select
    onchange={getPestsForCrop}
    bind:value={selectedCropValue}
    id="crop-select"
    name="crop-select"
    data-testid="crop-select"
    title="Select crop"
    class="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-base mb-6 cursor-pointer shadow"
  >
    {#each crops as { id, name }}
      <option value={id}>{name}</option>
    {/each}
  </select>

  <label for="pest-select" class="block mb-2 text-base font-medium">{pestName}</label>
  <div class="flex items-center gap-4">
    <select
      onchange={setPestValue}
      id="pest-select"
      name="pest-select"
      data-testid="pest-select"
      title="Select model"
      value={$pestId}
      class="flex-1 px-4 py-3 border border-gray-300 rounded-md bg-white text-base cursor-pointer shadow"
    >
      {#each pestsForCrop as { id, name }}
        <option value={id}>{name}</option>
      {/each}
    </select>

    {#if crops.length > 0}
      <button
        title="Show model information"
        onclick={() => (showModal = true)}
        class="text-gray-500 hover:text-black transition"
      >
        <FontAwesomeIcon icon={faCircleQuestion} class="text-lg -ml-1" />
      </button>
    {/if}
  </div>
</fieldset>

{#if showModal}
  <Modal
    close={() => {
      showModal = false;
    }}
    name={$selectedPest.name}
  >
    <div class="overflow-hidden break-words mb-4">
      {#if $selectedPest.photo}
        <img
          class="float-left mr-4 mt-2 mb-2 rounded-md w-[150px]"
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
