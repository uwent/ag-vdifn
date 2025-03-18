<style lang="scss">
  @use './scss/variables.scss' as vars;

  .main {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .sidebar {
    z-index: 999;
    @media #{vars.$medium-up} {
      width: 350px;
      box-shadow: 0 0 10px;
    }
  }

  .map {
    width: 100%;
    @media #{vars.$medium-up} {
      width: calc(100% - 350px);
    }
  }
</style>

<script lang="ts">
  import Map from '~/src/components/map/Map.svelte';
  import SeverityOverlay from '~/src/components/map/SeverityOverlay.svelte';
  import Sidebar from '@components/sidebar/Sidebar.svelte';
  import Interface from '@components/sidebar/Interface.svelte';
  import RightSidebar from '@components/legend/Legend.svelte';
  import SeverityLegend from '@components/legend/SeverityLegend.svelte';
  import Status from '~/src/components/map/Status.svelte';
</script>

<main class="main">
  <div class="sidebar">
    <Sidebar>
      <Interface />
    </Sidebar>
  </div>
  <div class="map">
    <Map>
      <Status />
      <SeverityOverlay />
    </Map>
    <RightSidebar>
      <SeverityLegend />
    </RightSidebar>
  </div>
</main>
