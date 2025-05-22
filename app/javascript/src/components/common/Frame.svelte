<script lang="ts">
  export let legend: string;
</script>

<fieldset class="mx-auto mb-6 p-4 border border-gray-300 rounded-lg w-full max-w-2xl">
  <legend class="flex justify-between items-center gap-2 mb-2 font-semibold text-lg">
    <span>{legend}</span>
    <slot name="legend-end" />
  </legend>
  <slot />
</fieldset>
