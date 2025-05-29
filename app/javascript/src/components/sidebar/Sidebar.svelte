<script lang="ts">
  import { sidebarOpen } from '@store';
  import { format } from 'date-fns';
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
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
  class="top-[50px] sm:top-0 left-0 z-50 sm:static fixed bg-white w-4/5 sm:w-[350px] max-w-[350px] h-[calc(100vh-50px)] sm:h-full overflow-y-auto sm:transform-none"
>
  <!-- HEADER -->

  {#snippet logo(title: string, imgUrl: string, href: string)}
    <a
      class="inline-block bg-contain bg-no-repeat bg-center mx-1 border border-white hover:border-gray-400 rounded w-11 h-11 logo"
      style="background-image: url('{imgUrl}')"
      {title}
      aria-label={title}
      {href}
      target="_blank"
    ></a>
  {/snippet}

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
