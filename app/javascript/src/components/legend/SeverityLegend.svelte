<style lang="scss">
  .dsv {
    clear: both;
  }

  .dsv-label {
    display: inline-block;
    margin-top: 5px;
    font-size: smaller;
    cursor: help;
  }

  .dsv-threshold {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin: 2px;
    border: 1px solid grey;
  }
</style>

<script lang="ts">
  import type { PestLegendElement } from '@types';
  import { onMount } from 'svelte';
  import tippy from 'tippy.js';
  import 'tippy.js/dist/tippy.css';

  export let severities: PestLegendElement[] = [];

  onMount(() => {
    tippy('.tippy-tooltip', {
      placement: 'top',
      arrow: true,
      theme: 'light-border',
      duration: 200,
    });
  });
</script>

<fieldset id="severity-legend">
  <legend>Severity Legend:</legend>
  {#each severities as { name, description, slug }}
    <div id="dsv-{slug}" class="dsv" data-color="#ff0000" data-testid="severity-level-{slug}">
      <div class="dsv-threshold severity-{slug}" data-testid="severity-color-{slug}"></div>
      <div class="dsv-label tippy-tooltip" data-tippy-content={description}>
        {name} Risk
      </div>
    </div>
  {/each}
</fieldset>
