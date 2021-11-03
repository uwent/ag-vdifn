<script lang="ts">
  import { Loader } from '@googlemaps/js-api-loader'
  import { onMount, setContext } from 'svelte'
  import mapOptions from './ts/mapOptions'
  import Loading from '../common/Loading.svelte'
  import { mapKey, mapsAPIKey } from '../../store/store'
  import GoogleWrapper from './ts/googleWrapper'
  let container: any
  let promise: any
  let map: any
  let googleInstance: GoogleWrapper

  const loader = new Loader({
    apiKey: process.env.GOOGLE_MAPS_KEY
  })

  setContext(mapKey, {
    getMap: () => map,
    getGoogle: () => googleInstance,
  })

  async function loadMap() {
    await loader.load().then(() => {
      googleInstance = new GoogleWrapper(google)
      map = googleInstance.createMap(container, mapOptions)
    })
  }

  onMount(() => {
    promise = loadMap()
  })
</script>

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

  :global(.weather-details-dsv) {
    margin-left: 8px;
    margin-right: 8px;
  }

  :global(.info-icon) {
    width: 10px;
    height: 10px;
    border: 1px solid black;
    text-align: center;
    border-radius: 50%;
    font-size: 9px;
  }
</style>

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
