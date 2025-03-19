<style lang="scss">
  .pest-container {
    display: flex;
  }

  button {
    margin-left: 10px;
    border: 1px solid #d0d0d0;
    border-radius: 3px;
    cursor: pointer;
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
  }

  select::-ms-expand {
    display: none;
  }

  label {
    padding: 0;
  }

  .clear {
    clear: both;
    height: 0.5em;
  }

  .modal__pest-info {
    overflow: hidden;
    word-break: break-word;
    margin-bottom: 1em;
  }

  .modal__pest-icon {
    width: 150px;
    float: left;
    margin-top: 1em;
    margin-right: 10px;
    border-radius: 3px;
  }
</style>

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

  let showModal = $state(false);
  let crops = $state<CropWithPests[]>([]);
  let selectedCropValue = $state(0);
  let pestsForCrop = $state<Pest[]>([]);
  let pestName = $state(getPestName());
  let modelId = $state<number | null>(null);

  function getPestsForCrop(event) {
    const cropId = parseInt(event.target.value);
    const cropWithPests = crops.find((crop) => {
      return crop.id === cropId;
    });
    if (cropWithPests) {
      pestsForCrop = cropWithPests.pests;
      pestId.update((_) => pestsForCrop[0].id);
      $pestId = pestsForCrop[0].id;
      $selectedPest = pestsForCrop[0];
    }
  }

  function getCurrentPest(pestId) {
    const pest = pestsForCrop.find((pest) => {
      return pest.id === pestId;
    });
    if (pest) return pest;
    return crops[0].pests[0] || ({} as Pest);
  }

  function setPestValue(event) {
    const value = parseInt(event.target.value);
    $pestId = value;
    $selectedPest = getCurrentPest(value);
  }

  function getPestId(alias: string) {
    const pest = pestsForCrop.find((pest) => {
      return pest.local_name === alias;
    });
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
      if (dev) console.log(`Model selection >> Loaded default model '${defaultModel} (${modelId})`);
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

<fieldset id="model-selection">
  <legend>Model Selection</legend>
  <label for="crop-select">Crop/Host</label>
  <select
    onchange={getPestsForCrop}
    bind:value={selectedCropValue}
    id="crop-select"
    name="crop-select"
    data-testid="crop-select"
    title="Select crop"
  >
    {#each crops as { id, name }}
      <option value={id}>{name}</option>
    {/each}
  </select>
  <div class="clear"></div>
  <label for="pest-select">{pestName}</label>
  <div class="pest-container">
    <select
      onchange={setPestValue}
      class="pest-select"
      id="pest-select"
      name="pest-select"
      data-testid="pest-select"
      title="Select model"
      value={$pestId}
    >
      {#each pestsForCrop as { id, name }}
        <option value={id}>{name}</option>
      {/each}
    </select>
    {#if crops.length > 0}
      <button title="Show model information" onclick={() => (showModal = true)}>?</button>
    {/if}
  </div>
</fieldset>
{#if showModal}
  <Modal name={$selectedPest.name} on:close={() => (showModal = false)}>
    <div class="modal__pest-info">
      {#if $selectedPest.photo}
        <img
          class="modal__pest-icon"
          src="{baseURL}/images/pests/{$selectedPest.photo}"
          alt="pest icon"
        />
      {/if}
      {@html $selectedPest.info}
      {#if $selectedPest.link}
        <b>More information:</b>
        <a href={$selectedPest.link} target="_blank">{$selectedPest.link}</a>
      {/if}
    </div>
  </Modal>
{/if}
