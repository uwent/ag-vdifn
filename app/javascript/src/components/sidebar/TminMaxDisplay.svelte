<script lang="ts">
  import { getContext } from 'svelte';
  import { f_to_c } from '@ts/utils';
  import { panelKey, selectedPest, selectedDDModel, tMinTmax } from '@store';
  import type { Pest, DegreeDayModel, PanelType } from '@types';

  const { panelType } = getContext<{ panelType: PanelType }>(panelKey);

  let in_f = $state(true);
  let tMinF = $state<number | null>(null);
  let tMaxF = $state<number | null>(null);
  let tMinC = $state<number | null>(null);
  let tMaxC = $state<number | null>(null);
  let tMinText = $state('');
  let tMaxText = $state('');

  function makeText(temp) {
    if (temp === null || temp === undefined) return 'None';
    return Number.isInteger(temp) ? temp.toFixed(0) : temp.toFixed(1);
  }

  function updateText(in_f: boolean) {
    const opts = {
      t_min: in_f ? tMinF : tMinC,
      t_max: in_f ? tMaxF : tMaxC,
      in_f: in_f,
    };
    $tMinTmax = opts;
    tMinText = makeText(opts.t_min);
    tMaxText = makeText(opts.t_max);
  }

  function setTminTmax(model: Pest | DegreeDayModel) {
    if (model) {
      tMinF = model.t_min;
      tMaxF = model.t_max;
      tMinC = f_to_c(tMinF);
      tMaxC = f_to_c(tMaxF);
      updateText(in_f);
    }
  }

  $effect(() => {
    updateText(in_f);
  });

  $effect(() => {
    const currentModel = panelType === 'custom' ? $selectedDDModel : $selectedPest;
    setTminTmax(currentModel);
  });
</script>

<!-- Temp Display + Unit Switch -->
<div id="degree_day_info" class="flex flex-row justify-evenly mt-2 w-full flex-wrap gap-4">
  <!-- Tmin/Tmax Display -->
  <div class="w-[50%] flex flex-col items-center">
    <div class="flex justify-between w-full">
      <!-- Tmin -->
      <div class="w-1/2 text-center pr-2">
        <div class="text-xs text-gray-700">Tmin</div>
        <div class="bg-gray-300 text-gray-700 px-2 py-1 mt-1 border border-gray-400 text-sm rounded">
          {tMinText}
        </div>
      </div>

      <!-- Tmax -->
      <div class="w-1/2 text-center pl-2">
        <div class="text-xs text-gray-700">Tmax</div>
        <div class="bg-gray-300 text-gray-700 px-2 py-1 mt-1 border border-gray-400 text-sm rounded">
          {tMaxText}
        </div>
      </div>
    </div>
  </div>

  <!-- Unit Toggle -->
  <div class="flex flex-col items-center justify-center">
    <div class="flex justify-between text-xs text-gray-600 w-full mb-1">
      <span class="pl-1">℃</span>
      <span class="pr-2">℉</span>
    </div>
    <label class="relative inline-block w-14 h-8">
      <input type="checkbox" title="temp-unit-toggle" bind:checked={in_f} class="sr-only peer" />
      <span
        class="absolute inset-0 rounded-full bg-gray-500 peer-checked:bg-green-500 transition-all duration-300"
      ></span>
      <span
        class="absolute left-1 top-1 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 transform peer-checked:translate-x-6"
      ></span>
    </label>
  </div>
</div>
