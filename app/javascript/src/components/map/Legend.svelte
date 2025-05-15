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
    const items: { value: number; color: string }[] = [];
    for (const key in gradient) {
      if (gradient.hasOwnProperty(key)) {
        items.push({ value: parseFloat(key), color: gradient[key] });
      }
    }
    const sortedItems = items.sort((a, b) => a.value - b.value);
    const legendEntries = sortedItems.map((item, i) => {
      const value = item.value;
      const color = item.color;
      const lowRange = i === 0 ? 0 : round(sortedItems[i - 1].value);
      const name =
        i === sortedItems.length - 1 ? `${lowRange}+` : `${lowRange} - ${round(item.value)}`;
      const description = `${name} degree days`;
      return { value, color, name, description };
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

{#if showModal}
  <Modal close={() => (showModal = false)} name="Pest Info">
    {@html $selectedPest.info}
  </Modal>
{/if}

{#if showLegend}
  <div
    id="legend"
    class="absolute max-w-[200px] bottom-2 right-2 z-10 bg-white rounded shadow-[inset_-4px_0px_10px_rgba(0,0,0,0.3),inset_4px_0px_10px_rgba(0,0,0,0.3)]
      [aria-expanded='true']:visible
      [aria-expanded='false']:invisible md:[aria-expanded='false']:visible"
    aria-expanded={expanded}
  >
    <div class="flex flex-col gap-2.5 p-2.5 pt-1.5">
      {#if currentLegend?.legend}
        <fieldset class="bg-[rgba(234,234,234,0.4)] p-2.5 m-0">
          <legend class="text-sm font-semibold mb-1">
            {$selectedPanel === 'custom' ? 'Degree-Day Legend:' : 'Severity Legend:'}
          </legend>
          <div class="w-full flex flex-col gap-1.5">
            {#each [...currentLegend.legend].reverse() as entry}
              <div class="flex flex-row gap-2.5 text-sm tippy-tooltip" data-tippy-content={entry.description}>
                <div class="h-5 w-[30px] border border-gray-400" style="background: {entry.color}"></div>
                <div class="flex items-center">{entry.name}</div>
              </div>
            {/each}
          </div>
        </fieldset>
      {/if}

      {#if currentLegend?.info}
        <fieldset class="bg-[rgba(234,234,234,0.4)] p-2.5 m-0">
          <legend class="text-sm font-semibold mb-1">More Information</legend>
          <p class="m-0 text-xs">{@html currentLegend.info}</p>
        </fieldset>
      {/if}
    </div>
  </div>

  <button
    id="legend-expand-button"
    aria-expanded={expanded}
    on:click={() => (expanded = !expanded)}
    class="fixed right-2.5 bottom-[60px] z-[100] px-2.5 py-1 border border-gray-400 rounded shadow-md bg-white
      [aria-expanded='true']:p-0 [aria-expanded='true']:w-[25px] [aria-expanded='true']:h-[25px]
      md:hidden"
  >
    {expanded ? '✖' : 'Show Legend'}
  </button>
{/if}
