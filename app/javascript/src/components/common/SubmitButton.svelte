<script lang="ts">
  import { IconLoader2 } from '@tabler/icons-svelte';

  const {
    click,
    text = 'Submit',
    title = text,
    ariaLabel = title,
    disabled = false,
  } = $props<{
    click: () => void;
    text?: string;
    title?: string;
    ariaLabel?: string;
    disabled?: boolean;
  }>();
</script>

<button
  class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 px-6 py-2 border border-gray-300 rounded-md w-full font-semibold text-white text-center cursor-pointer disabled:cursor-not-allowed"
  {title}
  aria-label={ariaLabel}
  onclick={click}
  {disabled}
>
  {#if disabled}
    <span class="mr-2">
      <IconLoader2 class="inline-block animate-spin" />
    </span>
  {/if}
  {text}
</button>
