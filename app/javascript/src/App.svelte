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
  import '~/src/scss/global.scss';
  import Map from '~/src/components/map/Map.svelte';
  import SeverityOverlay from '~/src/components/map/SeverityOverlay.svelte';
  import Sidebar from '@components/sidebar/Sidebar.svelte';
  import Interface from '@components/sidebar/Interface.svelte';
  import Legend from '@components/map/Legend.svelte';
  import Status from '~/src/components/map/Status.svelte';
  import ColorSelector from '@components/map/ColorSelector.svelte';
</script>

<main class="main">
  <div class="sidebar">
    <Sidebar>
      <Interface />
    </Sidebar>
  </div>
  
  <div class="map">
    <Map>
      <SeverityOverlay />
      <Status />
      <ColorSelector />
      <Legend />
    </Map>
  </div>
</main>
