<script lang="ts">
  import QuestionSvg from "../common/SVG/QuestionSvg.svelte";
  import {
    selectedPanel,
    PANELS,
    diseasePanelParams,
    insectPanelParams,
    overlayGradient,
    mapMinMapMax,
    selectedAffliction,
  } from "../../store/store";
  import { SeverityParams } from "../common/TypeScript/types";
  import DatabaseClient from "../common/TypeScript/databaseClient";
  import { onDestroy } from "svelte";
  import SeverityLegend from "./SeverityLegend.svelte";
  import CustomSeverityLegend from "./CustomSeverityLegend.svelte";
  import Modal from "../common/Modal.svelte";
  let expanded = false;
  export let currentSeverities = [];
  let diseaseSeverities = [];
  let insectSeverities = [];
  let severityInfo = ""
  let gradient = [];
  let showModal = false;
  const _ = require("lodash");

  const diseaseUnsubscribe = diseasePanelParams.subscribe(
    async (severityParams: SeverityParams) => {
      if (Object.entries(severityParams).length === 0) return;
      diseaseSeverities = await updateSeverities(severityParams);
      currentSeverities = diseaseSeverities;
    }
  );

  const insectUnsubscribe = insectPanelParams.subscribe(
    async (severityParams: SeverityParams) => {
      if (Object.entries(severityParams).length === 0) return;
      insectSeverities = await updateSeverities(severityParams);
      currentSeverities = insectSeverities;
      severityInfo = await updateSeverityInfo(severityParams);

    }
  );

  const overlayGradientUnsubscribe = overlayGradient.subscribe(
    (gradientMapping) => {
      if (Object.entries(gradientMapping).length === 0) return;
      const temp = [];
      _.forEach(gradientMapping, (value, key) => {
        temp.push({ number: key, color: value });
      });
      gradient = temp.sort((x, y) => {
        return x.number - y.number;
      });
    }
  );

  async function updateSeverities(severityParams) {
    return new DatabaseClient().fetchSeverityLegend(severityParams.pest_id);
  }

  async function updateSeverityInfo(severityParams) {
    return new DatabaseClient().fetchSeverityLegendInfo(severityParams.pest_id);
  }

  $: swapSeverities($selectedPanel);

  function swapSeverities(selectedPanel) {
    switch (selectedPanel) {
      case PANELS.DISEASE:
        currentSeverities = diseaseSeverities;
        break;
      case PANELS.INSECT:
        currentSeverities = insectSeverities;
        break;
      case PANELS.CUSTOM:
        currentSeverities = [];
        break;
    }
  }

  onDestroy(() => {
    diseaseUnsubscribe();
    insectUnsubscribe();
    overlayGradientUnsubscribe();
  });
</script>

<style type="scss">
  @import "../../scss/settings.scss";

  .tooltip {
    border: none;
    background-color: transparent;
  }

  #right-sidebar-expand-button {
    position: fixed;
    right: 10px;
    bottom: 60px;
    z-index: 100;
    padding: 5px 5px;
    border: none;
    border-radius: 3px;
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3);

    &[aria-expanded="true"] {
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
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3),
      4px 0px 10px rgba(0, 0, 0, 0.3);

    @media #{$medium-up} {
      bottom: 30px;
    }

    &[aria-expanded="true"] {
      visibility: visible;
      @media #{$medium-up} {
        visibility: visible;
        position: absolute;
        right: 15px;
      }
    }

    &[aria-expanded="false"] {
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
      font-size: 12px
    }
  }

  legend {
    padding: 0 5px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    font-size: 0.8em;
  }

  ul li {
    color: #424242;
  }

</style>

<button
  id="right-sidebar-expand-button" aria-expanded={expanded}
  on:click={() => (expanded = !expanded)}>{expanded ? '\u2716' : 'Show Legend'}</button>

<div id="right-sidebar" aria-expanded={expanded}>
  {#if $selectedPanel === PANELS.CUSTOM}
    <CustomSeverityLegend
      mapMin={$mapMinMapMax.min}
      mapMax={$mapMinMapMax.max}
      gradientMapping={gradient} />
  {:else}
    {#if $selectedPanel === PANELS.INSECT}
      {#if showModal}
        <Modal on:close={() => (showModal = false)}>
          {@html $selectedAffliction.info}
        </Modal>
      {/if}
    {/if}
    <SeverityLegend severities={currentSeverities} />
  {/if}

  {#if $selectedPanel === PANELS.DISEASE}
    <fieldset id="definitions">
      <legend>Terms</legend>
      <ul>
        <li id="disease-forecasting">
          Disease Forecasting <button
            class="tooltip"
            id="disease-forecasting-information"
            data-balloon-length="medium"
            data-balloon-pos='up-right'
            aria-label="A plant disease management system that uses computer-based models to collect field weather data and predict the onset and potential severity of crop diseases. Current and forecasted weather conditions determine the risk for disease, and prompts disease management decisions (preventative pesticide applications)."><QuestionSvg /></button>
        </li>
        <li id="tomcast">
          TOMCAST <button
            class="tooltip"
            id="tomcast-information"
            data-balloon-length="medium"
            data-balloon-pos='up-right'
            aria-label="Disease forecasting model (adapted from a tomato disease model) used to predict the development of carrot foliar blights caused by Alternaria and Cercospora fungi, based on an accumulation of DSVs from past temperature and leaf wetness data combined with forecasted weather conditions."><QuestionSvg /></button>
        </li>
        <li id="blitecast">
          Blitecast <button
            class="tooltip"
            id="blitecast-information"
            data-balloon-length="medium"
            data-balloon-pos='up-right'
            aria-label="Disease forecasting model used to predict the development of late blight of potato/tomato caused by Phytophthora infestans, based on an accumulation of DSVs, which are generated from air temperature and relative humidity data."><QuestionSvg /></button>
        </li>
      </ul>
    </fieldset>
  {/if}

  {#if $selectedPanel === PANELS.INSECT}
    <fieldset title="more-info">
      <legend>More Information</legend>
      <p> {severityInfo} </p>
    </fieldset>
    {/if}
</div>
