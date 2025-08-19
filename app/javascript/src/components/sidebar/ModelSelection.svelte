<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import Frame from '@components/common/Frame.svelte';
  import { IconHelpCircleFilled as IconHelp } from '@tabler/icons-svelte';
  import type { CropWithPests, PanelType, Pest } from '@types';
  import {
    panelKey,
    selectedDisease,
    selectedInsect,
    pestId,
    defaults,
    dev,
    baseURL,
    modal,
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

{#snippet modalContent()}
  <div class="mb-4 overflow-hidden break-words">
    {#if $selectedPest.photo}
      <img
        class="float-left mt-2 mr-4 mb-2 rounded-md w-[150px]"
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
{/snippet}

<Frame title="Model Selection">
  <label for="crop-select">Crop/Host</label>
  <select
    onchange={getPestsForCrop}
    bind:value={selectedCropValue}
    id="crop-select"
    name="crop-select"
    data-testid="crop-select"
    title="Select crop"
    class="bg-white shadow mb-3 px-4 py-3 border border-gray-300 rounded-md w-full cursor-pointer"
  >
    {#each crops as { id, name }}
      <option value={id}>{name}</option>
    {/each}
  </select>

  <label for="pest-select">{pestName}</label>
  <div class="flex items-center gap-4">
    <select
      onchange={setPestValue}
      id="pest-select"
      name="pest-select"
      data-testid="pest-select"
      title="Select model"
      value={$pestId}
      class="flex-1 bg-white shadow px-4 py-3 border border-gray-300 rounded-md cursor-pointer"
    >
      {#each pestsForCrop as { id, name }}
        <option value={id}>{name}</option>
      {/each}
    </select>

    {#if crops.length > 0}
      <button
        class="text-gray-500 hover:text-black transition cursor-pointer"
        title="Show model information"
        onclick={() =>
          modal.set({
            name: $selectedPest.name,
            content: modalContent,
          })}
      >
        <IconHelp />
      </button>
    {/if}
  </div>
</Frame>
