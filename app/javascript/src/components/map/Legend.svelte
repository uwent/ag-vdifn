<style lang="scss">
  @use '../../scss/variables.scss' as vars;

  #legend-expand-button {
    right: 12px;
    z-index: 25;
    padding: 4px 6px;
    border: 1px solid grey;
    border-radius: 9999px;
    font-size: 0.8rem;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
    background: lightgreen;

    @media #{vars.$medium-up} {
      display: none; // hide on desktop
    }
  }
  .mobile-legend-wrapper {
    position:fixed;
    bottom: 0;
    width: 100%;
    background: white;
    z-index: 20;
    display: flex;
    max-height: 40vh; 
    flex-direction: column;
    align-items: flex-end;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    max-height: 40vh;

    &.visible {
      transform: translateY(0%);
    }
}

  #legend {
    background: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end; 
    width: 100%;
    max-height: 33vh;
    overflow-y: auto; 
    border-top: 1px solid #ccc;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
    background: white;
    transition: transform 0.3s ease;
    z-index: 20;

    @media (min-width: 768px) {
      //desktop
      position: absolute;
      max-width: 200px;
      left: auto;
      width: auto;
      bottom: 10px;
      right: 10px;
      transform: none !important;
      box-shadow: none;
      border: none;
      max-height: none;
    }
  }

  .legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    padding-top: 5px;
  }

  .legend-values {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 15px;

    @media (min-width: 768px) {
      //desktop
      gap: 8px;
    }
  }

  .legend-value-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px; //the value name is below the color

    @media (min-width: 768px) {
      gap: 6px; // tighten spacing between color and text
    }
  }

  .legend-value-color {
    height: 20px;
    width: 30px;
    border: 1px solid grey;
    @media (min-width: 768px) {
      height: 14px;
      width: 20px; // smaller color boxes
    }
  }

  .legend-value-text {
    display: flex;
    align-items: center;

    @media (min-width: 768px) {
      font-size: 0.7rem;
    }
  }
</style>
<script lang="ts">
  import { onMount } from 'svelte';
  import { round } from '@ts/utils';
  import DatabaseClient from '@ts/databaseClient';
  import Frame from '@components/common/Frame.svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

  import {
    selectedPanel,
    diseasePanelParams,
    insectPanelParams,
    overlayGradient,
    overlayLoading,
    selectedPalette,
  } from '@store';
  import type { LegendData, GradientHash, SeverityParams } from '@types';
  import tippy from 'tippy.js';
  import 'tippy.js/dist/tippy.css';
  import ColorHelper from '@ts/colorHelper';

  const db = new DatabaseClient();

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

  let showLegendUI = $state(true);
  let isDesktop = $state(window.innerWidth >= 768);

  onMount(() => {
    const handler = () => {
      isDesktop = window.innerWidth >= 768;
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });

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
      const name = i === sortedItems.length - 1 ? `${lowRange}+` : `${lowRange} - ${round(item.value)}`;
      const description = `${name} degree days`;
      return { value, color, name, description };
    });
    return { legend: legendEntries, info: null };
  }

  $effect(() => {
    if ($selectedPanel === 'disease') buildPestLegend($diseasePanelParams).then((legend) => (diseaseLegend = legend));
  });

  $effect(() => {
    if ($selectedPanel === 'insect') buildPestLegend($insectPanelParams).then((legend) => (insectLegend = legend));
  });

  $effect(() => {
    if ($selectedPanel === 'custom' && !$overlayLoading) customLegend = buildCustomLegend($overlayGradient);
  });

  $effect(() => {
    currentLegend;
    invokeTippy();
  });
</script>

{#if !isDesktop}
  <button
    id="legend-expand-button"
    aria-expanded={showLegendUI}
    aria-controls="legend"
    class="z-30 bg-green-200 shadow p-2 border border-gray-400 rounded-full text-xl"
    style={`position: fixed; right: 12px; bottom: ${showLegendUI ? 'calc(38vh - 2rem)' : '8px'}; transition: bottom 0.3s ease;`}
    onclick={() => (showLegendUI = !showLegendUI)}
    tabindex="0"
  >
    {#if showLegendUI}
      <FontAwesomeIcon icon={faTimes} class="w-4 h-4" />
    {:else}
      <FontAwesomeIcon icon={faPlus} class="w-4 h-4" />
    {/if}
  </button>

  <div class={`mobile-legend-wrapper ${showLegendUI ? 'visible' : ''}`}
    style="position: fixed; bottom: 0; width: 100%; background: white; z-index: 20; display: flex; flex-direction: column; align-items: flex-end; max-height: 40vh; transition: transform 0.3s ease;"
  >
    <div id="legend" class="visible legend">
      {#if currentLegend?.legend}
        <Frame title={$selectedPanel === 'custom' ? 'Degree-Day Legend:' : 'Severity Legend:'}>
          <div class="legend-values">
            {#each [...currentLegend.legend].reverse() as entry}
              <div class="legend-value-row tippy-tooltip" data-tippy-content={entry.description}>
                <div class="legend-value-color" style="background: {entry.color}"></div>
                <div class="legend-value-text">{entry.name}</div>
              </div>
            {/each}
          </div>
        </Frame>
      {/if}
      {#if currentLegend?.info}
        <Frame title="More Information">
          <p class="text-sm">{@html currentLegend.info}</p>
        </Frame>
      {/if}
    </div>
  </div>
{:else}
  <div id="legend" class="legend desktop">
    {#if currentLegend?.legend}
      <Frame title={$selectedPanel === 'custom' ? 'Degree-Day Legend:' : 'Severity Legend:'}>
        <div class="legend-values">
          {#each [...currentLegend.legend].reverse() as entry}
            <div class="legend-value-row tippy-tooltip" data-tippy-content={entry.description}>
              <div class="legend-value-color" style="background: {entry.color}"></div>
              <div class="legend-value-text">{entry.name}</div>
            </div>
          {/each}
        </div>
      </Frame>
    {/if}
    {#if currentLegend?.info}
      <Frame title="More Information">
        <p class="text-sm">{@html currentLegend.info}</p>
      </Frame>
    {/if}
  </div>
{/if}

