<script lang="ts">
  import type { Snippet } from 'svelte';
  const { title, titleContent, css, children } = $props<{
    title: string;
    titleContent?: Snippet;
    css?: string;
    children: Snippet;
  }>();
</script>

<div class="w-full {css}">
  <fieldset class="bg-black/3 m-auto px-2 pb-2 border border-gray-400 rounded w-full">
    <legend class="flex justify-between items-center gap-2 mb-0 font-semibold text-gray-500">
      {title}
      {@render titleContent?.()}
    </legend>
    {@render children()}
  </fieldset>
</div>
