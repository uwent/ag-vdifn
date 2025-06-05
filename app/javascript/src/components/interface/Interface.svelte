<script lang="ts">
  import { onMount } from 'svelte';
  import DatabaseClient from '@ts/databaseClient';
  import DiseasePanel from '../sidebar/DiseasePanel.svelte';
  import InsectPanel from '../sidebar/InsectPanel.svelte';
  import CustomPanel from '../sidebar/CustomPanel.svelte';
  import Help from '../common/Help.svelte';
  import Frame from '../common/Frame.svelte';
  import Loading from '../common/Loading.svelte';
  import { overlayLoading, mapExtent, defaults, selectedPanel, modal } from '@store';
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

{#snippet helpModal()}
  <Help />
{/snippet}

{#snippet modelTypeInfo()}
  <button
    type="button"
    class="flex justify-center items-center rounded-md w-5 text-gray-500 text-lg cursor-pointer"
    title="How to use VDIFN"
    onclick={() =>
      modal.set({
        name: 'How to use VDIFN',
        content: helpModal,
        maxWidth: '40rem',
      })}
  >
    <FontAwesomeIcon icon={faCircleQuestion} />
  </button>
{/snippet}

<div class="flex flex-col gap-4">
  <Frame title="Model Type" titleContent={modelTypeInfo}>
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
