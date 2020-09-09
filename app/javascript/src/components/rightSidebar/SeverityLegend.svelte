<script lang="ts">
  import { SeverityParams } from "../../components/common/TypeScript/types";
  import { submitParams } from "../../store/store";
  import DatabaseClient from "../../components/common/TypeScript/databaseClient";
  import { onDestroy } from "svelte";
  import QuestionSvg from '../common/SVG/QuestionSvg.svelte'
  export let severities = [];

  const unsubscribe = submitParams.subscribe(async (severityParams: SeverityParams) => {
    if (Object.entries(severityParams).length === 0) 
      return;
    severities = await updateSeverities(severityParams);
  });

  async function updateSeverities(severityParams) {
    return new DatabaseClient().fetchSeverityLegend(severityParams.pest_id);
  }

  onDestroy(unsubscribe)

</script>

<!-- svelte-ignore a11y-label-has-associated-control -->

<fieldset id="dsv-legend">
    <legend>Severity Legend:</legend>
    {#each severities as { name, description, slug }}
      <div title="severity-level" id="dsv-{slug}" class="dsv" data-color="#ff0000">
        <div class="dsv-threshold dsv-{slug}" />
        <label>{name}<span class="tooltip left" title="" data-tooltip={description}><QuestionSvg /></span></label>
      </div>
    {/each}
</fieldset>

<style>
  .dsv-threshold.dsv-very_high {
    background: rgb(204, 0, 0);
  }

  .dsv-threshold.dsv-high {
    background: rgb(255, 128, 0);
  }

  .dsv-threshold.dsv-medium {
    background: rgb(255, 215, 0);
  }

  .dsv-threshold.dsv-low {
    background: rgb(125, 255, 35);
  }

  .dsv-threshold.dsv-very_low {
    background: rgb(0, 201, 87);
  }

  #severity-legend .dsv {
    clear: both;
  }

  #severity-legend .dsv label {
    display: inline-block;
    margin-top: 5px;
  }

  span {
    margin-left: 5px;
  }

  .dsv-threshold {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin: 2px;
  }
</style>

