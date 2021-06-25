<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte'
  import Button from './Button.svelte'
  export let name: string

  const dispatch = createEventDispatcher()
  const close = () => dispatch('close')

  let modal: any

  const handle_keydown = (e) => {
    if (e.key === 'Escape') {
      close()
      return
    }

    if (e.key === 'Tab') {
      // trap focus
      const nodes = modal.querySelectorAll('*')
      const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0)

      let index = tabbable.indexOf(document.activeElement)
      if (index === -1 && e.shiftKey) index = 0

      index += tabbable.length + (e.shiftKey ? -1 : 1)
      index %= tabbable.length

      tabbable[index].focus()
      e.preventDefault()
    }
  }

  const previously_focused =
    typeof document !== 'undefined' && document.activeElement

  if (previously_focused) {
    onDestroy(() => {
      previously_focused.focus()
    })
  }
</script>

<style type="scss">
  @import '../../scss/settings.scss';

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

    @media #{$medium-up} {
      position: fixed;
      left: 62%;
    }
  }

  h2 {
    margin: 0px;
  }
</style>

<svelte:window on:keydown={handle_keydown} />

<div class="modal-background" on:click={close} />

<div
  class="modal"
  role="dialog"
  aria-modal="true"
  bind:this={modal}
  aria-labelledby="affliction-modal">
  <h2 id="affliction-modal">{name}</h2>
  <slot name="header" />
  <slot />

  <!-- svelte-ignore a11y-autofocus -->
  <Button click={close} text="Close" />
</div>
