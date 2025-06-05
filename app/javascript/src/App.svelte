<script lang="ts">
  import Modal from '@components/common/Modal.svelte';
  import Interface from '@components/interface/Interface.svelte';
  import MobileHeader from '@components/interface/MobileHeader.svelte';
  import Sidebar from '@components/interface/Sidebar.svelte';
  import ColorSelector from '@components/map/ColorSelector.svelte';
  import Legend from '@components/map/Legend.svelte';
  import Map from '@components/map/Map.svelte';
  import SeverityOverlay from '@components/map/SeverityOverlay.svelte';
  import Status from '@components/map/Status.svelte';

  import { modal } from '@store';
</script>

<header class="sm:hidden top-0 right-0 left-0 z-50 fixed h-12">
  <MobileHeader />
</header>

<main class="flex mt-12 sm:mt-0 w-full h-screen">
  <Sidebar>
    <Interface />
  </Sidebar>

  <div class="relative w-full h-full">
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
