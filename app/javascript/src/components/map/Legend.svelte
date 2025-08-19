<style lang="scss">
  .legend-gradient-horizontal {
    display: flex;
    flex-direction: row;
    gap: 15px;
  }

  .legend-gradient-vertical {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .legend-color-item-horizontal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .legend-color-item-vertical {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
</style>

<script lang="ts">
  import { round } from '@ts/utils';
  import DatabaseClient from '@ts/databaseClient';
  import Frame from '@components/common/Frame.svelte';
  import { IconChevronDown, IconChevronUp } from '@tabler/icons-svelte';

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
  import { innerWidth } from 'svelte/reactivity/window';

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
  let colorHelper = $derived(new ColorHelper($selectedPalette));

  // Reactive window size detection
  const MOBILE_WIDTH = 640; // tailwind small width breakpoint
  let isDesktop = $derived((innerWidth.current || MOBILE_WIDTH) >= MOBILE_WIDTH);
  let showLegend = $state(true);
  let mobileDrawerHeight = $state(0);

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
    return { legend: legendEntries, info: null };
  }

  $effect(() => {
    if ($selectedPanel === 'disease')
      buildPestLegend($diseasePanelParams).then((legend) => (diseaseLegend = legend));
  });

  $effect(() => {
    if ($selectedPanel === 'insect')
      buildPestLegend($insectPanelParams).then((legend) => (insectLegend = legend));
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

{#if currentLegend}
  {#if isDesktop}
    <!-- DESKTOP LEGEND -->
    <div
      class="right-2 bottom-2 z-20 absolute flex flex-col gap-2 bg-white shadow-lg p-2 pt-1 border border-gray-200 rounded-lg max-w-60 max-h-100"
    >
      {#if currentLegend?.legend}
        <Frame title={$selectedPanel === 'custom' ? 'Degree-Day Legend:' : 'Severity Legend:'}>
          <div class="legend-gradient-vertical">
            {#each [...currentLegend.legend].reverse() as entry}
              <div
                class="legend-color-item-vertical tippy-tooltip"
                data-tippy-content={entry.description}
              >
                <div
                  class="flex-shrink-0 border border-gray-400 w-5 h-3.5"
                  style="background: {entry.color}"
                ></div>
                <div class="text-xs leading-tight">{entry.name}</div>
              </div>
            {/each}
          </div>
        </Frame>
      {/if}
      {#if currentLegend?.info}
        <Frame title="More Information">
          <p class="max-h-40 overflow-auto text-xs">{@html currentLegend.info}</p>
        </Frame>
      {/if}
    </div>
  {:else}
    <!-- MOBILE LEGEND -->
    <!-- Toggle Button -->
    <button
      class="inline-flex right-1 bottom-0 z-10 fixed items-center bg-white border-4 border-gray-300 border-t border-r border-l rounded-t h-10 overflow-hidden text-sm align-middle transition-all duration-300 ease-in-out"
      style={`bottom: ${showLegend ? mobileDrawerHeight - 10 : -10}px;`}
      onclick={() => (showLegend = !showLegend)}
      aria-expanded={showLegend}
      aria-controls="mobile-legend"
      aria-label={showLegend ? 'Hide legend' : 'Show legend'}
    >
      {#if showLegend}
        <IconChevronDown size={40} />
      {:else}
        <span class="pl-2">Show legend</span>
        <IconChevronUp size={40} />
      {/if}
    </button>

    <!-- Mobile Drawer -->
    <div
      id="mobile-legend"
      class="right-0 bottom-0 left-0 z-20 fixed bg-white shadow-2xl border-gray-300 border-t max-h-[40vh] overflow-hidden transition-transform duration-300 ease-in-out"
      style="transform: translateY({showLegend ? '0%' : '100%'})"
      bind:clientHeight={mobileDrawerHeight}
    >
      <div class="p-2 max-h-full overflow-y-auto">
        {#if currentLegend?.legend}
          <Frame title={$selectedPanel === 'custom' ? 'Degree-Day Legend:' : 'Severity Legend:'}>
            <div class="w-full legend-gradient-horizontal">
              {#each [...currentLegend.legend] as entry}
                <div
                  class="flex-1 legend-color-item-horizontal tippy-tooltip"
                  data-tippy-content={entry.description}
                >
                  <div
                    class="border border-gray-400 w-full min-w-[30px] h-5"
                    style="background: {entry.color}"
                  ></div>
                  <div class="text-xs text-center leading-tight">{entry.name}</div>
                </div>
              {/each}
            </div>
          </Frame>
        {/if}
        {#if currentLegend?.info}
          <div class="mt-3">
            <Frame title="More Information">
              <p class="max-h-40 overflow-auto text-sm">{@html currentLegend.info}</p>
            </Frame>
          </div>
        {/if}
      </div>
    </div>
  {/if}
{/if}
