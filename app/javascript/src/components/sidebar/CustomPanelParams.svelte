<script lang="ts">
  import { customPanelState } from '@store';
</script>

{#if $customPanelState.params}
  <fieldset class="border border-gray-300 p-4 rounded-lg mb-6 max-w-2xl mx-auto">
    <legend class="text-lg font-semibold mb-2">Submitted Values</legend>
    
    <div
      class="grid grid-cols-2 gap-y-2 text-sm pl-0 pr-[19%]"
      title="submitted-params"
    >
      <div class="font-medium text-gray-700">Start Date:</div>
      <div>{$customPanelState.params.start_date}</div>
      
      <div class="font-medium text-gray-700">End Date:</div>
      <div>{$customPanelState.params.end_date}</div>
      
      <div class="font-medium text-gray-700">Tmin:</div>
      <div>{$customPanelState.params.t_min}</div>
      
      <div class="font-medium text-gray-700">Tmax:</div>
      <div>{$customPanelState.params.t_max || 'None'}</div>
      
      <div class="font-medium text-gray-700">Units:</div>
      <div>{$customPanelState.params.in_f ? 'Fahrenheit' : 'Celsius'}</div>
    </div>
  </fieldset>
{/if}
