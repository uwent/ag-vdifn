<style lang="scss">
  @use '../../scss/variables.scss' as vars;

  input {
    text-align: center;
  }

  .severity-row {
    display: grid;
    grid-template-columns: 26px 1fr 1fr;
    padding: 0.3rem 0;
    column-gap: 1rem;
    width: 100%;
  }

  .severity-color {
    width: 30px;
    height: 30px;
  }

  %severity-value {
    display: flex;
    border: none;
    justify-content: center;
    align-items: center;
    font-size: 0.85rem;
    background-color: white;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.15);
    width: 100%;
    padding: 0;
  }

  %severity-button {
    background: vars.$btn-color-2;
    background: linear-gradient(to bottom, vars.$btn-color-1 0%, vars.$btn-color-2);
    border-radius: 3px;
    box-shadow:
      0px 1px 3px rgba(000, 000, 000, 0),
      inset 0px 0px 1px rgba(255, 255, 255, 1);
    color: #fff;
    font-size: 0.85em;
    margin-top: 13px;
    padding: 10px;
    border: 1px solid grey;
    cursor: pointer;

    &:hover {
      background: linear-gradient(to bottom, vars.$btn-color-2 0%, vars.$btn-color-3);
    }
  }

  button:disabled {
    background: grey;
    cursor: not-allowed;
  }

  .severity-value-end {
    @extend %severity-value;
    background-color: #d0d0d0;
  }

  .severity-value-end-input {
    @extend %severity-value;
  }

  .severity-value-intermediate {
    @extend %severity-value;
    grid-column: 2 / span 2;
    background-color: #d0d0d0;
  }

  input:invalid {
    border-color: #900;
    background-color: #fdd;
  }

  .validation-msg {
    margin-top: 0.5rem;
    font-size: smaller;
    font-style: italic;
  }

  .button-row {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    gap: 2px;
  }

  .level-quantity-button {
    @extend %severity-button;
    width: 20%;
  }

  .update-overlay-button {
    @extend %severity-button;
    width: 50%;
  }
</style>

<script lang="ts">
  import { untrack, onMount, onDestroy } from 'svelte';
  import GradientHelper from '@components/map/ts/gradientHelper';
  import ColorHelper from '@components/map/ts/colorHelper';
  import { strToNum } from '@ts/utils';
  import { mapRange, overlayGradient, customPanelState, twoPointGradientState } from '@store';
  import type { GradientHash } from '@types';

  const gradientHelper = new GradientHelper();

  let addButton: HTMLButtonElement;
  let minusButton: HTMLButtonElement;
  let userMinInput: HTMLInputElement;
  let userMaxInput: HTMLInputElement;
  let updateOverlayButton: HTMLButtonElement;
  let resetOverlayButton: HTMLButtonElement;

  let severityLevels = $state(5);
  let userValues = $state<number[]>([0, 0]);
  let userInputs = $state<number[]>([0, 0]);
  let intermediateRanges = $state<number[][]>([]);
  let buttonsDisabled = $state(false);
  let gradientValidationMessage = $state('');
  let gradient = $derived<GradientHash | null>(getGradient());

  // fetch gradient
  function getGradient() {
    if (!$customPanelState?.severities.length) return null;
    return gradientHelper.mapRangeToColors({
      min: userValues[0],
      max: userValues[1],
      totalLevels: severityLevels,
    });
  }

  // populate user values from map range
  function setUserMinMax(mapMin, mapMax) {
    const x = (mapMax - mapMin) / severityLevels;
    userInputs = [Math.floor(mapMin + x), Math.ceil(mapMax - x)];
    validateInputs();
    updateOverlay();
  }

  function validateInputs() {
    if (!userMinInput || !userMaxInput) return;

    const min = strToNum(userInputs[0]);
    const max = strToNum(userInputs[1]);
    const minMsg = validateMin(min, max);
    const maxMsg = validateMax(min, max);
    userMinInput.setCustomValidity(minMsg);
    userMaxInput.setCustomValidity(maxMsg);

    gradientValidationMessage = `${minMsg} ${maxMsg}`.trim();
    buttonsDisabled = !!gradientValidationMessage;
    if (!buttonsDisabled) {
      userValues = [min, max];
      updateIntermediateValues();
    }
  }

  // validate inputs, write to values, and update intermediates
  function validateMin(min: number, max: number): string {
    if (isNaN(min)) return 'No minimum value entered.';
    if (min < 0) return 'Minimum must be greater than zero.';
    if (min > max) return 'Minimum must be less than maximum.';
    return '';
  }

  function validateMax(min: number, max: number): string {
    if (isNaN(max)) return 'No maximum value entered.';
    if (max <= min) return 'Maximum must be greater than the minimum.';
    return '';
  }

  // generate intermediate values for display
  function updateIntermediateValues() {
    const { intermediateValues: values } = gradientHelper.gradientValues({
      min: userValues[0],
      max: userValues[1],
      intermediateLevels: severityLevels - 2,
    });
    intermediateRanges = values;
  }

  // update grid overlay
  function updateOverlay() {
    if (gradient) $overlayGradient = gradient;
  }

  // handle reset button
  function resetOverlay() {
    setUserMinMax($mapRange.min, $mapRange.max);
  }

  // add gradient level
  function addLevel() {
    if (severityLevels + 1 > 8) return;
    severityLevels += 1;
    updateIntermediateValues();
  }

  // remove gradient level
  function decrementLevel() {
    if (severityLevels - 1 < 3) return;
    severityLevels -= 1;
    updateIntermediateValues();
  }

  // handle input updates
  function handleUpdate(event) {
    const name = event.target.name;
    const { value } = event.target;
    if (name === 'userMin') {
      userInputs[0] = value;
    } else if (name === 'userMax') {
      userInputs[1] = value;
    }
    validateInputs();
  }

  onMount(() => {
    const state = $twoPointGradientState;
    if (state) {
      if (state.mapMin === $mapRange.min && state.mapMax === $mapRange.max) {
        // console.log('loading saved state');
        severityLevels = state.severityLevels || 5;
        userInputs = state.userValues || [];
        validateInputs();
        updateOverlay();
      } else {
        // console.log('saved state present but map has changed');
        setUserMinMax($mapRange.min, $mapRange.max);
      }
    } else {
      // console.log('no saved state found');
      setUserMinMax($mapRange.min, $mapRange.max);
    }
  });

  onDestroy(() => {
    $twoPointGradientState = {
      severityLevels,
      userValues,
      mapMin: $mapRange.min,
      mapMax: $mapRange.max,
      gradient: gradient,
    };
  });

  $effect(() => {
    const min = $mapRange.min;
    const max = $mapRange.max;
    untrack(() => setUserMinMax(min, max));
  });
</script>

<fieldset title="Gradient specification">
  <legend>Custom Degree-Day Values</legend>
  <div class="custom-values-wrapper">
    <div class="severity-row" data-testid="severity-row">
      <div class="severity-color" style="background: {ColorHelper.color(0, severityLevels)}"></div>
      <div class="severity-value-end">0</div>
      <input
        class="severity-value-end-input"
        title="Start of gradient"
        name="userMin"
        data-testid="userMinInput"
        type="number"
        required
        bind:this={userMinInput}
        bind:value={userInputs[0]}
        onchange={handleUpdate}
        onemptied={handleUpdate}
      />
    </div>
    {#each intermediateRanges as severityValueRange, index}
      <div class="severity-row" data-testid="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.color(index + 1, severityLevels)}"
        ></div>
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row" data-testid="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(severityLevels, severityLevels)}"
      ></div>
      <input
        class="severity-value-end-input"
        title="End of gradient"
        name="userMax"
        data-testid="userMaxInput"
        type="number"
        required
        bind:this={userMaxInput}
        bind:value={userInputs[1]}
        onchange={handleUpdate}
        onemptied={handleUpdate}
      />
      <div class="severity-value-end">&gt; &gt; &gt;</div>
    </div>
  </div>
  <div class="button-row">
    <button
      class="level-quantity-button"
      title="Add levels to gradient"
      data-testid="addButton"
      bind:this={addButton}
      onclick={addLevel}
      disabled={buttonsDisabled || severityLevels >= 8}
    >
      +
    </button>
    <button
      class="update-overlay-button"
      title="Update grid overlay with new values"
      data-testid="updateButton"
      bind:this={updateOverlayButton}
      onclick={updateOverlay}
      disabled={buttonsDisabled}
    >
      Update
    </button>
    <button
      class="update-overlay-button"
      title="Reset to defaults"
      data-testid="resetButton"
      bind:this={resetOverlayButton}
      onclick={resetOverlay}
    >
      Reset
    </button>
    <button
      class="level-quantity-button"
      title="Remove levels from gradient"
      data-testid="minusButton"
      bind:this={minusButton}
      onclick={decrementLevel}
      disabled={buttonsDisabled || severityLevels <= 3}
    >
      -
    </button>
  </div>
  {#if gradientValidationMessage}
    <div class="validation-msg" data-testid="validation-msg">
      {gradientValidationMessage}
    </div>
  {/if}
</fieldset>
