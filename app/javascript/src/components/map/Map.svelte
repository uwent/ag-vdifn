<style global lang="scss">
  #google-map {
    height: 100%;
    width: 100%;
    /* position: absolute; */
  }

  #map-pan-zoom-controls #map-google-logo {
    left: 335px;
  }

  #map-google-logo {
    bottom: 0;
  }

  .gm-style .gm-style-iw-c {
    overflow: visible;
  }

  .gm-style-iw-chr {
    height: 10px;
  }

  #iw-container {
    width: 275px;
    height: 350px;
  }

  #iw-content {
    margin: 0;
    overflow-y: visible;
    overflow-x: visible;
    height: 303px;
    font-size: 9pt;

    table th,
    table td {
      text-align: center;
    }
  }

  .iw-title {
    font-family: 'Open Sans Condensed', sans-serif;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 4px solid #48b5e9;
    margin: 1px;
  }
</style>

<script lang="ts">
  import { Loader } from '@googlemaps/js-api-loader';
  import { onMount, setContext } from 'svelte';

  import Loading from '../common/Loading.svelte';
  import GoogleWrapper from './ts/googleWrapper';
  import MapButtons from './MapButtons.svelte';
  import { mapKey, mapsApiKey } from '@store';
  // import { mapStyle } from './ts/mapStyle';

  let container;
  let promise;
  let map;
  let googleInstance: GoogleWrapper;

  const loader = new Loader({
    apiKey: mapsApiKey || '',
  });

  const mapOptions: google.maps.MapOptions = {
    center: {
      lat: 44.75,
      lng: -89.9,
    },
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'terrain', 'satellite'],
      position: 3,
    },
    mapTypeId: 'terrain',
    maxZoom: 14,
    minZoom: 5,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: 7,
    },
    zoom: 7,
    // styles: mapStyle,
    gestureHandling: 'greedy',
    mapId: 'cb1bee6358753186',
  };

  setContext(mapKey, {
    getMap: () => map,
    getGoogle: () => googleInstance,
  });

  async function initMap() {
    await loader.importLibrary('maps').then(() => {
      googleInstance = new GoogleWrapper(google);
      map = googleInstance.createMap(container, mapOptions);
    });
  }

  onMount(() => {
    promise = initMap();
  });
</script>

{#await promise}
  <Loading />
{:catch error}
  <p>{error}</p>
  <h1>An error occurred loading Google Maps, please try refreshing the page</h1>
{/await}

<div bind:this={container} id="google-map"></div>
{#if map}
  <MapButtons />
  <slot />
{/if}
