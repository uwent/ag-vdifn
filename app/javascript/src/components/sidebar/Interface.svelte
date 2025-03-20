<style lang="scss">
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

  .options {
    width: 100%;
  }

  .inner {
    overflow-y: auto;
    margin: 0 10px;
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

  .help-btn {
    border: 1px solid #d0d0d0;
    border-radius: 3px;
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  import DatabaseClient from '@ts/databaseClient';
  import DiseasePanel from './DiseasePanel.svelte';
  import InsectPanel from './InsectPanel.svelte';
  import CustomPanel from './CustomPanel.svelte';
  import Help from '../common/Help.svelte';
  import Loading from '../common/Loading.svelte';
  import Modal from '../common/Modal.svelte';
  import { overlayLoading, mapExtent, defaults, selectedPanel, selectedPalette } from '@store';
  import type {
    ColorPaletteName,
    CropWithPests,
    DegreeDayModel,
    MapExtent,
    PanelType,
  } from '@types';
  import { PANEL_TYPES } from '@types';

  // reactive variables
  let diseasePanelData = $state<CropWithPests[]>();
  let insectPanelData = $state<CropWithPests[]>();
  let customPanelData = $state<DegreeDayModel[]>();
  let panelDataReady = $state(false);
  let panel = $state<PanelType>(defaults.panel);
  let extent = $state<MapExtent>(defaults.extent);
  let showHelp = $state(false);
  let palette = $state<ColorPaletteName>(defaults.palette);
  let opts = $state({
    model: '',
    submit: false,
  });

  const databaseClient = new DatabaseClient();
  const urlParams = new URLSearchParams(window.location.search);

  function parseUrlParams() {
    const panelFromURL = (urlParams.get('type') ||
      urlParams.get('panel') ||
      urlParams.get('p') ||
      defaults.panel) as PanelType;
    if (PANEL_TYPES.includes(panelFromURL)) {
      panel = panelFromURL as PanelType;
      let model = urlParams.get('model') || urlParams.get('m');
      if (model)
        opts = {
          model: model,
          submit: true,
        };
    } else {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  onMount(async () => {
    parseUrlParams();
    diseasePanelData ||= await databaseClient.fetchDiseasePanel();
    insectPanelData ||= await databaseClient.fetchInsectPanel();
    customPanelData ||= await databaseClient.fetchCustomPanel();
    panelDataReady = true;
  });

  // Update store values when local state changes
  $effect(() => {
    $selectedPanel = panel;
  });

  $effect(() => {
    $mapExtent = extent;
  });

  $effect(() => {
    $selectedPalette = palette;
  });
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
        <button class="help-btn" title="How to use VDIFN" onclick={() => (showHelp = true)}
          >?</button
        >
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
          initialModelName={opts.model}
          submitOnLoad={opts.submit}
        />
      {:else if panel === 'insect'}
        <InsectPanel
          data={insectPanelData}
          initialModelName={opts.model}
          submitOnLoad={opts.submit}
        />
      {:else if panel === 'custom'}
        <CustomPanel data={customPanelData} />
      {/if}
      <fieldset id="palette">
        <legend>Color Palette</legend>
        <div class="switch-field">
          <input
            id="spectralPalette"
            title="Spectral color palette"
            type="radio"
            value="classic"
            bind:group={palette}
          />
          <label for="spectralPalette">Classic</label>
          <input
            id="viridisPalette"
            title="Viridis color palette"
            type="radio"
            value="viridis"
            bind:group={palette}
          />
          <label for="viridisPalette">Viridis</label>
        </div>
      </fieldset>
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
