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

<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import { CropWithAfflictions, Pest } from '../common/ts/types'
  import { panelKey, selectedAffliction, afflictionValue } from '../../store/store'
  const { getCrops, getAfflictionName } = getContext(panelKey)
  let crops: CropWithAfflictions[] = []
  let selectedCropValue = 0
  let afflictionsForCrop: Pest[] = []
  let afflictionName = getAfflictionName()

  function getAfflictionsForCrop(event) {
    const cropId = parseInt(event.target.value)
    const cropWithAfflictions = crops.find(crop => {
      return crop.id === cropId
    })
    if (cropWithAfflictions) {
      afflictionsForCrop = cropWithAfflictions.afflictions
      afflictionValue.update(_ => afflictionsForCrop[0].id)
      afflictionValue.set(afflictionsForCrop[0].id)
      selectedAffliction.set(afflictionsForCrop[0])
    }
  }

  function getCurrentAffliction(afflictionId) {
    const affliction = afflictionsForCrop.find(affliction => {
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
    afflictionValue.update(value => value)
    afflictionValue.set(value)
    selectedAffliction.set(getCurrentAffliction(value))
  }

  onMount(() => {
    crops = getCrops()
    if (crops.length <= 0) return
    selectedCropValue = crops[0].id
    afflictionsForCrop = crops[0].afflictions

    afflictionValue.update(_ => afflictionsForCrop[0].id)
    selectedAffliction.set(getCurrentAffliction(afflictionsForCrop[0].id))
  })
</script>

<fieldset id="model-selection">
  <legend>Model Selection</legend>
  <label for="crop-select">Crop</label>
  <select
    on:change={getAfflictionsForCrop}
    bind:value={selectedCropValue}
    id="crop-select"
    name="crop-select"
    title="Select crop"
  >
    {#each crops as { id, name }}
      <option value={id} name="crop_id">{name}</option>
    {/each}
  </select>
  <div class="clear" />
  <label for="affliction-select">{afflictionName}</label>
  <div class="affliction-container">
    <select
      on:change={setAfflictionValue}
      class="affliction-select"
      id="affliction-select"
      name="affliction-select"
      title="Select model"
    >
      {#each afflictionsForCrop as { id, name, t_min, t_max }}
        <option value={id} name="affliction_id"
          >{name} ({t_min}/{!t_max ? 'None' : t_max}&deg;F)</option
        >
      {/each}
    </select>
  </div>
</fieldset>
