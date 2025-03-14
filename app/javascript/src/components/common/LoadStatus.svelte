<style lang="scss">
  .status {
    margin: 1em 0;
    text-align: center;
    font-size: smaller;
    font-style: italic;
  }
</style>

<script lang="ts">
  // Displays prompt to submit when no model is submitted
  // Displays status message from Loading component after submit
  // Displays nothing when switching to a tab that already has data

  import { loadStatus } from '@store';
  import { onDestroy, onMount } from 'svelte';

  const { loaded = false } = $props<{ loaded?: boolean }>();
  let message = $state('');

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
