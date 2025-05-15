<script lang="ts">
  import { format } from 'date-fns';
  let expanded = true;
</script>

<!-- Sidebar Container -->
<div
  id="sidebar"
  aria-expanded={expanded}
  class="fixed md:relative z-50 flex flex-col w-full h-[calc(100%-50px)] md:w-[350px] md:h-full overflow-y-auto bg-white transition-all duration-300 ease-in-out"
  class:top-0={expanded}
  class:top-full={!expanded && !window.matchMedia('(min-width: 768px)').matches}
>
  <!-- Header Section -->
  <header class="flex flex-col w-full px-4 pb-2 text-center">
    <!-- Logos -->
    <div class="flex justify-center gap-2 mt-4">
      <a
        class="w-11 h-11 bg-center bg-contain bg-no-repeat rounded border border-white hover:border-gray-400"
        href="https://agweather.cals.wisc.edu"
        style="background-image: url('/images/uw-madison.png');"
        title="AgWeather Home"
        aria-label="AgWeather Home"
        target="_blank"
      ></a>
      <a
        class="w-11 h-11 bg-center bg-contain bg-no-repeat rounded border border-white hover:border-gray-400"
        href="https://vegpath.plantpath.wisc.edu/"
        style="background-image: url('/images/plantpath-logo.png');"
        title="UW-Madison Plant Pathology"
        aria-label="UW-Madison Plant Pathology"
        target="_blank"
      ></a>
      <a
        class="w-11 h-11 bg-center bg-contain bg-no-repeat rounded border border-white hover:border-gray-400"
        href="https://vegento.russell.wisc.edu/"
        style="background-image: url('/images/vegento-logo.png');"
        title="UW-Madison Vegetable Entomology"
        aria-label="UW-Madison Vegetable Entomology"
        target="_blank"
      ></a>
    </div>

    <!-- Title -->
    <h1 class="mt-2">
      <a
        id="home"
        href={window.location.pathname}
        title="VDIFN Home"
        class="text-gray-800"
      >
        <span class="block whitespace-nowrap">Vegetable Disease &amp;</span>
        <span class="block whitespace-nowrap -mt-2 text-sm">Insect Forecasting Network</span>
      </a>
    </h1>
  </header>

  <!-- Main Content -->
  <div class="flex-1 px-4">
    <slot />
  </div>

  <!-- Footer -->
  <footer class="mt-6 mb-2 text-center text-sm text-gray-500">
    <div>
      <a
        href="mailto:agweather@cals.wisc.edu"
        class="text-blue-600 hover:underline"
      >
        Contact Us
      </a><br />
      Copyright &copy;{format(new Date(), 'yyyy')} University of Wisconsin-Madison
    </div>
  </footer>

  <!-- Collapse Button (Mobile) -->
  <button
    class="fixed bottom-0 w-full h-[50px] md:hidden bg-white border-t border-gray-300 bg-center bg-no-repeat z-[100]"
    style="background-image: url({expanded ? '/images/close.svg' : '/images/open.svg'});"
    title={expanded ? 'Hide controls' : 'Show controls'}
    aria-label={expanded ? 'Hide controls' : 'Show controls'}
    on:click={() => (expanded = !expanded)}
  ></button>
</div>
