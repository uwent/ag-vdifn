<script lang="ts">
    export let on = false;
    export let toggle = () => {};
    export let labelOn = 'Hide Legend';
    export let labelOff = 'Show Legend';
  </script>
  
  <button
    class="fixed bottom-4 right-4 z-[60] px-3 py-2 bg-white border border-gray-300 rounded-md shadow text-sm hover:bg-gray-100 transition sm:hidden"
    on:click={toggle}
    aria-pressed={on}
  >
    {on ? labelOn : labelOff}
  </button>
  