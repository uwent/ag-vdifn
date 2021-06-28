<script lang="ts">
  import { onMount } from 'svelte'
  import {
    overlayLoading,
    panelNames,
    defaults,
  } from '../../store/store'
  import DiseasePanel from './DiseasePanel.svelte'
  import InsectPanel from './InsectPanel.svelte'
  import DatabaseClient from '../common/ts/databaseClient'
  import Loading from '../common/Loading.svelte'
  import CustomPanel from './CustomPanel.svelte'
  import Modal from '../common/Modal.svelte'
  import Help from './Help.svelte'
  export let diseasePanelData
  export let insectPanelData
  const databaseClient = new DatabaseClient()
  const urlParams = new URLSearchParams(window.location.search)
  let panel = defaults.panel
  let queryModel: string
  let showHelp = false
  let diseaseParams = { model: defaults.disease }
  let insectParams = { model: defaults.insect }
  let customParams = {}

  function parseUrlParams() {
    if (panelNames.all.includes(urlParams.get('panel'))) {
      panel = urlParams.get('panel')
      switch (panel) {
        case 'disease':
          if (urlParams.has('model')) {
            diseaseParams.model = urlParams.get('model')
          }
          break
        case 'insect':
          if (urlParams.has('model')) {
            insectParams.model = urlParams.get('model')
          }
          break
        case 'custom':
          break
      }
    } else {
      window.history.replaceState({}, null, window.location.pathname)
    }
  }

  onMount(async () => {
    parseUrlParams()
    if (!diseasePanelData) diseasePanelData = await databaseClient.fetchDiseasePanel()
    if (!insectPanelData) insectPanelData = await databaseClient.fetchInsectPanel()
  })

  // $: handlePanelChange(panel)
</script>

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
    width: 20%;
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

  .switch-field label:hover {
    cursor: pointer;
  }

  .switch-field input:checked + label {
    background-color: #a5dc86;
    box-shadow: none;
  }
</style>

<div class="options">
  <div class="inner">
    <fieldset id="interface">
      <div class="switch-field">
        <input
          name="interface"
          type="radio"
          id="disease"
          value="disease"
          bind:group={panel}
          disabled={$overlayLoading} />
        <label for="disease">Disease</label>
        <input
          name="interface"
          type="radio"
          id="insect"
          value="insect" 
          bind:group={panel}
          disabled={$overlayLoading}/>
        <label for="insect">Insect</label>
        <input
          name="interface"
          type="radio"
          id="custom"
          value="custom"
          bind:group={panel}
          disabled={$overlayLoading}/>
        <label for="custom">Custom</label>
        <button on:click={() => (showHelp = true)}>?</button>
      </div>
    </fieldset>
    {#if diseasePanelData && insectPanelData}
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
          data={insectPanelData} />
      {/if}
    {:else}
      <Loading />
    {/if}
  </div>
</div>
{#if showHelp}
  <Modal on:close={() => (showHelp = false)} name="How to use VDIFN">
    <Help />
  </Modal>
{/if}
