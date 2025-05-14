<script lang="ts">
  import { loadStatus } from '@store';
  import { onDestroy, onMount } from 'svelte';

  let time = $state(0);
  let interval: ReturnType<typeof setTimeout>;

  onMount(() => {
    interval = setInterval(() => {
      time += 0.1;
    }, 100);
  });

  onDestroy(() => {
    clearInterval(interval);
    $loadStatus = `Data load completed in ${time.toFixed(1)} seconds.`;
  });
</script>

<div class="flex flex-col items-center justify-center space-y-2 mt-4">
  <div
    class="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"
    title="Loading"
    data-testid="loading"
  />
  
  <div class="text-center italic text-xs text-gray-600">
    Fetching data: {time.toFixed(1)} seconds
  </div>
</div>
