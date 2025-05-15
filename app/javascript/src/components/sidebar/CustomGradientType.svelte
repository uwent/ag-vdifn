<script lang="ts">
  import { customPanelState, selectedPalette } from '@store';
</script>

<div data-testid="gradient-opts" class="mx-auto w-full max-w-xs">
  <fieldset class="flex flex-col items-center border border-gray-300 rounded-md p-3">
    <legend class="mb-1 text-sm font-medium text-gray-700 text-center">Gradient Type</legend>

    <div class="flex flex-row gap-4">
      <!-- Two Point Gradient -->
      <label for="gradient-2-point" class="flex flex-col items-center cursor-pointer select-none">
        <input
          id="gradient-2-point"
          type="radio"
          name="gradient-type"
          title="gradient-2-point"
          class="hidden"
          bind:group={$customPanelState.selectedGradient}
          value="two-point"
        />
        <span
          class={`h-8 w-[95px] rounded-md border-2 ${
            $customPanelState.selectedGradient === 'two-point'
              ? 'border-blue-700'
              : 'border-white hover:border-gray-300'
          } ${
            $selectedPalette === 'spectral'
              ? 'bg-gradient-to-r from-[#00b026] via-[#f5ff00] to-[#ff0000]'
              : $selectedPalette === 'viridis'
              ? 'bg-gradient-to-r from-[#470052] via-[#008a8c] to-[#ffe849]'
              : ''
          }`}
        ></span>
      </label>

      <!-- Three Point Gradient -->
      <label for="gradient-3-point" class="flex flex-col items-center cursor-pointer select-none">
        <input
          id="gradient-3-point"
          type="radio"
          name="gradient-type"
          title="gradient-3-point"
          class="hidden"
          bind:group={$customPanelState.selectedGradient}
          value="three-point"
        />
        <span
          class={`h-8 w-[95px] rounded-md border-2 ${
            $customPanelState.selectedGradient === 'three-point'
              ? 'border-blue-700'
              : 'border-white hover:border-gray-300'
          } ${
            $selectedPalette === 'spectral'
              ? 'bg-[linear-gradient(90deg,#00b026_0%,#f9ff00_25%,#ff0000_50%,#ffff00_75%,#00b026_100%)]'
              : $selectedPalette === 'viridis'
              ? 'bg-[linear-gradient(90deg,#470052_0%,#008a8c_25%,#ffe849_50%,#008a8c_75%,#470052_100%)]'
              : ''
          }`}
        ></span>
      </label>
    </div>
  </fieldset>
</div>
