<script lang="ts">
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
  class="px-6 py-2.5 text-sm font-semibold text-white rounded-md bg-gradient-to-b from-[#249dde] to-[#1c87c9] shadow-inner shadow-white/40 hover:from-[#1c87c9] hover:to-[#176da8] border border-[#7f7f7f] disabled:bg-gray-400 disabled:cursor-not-allowed"
  {title}
  aria-label={ariaLabel}
  on:click={click}
  {disabled}
>
  {text}
</button>
