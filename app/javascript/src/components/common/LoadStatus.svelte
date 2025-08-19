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
  <div class="text-gray-600 text-sm text-center italic">
    {message}
  </div>
{/if}
