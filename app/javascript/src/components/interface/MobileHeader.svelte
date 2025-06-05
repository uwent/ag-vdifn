<script lang="ts">
  import { sidebarOpen } from '@store';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="flex justify-left items-center gap-2 bg-green-700 px-4 w-full h-full text-white">
  <button onclick={() => ($sidebarOpen = !$sidebarOpen)} aria-label="Toggle menu">
    {#if $sidebarOpen}
      <FontAwesomeIcon icon={faArrowLeft} class="w-6 h-6" />
    {:else}
      <FontAwesomeIcon icon={faBars} class="w-6 h-6" />
    {/if}
  </button>
  <div class="font-bold text-lg">VDIFN</div>
</div>
