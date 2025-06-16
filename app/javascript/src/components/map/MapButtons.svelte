<style lang="scss">
  .map-btn {
    margin-top: 8px;
    margin-right: 10px;
    cursor: pointer;
  }
</style>

<script lang="ts">
  import { mapKey } from '@store';
  import { getContext, onMount } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faLocationCrosshairs, faLocationDot, faExpand } from '@fortawesome/free-solid-svg-icons';
  import { bounds, mapExtent, userLocation } from '@store';
  import type { LatLng } from '@types';

  const { getMap } = getContext<any>(mapKey);
  const map = getMap();
  const btnBaseClass =
  'bg-white shadow-md border-2 border-white w-10 h-10 text-gray-500 hover:text-gray-700';
  let zoomBtn: HTMLDivElement;
  let locationBtn: HTMLDivElement;
  let marker: google.maps.marker.AdvancedMarkerElement;

  function zoomExtents() {
    map.fitBounds(bounds[$mapExtent]);
  }

  function handleLocation() {
    if ($userLocation) {
      $userLocation = null;
    } else {
      navigator.geolocation.getCurrentPosition(handlePosition);
    }
  }

  function handlePosition(position: GeolocationPosition) {
    $userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  }

  async function setMarker(position: LatLng | null) {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker',
    )) as google.maps.MarkerLibrary;
    if (position) {
      marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: 'Your location',
      });
      marker.addListener('gmp-click', () => {
        map.setZoom(12);
        map.panTo(position);
      });
    } else if (marker) {
      marker.map = null;
    }
  }

  onMount(() => {
    const controlPosition = google.maps.ControlPosition.RIGHT_TOP;
    map.controls[controlPosition].push(zoomBtn);
    map.controls[controlPosition].push(locationBtn);
  });

  $effect(() => {
    const loc = $userLocation;
    setMarker(loc);
  });
</script>

<div bind:this={zoomBtn} class="map-btn">
  <button
    class="btnBaseClass"
    title="Zoom extents"
    onclick={zoomExtents}
  >
    <FontAwesomeIcon icon={faExpand as any} size="2x" />
  </button>
</div>

<div bind:this={locationBtn} class="map-btn">
  <button
    class="btnBaseClass"
    title={$userLocation ? 'Hide location' : 'Show my location'}
    onclick={handleLocation}
  >
    {#if $userLocation}
      <FontAwesomeIcon icon={faLocationDot as any} size="2x" />
    {:else}
      <FontAwesomeIcon icon={faLocationCrosshairs as any} size="2x" />
    {/if}
  </button>
</div>

