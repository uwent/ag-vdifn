<script lang="ts">
  import { getContext } from 'svelte';
  import { f_to_c } from '@ts/utils';
  import { panelKey, selectedPest, selectedDDModel, tMinTmax } from '@store';
  import type { PanelType } from '@types';

  const { panelType } = getContext<{ panelType: PanelType }>(panelKey);

  // Basic state variables
  let in_f = $state(true);
  let tMinF = $state<number | null>(null);
  let tMaxF = $state<number | null>(null);

  // Derive Celsius values from Fahrenheit
  let tMinC = $derived(f_to_c(tMinF));
  let tMaxC = $derived(f_to_c(tMaxF));

  // Helper function for formatting temperatures
  function formatTemp(temp: number | null): string {
    if (temp === null || temp === undefined) return 'None';
    return Number.isInteger(temp) ? temp.toFixed(0) : temp.toFixed(1);
  }

  // Derive the current temperatures based on selected unit
  let currentTMin = $derived(in_f ? tMinF : tMinC);
  let currentTMax = $derived(in_f ? tMaxF : tMaxC);

  // Derive formatted text for display
  let tMinText = $derived(formatTemp(currentTMin));
  let tMaxText = $derived(formatTemp(currentTMax));

  // Update the store whenever relevant values change
  $effect(() => {
    $tMinTmax = {
      t_min: currentTMin,
      t_max: currentTMax,
      in_f: in_f,
    };
  });

  // Update temperature values when the model changes
  $effect(() => {
    const currentModel = panelType === 'custom' ? $selectedDDModel : $selectedPest;
    if (currentModel) {
      tMinF = currentModel.t_min;
      tMaxF = currentModel.t_max;
    }
  });
</script>

<!-- UI -->
<div class="mt-2 flex flex-row justify-evenly items-start gap-2 flex-wrap">
  <!-- Temp Min/Max -->
  <div class="flex flex-col w-1/2">
    <div class="flex justify-between gap-4">
      <div class="text-center w-1/2 mr-2">
        <div class="text-xs text-gray-700">Tmin</div>
        <div
          title="Min temp"
          class="bg-gray-300 text-gray-700 text-sm py-1 px-2 mt-1 border border-gray-300 text-center"
        >
          {tMinText}
        </div>
      </div>
      <div class="text-center w-1/2">
        <div class="text-xs text-gray-700">Tmax</div>
        <div
          title="Max temp"
          class="bg-gray-300 text-gray-700 text-sm py-1 px-2 mt-1 border border-gray-300 text-center"
        >
          {tMaxText}
        </div>
      </div>
    </div>
  </div>

  <!-- Fahrenheit/Celsius Toggle -->
  <div class="flex flex-col items-center justify-center">
    <div class="flex justify-between w-[60px] text-[0.75em] text-gray-700 mb-1">
      <span>&#8451;</span>
      <span>&#8457;</span>
    </div>
    <label class="relative inline-block w-[60px] h-[34px]">
      <input type="checkbox" title="temp-unit-toggle" bind:checked={in_f} class="sr-only peer" />
      <span
        class="peer-checked:bg-green-500 bg-gray-600 rounded-full absolute top-0 left-0 right-0 bottom-0 transition duration-300
          before:content-[''] before:absolute before:h-[26px] before:w-[26px] before:bottom-[4px] before:left-[4px]
          before:bg-white before:rounded-full before:transition-transform before:duration-300
          peer-checked:before:translate-x-[26px]"
      ></span>
    </label>
  </div>
</div>
