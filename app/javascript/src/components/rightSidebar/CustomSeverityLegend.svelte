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
  import type { GradientMapping, LegendMapping } from '@types';

  export let gradientMapping: GradientMapping[] = [];

  let legend: LegendMapping[] = [];

  // converts color/cutoff gradient into legend
  function makeLegend(gradient) {
    legend = [];
    if (gradient) {
      gradient.forEach((element, index) => {
        let color = element.color;
        let text = '';
        if (index === 0) {
          text = `0 - ${element.number}`;
        } else {
          let lowRange = Math.round(gradient[index - 1].number) + 1;
          text = index === gradient.length - 1 ? `${lowRange}+` : `${lowRange} - ${element.number}`;
        }
        legend[index] = { color: color, text: text };
      });
    }
    return legend;
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
