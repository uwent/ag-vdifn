<style lang="postcss">
  @reference "tailwindcss";
  .custom-class {
    @apply font-medium text-gray-700;
  }
</style>

<script lang="ts">
  import Frame from '@components/common/Frame.svelte';
  import { customPanelState } from '@store';
</script>

{#if $customPanelState.params}
  <Frame title="Submitted Values">
    <div class="gap-y-2 grid grid-cols-2 pr-[19%] pl-0 text-sm" title="submitted-params">
      <div class="custom-class">Start Date:</div>
      <div>{$customPanelState.params.start_date}</div>

      <div class="custom-class">End Date:</div>
      <div>{$customPanelState.params.end_date}</div>

      <div class="custom-class">Tmin:</div>
      <div>{$customPanelState.params.t_min}</div>

      <div class="custom-class">Tmax:</div>
      <div>{$customPanelState.params.t_max || 'None'}</div>

      <div class="custom-class">Units:</div>
      <div>{$customPanelState.params.in_f ? 'Fahrenheit' : 'Celsius'}</div>
    </div>
  </Frame>
{/if}
