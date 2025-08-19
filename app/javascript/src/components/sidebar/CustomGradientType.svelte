<style>
  .spectral-2 {
    background: linear-gradient(
      90deg,
      rgb(0, 176, 38) 0%,
      rgb(245, 255, 0) 50%,
      rgb(255, 0, 0) 100%
    );
  }

  .spectral-3 {
    background: linear-gradient(
      90deg,
      rgb(0, 176, 38) 0%,
      rgb(249, 255, 0) 25%,
      rgb(255, 0, 0) 50%,
      rgb(255, 255, 0) 75%,
      rgb(0, 176, 38) 100%
    );
  }

  .viridis-2 {
    background: linear-gradient(
      90deg,
      rgb(71, 0, 82) 0%,
      rgb(0, 138, 140) 50%,
      rgb(255, 232, 73) 100%
    );
  }

  .viridis-3 {
    background: linear-gradient(
      90deg,
      rgb(71, 0, 82) 0%,
      rgb(0, 138, 140) 25%,
      rgb(255, 232, 73) 50%,
      rgb(0, 138, 140) 75%,
      rgb(71, 0, 82) 100%
    );
  }
</style>

<script lang="ts">
  import Frame from '../common/Frame.svelte';
  import { customPanelState, selectedPalette } from '@store';
</script>

<Frame title="Gradient Type">
  <div class="gap-2 grid grid-cols-2">
    <label for="gradient-2-point" class="flex cursor-pointer select-none">
      <input
        id="gradient-2-point"
        type="radio"
        name="gradient-type"
        title="gradient-2-point"
        bind:group={$customPanelState.selectedGradient}
        value="two-point"
        class="hidden"
      />
      <span
        class={`h-9 w-full rounded-md border-2 ${
          $customPanelState.selectedGradient === 'two-point'
            ? 'border-blue-700'
            : 'border-white hover:border-gray-300'
        } ${$selectedPalette}-2`}
      ></span>
    </label>

    <label for="gradient-3-point" class="flex p-0 cursor-pointer select-none">
      <input
        id="gradient-3-point"
        type="radio"
        name="gradient-type"
        title="gradient-3-point"
        bind:group={$customPanelState.selectedGradient}
        value="three-point"
        class="hidden"
      />
      <span
        class={`h-9 w-full rounded-md border-2 ${
          $customPanelState.selectedGradient === 'three-point'
            ? 'border-blue-700'
            : 'border-white hover:border-gray-300'
        } ${$selectedPalette}-3`}
      ></span>
    </label>
  </div>
</Frame>
