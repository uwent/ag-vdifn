<script lang="ts">
  import type { Snippet } from 'svelte';
  const {
    title = null,
    titleContent = null,
    children,
  } = $props<{
    title: string;
    titleContent?: Snippet;
    children: Snippet;
  }>();
</script>

<fieldset class="bg-black/5 mx-auto p-2 border border-gray-300 rounded w-full">
  <legend class="flex justify-between items-center gap-2 mb-0 font-semibold">
    {title}
    {@render titleContent?.()}
  </legend>
  {@render children()}
</fieldset>
