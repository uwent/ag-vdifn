<script lang="ts">
  import { sidebarOpen } from '@store';
  import {
    IconLayoutSidebarLeftExpand,
    IconLayoutSidebarLeftCollapseFilled,
  } from '@tabler/icons-svelte';
</script>

<div class="flex justify-left items-center gap-2 bg-green-700 px-2 w-full h-full text-white">
  <button onclick={() => ($sidebarOpen = !$sidebarOpen)} aria-label="Toggle menu" class="w-6 h-6">
    {#if $sidebarOpen}
      <IconLayoutSidebarLeftCollapseFilled />
    {:else}
      <IconLayoutSidebarLeftExpand />
    {/if}
  </button>
  <div class="w-full font-bold text-lg">VDIFN</div>
</div>
