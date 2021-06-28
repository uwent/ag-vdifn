<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import {
    panelKey,
    selectedAffliction,
    afflictionValue,
  } from '../../store/store'
  import { CropWithAfflictions, Pest } from '../common/ts/types'
  import Modal from '../common/Modal.svelte'
  let showModal = false
  let selectedCropValue: number
  let afflictionsForCrop: Pest[] = []
  let crops: CropWithAfflictions[] = []
  let afflictionName: string
  export let defaultModel: string
  let modelId: number
  const productionURL = process.env.NODE_ENV === `production` ? `/vdifn` : ``
  const { getCrops, getAfflictionName } = getContext(panelKey)

  afflictionName = getAfflictionName()

  function getAfflictionsForCrop(event) {
    const cropId = parseInt(event.target.value)
    const cropWithAfflictions = crops.find((crop) => {
      return crop.id === cropId
    })
    if (cropWithAfflictions) {
      afflictionsForCrop = cropWithAfflictions.afflictions
      afflictionValue.update((_) => afflictionsForCrop[0].id)
      afflictionValue.set(afflictionsForCrop[0].id)
      selectedAffliction.set(afflictionsForCrop[0])
    }
  }

  function getCurrentAffliction(afflictionId) {
    const affliction = afflictionsForCrop.find((affliction) => {
      return affliction.id === afflictionId
    })
    if (affliction) {
      return affliction
    } else if (crops[0] === undefined) {
      return []
    } else {
      return crops[0].afflictions[0]
    }
  }

  function setAfflictionValue(event) {
    const value = parseInt(event.target.value)
    afflictionValue.update((value) => value)
    afflictionValue.set(value)
    selectedAffliction.set(getCurrentAffliction(value))
  }

  function buildModalLink(link) {
    if (link != null) {
      return `<a href='${link}' target='_blank'>More Information... </a>`
    }
  }

  function buildModalImage(photo) {
    if (photo != null) {
      return `<img src="${productionURL}/images/${photo}" width="150px" align="left" style="margin-top: 1em; margin-right: 10px;"/>`
    } else {
      return ""
    }
  }

  function getAfflictionId(alias: string) {
    const affliction = afflictionsForCrop.find((affliction) => {
      return affliction.local_name === alias
    })
    return affliction ? affliction.id : afflictionsForCrop[0].id
  }

  function handleUrlParams() {
    const queryModel = defaultModel
    if (queryModel) {
      modelId = getAfflictionId(queryModel)
      console.log("Model selection >> Specified model '" + queryModel + "' matched to id " + modelId)
    } else {
      modelId = getAfflictionId(defaultModel)
      console.log("Model selection >> No model param specified, choosing default model '" + queryModel + "'")
    }
  }

  onMount(() => {
    crops = getCrops()
    if (crops.length <= 0) return
    afflictionsForCrop = crops[0].afflictions

    handleUrlParams()

    afflictionValue.update((_) => modelId)
    selectedAffliction.set(getCurrentAffliction(modelId))
  })
</script>

<style>
  .affliction-container {
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

  button {
    margin-left: 10px;
    background: rgb(225, 225, 225);
    border: 1px solid #d0d0d0;
    border-radius: 3px;
    cursor: pointer;
    appearance: none;
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

  .clear {
    clear: both;
    height: 0.5em;
  }

  .modal__pest-info {
    overflow: hidden;
  }

  .modal__pest-info p {
    word-break: break-word;
    margin: 0px;
  }
</style>

<fieldset id="model-selection">
  <legend>Model Selection</legend>
  <label for="crop-select">Crop/Host</label>
  <!-- svelte-ignore a11y-no-onchange -->
  <select
    on:change={getAfflictionsForCrop}
    bind:value={selectedCropValue}
    id="crop-select"
    name="crop-select"
    data-testid="crop-select"
    title="Select crop">
    {#each crops as { id, name }}
      <option value={id} name="crop_id">{name}</option>
    {/each}
  </select>
  <div class="clear" />
  <label for="affliction-select">{afflictionName}</label>
  <div class="affliction-container">
    <!-- svelte-ignore a11y-no-onchange -->
    <select
      on:change={setAfflictionValue}
      class="affliction-select"
      id="affliction-select"
      name="affliction-select"
      data-testid="affliction-select"
      title="Select model"
      value={$afflictionValue}>
      {#each afflictionsForCrop as { id, name }}
        <option value={id} name="affliction_id">{name}</option>
      {/each}
    </select>
    {#if crops.length > 0}
      <button on:click={() => (showModal = true)}>?</button>
    {/if}
  </div>
</fieldset>
{#if showModal}
  <Modal on:close={() => (showModal = false)} name={$selectedAffliction.name}>
    <div class="modal__pest-info">
      {@html buildModalImage($selectedAffliction.photo)}
      <p>
        {@html $selectedAffliction.info}
      </p>
      {@html buildModalLink($selectedAffliction.link)}
    </div>
  </Modal>
{/if}
