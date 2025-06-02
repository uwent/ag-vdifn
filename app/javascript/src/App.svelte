<style lang="scss">
  @use './scss/variables.scss' as vars;

  .main {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .map {
    position: relative;
    width: 100%;
    @media #{vars.$medium-up} {
      width: calc(100% - 350px);
    }
    @media #{vars.$small-only} {
      width: 100%;
      height: calc(100vh - 50px);
    }
  }
</style>

<script lang="ts">
  import Map from '~/src/components/map/Map.svelte';
  import SeverityOverlay from '~/src/components/map/SeverityOverlay.svelte';
  import Sidebar from '@components/sidebar/Sidebar.svelte';
  import Interface from '@components/sidebar/Interface.svelte';
  import Legend from '@components/map/Legend.svelte';
  import Status from '~/src/components/map/Status.svelte';
  import Modal from '@components/common/Modal.svelte';
  import ColorSelector from '@components/map/ColorSelector.svelte';
  import { sidebarOpen, modal } from '@store';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
  // import { Drawer, CloseButton } from 'flowbite-svelte';
</script>

<header
  class="sm:hidden top-0 left-0 z-[60] fixed flex justify-left items-center gap-2 bg-green-700 shadow px-4 w-full h-12 text-white"
>
  <button onclick={() => ($sidebarOpen = !$sidebarOpen)} aria-label="Toggle menu">
    {#if $sidebarOpen}
      <FontAwesomeIcon icon={faArrowLeft} class="w-6 h-6" />
    {:else}
      <FontAwesomeIcon icon={faBars} class="w-6 h-6" />
    {/if}
  </button>
  <div class="font-bold text-lg">VDIFN</div>
</header>

<main class="main">
  <Sidebar>
    <Interface />
  </Sidebar>

  <div class="relative pt-12 sm:pt-0 map">
    <Map>
      <SeverityOverlay />
      <Status />
      <ColorSelector />
      <Legend />
    </Map>
  </div>
</main>

{#if $modal}
  <Modal name={$modal.name} maxWidth={$modal?.maxWidth}>
    {@render $modal.content()}
  </Modal>
{/if}
