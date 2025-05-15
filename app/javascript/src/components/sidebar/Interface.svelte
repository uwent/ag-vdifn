<script lang="ts">
  import { onMount } from 'svelte';
  import type { MapExtentOption } from '@types';
  import DatabaseClient from '@ts/databaseClient';
  import DiseasePanel from './DiseasePanel.svelte';
  import InsectPanel from './InsectPanel.svelte';
  import CustomPanel from './CustomPanel.svelte';
  import Help from '../common/Help.svelte';
  import Loading from '../common/Loading.svelte';
  import Modal from '../common/Modal.svelte';
  import { overlayLoading, mapExtent, defaults, selectedPanel } from '@store';
  import type { CropWithPests, DegreeDayModel, MapExtent, PanelType } from '@types';
  import { PANEL_TYPES } from '@types';

  let diseasePanelData = $state<CropWithPests[]>();
  let insectPanelData = $state<CropWithPests[]>();
  let customPanelData = $state<DegreeDayModel[]>();
  let panelDataReady = $state(false);
  let panel = $state<PanelType>(defaults.panel);
  let extent = $state<MapExtentOption>(defaults.extent); // ✅ 'wisconsin' or 'midwest'

  let showHelp = $state(false);

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
      panel = panelFromURL;
      let model = urlParams.get('model') || urlParams.get('m');
      if (model) {
        opts = {
          model: model,
          submit: true,
        };
      }
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

  $effect(() => {
    $selectedPanel = panel;
  });

  $effect(() => {
    $mapExtent = extent;
  });
</script>

{#if showHelp}
  <Modal
    close={() => (showHelp = false)}
    name="How to use VDIFN"
    maxWidth="40em"
  >
    <Help />
  </Modal>
{/if}

<!-- Wrapper -->
<div class="w-full">
  <div class="max-w-3xl mx-auto space-y-6 px-4 py-4">
    <!-- Interface Fieldset -->
    <!-- Model Type + Help aligned side-by-side -->
<div class="flex items-center justify-between mb-4">
  <!-- Fieldset: Model Type -->
  <fieldset id="interface" class="border border-gray-300 rounded-md p-4 w-full">
    <legend class="text-sm font-medium text-gray-700 mb-2">Model Type</legend>
    <div class="flex flex-row items-center gap-4 flex-wrap">
      <!-- Disease -->
      <div class="flex items-center space-x-2">
        <input
          name="interface"
          type="radio"
          id="disease"
          value="disease"
          bind:group={panel}
          disabled={$overlayLoading}
          class="peer hidden"
        />
        <label
          for="disease"
          class="px-3 py-1 text-sm border border-gray-300 rounded cursor-pointer peer-checked:bg-green-300 peer-checked:text-black text-gray-600"
        >
          Disease
        </label>
      </div>

      <!-- Insect -->
      <div class="flex items-center space-x-2">
        <input
          name="interface"
          type="radio"
          id="insect"
          value="insect"
          bind:group={panel}
          disabled={$overlayLoading}
          class="peer hidden"
        />
        <label
          for="insect"
          class="px-3 py-1 text-sm border border-gray-300 rounded cursor-pointer peer-checked:bg-green-300 peer-checked:text-black text-gray-600"
        >
          Insect
        </label>
      </div>

      <!-- Custom -->
      <div class="flex items-center space-x-2">
        <input
          name="interface"
          type="radio"
          id="custom"
          value="custom"
          bind:group={panel}
          disabled={$overlayLoading}
          class="peer hidden"
        />
        <label
          for="custom"
          class="px-3 py-1 text-sm border border-gray-300 rounded cursor-pointer peer-checked:bg-green-300 peer-checked:text-black text-gray-600"
        >
          Custom
        </label>
      </div>
    </div>
  </fieldset>

  <!-- Help Button -->
  <button
    class="ml-4 mt-7 h-fit px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 transition"
    title="How to use VDIFN"
    on:click={() => (showHelp = true)}
  >
    ?
  </button>
</div>

    <!-- Extents Fieldset -->
    <fieldset id="extents" class="border border-gray-300 rounded-md p-4">
      <legend class="text-sm font-medium text-gray-700 mb-2">Data Range</legend>
      <div class="flex justify-evenly items-center gap-2 flex-wrap">
        <div class="flex items-center space-x-2">
          <input
            name="extent"
            type="radio"
            id="wisconsin"
            value="wisconsin"
            bind:group={extent}
            disabled={$overlayLoading}
            class="peer hidden"
          />
          <label
            for="wisconsin"
            class="px-3 py-1 text-sm border border-gray-300 rounded cursor-pointer peer-checked:bg-green-300 peer-checked:text-black text-gray-600 text-center"
          >
            Wisconsin
          </label>
        </div>

        <div class="flex items-center space-x-2">
          <input
            name="extent"
            type="radio"
            id="midwest"
            value="midwest"
            bind:group={extent}
            disabled={$overlayLoading}
            class="peer hidden"
          />
          <label
            for="midwest"
            class="px-3 py-1 text-sm border border-gray-300 rounded cursor-pointer peer-checked:bg-green-300 peer-checked:text-black text-gray-600 text-center"
          >
            Upper Midwest
          </label>
        </div>
      </div>
    </fieldset>

    <!-- Dynamic Panels -->
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
    {:else}
      <Loading />
    {/if}
  </div>
</div>
