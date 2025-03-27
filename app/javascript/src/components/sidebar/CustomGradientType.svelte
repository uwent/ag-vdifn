<style lang="scss">
  .spectral-2 {
    background: linear-gradient(
      90deg,
      rgb(0, 176, 38) 0%,
      rgb(245, 255, 0) 50%,
      rgb(255, 0, 0) 100%
    );
  }

  .spectral-3 {
    background: linear-gradient(
      90deg,
      rgb(0, 176, 38) 0%,
      rgb(249, 255, 0) 25%,
      rgb(255, 0, 0) 50%,
      rgb(255, 255, 0) 75%,
      rgb(0, 176, 38) 100%
    );
  }

  .viridis-2 {
    background: linear-gradient(
      90deg,
      rgb(71, 0, 82) 0%,
      rgb(0, 138, 140) 50%,
      rgb(255, 232, 73) 100%
    );
  }

  .viridis-3 {
    background: linear-gradient(
      90deg,
      rgb(71, 0, 82) 0%,
      rgb(0, 138, 140) 25%,
      rgb(255, 232, 73) 50%,
      rgb(0, 138, 140) 75%,
      rgb(71, 0, 82) 100%
    );
  }

  /* Customize the label (the container) */
  .gradient-type-field {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .container {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default radio button */
  .container input {
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom radio button */
  .gradient {
    top: 0;
    left: 0;
    height: 36px;
    width: 110px;
    border-radius: 6px;
  }

  .container input ~ .gradient {
    border: medium solid white;
  }

  /* On mouse-over, add a grey background color */
  .container:hover input ~ .gradient {
    border-color: #ccc;
  }

  /* When the radio button is checked, add a blue background */
  .container input:checked ~ .gradient {
    background-color: #2196f3;
    border: medium solid rgba(52, 65, 187, 0.947);
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */
  .gradient:after {
    content: '';
    position: absolute;
    display: none;
  }

  /* Show the indicator (dot/circle) when checked */
  .container input:checked ~ .gradient:after {
    display: block;
  }

  /* Style the indicator (dot/circle) */
  .container .gradient:after {
    top: 9px;
    left: 9px;
    width: 8px;
    height: 8px;
  }
</style>

<script lang="ts">
  import { customPanelState, selectedPalette } from '@store';
</script>

<div data-testid="gradient-opts">
  <fieldset class="gradient-type-field">
    <legend>Gradient Type</legend>
    <label for="gradient-2-point" class="container">
      <input
        id="gradient-2-point"
        type="radio"
        name="gradient-type"
        title="gradient-2-point"
        bind:group={$customPanelState.selectedGradient}
        value="two-point"
      />
      <span class="gradient {$selectedPalette}-2"></span>
    </label>
    <label for="gradient-3-point" class="container">
      <input
        id="gradient-3-point"
        type="radio"
        name="gradient-type"
        title="gradient-3-point"
        bind:group={$customPanelState.selectedGradient}
        value="three-point"
      />
      <span class="gradient {$selectedPalette}-3"></span>
    </label>
  </fieldset>
</div>
