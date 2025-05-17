<script lang="ts">
  import { mapKey } from '@store';
  import { getContext, onMount } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faLocationCrosshairs, faLocationDot, faExpand } from '@fortawesome/free-solid-svg-icons';
  import { bounds, mapExtent, userLocation } from '@store';
  import type { LatLng } from '@types';

  const { getMap } = getContext<any>(mapKey);
  const map = getMap();
  const position = google.maps.ControlPosition.RIGHT_TOP;

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

  function handlePosition(position) {
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
    map.controls[position].push(zoomBtn);
    map.controls[position].push(locationBtn);
  });

  $: setMarker($userLocation);
</script>
<div bind:this={zoomBtn}>
  <button
    class="h-10 w-10 bg-white border-2 border-white rounded shadow-md text-gray-500 hover:text-gray-700 flex items-center justify-center"
    title="Zoom extents"
    on:click={zoomExtents}
  >
    <FontAwesomeIcon icon={faExpand as any} size="2x" />
  </button>
</div>

<div bind:this={locationBtn}>
  <button
    class="h-10 w-10 bg-white border-2 border-white rounded shadow-md text-gray-500 hover:text-gray-700 flex items-center justify-center"
    title={$userLocation ? 'Hide location' : 'Show my location'}
    on:click={handleLocation}
  >
    {#if $userLocation}
      <FontAwesomeIcon icon={faLocationDot as any} size="2x" />
    {:else}
      <FontAwesomeIcon icon={faLocationCrosshairs as any} size="2x" />
    {/if}
  </button>
</div>
