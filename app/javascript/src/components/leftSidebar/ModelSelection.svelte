<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { panelKey, selectedAffliction } from "../../store/store"
  import { afflictionValue } from "../../store/store";
  import { CropWithAfflictions, Pest } from "../common/TypeScript/types";
  import Modal from '../common/Modal.svelte';
  let showModal: boolean = false;
  let afflictionInputValue: number = 1;
  let selectedCropValue: number;
  let afflictionsForCrop: Pest[] = [];
  let crops: CropWithAfflictions[] = [];
  let afflictionName: string;

  const { getCrops, getAfflictionName } = getContext(panelKey);
  crops = getCrops();
  afflictionName = getAfflictionName()

  function getAfflictionsForCrop(cropId) {
    const cropWithAfflictions = crops.find((crop) => {
      return crop.id === cropId
    })
    if (cropWithAfflictions) {
      afflictionsForCrop = cropWithAfflictions.afflictions;
      selectedAffliction.set(afflictionsForCrop[0])
    }
  }

  function getCurrentAffliction(afflictionId) {
    const affliction = afflictionsForCrop.find((affliction) => {
      return affliction.id === afflictionId;
    })
    if (affliction) {
      return affliction;
    } else if (crops[0] === undefined) {
        return []
      } else {
        return crops[0].afflictions[0]
    } 
  }


  $: afflictionValue.set(afflictionInputValue);
  $: getAfflictionsForCrop(selectedCropValue);
  $: selectedAffliction.set(getCurrentAffliction(afflictionInputValue));
  onMount(() => {
    afflictionValue.set(afflictionInputValue);
  });
</script>

<fieldset id="crop">
  <legend>Model Selection</legend>
    <label for="crop-select">Crop</label>
    <select bind:value={selectedCropValue} id="crop-select" name="crop-select">
      {#each crops as {id, name}}
        <option value={id} name="crop_id">{name}</option>
      {/each}
    </select>
  <div class="clear" />
  <label for="affliction-select">{afflictionName}</label>
  <div class="affliction-container">
    <select bind:value={afflictionInputValue} class="affliction-select" id="affliction-select" name="affliction-select">
      {#each afflictionsForCrop as { id, name }}
        <option value={id} name="affliction_id">{name}</option>
      {/each}
    </select>
    {#if crops.length > 0}
    <button on:click="{() => showModal = true}">
      ?
    </button>
    {/if}
  </div>

</fieldset>
{#if showModal}
<Modal on:close="{() => showModal = false}">
  {@html $selectedAffliction.info}
</Modal>
{/if}

<style>

  .affliction-container {
    display: flex;
    
  }
  fieldset {
    background: rgba(200, 200, 200, 0.4);
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
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  select::-ms-expand {
    display: none;
  }

  .clear {
    clear: both;
    height: 0.5em;
  }

</style>
