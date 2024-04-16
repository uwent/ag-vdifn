<style>
  #google-map {
    height: 100%;
    width: 100%;
    position: absolute;
  }

  :global(#map-pan-zoom-controls #map-google-logo) {
    left: 335px;
  }

  :global(#map-google-logo) {
    bottom: 0;
  }

  :global(.gm-style .gm-style-iw-c) {
    overflow: visible;
  }
</style>

<script lang="ts">
  import { Loader } from '@googlemaps/js-api-loader';
  import { onMount, setContext } from 'svelte';

  import Loading from '../common/Loading.svelte';
  import mapOptions from '@ts/map/mapOptions';
  import GoogleWrapper from '@ts/map/googleWrapper';
  import { mapKey, mapsApiKey } from '@store';

  let container;
  let promise;
  let map;
  let googleInstance: GoogleWrapper;

  const loader = new Loader({
    apiKey: mapsApiKey || '',
  });

  setContext(mapKey, {
    getMap: () => map,
    getGoogle: () => googleInstance,
  });

  async function loadMap() {
    await loader.load().then(() => {
      googleInstance = new GoogleWrapper(google);
      map = googleInstance.createMap(container, mapOptions);
    });
  }

  onMount(() => {
    promise = loadMap();
  });
</script>

{#await promise}
  <Loading />
{:catch error}
  <p>{error}</p>
  <h1>An error occurred loading Google Maps, please try refreshing the page</h1>
{/await}

<div bind:this={container} id="google-map">
  {#if map}
    <slot />
  {/if}
</div>
