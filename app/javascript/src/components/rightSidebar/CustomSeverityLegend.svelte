<style lang="scss">
  @import '../../scss/settings.scss';

  .severity-level-col {
    display: flex;
    flex-direction: row;
  }

  .severity-level-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
  }

  .severity-color {
    width: 15px;
    margin-right: 10px;
    padding: 10px;
  }
</style>

<script lang="ts">
  import { round } from '@ts/utils';
  import type { GradientMapping, LegendMapping } from '@types';

  export let gradientMapping: GradientMapping[] = [];

  let legend: LegendMapping[] = [];

  // converts color/cutoff gradient into array of legend text/color pairs
  function makeLegend(gradient) {
    if (!gradient) return [];
    console.log(gradientMapping);
    return gradient.map((el, i) => {
      const color = el.color;
      const lowRange = i === 0 ? 0 : round(gradient[i - 1].number, 1);
      const text = i === gradient.length - 1 ? `${lowRange}+` : `${lowRange} - ${el.number}`;
      return { color, text };
    });
  }

  $: legend = makeLegend(gradientMapping);
</script>

<fieldset id="dsv-legend" data-testid="dsv-legend">
  <legend>Degree-Day Legend:</legend>
  {#each legend.reverse() as entry}
    <div class="severity-level-col">
      <div class="severity-level-row" data-testid="dsv-row">
        <div class="severity-color" data-testid="dsv-color" style="background: {entry.color}" />
        <div>{entry.text}</div>
      </div>
    </div>
  {/each}
</fieldset>
