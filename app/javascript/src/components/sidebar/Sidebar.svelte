<script lang="ts">
  import { format } from 'date-fns';
  let expanded = true;
</script>

<div
  id="sidebar"
  aria-expanded={expanded}
  class={`fixed md:static z-50 flex flex-col bg-white/95 transition-all duration-300 ${
    expanded ? 'top-0' : 'top-full md:top-0'
  } w-full md:w-[350px] h-[calc(100%-50px)] md:h-full overflow-y-auto`}
>
  <!-- HEADER -->
  <header class="flex flex-col items-center w-full px-0 pb-2 text-center">
    <div class="flex justify-center items-center mt-2 mb-1">
      <a
        id="uw-madison"
        title="AgWeather Home"
        aria-label="AgWeather Home"
        class="logo bg-center bg-contain bg-no-repeat inline-block w-11 h-11 mx-1 rounded border border-white hover:border-gray-400"
        href="https://agweather.cals.wisc.edu"
        target="_blank"
        style="background-image: url('/images/uw-madison.png')"
      ></a>
      <a
        id="plantpath-logo"
        title="UW-Madison Plant Pathology"
        aria-label="UW-Madison Plant Pathology"
        class="logo bg-center bg-contain bg-no-repeat inline-block w-11 h-11 mx-1 rounded border border-white hover:border-gray-400"
        href="https://vegpath.plantpath.wisc.edu/"
        target="_blank"
        style="background-image: url('/images/plantpath-logo.png')"
      ></a>
      <a
        id="vegento-logo"
        title="UW-Madison Vegetable Entomology"
        aria-label="UW-Madison Vegetable Entomology"
        class="logo bg-center bg-contain bg-no-repeat inline-block w-11 h-11 mx-1 rounded border border-white hover:border-gray-400"
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
    <slot />
  </div>

  <!-- FOOTER -->
  <footer class="mt-6 mb-2 text-center text-sm text-gray-500">
    <div>
      <a
        href="mailto:agweather@cals.wisc.edu"
        class="hover:text-blue-500 text-current no-underline"
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
    class="md:hidden fixed bottom-0 w-full h-[50px] bg-white border-t border-gray-300 bg-center bg-no-repeat"
    style={`background-image: url('/images/${expanded ? 'close' : 'open'}.svg')`}
  ></button>
</div>
