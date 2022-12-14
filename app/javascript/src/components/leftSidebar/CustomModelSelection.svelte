<style>
  .dd-container {
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
</style>

<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import { DegreeDayModel } from '../common/ts/types'
  import { panelKey, selectedDDModel, tMinTmax } from '../../store/store'
  const { getModels } = getContext(panelKey)
  let ddModels: DegreeDayModel[] = []
  let defaultModel = "dd_50_86"
  
  function setDegreeDayModel(event) {
    const id = parseInt(event.target.value)
    const model = ddModels.find(model => { return model.id === id })
    selectedDDModel.set(model)
  }

  function getCurrentModel(model: DegreeDayModel) {
    let tmin = $tMinTmax.t_min
    let tmax = $tMinTmax.t_max

    if (model.id === undefined || model.t_min != tmin || model.t_max != tmax) {
      let match = ddModels.find(model => {
        return (model.t_min === tmin) && (model.t_max === tmax)
      })
      if (match) return match

      match = ddModels.find(model => { return model.t_min === tmin })
      if (match) return match

      return ddModels.find(model => { return model.remote_name === defaultModel })
    }
    return model
  }

  onMount(() => {
    ddModels = getModels()
    if (!ddModels) return
    selectedDDModel.set(getCurrentModel($selectedDDModel))
  })
</script>

<fieldset id="model-selection">
  <legend>Degree Day Model</legend>
  <label for="dd-select">Choose model</label>
  <div class="dd-container">
    <select
      on:change={setDegreeDayModel}
      class="dd-select"
      id="dd-select"
      name="dd-select"
      title="Select model"
      value={$selectedDDModel.id}
    >
      {#each ddModels as { id, name, name_c }}
        <option value={id} name="dd-id">{$tMinTmax.in_fahrenheit ? name : name_c}</option
        >
      {/each}
    </select>
  </div>
</fieldset>
