<style lang="scss">
  @use '../../scss/variables.scss' as vars;

  .container {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 10;
  }

  // .flex {
  //   display: flex;
  //   flex-direction: column;
  //   gap: 2px;
  // }

  .label {
    font-size: small;
    color: grey;
  }

  .switch-field {
    display: flex;
    overflow: hidden;
    border-radius: 15px;
    border: 1px solid #ddd;

    input {
      position: absolute;
      clip: rect(0, 0, 0, 0);
      height: 1px;
      width: 1px;
      border: 0;
      overflow: hidden;

      &:focus + label {
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
      }

      // Spectral - light green background when selected
      &#spectral:checked + label {
        background-color: #e8f5e9; // Light green
        color: #2e7d32; // Darker green for text
      }

      // Viridis - light purple background when selected
      &#viridis:checked + label {
        background-color: #f3e5f5; // Light purple
        color: #7b1fa2; // Darker purple for text
      }
    }

    label {
      display: inline-block;
      background-color: #f8f8f8;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      padding: 5px 10px;
      transition: all 0.1s ease-in-out;
      cursor: pointer;

      &:hover {
        background-color: #f1f1f1;
      }

      &:first-of-type {
        border-radius: 20px 0 0 20px;
      }

      &:last-of-type {
        border-radius: 0 20px 20px 0;
      }
    }
  }
</style>

<script lang="ts">
  import { defaults, selectedPalette } from '@store';
  import type { ColorPaletteName } from '@types';
  let palette = $state<ColorPaletteName>(defaults.palette);

  $effect(() => {
    $selectedPalette = palette;
  });
</script>

<div class="container flex-column w-min">
  <div class="label">Color Palette:</div>
  <div class="switch-field">
    <input
      id="spectral"
      title="Spectral color palette"
      type="radio"
      value="spectral"
      bind:group={palette}
    />
    <label for="spectral">Spectral</label>
    <input
      id="viridis"
      title="Viridis color palette"
      type="radio"
      value="viridis"
      bind:group={palette}
    />
    <label for="viridis">Viridis</label>
  </div>
</div>
