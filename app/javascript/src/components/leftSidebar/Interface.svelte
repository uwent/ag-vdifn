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
    font-size: 13px;
    font-weight: normal;
    text-align: center;
    text-shadow: none;
    padding: 6px 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow:
      inset 0 1px 3px rgba(0, 0, 0, 0.3),
      0 1px rgba(255, 255, 255, 0.1);
    transition: all 0.1s ease-in-out;
  }

  button {
    cursor: pointer;
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';

  import DatabaseClient from '@ts/databaseClient';
  import DiseasePanel from './DiseasePanel.svelte';
  import InsectPanel from './InsectPanel.svelte';
  import CustomPanel from './CustomPanel.svelte';
  import Help from './Help.svelte';
  import Loading from '../common/Loading.svelte';
  import Modal from '../common/Modal.svelte';
  import { overlayLoading, mapExtent, defaults } from '@store';
  import type { CropWithAfflictions, DegreeDayModel } from '@types';

  export let diseasePanelData: CropWithAfflictions[] = [];
  export let insectPanelData: CropWithAfflictions[] = [];
  export let customPanelData: DegreeDayModel[] = [];
  let panelDataReady = false;

  const databaseClient = new DatabaseClient();
  const urlParams = new URLSearchParams(window.location.search);
  const validPanels = ['disease', 'insect', 'custom'];

  let panel = defaults.panel;
  let extent = defaults.extent;
  let showHelp = false;
  let opts = {
    initialDisease: defaults.disease,
    initialInsect: defaults.insect,
    submitOnLoad: false,
  };

  // console.log('Launching VDIFN in ' + env + ' environment')

  function parseUrlParams() {
    let panelFromParams = urlParams.get('p') || urlParams.get('panel') || '';
    if (validPanels.includes(panelFromParams)) {
      panel = panelFromParams;
      let model = urlParams.get('m') || urlParams.get('model');
      if (model) {
        opts.submitOnLoad = true;
        if (panel === 'disease') opts.initialDisease = model;
        if (panel === 'insect') opts.initialInsect = model;
      }
    } else {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  onMount(async () => {
    parseUrlParams();
    if (diseasePanelData.length < 1) diseasePanelData = await databaseClient.fetchDiseasePanel();
    if (insectPanelData.length < 1) insectPanelData = await databaseClient.fetchInsectPanel();
    if (customPanelData.length < 1) customPanelData = await databaseClient.fetchCustomPanel();
    panelDataReady = true;
  });

  $: mapExtent.set(extent);
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
          disabled={$overlayLoading}
        />
        <label for="wisconsin">Wisconsin</label>
        <input
          name="extent"
          type="radio"
          id="midwest"
          value="midwest"
          bind:group={extent}
          disabled={$overlayLoading}
        />
        <label for="midwest">Upper Midwest</label>
      </div>
    </fieldset>
    {#if panelDataReady}
      {#if panel === 'disease'}
        <DiseasePanel
          data={diseasePanelData}
          defaultModel={opts.initialDisease}
          submitOnLoad={opts.submitOnLoad}
        />
      {:else if panel === 'insect'}
        <InsectPanel
          data={insectPanelData}
          defaultModel={opts.initialInsect}
          submitOnLoad={opts.submitOnLoad}
        />
      {:else if panel === 'custom'}
        <CustomPanel data={customPanelData} />
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
