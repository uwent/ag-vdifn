<style lang="scss">
  @import '../../scss/settings.scss';

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
    background: $btn-color-2;
    background: linear-gradient(to bottom, $btn-color-1 0%, $btn-color-2);
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
      background: linear-gradient(to bottom, $btn-color-2 0%, $btn-color-3);
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
  import _ from 'lodash';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import GradientHelper from '@ts/gradientHelper';
  import ColorHelper from '@ts/map/colorHelper';
  import { mapRange, twoPointGradientState } from '@store';

  const dispatch = createEventDispatcher();

  let gradientHelper = new GradientHelper();
  let addButton: HTMLButtonElement;
  let minusButton: HTMLButtonElement;
  let userMinInput: HTMLInputElement;
  let userMaxInput: HTMLInputElement;
  let updateOverlayButton: HTMLButtonElement;
  let resetOverlayButton: HTMLButtonElement;

  let severityLevels = 5;
  let userValues: number[] = [0, 0];
  let userInputs: number[] = [0, 0];
  let intermediateRanges: number[][] = [];
  let buttonsDisabled = false;

  $: setUserMinMax($mapRange.min, $mapRange.max);

  onMount(() => {
    const state = get(twoPointGradientState);
    if (_.size(state) > 0) {
      if (state.mapMin === $mapRange.min && state.mapMax === $mapRange.max) {
        // console.log('loading saved state')
        severityLevels = state.severityLevels || 5;
        userInputs = state.userValues || [];
        validateInputs();
        updateOverlay();
      } else {
        // console.log('saved state present but map has changed')
        setUserMinMax($mapRange.min, $mapRange.max);
      }
    } else {
      // console.log('no saved state found')
      setUserMinMax($mapRange.min, $mapRange.max);
    }
  });

  onDestroy(() => {
    twoPointGradientState.set({
      severityLevels,
      userValues,
      mapMax: get(mapRange).max,
      mapMin: get(mapRange).min,
      gradient: getGradient(),
    });
  });

  // populate user values from map range
  function setUserMinMax(mapMin, mapMax) {
    const x = (mapMax - mapMin) / severityLevels;
    userInputs = [Math.floor(mapMin + x), Math.ceil(mapMax - x)];
    validateInputs();
    updateOverlay();
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

  // validate inputs, write to values, and update intermediates
  function validateInputs() {
    if (!userMinInput || !userMaxInput) return;

    const min = Number(userInputs[0]);
    const max = Number(userInputs[1]);

    if (isNaN(min)) {
      userMinInput.setCustomValidity('No value entered');
    } else if (min < 0 || min > max) {
      userMinInput.setCustomValidity('This value must be between 0 and the maximum');
    } else {
      userMinInput.setCustomValidity('');
    }

    if (isNaN(max)) {
      userMaxInput.setCustomValidity('No value entered');
    } else if (max < min) {
      userMaxInput.setCustomValidity('This value must be greater than the minimum');
    } else {
      userMaxInput.setCustomValidity('');
    }

    if (userMinInput.validationMessage || userMaxInput.validationMessage) {
      buttonsDisabled = true;
    } else {
      buttonsDisabled = false;
      userValues = [min, max];
      updateIntermediateValues();
    }
  }

  // fetch gradient
  function getGradient() {
    return gradientHelper.mapRangeToColors({
      min: userValues[0],
      max: userValues[1],
      totalLevels: severityLevels,
    });
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

  // update grid overlay
  function updateOverlay() {
    dispatch('updateOverlay', getGradient());
  }

  // handle reset button
  function resetOverlay() {
    setUserMinMax($mapRange.min, $mapRange.max);
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
</script>

<fieldset title="Gradient specification">
  <legend>Custom Degree-Day Values</legend>
  <div class="custom-values-wrapper">
    <div class="severity-row" data-testid="severity-row">
      <div class="severity-color" style="background: {ColorHelper.color(0, severityLevels)}" />
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
        on:change={handleUpdate}
      />
    </div>
    {#each intermediateRanges as severityValueRange, index}
      <div class="severity-row" data-testid="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.color(index + 1, severityLevels)}"
        />
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row" data-testid="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(severityLevels, severityLevels)}"
      />
      <input
        class="severity-value-end-input"
        title="End of gradient"
        name="userMax"
        data-testid="userMaxInput"
        type="number"
        required
        bind:this={userMaxInput}
        bind:value={userInputs[1]}
        on:change={handleUpdate}
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
      on:click={addLevel}
      disabled={buttonsDisabled || severityLevels >= 8}
    >
      +
    </button>
    <button
      class="update-overlay-button"
      title="Update grid overlay with new values"
      data-testid="updateButton"
      bind:this={updateOverlayButton}
      on:click={updateOverlay}
      disabled={buttonsDisabled}
    >
      Update
    </button>
    <button
      class="update-overlay-button"
      title="Reset to defaults"
      data-testid="resetButton"
      bind:this={resetOverlayButton}
      on:click={resetOverlay}
    >
      Reset
    </button>
    <button
      class="level-quantity-button"
      title="Remove levels from gradient"
      data-testid="minusButton"
      bind:this={minusButton}
      on:click={decrementLevel}
      disabled={buttonsDisabled || severityLevels <= 3}
    >
      -
    </button>
  </div>
</fieldset>
