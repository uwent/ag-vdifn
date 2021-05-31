<script lang="ts">
  import QuestionSvg from '../common/SVG/QuestionSvg.svelte'
  export let severities = []
</script>

<style type="scss">
  @import '../../scss/settings.scss';

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

  .dsv-threshold {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin: 2px;
  }

  button {
    border: none;
    background-color: transparent;
  }
</style>

<fieldset id="dsv-legend">
  <legend>Severity Legend:</legend>
  {#each severities as { name, description, slug }}
    <div
      title="severity-level"
      id="dsv-{slug}"
      class="dsv"
      data-color="#ff0000">
      <div class="dsv-threshold dsv-{slug}" />
      <label>
        {name}
        <button
          title=""
          data-balloon-length="medium"
          data-balloon-pos="up-right"
          aria-label={description}>
          <QuestionSvg />
        </button>
      </label>
    </div>
  {/each}
</fieldset>
