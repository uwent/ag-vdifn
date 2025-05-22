<script lang="ts">
  import { format } from 'date-fns';
  import type { Snippet } from 'svelte';

  let expanded = $state(true);
  let { children } = $props<{ children: Snippet }>();
</script>

<div
  id="sidebar"
  aria-expanded={expanded}
  class={`fixed md:static z-50 flex flex-col bg-white/95 transition-all duration-300 ${
    expanded ? 'top-0' : 'top-full md:top-0'
  } w-full md:w-[350px] h-[calc(100%-50px)] md:h-full overflow-y-auto`}
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

  <!-- CONTENT -->
  <div class="flex-1">
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

  <!-- TOGGLE BUTTON -->
  <button
    onclick={() => (expanded = !expanded)}
    title={expanded ? 'Hide controls' : 'Show controls'}
    aria-label={expanded ? 'Hide controls' : 'Show controls'}
    class="md:hidden bottom-0 fixed bg-white bg-no-repeat bg-center border-gray-300 border-t w-full h-[50px]"
    style={`background-image: url('/images/${expanded ? 'close' : 'open'}.svg')`}
  ></button>
</div>
