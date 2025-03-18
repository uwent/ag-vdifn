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
    diseaseLegend,
    insectLegend,
    customPanelState,
    customLegend,
    overlayLoading,
  } from '@store';
  import type { GradientMapping, SeverityParams } from '@types';
  import type { Snippet } from 'svelte';

  const { parent } = $props<{
    parent: Snippet;
  }>();

  let expanded = $state(true);
  let showModal = $state(false);
  let showDiseaseLegend = $derived($selectedPanel === 'disease' && $diseaseLegend);
  let showInsectLegend = $derived($selectedPanel === 'insect' && $insectLegend);
  let showCustomLegend = $derived($selectedPanel === 'custom' && $customLegend && !$overlayLoading);

  async function updateSeverities(severityParams: SeverityParams) {
    return new DatabaseClient().fetchSeverityLegend(severityParams.pest_id);
  }

  async function updateSeverityInfo(severityParams: SeverityParams) {
    return new DatabaseClient().fetchSeverityLegendInfo(severityParams.pest_id);
  }

  $effect(() => {
    const severityParams = $diseasePanelParams;
    if (!severityParams) return;

    (async () => {
      const legend = await updateSeverities(severityParams);
      $diseaseLegend = legend;
    })();
  });

  $effect(() => {
    const severityParams = $insectPanelParams;
    if (!severityParams) return;

    (async () => {
      let legend = await updateSeverities(severityParams);
      let info = await updateSeverityInfo(severityParams);
      $insectLegend = { legend: legend, info: info };
    })();
  });

  $effect(() => {
    const gradientMapping = $overlayGradient;
    if (!gradientMapping) return;

    const arr: GradientMapping[] = [];
    for (const key in gradientMapping) {
      if (gradientMapping.hasOwnProperty(key)) {
        arr.push({ number: parseFloat(key), color: gradientMapping[key] });
      }
    }
    const gradient = arr.sort((x, y) => x.number - y.number);
    $customLegend = gradient;
  });
</script>

{@render parent?.()}

{#if showModal}
  <Modal name="Pest Info" on:close={() => (showModal = false)}>
    {@html $selectedPest.info}
  </Modal>
{/if}

{#if showDiseaseLegend}
  <div id="right-sidebar" aria-expanded={expanded}>
    <SeverityLegend severities={$diseaseLegend} />
  </div>
{/if}

{#if showInsectLegend}
  <div id="right-sidebar" aria-expanded={expanded}>
    <SeverityLegend severities={$insectLegend.legend} />
    <fieldset title="more-info">
      <legend>More Information</legend>
      <p>{@html $insectLegend.info}</p>
    </fieldset>
  </div>
{/if}

{#if showCustomLegend}
  <div id="right-sidebar" aria-expanded={expanded}>
    <CustomSeverityLegend gradientMapping={$customLegend} />
  </div>
{/if}

{#if showDiseaseLegend || showInsectLegend || showCustomLegend}
  <button
    id="right-sidebar-expand-button"
    aria-expanded={expanded}
    onclick={() => (expanded = !expanded)}
  >
    {expanded ? '✖' : 'Show Legend'}
  </button>
{/if}
