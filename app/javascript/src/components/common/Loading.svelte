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

<div class="mt-2 text-sm text-center italic">
  Fetching data: {time.toFixed(1)} seconds
</div>
