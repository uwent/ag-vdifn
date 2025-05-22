<script lang="ts">
  import { onMount } from 'svelte';
  import DatabaseClient from '@ts/databaseClient';
  import DiseasePanel from './DiseasePanel.svelte';
  import InsectPanel from './InsectPanel.svelte';
  import CustomPanel from './CustomPanel.svelte';
  import Help from '../common/Help.svelte';
  import Frame from '../common/Frame.svelte';
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
  let sidebarOpen = $state(true);

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

<!-- Help Modal -->
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

<!-- Mobile Header -->
<header
  class="sm:hidden top-0 left-0 z-[60] fixed flex justify-between items-center bg-green-700 shadow px-4 w-full h-12 text-white"
>
  <div class="font-bold text-lg">VDIFN</div>
  <button onclick={() => (sidebarOpen = !sidebarOpen)} aria-label="Toggle menu">
    <svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-6 h-6" viewBox="0 0 20 20">
      <path d="M3 6h14M3 10h14M3 14h14" />
    </svg>
  </button>
</header>

<!-- Sidebar -->
<div
  id="sidebar"
  aria-expanded={sidebarOpen}
  class={`fixed sm:static top-12 sm:top-0 left-0 z-50 bg-white transition-transform duration-300 transform sm:transform-none sm:translate-x-0 ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } w-4/5 sm:w-[335px] h-screen sm:h-full overflow-y-auto`}
>
  <div class="flex flex-col gap-5 mx-[12px] pt-2 overflow-y-auto">
    <Frame title="Model Type">
      {#snippet titleContent()}
        <button
          type="button"
          class="flex justify-center items-center rounded-md w-5 text-gray-500 text-lg cursor-pointer"
          title="How to use VDIFN"
          onclick={() => (showHelp = true)}
        >
          <FontAwesomeIcon icon={faCircleQuestion} />
        </button>
      {/snippet}

      <div class="gap-2 grid grid-cols-3 auto-rows-fr">
        {#each ['disease', 'insect', 'custom'] as type}
          <div class="w-full">
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
              class={`w-full h-full min-h-[2rem] flex items-center justify-center text-2xl px-6 border border-black/20 rounded-md shadow-inner hover:cursor-pointer transition-all
                ${panel === type ? 'bg-green-300 text-black font-semibold' : 'bg-gray-200 text-black/60'}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          </div>
        {/each}
      </div>
    </Frame>

    <Frame title="Data Range">
      <div class="flex justify-evenly gap-2">
        {#each ['wisconsin', 'midwest'] as region}
          <div class="relative w-full">
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
              class={`w-full h-full min-h-[2rem] flex items-center justify-center text-lg px-5 border border-black/20 rounded-md shadow-inner hover:cursor-pointer transition-all
                ${extent === region ? 'bg-green-300 text-black font-semibold' : 'bg-gray-200 text-black/60'}`}
            >
              {region === 'midwest' ? 'Upper Midwest' : 'Wisconsin'}
            </label>
          </div>
        {/each}
      </div>
    </Frame>

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

<!-- Background overlay -->
{#if sidebarOpen}
  <div class="sm:hidden z-40 fixed inset-0 bg-black/40" onclick={() => (sidebarOpen = false)} />
{/if}
