<script lang="ts">
  import '~/src/scss/global.scss'; // keep global styles if needed
  import Map from '~/src/components/map/Map.svelte';
  import SeverityOverlay from '~/src/components/map/SeverityOverlay.svelte';
  import Sidebar from '@components/sidebar/Sidebar.svelte';
  import Interface from '@components/sidebar/Interface.svelte';
  import Legend from '@components/map/Legend.svelte';
  import Status from '~/src/components/map/Status.svelte';
  import ColorSelector from '@components/map/ColorSelector.svelte';
</script>

<!-- Layout Container -->
<main class="flex w-full h-full">
  <!-- Sidebar: fixed width on medium+ screens -->
  <div class="z-[999] w-full md:w-[350px] shadow-md md:shadow-lg">
    <Sidebar>
      <Interface />
    </Sidebar>
  </div>

  <!-- Map: fills remaining space -->
  <div class="relative w-full md:w-[calc(100%-350px)] h-[calc(100vh-50px)] md:h-full">
    <Map>
      <SeverityOverlay />
      <Status />
      <ColorSelector />
      <Legend />
    </Map>
  </div>
</main>
