<style>
  :global(.lds-ring) {
    display: flex;
    height: 80px;
    justify-content: center;
    margin: 10px;
  }
  :global(.lds-ring div) {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: rgb(16, 165, 96) transparent transparent transparent;
  }
  :global(.lds-ring div:nth-child(1)) {
    animation-delay: -0.45s;
  }
  :global(.lds-ring div:nth-child(2)) {
    animation-delay: -0.3s;
  }
  :global(.lds-ring div:nth-child(3)) {
    animation-delay: -0.15s;
  }
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
