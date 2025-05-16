<script lang="ts">
  import { round } from '@ts/utils';
  import DatabaseClient from '@ts/databaseClient';
  import Modal from '@components/common/Modal.svelte';
  import {
    selectedPanel,
    diseasePanelParams,
    insectPanelParams,
    overlayGradient,
    selectedPest,
    overlayLoading,
    selectedPalette,
  } from '@store';
  import type { LegendData, GradientHash, SeverityParams } from '@types';
  import tippy from 'tippy.js';
  import 'tippy.js/dist/tippy.css';
  import ColorHelper from '@ts/colorHelper';

  const db = new DatabaseClient();

  let expanded = $state(true);
  let showModal = $state(false);
  let diseaseLegend = $state<LegendData | null>();
  let insectLegend = $state<LegendData | null>();
  let customLegend = $state<LegendData | null>();
  let currentLegend = $derived.by(() => {
    switch ($selectedPanel) {
      case 'disease':
        if (diseaseLegend) return addColorToLegend(diseaseLegend);
      case 'insect':
        if (insectLegend) return addColorToLegend(insectLegend);
      case 'custom':
        if (customLegend) return customLegend;
    }
  });
  let showLegend = $derived(!!currentLegend);
  let colorHelper = $derived(new ColorHelper($selectedPalette));

  function invokeTippy() {
    tippy('.tippy-tooltip', {
      placement: 'top',
      arrow: true,
      theme: 'light-border',
      duration: 200,
    });
  }

  function addColorToLegend(legend: LegendData) {
    if (!legend) return null;
    const newLegend = legend.legend.map((item) => ({
      ...item,
      color: colorHelper.color(item.value, 5),
    }));
    return { legend: newLegend, info: legend.info };
  }

  async function buildPestLegend(params: SeverityParams): Promise<LegendData | null> {
    if (!params) return null;
    return await db.fetchSeverityLegend(params.pest_id);
  }

  function buildCustomLegend(gradient: GradientHash): LegendData | null {
    if (!gradient) return null;

    // Fixed breakpoints for consistent degree-day legend
    const fixedBreaks = [91, 176, 262, 347];
    const legendEntries = fixedBreaks.map((val, i) => {
      const low = i === 0 ? 0 : fixedBreaks[i - 1];
      const high = val;
      const name = i === fixedBreaks.length - 1 ? `${low}+` : `${low} - ${high}`;
      const color = gradient[high.toString()] || '#ccc';
      return {
        value: high,
        color,
        name,
        description: `${name} degree days`,
      };
    });

    return {
      legend: legendEntries,
      info: null,
    };
  }

  $effect(() => {
    if ($selectedPanel === 'disease')
      buildPestLegend($diseasePanelParams).then((legend) => {
        diseaseLegend = legend;
      });
  });

  $effect(() => {
    if ($selectedPanel === 'insect')
      buildPestLegend($insectPanelParams).then((legend) => {
        insectLegend = legend;
      });
  });

  $effect(() => {
    if ($selectedPanel === 'custom' && !$overlayLoading)
      customLegend = buildCustomLegend($overlayGradient);
  });

  $effect(() => {
    currentLegend;
    invokeTippy();
  });
</script>

{#if showModal} <Modal close={() => (showModal = false)} 
  name="Pest Info"> {@html $selectedPest.info} </Modal> {/if}

{#if showLegend}
  <div
    id="legend"
    class="absolute max-w-[200px] bottom-2.5 right-2.5 z-10 bg-white rounded shadow-[rgba(0,0,0,0.3)_-4px_0px_10px,rgba(0,0,0,0.3)_4px_0px_10px]"
    aria-expanded={expanded}
    class:invisible={!expanded && $selectedPanel !== 'custom'}
  >
    {#if currentLegend?.legend}
      <fieldset class="bg-[rgba(234,234,234,0.4)] p-2 m-0">
        <legend class="text-sm font-medium">
          {$selectedPanel === 'custom' ? 'Degree-Day Legend:' : 'Severity Legend:'}
        </legend>
        <div class="flex flex-col gap-1.5 w-full">
          {#each [...currentLegend.legend].reverse() as entry}
            <div
              class="flex flex-row gap-2 text-sm tippy-tooltip"
              data-tippy-content={entry.description}
            >
              <div class="h-5 w-7.5 border border-gray-400" style="background: {entry.color}"></div>
              <div class="flex items-center">{entry.name}</div>
            </div>
          {/each}
        </div>
      </fieldset>
    {/if}
    {#if currentLegend?.info}
      <fieldset class="bg-[rgba(234,234,234,0.4)] p-2 m-0">
        <legend class="text-sm font-medium">More Information</legend>
        <p class="m-0 text-xs">{@html currentLegend.info}</p>
      </fieldset>
    {/if}
  </div>
  <button
    id="legend-expand-b utton"
    class="fixed right-2.5 bottom-14 z-[100] px-2.5 py-1 border border-gray-400 rounded shadow-[0px_0px_10px_rgba(0,0,0,0.3)] bg-white md:hidden"
    aria-expanded={expanded}
    on:click={() => (expanded = !expanded)}
    class:!p-0={!expanded}
    class:!h-[25px]={!expanded}
    class:!w-[25px]={!expanded}
  >
    {expanded ? '✖' : 'Show Legend'}
  </button>
{/if}
