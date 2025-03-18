<style lang="scss">
  @use '../../scss/variables.scss' as vars;

  input {
    text-align: center;
  }

  input:invalid {
    border: 1px solid darkred;
    background-color: #fdd;
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
    background: rgba(0, 176, 38, 1);
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
    padding: 10px;
    margin-top: 13px;
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

  .validation-msg {
    margin-top: 0.5rem;
    font-size: smaller;
    font-style: italic;
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

  button:disabled {
    background: grey;
    cursor: not-allowed;
  }
</style>

<script lang="ts">
  import { untrack, onMount, onDestroy } from 'svelte';
  import GradientHelper from '@components/map/ts/gradientHelper';
  import ColorHelper from '@components/map/ts/colorHelper';
  import { strToNum } from '@ts/utils';
  import { mapRange, overlayGradient, threePointGradientState } from '@store';
  import type { GradientHash } from '@types';

  const gradientHelper = new GradientHelper();

  let userInputElements = $state<(HTMLInputElement | null)[]>([]);
  let severityLevels = $state(5);
  let userValues = $state<number[]>([0, 0, 0, 0]);
  let userInputs = $state<number[]>([0, 0, 0, 0]);
  let intermediateRangesUpper = $state<number[][]>([]);
  let intermediateRangesLower = $state<number[][]>([]);
  let buttonsDisabled = $state(false);
  let gradientValidationMessage = $state('');
  let gradient = $derived<GradientHash>(getGradient());

  // populate temporary elements
  for (let i = 0; i <= 3; i++) {
    userInputElements[i] = null;
  }

  // fetch gradient
  function getGradient() {
    const gradient = gradientHelper.mapRangeToColors({
      min: userValues[0],
      middleMin: userValues[1],
      middleMax: userValues[2],
      max: userValues[3],
      totalLevels: severityLevels,
    });
    return gradient;
  }

  // populate user values from map range
  function setUserMinMax(mapMin, mapMax) {
    const x = (mapMax - mapMin) / (severityLevels * 2 - 1);
    userInputs = [
      Math.round(mapMin + x),
      Math.round((mapMin + mapMax) / 2 - x / 2),
      Math.round((mapMin + mapMax) / 2 + x / 2),
      Math.round(mapMax - x),
    ];
    validateInputs();
    updateOverlay();
  }

  // validate inputs, write to values, and update intermediates
  function validateInputs() {
    if (!userInputElements || !userInputElements.every(Boolean)) return;

    const ranges = userInputs.map(strToNum).concat([Infinity]);
    let messages = [''];
    for (let i = 0; i <= 3; i++) {
      let msg = '';
      if (isNaN(ranges[i])) {
        msg = 'Please enter a number in each field.';
        messages.push(msg);
      } else if (i === 0 && ranges[0] < 0) {
        msg = 'Minimum value must be greater than zero.';
        messages.push(msg);
      } else if (ranges[i] < ranges[i - 1]) {
        msg = 'All values must be in ascending order.';
        messages.push(msg);
      }
      if (userInputElements[i]) userInputElements[i]?.setCustomValidity(msg);
    }
    gradientValidationMessage = [...new Set(messages)].join(' ').trim();
    buttonsDisabled = !!gradientValidationMessage;
    if (!buttonsDisabled) {
      userValues = ranges.slice(0, 4);
      updateIntermediateValues();
    }
  }

  // generate intermediate values for display
  function updateIntermediateValues() {
    const { intermediateValues: lower } = gradientHelper.gradientValues({
      min: userValues[0],
      max: userValues[1],
      intermediateLevels: severityLevels - 2,
    });
    const { intermediateValues: upper } = gradientHelper.gradientValues({
      min: userValues[2],
      max: userValues[3],
      intermediateLevels: severityLevels - 2,
    });
    intermediateRangesLower = lower;
    intermediateRangesUpper = upper;
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
    if (severityLevels > 8) return;
    severityLevels += 1;
    updateIntermediateValues();
  }

  // remove gradient level
  function decrementLevel() {
    if (severityLevels < 3) return;
    severityLevels -= 1;
    updateIntermediateValues();
  }

  // handle inputs
  function handleUpdate(event) {
    const name = event.target.name;
    const { value } = event.target;
    if (name === 'userMin') {
      userInputs[0] = value;
    } else if (name === 'userMiddleMin') {
      userInputs[1] = value;
    } else if (name === 'userMiddleMax') {
      userInputs[2] = value;
    } else if (name === 'userMax') {
      userInputs[3] = value;
    }
    validateInputs();
  }

  onMount(() => {
    const state = $threePointGradientState;
    if (state && state.mapMin === $mapRange.min && state.mapMax === $mapRange.max) {
      // console.log('loading saved state')
      severityLevels = state.severityLevels || 5;
      userInputs = state.userValues || [];
      validateInputs();
      updateOverlay();
    } else {
      // console.log('no saved state found or map changed')
      setUserMinMax($mapRange.min, $mapRange.max);
    }
  });

  onDestroy(() => {
    $threePointGradientState = {
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
        type="number"
        name="userMin"
        data-testid="userMinInput"
        required
        bind:this={userInputElements[0]}
        bind:value={userInputs[0]}
        onchange={handleUpdate}
      />
    </div>
    {#each intermediateRangesLower as severityValueRange, index}
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
        title="Lower middle range"
        type="number"
        name="userMiddleMin"
        data-testid="userMiddleMinInput"
        required
        bind:this={userInputElements[1]}
        bind:value={userInputs[1]}
        onchange={handleUpdate}
      />
      <input
        class="severity-value-end-input"
        title="Upper middle range"
        type="number"
        name="userMiddleMax"
        data-testid="userMiddleMaxInput"
        required
        bind:this={userInputElements[2]}
        bind:value={userInputs[2]}
        onchange={handleUpdate}
      />
    </div>
    {#each intermediateRangesUpper as severityValueRange, index}
      <div class="severity-row" data-testid="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.colorInverse(index + 1, severityLevels)}"
        ></div>
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row" data-testid="severity-row">
      <div class="severity-color" style="background: {ColorHelper.color(0, severityLevels)}"></div>
      <input
        class="severity-value-end-input"
        title="End of gradient"
        type="number"
        name="userMax"
        data-testid="userMaxInput"
        required
        bind:this={userInputElements[3]}
        bind:value={userInputs[3]}
        onchange={handleUpdate}
      />
      <div class="severity-value-end">&gt; &gt; &gt;</div>
    </div>
    <div class="button-row">
      <button
        class="level-quantity-button"
        title="Add levels to gradient"
        data-testid="addButton"
        onclick={addLevel}
        disabled={buttonsDisabled || severityLevels >= 8}>+</button
      >
      <button
        class="update-overlay-button"
        title="Update grid overlay with new values"
        data-testid="updateButton"
        onclick={updateOverlay}
        disabled={buttonsDisabled}>Update</button
      >
      <button
        class="update-overlay-button"
        title="Reset to defaults"
        data-testid="resetButton"
        onclick={resetOverlay}>Reset</button
      >
      <button
        class="level-quantity-button"
        title="Remove levels from gradient"
        data-testid="minusButton"
        onclick={decrementLevel}
        disabled={buttonsDisabled || severityLevels <= 3}>-</button
      >
    </div>
  </div>
  {#if gradientValidationMessage}
    <div class="validation-msg" data-testid="validation-msg">
      {gradientValidationMessage}
    </div>
  {/if}
</fieldset>
