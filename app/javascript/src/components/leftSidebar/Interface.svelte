<style>
  .options {
    width: 100%;
  }

  .inner {
    overflow-y: auto;
    margin: 0 10px;
  }

  fieldset {
    margin-bottom: 10px;
    padding: 10px;
  }

  .switch-field {
    font-family: 'Lucida Grande', Tahoma, Verdana, sans-serif;
    overflow: hidden;
    display: flex;
    justify-content: space-evenly;
    gap: 10px;
  }

  .switch-field label:hover {
    cursor: pointer;
  }

  .switch-field input:checked + label {
    background-color: #a5dc86;
    box-shadow: none;
  }

  input {
    opacity: 0;
    position: absolute;
    width: 0;
  }

  input:checked + label {
    background-color: #a5dc86;
    box-shadow: none;
    color: rgba(0, 0, 0, 0.9);
  }

  label {
    width: 100%;
    background-color: #e4e4e4;
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    text-shadow: none;
    padding: 6px 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
    transition: all 0.1s ease-in-out;
  }

  button {
    cursor: pointer;
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte'
  import { overlayLoading, mapExtent, defaults, env } from '../../store/store'
  import DiseasePanel from './DiseasePanel.svelte'
  import InsectPanel from './InsectPanel.svelte'
  import DatabaseClient from '../common/ts/databaseClient'
  import Loading from '../common/Loading.svelte'
  import CustomPanel from './CustomPanel.svelte'
  import Modal from '../common/Modal.svelte'
  import Help from './Help.svelte'
  export let diseasePanelData
  export let insectPanelData
  export let customPanelData
  const databaseClient = new DatabaseClient()
  const urlParams = new URLSearchParams(window.location.search)
  const validPanels = ['disease', 'insect', 'custom']
  let panel = defaults.panel
  let extent = defaults.extent
  let showHelp = false
  let diseaseParams = { model: defaults.disease }
  let insectParams = { model: defaults.insect }

  console.log('Launching VDIFN in ' + env + ' environment')

  function parseUrlParams() {
    if (validPanels.includes(urlParams.get('panel'))) {
      panel = urlParams.get('panel')
      if (panel === 'disease' && urlParams.has('model')) {
        diseaseParams.model = urlParams.get('model')
      }
      if (panel === 'insect' && urlParams.has('model')) {
        insectParams.model = urlParams.get('model')
      }
    } else {
      window.history.replaceState({}, null, window.location.pathname)
    }
  }

  onMount(async () => {
    parseUrlParams()
    if (!diseasePanelData) diseasePanelData = await databaseClient.fetchDiseasePanel()
    if (!insectPanelData) insectPanelData = await databaseClient.fetchInsectPanel()
    if (!customPanelData) customPanelData = await databaseClient.fetchCustomPanel()
  })

  $: mapExtent.set(extent)
</script>

<div class="options">
  <div class="inner">
    <fieldset id="interface">
      <legend>Model Type</legend>
      <div class="switch-field">
        <input
          name="interface"
          type="radio"
          id="disease"
          value="disease"
          bind:group={panel}
          disabled={$overlayLoading}
        />
        <label for="disease">Disease</label>
        <input
          name="interface"
          type="radio"
          id="insect"
          value="insect"
          bind:group={panel}
          disabled={$overlayLoading}
        />
        <label for="insect">Insect</label>
        <input
          name="interface"
          type="radio"
          id="custom"
          value="custom"
          bind:group={panel}
          disabled={$overlayLoading}
        />
        <label for="custom">Custom</label>
        <button on:click={() => (showHelp = true)}>?</button>
      </div>
    </fieldset>
    <fieldset id="extents">
      <legend>Data Range</legend>
      <div class="switch-field">
        <input
          name="extent"
          type="radio"
          id="wisconsin"
          value="wisconsin"
          bind:group={extent}
          disabled={$overlayLoading}>
        <label for="wisconsin">Wisconsin</label>
        <input
          name="extent"
          type="radio"
          id="midwest"
          value="midwest"
          bind:group={extent}
          disabled={$overlayLoading}>
        <label for="midwest">Upper Midwest</label>
      </div>
    </fieldset>
    {#if diseasePanelData && insectPanelData && customPanelData}
      {#if panel === 'disease'}
        <DiseasePanel
          data={diseasePanelData}
          defaultModel={diseaseParams.model} />
      {:else if panel === 'insect'}
        <InsectPanel
          data={insectPanelData}
          defaultModel={insectParams.model} />
      {:else if panel === 'custom'}
        <CustomPanel
          data={customPanelData} />
      {/if}
    {:else}
      <Loading />
    {/if}
  </div>
</div>
{#if showHelp}
  <Modal name="How to use VDIFN" maxWidth="40em" on:close={() => (showHelp = false)}>
    <Help />
  </Modal>
{/if}
