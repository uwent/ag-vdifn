<style type="scss">
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
  export let gradientMapping = []
  let legend = []

  // converts color/cutoff gradient into legend
  function makeLegend(gradient) {
    let legend = []
    if (gradient) {
      gradient.forEach((element, index) => {
        if (index === 0) {
          legend[0] = { color: element.color, text: '0 - ' + element.number }
        } else if (index === gradient.length - 1) {
          legend[index] = {
            color: element.color,
            text: Math.round(gradient[index - 1].number) + 1 + '+'
          }
        } else {
          legend[index] = {
            color: element.color,
            text:
              Math.round(gradient[index - 1].number) +
              1 +
              ' - ' +
              Math.round(gradient[index].number)
          }
        }
      })
    }
    return legend
  }

  $: legend = makeLegend(gradientMapping)
</script>

<fieldset id="dsv-legend" data-testid="dsv-legend">
  <legend>Degree-Day Legend:</legend>
  {#each legend.reverse() as entry}
    <div class="severity-level-col">
      <div class="severity-level-row" data-testid="dsv-row">
        <div
          class="severity-color"
          data-testid="dsv-color"
          style="background: {entry.color}"
        />
        <div>{entry.text}</div>
      </div>
    </div>
  {/each}
</fieldset>
