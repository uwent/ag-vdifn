<style lang="scss">
  @use '../../scss/variables.scss' as vars;

  #right-sidebar-expand-button {
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

  #right-sidebar {
    position: fixed;
    max-width: 200px;
    bottom: 60px;
    right: 10px;
    z-index: 10;
    padding: 5px 10px;
    background: #fff;
    // background: rgba(255, 255, 255, 0.95);
    border-radius: 3px;
    box-shadow:
      -4px 0px 10px rgba(0, 0, 0, 0.3),
      4px 0px 10px rgba(0, 0, 0, 0.3);

    @media #{vars.$medium-up} {
      bottom: 30px;
    }

    &[aria-expanded='true'] {
      visibility: visible;
      @media #{vars.$medium-up} {
        visibility: visible;
        position: absolute;
        right: 15px;
      }
    }

    &[aria-expanded='false'] {
      visibility: hidden;

      @media #{vars.$medium-up} {
        visibility: visible;
        position: absolute;
        right: 15px;
        bottom: 30px;
      }
    }
  }

  fieldset {
    margin-top: 10px;
    background: rgba(234, 234, 234, 0.4);
    margin-bottom: 10px;
    padding: 10px;

    p {
      margin: 0;
      font-size: 12px;
    }
  }

  legend {
    padding: 0 5px;
  }
</style>

<script lang="ts">
  import DatabaseClient from '@ts/databaseClient';
  import SeverityLegend from './SeverityLegend.svelte';
  import CustomSeverityLegend from './CustomLegend.svelte';
  import Modal from '../common/Modal.svelte';
  import {
    selectedPanel,
    diseasePanelParams,
    insectPanelParams,
    overlayGradient,
    selectedPest,
    overlayLoading,
  } from '@store';
  import type { PestLegend, GradientHash, GradientMapping, SeverityParams } from '@types';

  let expanded = $state(true);
  let showModal = $state(false);
  let diseaseLegend = $state<PestLegend | null>(null);
  let insectLegend = $state<PestLegend | null>(null);
  let customLegend = $state<GradientMapping[] | null>(null);
  let pestLegend = $derived.by(() => {
    switch ($selectedPanel) {
      case 'disease':
        return diseaseLegend;
      case 'insect':
        return insectLegend;
    }
    return null;
  });
  let showPestLegend = $derived(!!pestLegend);
  let showCustomLegend = $derived($selectedPanel === 'custom' && !!customLegend);
  let showLegend = $derived(showPestLegend || showCustomLegend);

  async function buildPestLegend(params: SeverityParams): Promise<PestLegend | null> {
    if (!params) return null;
    let legend = await updateSeverities(params);
    let info = await updateSeverityInfo(params);
    return { legend: legend, info: info };
  }

  function buildCustomLegend(gradient: GradientHash): GradientMapping[] | null {
    if (!gradient) return null;
    const arr: GradientMapping[] = [];
    for (const key in gradient) {
      if (gradient.hasOwnProperty(key)) {
        arr.push({ number: parseFloat(key), color: gradient[key] });
      }
    }
    return arr.sort((x, y) => x.number - y.number);
  }

  async function updateSeverities(severityParams: SeverityParams) {
    return new DatabaseClient().fetchSeverityLegend(severityParams.pest_id);
  }

  async function updateSeverityInfo(severityParams: SeverityParams) {
    return new DatabaseClient().fetchSeverityLegendInfo(severityParams.pest_id);
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
</script>

{#if showModal}
  <Modal name="Pest Info" on:close={() => (showModal = false)}>
    {@html $selectedPest.info}
  </Modal>
{/if}

{#if showLegend}
  <div id="right-sidebar" aria-expanded={expanded}>
    {#if pestLegend && showPestLegend}
      <SeverityLegend severities={pestLegend.legend} />
      {#if pestLegend.info}
        <fieldset title="more-info">
          <legend>More Information</legend>
          <p>{@html pestLegend.info}</p>
        </fieldset>
      {/if}
    {/if}
    {#if customLegend && showCustomLegend}
      <CustomSeverityLegend gradientMapping={customLegend} />
    {/if}
  </div>
  <button
    id="right-sidebar-expand-button"
    aria-expanded={expanded}
    onclick={() => (expanded = !expanded)}
  >
    {expanded ? '✖' : 'Show Legend'}
  </button>
{/if}
