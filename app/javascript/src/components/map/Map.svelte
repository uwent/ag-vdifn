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
    mapTypeId: 'roadmap',
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
