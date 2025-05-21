<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';
  import Button from './Button.svelte';

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
  class="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ease-in-out"
  role="none"
  onclick={close}
  onkeydown={() => close()}
></div>

<!-- Modal box -->
<div
  class="fixed left-[60%] top-1/2 transform -translate-x-[60%] -translate-y-1/2 w-[calc(100vw-4em)] max-w-[32em] max-h-[80%] overflow-auto bg-white rounded p-4 z-50 shadow-xl"
  role="dialog"
  aria-modal="true"
  bind:this={modal}
  aria-labelledby="pest-modal"
  style={`max-width: ${maxWidth}`}
>
  <h2 id="pest-modal" class="text-lg font-semibold mb-4">{name}</h2>
  {@render children?.()}
  <div class="mt-4 text-right">
    <Button click={close} text="Close" />
  </div>
</div>
