<script lang="ts">
  import { sidebarOpen } from '@store';
  import { format } from 'date-fns';
  import type { Snippet} from 'svelte';
  import {onMount } from 'svelte';
  let { children } = $props<{ children: Snippet }>();
  let isMobile = $state(window.innerWidth < 640);
  onMount(() => {
  const handler = () => {
    isMobile = window.innerWidth < 640;
  };
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
});

</script>



<div
  id="sidebar"
  aria-expanded={$sidebarOpen}
  style={isMobile
    ? `transform: ${$sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'}; transition: transform 0.3s ease;`
    : ''}
  class="fixed top-[50px] sm:top-0 left-0 z-50 bg-white w-4/5 max-w-[350px] h-[calc(100vh-50px)] sm:h-full overflow-y-auto sm:static sm:w-[350px] sm:transform-none"
>

  <!-- HEADER -->
  <header class="flex flex-col items-center px-0 pb-2 w-full text-center">
    <div class="flex justify-center items-center mt-2 mb-1">
      <a
        id="uw-madison"
        title="AgWeather Home"
        aria-label="AgWeather Home"
        class="inline-block bg-contain bg-no-repeat bg-center mx-1 border border-white hover:border-gray-400 rounded w-11 h-11 logo"
        href="https://agweather.cals.wisc.edu"
        target="_blank"
        style="background-image: url('/images/uw-madison.png')"
      ></a>
      <a
        id="plantpath-logo"
        title="UW-Madison Plant Pathology"
        aria-label="UW-Madison Plant Pathology"
        class="inline-block bg-contain bg-no-repeat bg-center mx-1 border border-white hover:border-gray-400 rounded w-11 h-11 logo"
        href="https://vegpath.plantpath.wisc.edu/"
        target="_blank"
        style="background-image: url('/images/plantpath-logo.png')"
      ></a>
      <a
        id="vegento-logo"
        title="UW-Madison Vegetable Entomology"
        aria-label="UW-Madison Vegetable Entomology"
        class="inline-block bg-contain bg-no-repeat bg-center mx-1 border border-white hover:border-gray-400 rounded w-11 h-11 logo"
        href="https://vegento.russell.wisc.edu/"
        target="_blank"
        style="background-image: url('/images/vegento-logo.png')"
      ></a>
    </div>

    <h1>
      <a
        id="home"
        title="VDIFN Home"
        href={window.location.pathname}
        class="text-black no-underline"
      >
        <span class="block whitespace-nowrap">Vegetable Disease &amp;</span>
        <span class="block -mt-2 text-[0.85em] whitespace-nowrap">Insect Forecasting Network</span>
      </a>
    </h1>
  </header>

  <!-- SLOT IN INTERFACE OR OTHER CHILDREN -->
  <div class="flex-1 p-2 overflow-y-auto">
    {@render children()}
  </div>

  <!-- FOOTER -->
  <footer class="mt-6 mb-2 text-gray-500 text-sm text-center">
    <div>
      <a
        href="mailto:agweather@cals.wisc.edu"
        class="text-current hover:text-blue-500 no-underline"
      >
        Contact Us
      </a>
      <br />
      Copyright &copy;{format(new Date(), 'yyyy')} University of Wisconsin-Madison
    </div>
  </footer>
</div>
  <!-- FOR MOBILE, CLICKAWAY OVERLAY -->
  {#if $sidebarOpen}
   <div
    class="sm:hidden fixed inset-0 bg-black/40 z-40"
    on:click={() => sidebarOpen.set(false)}
   />
   {/if}