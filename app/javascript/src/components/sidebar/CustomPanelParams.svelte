<style lang="scss">
  .submitted-params {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: flex-start;
    padding: 0px 19% 0px;
    padding-left: 0px;
    font-size: small;
  }
</style>

<script lang="ts">
  import { customPanelState } from '@store';
</script>

{#if $customPanelState.params}
  <fieldset>
    <legend>Submitted Values</legend>
    <div class="submitted-params" title="submitted-params">
      <div>Start Date:</div>
      <div>{$customPanelState.params.start_date}</div>
      <div>End Date:</div>
      <div>{$customPanelState.params.end_date}</div>
      <div>Tmin:</div>
      <div>{$customPanelState.params.t_min}</div>
      <div>Tmax:</div>
      <div>{$customPanelState.params.t_max || 'None'}</div>
      <div>Units:</div>
      <div>{$customPanelState.params.in_f ? 'Fahrenheit' : 'Celcius'}</div>
    </div>
  </fieldset>
{/if}
