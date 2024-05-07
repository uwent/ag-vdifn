<style lang="scss">
  #gradient-2-point-display {
    background: linear-gradient(
      90deg,
      rgba(0, 176, 38, 1) 0%,
      rgba(245, 255, 0, 1) 50%,
      rgba(255, 0, 0, 1) 100%
    );
  }

  #gradient-3-point-display {
    background: linear-gradient(
      90deg,
      rgba(0, 176, 38, 1) 0%,
      rgba(249, 255, 0, 1) 25%,
      rgba(255, 0, 0, 1) 50%,
      rgba(255, 255, 0, 1) 75%,
      rgba(0, 176, 38, 1) 100%
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

  .submitted-params {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: flex-start;
    padding: 0px 19% 0px;
    padding-left: 0px;
    font-size: small;
  }

  .note {
    margin: 0.5em;
    text-align: center;
    font-style: italic;
    font-size: small;
  }
</style>

<script lang="ts">
  import moment from 'moment';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  import TwoPointGradient from './TwoPointGradient.svelte';
  import ThreePointGradient from './ThreePointGradient.svelte';
  import { overlayGradient, customOverlaySubmitted, customPanelState, mapRange } from '@store';

  let gradient = 1;

  function updateOverlay(event) {
    $overlayGradient = event.detail;
    updateCustomPanelState();
  }

  function updateCustomPanelState() {
    customPanelState.update((state) => ({
      ...state,
      selectedGradient: gradient,
    }));
  }

  onMount(() => {
    if ($customOverlaySubmitted) {
      gradient = $customPanelState.selectedGradient || 1;
    }
  });
</script>

<div data-testid="gradient-opts">
  {#if $customPanelState.params}
    <fieldset>
      <legend>Submitted Values</legend>
      <div class="submitted-params" title="submitted-params">
        <div>Start Date:</div>
        <div>{moment($customPanelState.params.start_date).format('YYYY-MM-DD')}</div>
        <div>End Date:</div>
        <div>{moment($customPanelState.params.end_date).format('YYYY-MM-DD')}</div>
        <div>Tmin:</div>
        <div>{$customPanelState.params.t_min}</div>
        <div>Tmax:</div>
        <div>{$customPanelState.params.t_max || 'None'}</div>
        <div>Units:</div>
        <div>{$customPanelState.params.in_fahrenheit ? 'Fahrenheit' : 'Celcius'}</div>
      </div>
    </fieldset>
  {/if}
  <fieldset class="gradient-type-field">
    <legend>Gradient Type</legend>
    <label for="gradient-2-point" class="container">
      <input
        id="gradient-2-point"
        type="radio"
        name="gradient-type"
        title="gradient-2-point"
        bind:group={gradient}
        value={1}
      />
      <span id="gradient-2-point-display" class="gradient" />
    </label>
    <label for="gradient-3-point" class="container">
      <input
        id="gradient-3-point"
        type="radio"
        name="gradient-type"
        title="gradient-3-point"
        bind:group={gradient}
        value={2}
      />
      <span id="gradient-3-point-display" class="gradient" />
    </label>
  </fieldset>
  {#if gradient === 1}
    <TwoPointGradient on:updateOverlay={updateOverlay} />
  {:else}
    <ThreePointGradient on:updateOverlay={updateOverlay} />
  {/if}
  <div title="Map range" class="note">
    Map range: {Math.round($mapRange.min * 10) / 10} - {Math.round($mapRange.max * 10) / 10} degree days
  </div>
</div>
