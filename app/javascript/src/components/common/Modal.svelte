<style lang="scss">
  @use '../../scss/variables.scss' as vars;

  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  .modal {
    position: absolute;
    left: 60%;
    top: 50%;
    width: calc(100vw - 4em);
    max-width: 32em;
    max-height: 80%;
    overflow: auto;
    transform: translate(-60%, -50%);
    padding: 1em;
    border-radius: 0.2em;
    background: white;
    z-index: 1;

    @media #{vars.$medium-up} {
      position: fixed;
      left: 62%;
    }
  }

  h2 {
    margin: 0px;
  }
</style>

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

<div class="modal-background" role="none" onclick={close} onkeydown={() => close()}></div>

<div
  class="modal"
  role="dialog"
  aria-modal="true"
  bind:this={modal}
  aria-labelledby="affliction-modal"
  style={`max-width: ${maxWidth}`}
>
  <h2 id="affliction-modal">{name}</h2>
  {@render children?.()}
  <Button click={close} text="Close" />
</div>
