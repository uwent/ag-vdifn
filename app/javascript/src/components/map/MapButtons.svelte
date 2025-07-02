<style lang="postcss">
  @reference "tailwindcss";

  button {
    @apply text-gray-500 hover:text-gray-700 text-center cursor-pointer;
  }
</style>

<script lang="ts">
  import { mapKey } from '@store';
  import { getContext, onMount } from 'svelte';
  import { IconArrowsMaximize, IconMapPin, IconMapPinX } from '@tabler/icons-svelte';
  import { bounds, mapExtent, userLocation } from '@store';
  import type { LatLng } from '@types';

  const { getMap } = getContext<any>(mapKey);
  const map = getMap();
  let buttons: HTMLDivElement;
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
    map.controls[controlPosition].push(buttons);
  });

  $effect(() => {
    const loc = $userLocation;
    setMarker(loc);
  });
</script>

<div bind:this={buttons} class="flex flex-col gap-4 bg-white shadow-md m-[10px] p-[8px]">
  <button title="Zoom extents" onclick={zoomExtents}>
    <IconArrowsMaximize />
  </button>

  <button title={$userLocation ? 'Hide location pin' : 'Show my location'} onclick={handleLocation}>
    {#if $userLocation}
      <IconMapPinX class="text-black" />
    {:else}
      <IconMapPin />
    {/if}
  </button>
</div>
