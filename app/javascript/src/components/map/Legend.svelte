<style lang="scss">
  @use '../../scss/variables.scss' as vars;

  #legend-expand-button {
    position: fixed;
    right: 10px;
    bottom: 60px;
    z-index: 100;
    padding: 5px 10px;
    border: 1px solid grey;
    border-radius: 3px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    background: #fff;

    &[aria-expanded='true'] {
      // background: rgba(240, 240, 240);
      padding: 0;
      height: 25px;
      width: 25px;
    }

    @media #{vars.$medium-up} {
      display: none;
    }
  }

  #legend {
    position: absolute;
    max-width: 200px;
    bottom: 10px;
    right: 10px;
    z-index: 10;
    background: #fff;
    // background: rgba(255, 255, 255, 0.95);
    border-radius: 3px;
    box-shadow:
      -4px 0px 10px rgba(0, 0, 0, 0.3),
      4px 0px 10px rgba(0, 0, 0, 0.3);

    // @media #{vars.$medium-up} {
    //   bottom: 10px;
    // }

    &[aria-expanded='true'] {
      visibility: visible;
      @media #{vars.$medium-up} {
        visibility: visible;
        position: absolute;
      }
    }

    &[aria-expanded='false'] {
      visibility: hidden;

      @media #{vars.$medium-up} {
        visibility: visible;
        position: absolute;
        // bottom: 30px;
      }
    }
  }

  fieldset {
    background: rgba(234, 234, 234, 0.4);
    padding: 10px;
    margin: 0px;

    p {
      margin: 0;
      font-size: 12px;
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
    flex-direction: column;
    gap: 5px;
  }

  .legend-value-row {
    display: flex;
    flex-direction: row;
    gap: 10px;
    font-size: small;
  }

  .legend-value-color {
    height: 20px;
    width: 30px;
    border: 1px solid grey;
  }

  .legend-value-text {
    display: flex;
    align-items: center;
  }
</style>

<script lang="ts">
  import { round } from '@ts/utils';
  import DatabaseClient from '@ts/databaseClient';
  import Modal from '../common/Modal.svelte';
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
  import ColorHelper from '@components/map/ts/colorHelper';

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

    // convert gradient hash to array of objects
    const items: { value: number; color: string }[] = [];
    for (const key in gradient) {
      if (gradient.hasOwnProperty(key)) {
        items.push({ value: parseFloat(key), color: gradient[key] });
      }
    }
    const sortedItems = items.sort((a, b) => a.value - b.value);

    // add legend text and tooltip
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
  <Modal name="Pest Info" on:close={() => (showModal = false)}>
    {@html $selectedPest.info}
  </Modal>
{/if}

{#if showLegend}
  <div id="legend" class="legend" aria-expanded={expanded}>
    {#if currentLegend?.legend}
      <fieldset id="legend-values">
        <legend>{$selectedPanel === 'custom' ? 'Degree-Day Legend:' : 'Severity Legend:'}</legend>
        <div class="legend-values">
          {#each [...currentLegend.legend].reverse() as entry}
            <div class="legend-value-row tippy-tooltip" data-tippy-content={entry.description}>
              <div class="legend-value-color" style="background: {entry.color}"></div>
              <div class="legend-value-text">{entry.name}</div>
            </div>
          {/each}
        </div>
      </fieldset>
    {/if}
    {#if currentLegend?.info}
      <fieldset>
        <legend>More Information</legend>
        <p>{@html currentLegend.info}</p>
      </fieldset>
    {/if}
  </div>
  <button id="legend-expand-button" aria-expanded={expanded} onclick={() => (expanded = !expanded)}>
    {expanded ? '✖' : 'Show Legend'}
  </button>
{/if}
