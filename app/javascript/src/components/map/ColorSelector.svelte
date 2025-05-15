<script lang="ts">
  import { defaults, selectedPalette } from '@store';
  import type { ColorPaletteName } from '@types';
  let palette = $state<ColorPaletteName>(defaults.palette);

  $effect(() => {
    $selectedPalette = palette;
  });
</script>

<div class="absolute left-2 bottom-2 z-10 flex flex-col gap-1">
  <div class="text-sm text-gray-500">Color Palette:</div>
  <div class="flex overflow-hidden rounded-[15px] border border-gray-300">
    <input
      id="spectral"
      title="Spectral color palette"
      type="radio"
      value="spectral"
      bind:group={palette}
      class="sr-only peer/spectral"
    />
    <label
      for="spectral"
      class="peer-checked/spectral:bg-green-100 peer-checked/spectral:text-green-800 bg-gray-100 text-black/60 text-sm font-medium text-center px-3 py-1 cursor-pointer transition-all hover:bg-gray-200 rounded-l-[20px]"
    >
      Spectral
    </label>

    <input
      id="viridis"
      title="Viridis color palette"
      type="radio"
      value="viridis"
      bind:group={palette}
      class="sr-only peer/viridis"
    />
    <label
      for="viridis"
      class="peer-checked/viridis:bg-purple-100 peer-checked/viridis:text-purple-800 bg-gray-100 text-black/60 text-sm font-medium text-center px-3 py-1 cursor-pointer transition-all hover:bg-gray-200 rounded-r-[20px]"
    >
      Viridis
    </label>
  </div>
</div>
