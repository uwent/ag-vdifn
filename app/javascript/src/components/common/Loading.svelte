<style lang="scss">
  @keyframes -global-lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-timer {
    text-align: center;
    font-style: italic;
    font-size: smaller;
  }
</style>

<script lang="ts">
  import { loadStatus } from '@store';
  import { onDestroy, onMount } from 'svelte';

  let time = 0;

  onMount(() => {
    setInterval(() => {
      time += 0.1;
    }, 100);
  });

  onDestroy(() => {
    $loadStatus = `Data load completed in ${time.toFixed(1)} seconds.`;
  });
</script>

<div class="lds-ring" title="Loading" data-testid="loading">
  <div />
  <div />
  <div />
  <div />
</div>

<div class="loading-timer">Fetching data: {time.toFixed(1)} seconds</div>
