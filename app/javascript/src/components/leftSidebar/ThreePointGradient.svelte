<style lang="scss">
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
    background: $btn-color-2;
    background: linear-gradient(to bottom, $btn-color-1 0%, $btn-color-2);
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
      background: linear-gradient(to bottom, $btn-color-2 0%, $btn-color-3);
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
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import GradientHelper from '@components/map/ts/gradientHelper';
  import ColorHelper from '@components/map/ts/colorHelper';
  import { strToNum } from '@ts/utils';
  import { mapRange, threePointGradientState } from '@store';

  const dispatch = createEventDispatcher();

  let gradientHelper = new GradientHelper();
  let userInputElements: HTMLInputElement[] = [];
  let severityLevels = 5;
  let userValues = [0, 0, 0, 0];
  let userInputs = [0, 0, 0, 0];
  let intermediateRangesUpper: number[][] = [];
  let intermediateRangesLower: number[][] = [];
  let buttonsDisabled = false;
  let gradientValidationMessage = '';

  // populate temporary elements
  for (let i = 0; i <= 3; i++) {
    userInputElements.push(0 as any);
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
        userInputElements[i].setCustomValidity(msg);
      } else if (i === 0 && ranges[0] < 0) {
        msg = 'Minimum value must be greater than zero.';
        messages.push(msg);
        userInputElements[i].setCustomValidity(msg);
      } else if (ranges[i] < ranges[i - 1]) {
        msg = 'All values must be in ascending order.';
        messages.push(msg);
        userInputElements[i].setCustomValidity(msg);
      } else {
        userInputElements[i].setCustomValidity('');
      }
    }
    gradientValidationMessage = [...new Set(messages)].join(' ').trim();
    buttonsDisabled = !!gradientValidationMessage;
    if (!buttonsDisabled) {
      userValues = ranges.slice(0, 4);
      updateIntermediateValues();
    }
  }

  // fetch gradient
  function getGradient() {
    return gradientHelper.mapRangeToColors({
      min: userValues[0],
      middleMin: userValues[1],
      middleMax: userValues[2],
      max: userValues[3],
      totalLevels: severityLevels,
    });
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

  // update grid overlay
  function updateOverlay() {
    dispatch('updateOverlay', getGradient());
  }

  // handle reset button
  function resetOverlay() {
    setUserMinMax($mapRange.min, $mapRange.max);
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
    if (
      Object.keys(state).length > 0 &&
      state.mapMin === $mapRange.min &&
      state.mapMax === $mapRange.max
    ) {
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
      gradient: getGradient(),
    };
  });

  $: setUserMinMax($mapRange.min, $mapRange.max);
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
        type="number"
        name="userMin"
        data-testid="userMinInput"
        required
        bind:this={userInputElements[0]}
        bind:value={userInputs[0]}
        on:change={handleUpdate}
      />
    </div>
    {#each intermediateRangesLower as severityValueRange, index}
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
        title="Lower middle range"
        type="number"
        name="userMiddleMin"
        data-testid="userMiddleMinInput"
        required
        bind:this={userInputElements[1]}
        bind:value={userInputs[1]}
        on:change={handleUpdate}
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
        on:change={handleUpdate}
      />
    </div>
    {#each intermediateRangesUpper as severityValueRange, index}
      <div class="severity-row" data-testid="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.colorInverse(index + 1, severityLevels)}"
        />
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row" data-testid="severity-row">
      <div class="severity-color" style="background: {ColorHelper.color(0, severityLevels)}" />
      <input
        class="severity-value-end-input"
        title="End of gradient"
        type="number"
        name="userMax"
        data-testid="userMaxInput"
        required
        bind:this={userInputElements[3]}
        bind:value={userInputs[3]}
        on:change={handleUpdate}
      />
      <div class="severity-value-end">&gt; &gt; &gt;</div>
    </div>
    <div class="button-row">
      <button
        class="level-quantity-button"
        title="Add levels to gradient"
        data-testid="addButton"
        on:click={addLevel}
        disabled={buttonsDisabled || severityLevels >= 8}>+</button
      >
      <button
        class="update-overlay-button"
        title="Update grid overlay with new values"
        data-testid="updateButton"
        on:click={updateOverlay}
        disabled={buttonsDisabled}>Update</button
      >
      <button
        class="update-overlay-button"
        title="Reset to defaults"
        data-testid="resetButton"
        on:click={resetOverlay}>Reset</button
      >
      <button
        class="level-quantity-button"
        title="Remove levels from gradient"
        data-testid="minusButton"
        on:click={decrementLevel}
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
