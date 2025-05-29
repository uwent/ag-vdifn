<script lang="ts">
  export let on = false;
  export let toggle = () => {};
  export let labelOn = 'Hide Legend';
  export let labelOff = 'Show Legend';
</script>

<button
  class="sm:hidden right-4 bottom-4 z-[60] fixed bg-white hover:bg-gray-100 shadow px-3 py-2 border border-gray-300 rounded-md text-sm transition"
  onclick={toggle}
  aria-pressed={on}
>
  {on ? labelOn : labelOff}
</button>
