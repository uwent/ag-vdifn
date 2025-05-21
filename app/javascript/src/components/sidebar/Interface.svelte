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
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

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
  <div class="mx-[10px] overflow-y-auto">
    <!-- MODEL TYPE -->
    <fieldset class="mx-auto p-4 border border-gray-300 rounded-lg w-full max-w-2xl">
      <legend class="flex gap-2 mb-2 font-semibold text-lg">
        <div>Model Type</div>
        <div>
          <button
            type="button"
            class="flex justify-center items-center rounded-md w-5 h-5 text-gray-500 text-lg cursor-pointer"
            title="How to use VDIFN"
            onclick={() => (showHelp = true)}
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
          </button>
        </div>
      </legend>
      <div class="flex justify-evenly gap-2 h-5">
        {#each ['disease', 'insect', 'custom'] as type}
          <div class="flex-1 h-10">
            <input
              type="radio"
              name="interface"
              id={type}
              value={type}
              bind:group={panel}
              disabled={$overlayLoading}
              class="absolute opacity-0 w-0"
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
      </div>
    </fieldset>

    <!-- DATA RANGE -->
    <fieldset class="mx-auto mb-6 p-4 border border-gray-300 rounded-lg max-w-2xl">
      <legend class="mb-2 font-semibold text-lg">Data Range</legend>
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
              class="absolute opacity-0 w-0"
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
