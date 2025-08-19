<script lang="ts">
  import { format } from 'date-fns';
  import type { Snippet } from 'svelte';
  import { baseURL, sidebarOpen } from '@store';

  let { children } = $props<{ children: Snippet }>();
</script>

{#snippet logo(title: string, imgUrl: string, href: string)}
  <a
    class="inline-block bg-contain bg-no-repeat bg-center mx-1 border border-white hover:border-gray-400 rounded w-11 h-11 logo"
    style={`background-image: url('${baseURL}${imgUrl}')`}
    title={title}
    aria-label={title}
    href={href}
    target="_blank"
  ></a>
{/snippet}

<div
  id="sidebar"
  aria-expanded={$sidebarOpen}
  class={'top-12 sm:top-0 left-0 z-50 sm:static fixed bg-white sm:w-4/5 w-[350px] max-w-[350px] h-full overflow-y-auto sm:transform-none transition-transform sm:transition-none duration-300 ease-in-out transform sm:translate-x-0 ' +
    ($sidebarOpen ? 'translate-x-0' : '-translate-x-full')}
>
  <!-- HEADER -->
  <header class="flex flex-col items-center px-0 pb-2 w-full text-center">
    <div class="flex justify-center items-center mt-2 mb-1">
      {@render logo('AgWeather Home', '/images/uw-madison.png', 'https://agweather.cals.wisc.edu')}
      {@render logo(
        'UW-Madison Plant Pathology',
        '/images/plantpath-logo.png',
        'https://vegpath.plantpath.wisc.edu/',
      )}
      {@render logo(
        'UW-Madison Vegetable Entomology',
        '/images/vegento-logo.png',
        'https://vegento.russell.wisc.edu/',
      )}
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
    class="sm:hidden z-40 fixed inset-0 bg-black/40"
    role="button"
    tabindex="0"
    aria-label="Close sidebar"
    onclick={() => sidebarOpen.set(false)}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sidebarOpen.set(false);
      }
    }}
  ></div>
{/if}
