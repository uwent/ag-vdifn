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

  // button {
  //   border: none;
  //   background-color: transparent;
  //   position: relative;
  //   cursor: help;
  // }
</style>

<script lang="ts">
  import type { SeverityLegend } from '@types';
  import QuestionSvg from '../common/QuestionSvg.svelte';
  import tippy from 'tippy.js';
  import 'tippy.js/dist/tippy.css';
  import { onMount } from 'svelte';

  export let severities: SeverityLegend[] = [];

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
  <script src="https://unpkg.com/@popperjs/core@2"></script>
  <script src="https://unpkg.com/tippy.js@6"></script>
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
