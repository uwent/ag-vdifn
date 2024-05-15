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
  import type { CropWithPests, Pest } from '@types';
  import {
    panelKey,
    selectedDisease,
    selectedInsect,
    pestId,
    defaults,
    env,
    baseURL,
  } from '@store';

  export let initialModel = '';

  const { panelType, getCrops, getPestName } = getContext<any>(panelKey);
  const defaultModel = panelType === 'disease' ? defaults.disease : defaults.insect;
  const selectedPest = panelType === 'disease' ? selectedDisease : selectedInsect;
  const logging = env === 'development';

  let showModal = false;
  let crops: CropWithPests[] = [];
  let selectedCropValue = 0;
  let pestsForCrop: Pest[] = [];
  let pestName = getPestName();
  let modelId: number;

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
    // pestId.update((value) => value);
    $pestId = value;
    $selectedPest = getCurrentPest(value);
  }

  function getPestId(alias: string) {
    const pest = pestsForCrop.find((pest) => {
      return pest.local_name === alias;
    });
    // return pest ? pest.id : pestsForCrop[0].id;
    return pest ? pest.id : null;
  }

  function selectInitialModel() {
    if (logging) console.log('ModelSelection :: selectInitialModel', initialModel);
    let matched;
    if (initialModel) {
      matched = getPestId(initialModel);
      modelId = matched || getPestId(defaultModel);
      if (logging) {
        if (matched) {
          console.log(`Model selection >> Matched model '${initialModel} (${modelId})'`);
        } else {
          console.log(`Model selection >> Failed to match model name '${initialModel}'`);
        }
      }
    } else {
      modelId = getPestId(defaultModel) || pestsForCrop[0].id;
      if (logging)
        console.log(`Model selection >> Loaded default model '${defaultModel} (${modelId})`);
    }
  }

  onMount(() => {
    crops = getCrops();
    if (crops.length <= 0) return;
    selectedCropValue = crops[0].id;
    pestsForCrop = crops[0].pests;

    selectInitialModel();

    // pestId.update((_) => modelId);
    $pestId = modelId;
    $selectedPest = getCurrentPest(modelId);
  });
</script>

<fieldset id="model-selection">
  <legend>Model Selection</legend>
  <label for="crop-select">Crop/Host</label>
  <select
    on:change={getPestsForCrop}
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
  <div class="clear" />
  <label for="pest-select">{pestName}</label>
  <div class="pest-container">
    <select
      on:change={setPestValue}
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
      <button title="Show model information" on:click={() => (showModal = true)}>?</button>
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
