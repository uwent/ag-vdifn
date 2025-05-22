<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';
  import Button from './SubmitButton.svelte';

  let {
    close = () => {},
    name = 'Information',
    maxWidth = '32em',
    children,
  } = $props<{
    close: () => void;
    name?: string;
    maxWidth?: string;
    children?: Snippet;
  }>();

  let modal = $state<HTMLElement | null>(null);

  const handle_keydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      return;
    }

    if (e.key === 'Tab') {
      // trap focus
      const nodes = modal?.querySelectorAll('*');
      if (!nodes) return;

      const tabbable = Array.from(nodes).filter(
        (n: Element) => (n as HTMLElement).tabIndex >= 0,
      ) as HTMLElement[];

      let index = tabbable.indexOf(document.activeElement as HTMLElement);
      if (index === -1 && e.shiftKey) index = 0;

      index += tabbable.length + (e.shiftKey ? -1 : 1);
      index %= tabbable.length;

      tabbable[index].focus();
      e.preventDefault();
    }
  };

  const previously_focused = typeof document !== 'undefined' && document.activeElement;

  if (previously_focused) {
    onDestroy(() => {
      (previously_focused as HTMLElement)?.focus();
    });
  }
</script>

<svelte:window on:keydown={handle_keydown} />

<!-- Modal backdrop -->
<div
  class="z-40 fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out"
  role="none"
  onclick={close}
  onkeydown={() => close()}
></div>

<!-- Modal box -->
<div
  class="top-1/2 left-[60%] z-50 fixed bg-white shadow-xl p-4 rounded w-[calc(100vw-4em)] max-w-[32em] max-h-[80%] overflow-auto -translate-x-[60%] -translate-y-1/2 transform"
  role="dialog"
  aria-modal="true"
  bind:this={modal}
  aria-labelledby="pest-modal"
  style={`max-width: ${maxWidth}`}
>
  <h2 id="pest-modal" class="mb-4 font-semibold text-lg">{name}</h2>
  {@render children?.()}
  <div class="mt-4 text-right">
    <Button click={close} text="Close" />
  </div>
</div>
