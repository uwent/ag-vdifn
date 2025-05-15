<script lang="ts">
  import { customPanelState } from '@store';
</script>

{#if $customPanelState.params}
<fieldset class="border border-gray-300 rounded-md p-4 w-fit mx-auto">
  <legend class="text-sm font-medium text-gray-700 mb-2 text-center">Submitted Values</legend>
  <div
    class="grid grid-cols-2 justify-items-start gap-y-1 text-sm"
    title="submitted-params"
  >
    <div>Start Date:</div>
    <div>{$customPanelState.params.start_date}</div>

    <div>End Date:</div>
    <div>{$customPanelState.params.end_date}</div>

    <div>Tmin:</div>
    <div>{$customPanelState.params.t_min}</div>

    <div>Tmax:</div>
    <div>{$customPanelState.params.t_max || 'None'}</div>

    <div>Units:</div>
    <div>{$customPanelState.params.in_f ? 'Fahrenheit' : 'Celsius'}</div>
  </div>
</fieldset>
{/if}
