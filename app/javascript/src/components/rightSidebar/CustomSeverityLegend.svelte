<script lang="ts">
  export let gradientMapping
  let legend = []

  // function makeLegend(gradient) {
  //   let legend = []
  //   if (gradient) {
  //     gradient.forEach((element, index) => {
  //       if (index === 0) {
  //         legend[0] = {color: element.color, number: "0 - " + element.number}
  //       } else if (index === gradient.length - 1) {
  //         legend[index] = {color: element.color, text: gradient[index - 1].number + "+"}
  //       } else {
  //         legend[index] = {color: element.color, text: gradient[index - 1].number + " - " + gradient[index].number}
  //       }
  //     })
  //   }
  //   return legend
  // }

  function makeLegend(gradient) {
    let legend = []
    if (gradient) {
      gradient.forEach((element, index) => {
        if (index === 0) {
            legend[0] = {color: element.color, text: "0 - " + element.number}
        } else if (index === gradient.length - 1) {
            legend[index] = {color: element.color, text: Math.round(gradient[index - 1].number) + "+"}
        } else {
            legend[index] = {color: element.color, text: (Math.round(gradient[index - 1].number) + 1) + " - " + Math.round(gradient[index].number)}
        }
      })
    }
    return legend
  }

  $: legend = makeLegend(gradientMapping)
</script>

<style type="scss">
  @import '../../scss/settings.scss';

  // .severity-level-col {
  //   display: flex;
  //   flex-direction: column;
  //   width: 20px;
  //   height: 20px;
  //   margin-bottom: 5px;
  // }

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

  // .severity-range {
  //   width: 35px;
  //   height: 15px;
  //   content: '\2264';
  // }

  // span {
  //   display: inline;
  // }
</style>

<!-- <fieldset id="dsv-legend">
  <legend>Degree-Day Legend:</legend>
  {#each gradientMapping.reverse() as severity, i}
    {#if i === 0}
      <div class="severity-level-col">
        <div class="severity-level-row">
          <div class="severity-color" style="background: {severity.color}" />
          <div class="severity-range"><span>&gt;</span></div>
        </div>
      </div>
    {:else}
      <div class="severity-level-col">
        <div class="severity-level-row">
          <div class="severity-color" style="background: {severity.color}" />
          <div class="severity-range"><span>&#8804</span>{Math.round(severity.number)}</div>
        </div>
      </div>
    {/if}
  {:else}
    Update overlay!
  {/each}
</fieldset> -->

<fieldset id="dsv-legend">
  <legend>Degree-Day Legend:</legend>
  {#each legend.reverse() as entry}
    <div class="severity-level-col">
      <div class="severity-level-row">
        <div class="severity-color" style="background: {entry.color}" />
        <div>{entry.text}</div>
      </div>
    </div>
  {:else}
    <span style="font-size:small">Update overlay!</span>
  {/each}
</fieldset>

<!-- <fieldset id="dsv-legend">
  <legend>Degree-Day Legend:</legend>
  {#each gradientMapping.reverse() as severity, index (severity)}
    {#if index === 0}
      <div class="severity-level-col">
        <div class="severity-level-row">
          <div class="severity-color" style="background: {severity.color}" />
          <div class="severity-range"><span>&#8804;</span>{Math.round(severity.number)}</div>
        </div>
      </div>
      
  {/each}
</fieldset> -->