<style type="scss">
  .status {
    margin: 1em 0;
    text-align: center;
    font-size: smaller;
    font-style: italic;
  }
</style>

<script type="ts">
  // Displays prompt to submit when no model is submitted
  // Displays status message from Loading component after submit
  // Displays nothing when switching to a tab that already has data

  import { loadStatus } from '@store';
  import { onDestroy, onMount } from 'svelte';

  export let loaded = false;
  let message = '';

  onMount(() => {
    message = loaded ? $loadStatus : 'Please submit a model.';
  });

  onDestroy(() => {
    $loadStatus = '';
  });
</script>

{#if message}
  <div class="status">
    {message}
  </div>
{/if}
