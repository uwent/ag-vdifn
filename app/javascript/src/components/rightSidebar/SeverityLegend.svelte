<style lang="scss">
  #severity-legend .dsv {
    clear: both;
  }

  #severity-legend .dsv label {
    display: inline-block;
    margin-top: 5px;
  }

  .dsv-threshold {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin: 2px;
    border: 1px solid grey;
  }

  button {
    border: none;
    background-color: transparent;
  }
</style>

<script lang="ts">
  import type { SeverityLegend } from '@types';
  import QuestionSvg from '../common/QuestionSvg.svelte';

  export let severities: SeverityLegend[] = [];
</script>

<fieldset id="dsv-legend">
  <legend>Severity Legend:</legend>
  {#each severities as { name, description, slug }}
    <div id="dsv-{slug}" class="dsv" data-color="#ff0000" data-testid="severity-level-{slug}">
      <div class="dsv-threshold severity-{slug}" data-testid="severity-color-{slug}" />
      <label>
        {name}
        <button
          title=""
          data-balloon-length="medium"
          data-balloon-pos="up-right"
          aria-label={description}
        >
          <QuestionSvg />
        </button>
      </label>
    </div>
  {/each}
</fieldset>
