<script lang="ts">
  import { onMount } from 'svelte';
  import DatabaseClient from '@ts/databaseClient';
  import DiseasePanel from './DiseasePanel.svelte';
  import InsectPanel from './InsectPanel.svelte';
  import CustomPanel from './CustomPanel.svelte';
  import Help from '../common/Help.svelte';
  import Loading from '../common/Loading.svelte';
  import Modal from '../common/Modal.svelte';
  import { overlayLoading, mapExtent, defaults, selectedPanel } from '@store';
  import type { CropWithPests, DegreeDayModel, PanelType, MapExtentOption } from '@types';
  import { PANEL_TYPES } from '@types';

  let diseasePanelData = $state<CropWithPests[]>();
  let insectPanelData = $state<CropWithPests[]>();
  let customPanelData = $state<DegreeDayModel[]>();
  let panelDataReady = $state(false);
  let panel = $state<PanelType>(defaults.panel);
  let extent = $state<MapExtentOption>(defaults.extent);
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

  $effect(() => {
    $selectedPanel = panel;
  });

  $effect(() => {
    $mapExtent = extent;
  });
</script>

{#if showHelp}
  <Modal
    close={() => {
      showHelp = false;
    }}
    name="How to use VDIFN"
    maxWidth="40em"
  >
    <Help />
  </Modal>
{/if}

<div class="w-full">
  <div class="overflow-y-auto mx-[10px]">
    <!-- MODEL TYPE -->
    <fieldset class="w-full border border-gray-300 p-4 rounded-lg mb-6 max-w-2xl mx-auto">
      <legend class="flex items-center justify-between text-lg font-semibold mb-2">
        Model Type
      </legend>
      <div class="flex justify-evenly gap-4">
        {#each ['disease', 'insect', 'custom'] as type}
          <div class="relative">
            <input
              type="radio"
              name="interface"
              id={type}
              value={type}
              bind:group={panel}
              disabled={$overlayLoading}
              class="absolute w-0 opacity-0"
            />
            <label
              for={type}
              class={`block text-[13px] text-center px-4 py-2 border border-black/20 rounded-md shadow-inner hover:cursor-pointer transition-all
                ${panel === type ? 'bg-green-300 text-black font-semibold' : 'bg-gray-200 text-black/60'}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          </div>
        {/each}
        <button
          class="ml-2 px-2 py-1 border border-[#d0d0d0] rounded-md text-sm hover:bg-gray-100"
          title="How to use VDIFN"
          onclick={() => (showHelp = true)}
        >
          ?
        </button>
      </div>
    </fieldset>

    <!-- DATA RANGE -->
    <fieldset class="border border-gray-300 p-4 rounded-lg mb-6 max-w-2xl mx-auto">
      <legend class="font-semibold text-lg mb-2">Data Range</legend>
      <div class="flex justify-evenly gap-4">
        {#each ['wisconsin', 'midwest'] as region}
          <div class="relative w-32">
            <input
              type="radio"
              name="extent"
              id={region}
              value={region}
              bind:group={extent}
              disabled={$overlayLoading}
              class="absolute w-0 opacity-0"
            />
            <label
              for={region}
              class={`block text-[13px] text-center px-4 py-2 border border-black/20 rounded-md shadow-inner hover:cursor-pointer transition-all
                ${extent === region ? 'bg-green-300 text-black font-semibold' : 'bg-gray-200 text-black/60'}`}
            >
              {region === 'midwest' ? 'Upper Midwest' : 'Wisconsin'}
            </label>
          </div>
        {/each}
      </div>
    </fieldset>

    <!-- PANEL -->
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
