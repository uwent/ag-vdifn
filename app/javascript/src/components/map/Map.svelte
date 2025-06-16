<script lang="ts">
  import { Loader } from '@googlemaps/js-api-loader';
  import { onMount, setContext, type Snippet } from 'svelte';
  import Loading from '../common/Loading.svelte';
  import GoogleWrapper from '@ts/googleWrapper';
  import MapButtons from './MapButtons.svelte';
  import { mapKey, mapsApiKey } from '@store';

  let container = $state<HTMLElement>();
  let promise = $state<Promise<void>>();
  let map = $state<google.maps.Map>();
  let googleInstance = $state<GoogleWrapper>();
  let error = $state<Error>();

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
    cameraControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: 7,
    },
    zoom: 7,
    gestureHandling: 'greedy',
    mapId: 'cb1bee6358753186',
  };

  const { children } = $props<{ children: Snippet }>();

  setContext(mapKey, {
    getMap: () => map,
    getGoogle: () => googleInstance,
  });

  async function initMap() {
    try {
      await loader.importLibrary('maps');
      googleInstance = new GoogleWrapper(google);
      if (container) map = googleInstance.createMap(container, mapOptions);
    } catch (e) {
      error = e instanceof Error ? e : new Error(String(e));
    }
  }

  onMount(() => {
    if (container) promise = initMap();
  });
</script>

{#if !map && !error}
  <Loading />
{:else if error}
  <p>{error.message}</p>
  <h1>An error occurred loading Google Maps, please try refreshing the page</h1>
{/if}

<div bind:this={container} id="google-map"></div>
{#if map}
  <MapButtons />
  {@render children()}
{/if}

