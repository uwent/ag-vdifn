<style lang="scss">
  @import '../../scss/settings.scss';
  
  #right-sidebar-expand-button {
    position: fixed;
    right: 10px;
    bottom: 60px;
    z-index: 100;
    padding: 5px 5px;
    border: none;
    border-radius: 3px;
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3);

    &[aria-expanded='true'] {
      background: rgba(240, 240, 240);
    }

    @media #{$medium-up} {
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
    background: rgba(255, 255, 255, 0.95);
    border-radius: 3px;
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3), 4px 0px 10px rgba(0, 0, 0, 0.3);

    @media #{$medium-up} {
      bottom: 30px;
    }

    &[aria-expanded='true'] {
      visibility: visible;
      @media #{$medium-up} {
        visibility: visible;
        position: absolute;
        right: 15px;
      }
    }

    &[aria-expanded='false'] {
      @media #{$medium-up} {
        visibility: visible;
        position: absolute;
        right: 15px;
        bottom: 30px;
      }
      visibility: hidden;
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
  const _ = require('lodash')
  import { onDestroy } from 'svelte'
  import { SeverityParams } from '../common/ts/types'
  import {
    selectedPanel,
    diseasePanelParams,
    insectPanelParams,
    overlayGradient,
    selectedAffliction,
    diseaseLegend,
    insectLegend,
    customLegend
  } from '../../store/store'
  import DatabaseClient from '../common/ts/databaseClient'
  import SeverityLegend from './SeverityLegend.svelte'
  import CustomSeverityLegend from './CustomSeverityLegend.svelte'
  import Modal from '../common/Modal.svelte'
  let expanded = false
  let showModal = false

  const diseaseUnsubscribe = diseasePanelParams.subscribe(
    async (severityParams: SeverityParams) => {
      if (Object.entries(severityParams).length === 0) return
      let legend = await updateSeverities(severityParams)
      diseaseLegend.set(legend)
    }
  )

  const insectUnsubscribe = insectPanelParams.subscribe(
    async (severityParams: SeverityParams) => {
      if (Object.entries(severityParams).length === 0) return
      let legend = await updateSeverities(severityParams)
      let info = await updateSeverityInfo(severityParams)
      insectLegend.set({legend: legend, info: info})
    }
  )

  const overlayGradientUnsubscribe = overlayGradient.subscribe(gradientMapping => {
    if (Object.entries(gradientMapping).length === 0) return
    const temp = []
    _.forEach(gradientMapping, (value, key) => {
      temp.push({ number: key, color: value })
    })
    let gradient = temp.sort((x, y) => {
      return x.number - y.number
    })
    customLegend.set(gradient)
  })

  async function updateSeverities(severityParams) {
    return new DatabaseClient().fetchSeverityLegend(severityParams.pest_id)
  }

  async function updateSeverityInfo(severityParams) {
    return new DatabaseClient().fetchSeverityLegendInfo(severityParams.pest_id)
  }

  onDestroy(() => {
    diseaseUnsubscribe()
    insectUnsubscribe()
    overlayGradientUnsubscribe()
  })
</script>

<button
  id="right-sidebar-expand-button"
  aria-expanded={expanded}
  on:click={() => (expanded = !expanded)}>
  {expanded ? '\u2716' : 'Show Legend'}
</button>

{#if showModal}
  <Modal name="Pest Info" on:close={() => (showModal = false)}>
    {@html $selectedAffliction.info}
  </Modal>
{/if}

{#if $selectedPanel === "disease" && $diseaseLegend.length}
  <div id="right-sidebar" aria-expanded={expanded}>
    <SeverityLegend severities={$diseaseLegend} />
  </div>
{/if}

{#if $selectedPanel === "insect" && $insectLegend.legend.length}
  <div id="right-sidebar" aria-expanded={expanded}>
    <SeverityLegend severities={$insectLegend.legend} />
    <fieldset title="more-info">
      <legend>More Information</legend>
      <p>{@html $insectLegend.info}</p>
    </fieldset>
  </div>
{/if}

{#if $selectedPanel === "custom" && $customLegend.length}
  <div id="right-sidebar" aria-expanded={expanded}>
    <CustomSeverityLegend gradientMapping={$customLegend} />
  </div>
{/if}
