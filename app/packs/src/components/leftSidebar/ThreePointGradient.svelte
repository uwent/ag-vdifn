<script lang="ts">
  import GradientHelper from './ts/gradientHelper'
  import ColorHelper from '../../components/map/ts/colorHelper'
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { mapMinMapMax, threePointGradientState } from '../../store/store'
  import { get } from 'svelte/store'

  const _ = require('lodash')
  const dispatch = createEventDispatcher()

  let gradientHelper = new GradientHelper()
  let userMinInput: HTMLInputElement
  let userMiddleMinInput: HTMLInputElement
  let userMiddleMaxInput: HTMLInputElement
  let userMaxInput: HTMLInputElement
  let addButton: HTMLButtonElement
  let minusButton: HTMLButtonElement
  let updateOverlayButton: HTMLButtonElement
  let resetOverlayButton: HTMLButtonElement

  let severityLevels: number = 5
  let userValues: number[] = [0, 0, 0, 0]
  let userInputs: number[] = [0, 0, 0, 0]
  let intermediateRangesUpper: number[][] = []
  let intermediateRangesLower: number[][] = []
  let buttonsDisabled: boolean = false

  $: setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)

  onMount(() => {
    const state = get(threePointGradientState)
    if (_.size(state) > 0) {
      if (state.mapMin === $mapMinMapMax.min && state.mapMax === $mapMinMapMax.max) {
        // console.log('loading saved state')
        severityLevels = state.severityLevels
        userInputs = state.userValues
        validateInputs()
        updateOverlay()
      } else {
        // console.log('saved state present but map has changed')
        setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
      }
    } else {
      // console.log('no saved state found')
      setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
    }
  })

  onDestroy(() => {
    threePointGradientState.set({
      severityLevels,
      userValues,
      mapMin: get(mapMinMapMax).min,
      mapMax: get(mapMinMapMax).max,
      gradient: getGradient(),
    })
  })

  // populate user values from map range
  function setUserMinMax(mapMin, mapMax) {
    const x = (mapMax - mapMin) / (severityLevels * 2 - 1)
    userInputs = [
      Math.round(mapMin + x),
      Math.round((mapMin + mapMax) / 2 - x / 2),
      Math.round((mapMin + mapMax) / 2 + x / 2),
      Math.round(mapMax - x)]
    validateInputs()
    updateOverlay()
  }

  // generate intermediate values for display
  function updateIntermediateValues() {
    const { intermediateValues: lower } = gradientHelper.gradientValues({
      min: userValues[0],
      max: userValues[1],
      intermediateLevels: severityLevels - 2,
    })
    const { intermediateValues: upper } = gradientHelper.gradientValues({
      min: userValues[2],
      max: userValues[3],
      intermediateLevels: severityLevels - 2,
    })
    intermediateRangesLower = lower
    intermediateRangesUpper = upper
  }

  // validate inputs, write to values, and update intermediates
  function validateInputs() {

    if (!userMinInput || !userMiddleMinInput || !userMiddleMaxInput || !userMaxInput) return

    const min = Number(userInputs[0])
    const middleMin = Number(userInputs[1])
    const middleMax = Number(userInputs[2])
    const max = Number(userInputs[3])

    if (isNaN(min)) {
      userMinInput.setCustomValidity('No value entered')
    } else if (min < 0 || min > middleMin) {
      userMinInput.setCustomValidity('This value must be between 0 and the middle min')
    } else {
      userMinInput.setCustomValidity('')
      userValues[0] = min
    }

    if (isNaN(middleMin)) {
      userMiddleMinInput.setCustomValidity('No value entered')
    } else if (middleMin < min || middleMin > middleMax) {
      userMiddleMinInput.setCustomValidity('This value must be between the min and middle max')
    } else {
      userMiddleMinInput.setCustomValidity('')
    }

    if (isNaN(middleMax)) {
      userMiddleMaxInput.setCustomValidity('No value entered')
    } else if (middleMax < middleMin || middleMax > max) {
      userMiddleMaxInput.setCustomValidity('This value must be between the middle min and the max')
    } else {
      userMiddleMaxInput.setCustomValidity('')
    }

    if (isNaN(max)) {
      userMaxInput.setCustomValidity('No value entered')
    } else if (max < middleMax) {
      userMaxInput.setCustomValidity('This value must be greater than the middle max')
    } else {
      userMaxInput.setCustomValidity('')
    }

    if (userMinInput.validationMessage || userMiddleMinInput.validationMessage || userMiddleMaxInput.validationMessage || userMaxInput.validationMessage) {
      buttonsDisabled = true
    } else {
      buttonsDisabled = false
      userValues = [min, middleMin, middleMax, max]
      updateIntermediateValues()
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
    })
  }

  // add gradient level
  function addLevel() {
    if (severityLevels > 8) return
    severityLevels += 1
    updateIntermediateValues()
  }

  // remove gradient level
  function decrementLevel() {
    if (severityLevels < 3) return
    severityLevels -= 1
    updateIntermediateValues()
  }

  // update grid overlay
  function updateOverlay() {
    dispatch('updateOverlay', getGradient())
  }

  // handle reset button
  function resetOverlay() {
    setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
  }

  // handle inputs
  function handleUpdate(event) {
    const name = event.target.name
    const { value } = event.target
    if (name === 'userMin') {
      userInputs[0] = value
    } else if (name === 'userMiddleMin') {
      userInputs[1] = value
    } else if (name === 'userMiddleMax') {
      userInputs[2] = value
    } else if (name === 'userMax') {
      userInputs[3] = value
    }
    validateInputs()
  }

</script>

<style type="scss">
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
    background: #249dde;
    border-radius: 3px;
    box-shadow: 0px 1px 3px rgba(000, 000, 000, 0),
      inset 0px 0px 1px rgba(255, 255, 255, 1);
    color: #fff;
    font-size: 0.85em;
    padding: 10px;
    margin-top: 13px;
    border: none;
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

<fieldset title="Gradient specification">
  <legend>Custom Degree-Day Values</legend>
  <div class="custom-values-wrapper">
    <div class="severity-row" data-testid="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(0, severityLevels)}" />
      <div class="severity-value-end">
        0
      </div>
      <input
        class="severity-value-end-input"
        title="Start of gradient"
        type="number"
        name="userMin"
        data-testid="userMinInput"
        required
        bind:this={userMinInput}
        bind:value={userInputs[0]}
        on:change={handleUpdate} />
    </div>
    {#each intermediateRangesLower as severityValueRange, index}
      <div class="severity-row" data-testid="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.color(index + 1, severityLevels)}" />
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row" data-testid="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(severityLevels, severityLevels)}" />
      <input
        class="severity-value-end-input"
        title="Lower middle range"
        type="number"
        name="userMiddleMin"
        data-testid="userMiddleMinInput"
        required
        bind:this={userMiddleMinInput}
        bind:value={userInputs[1]}
        on:change={handleUpdate} />
      <input
        class="severity-value-end-input"
        title="Upper middle range"
        type="number"
        name="userMiddleMax"
        data-testid="userMiddleMaxInput"
        required
        bind:this={userMiddleMaxInput}
        bind:value={userInputs[2]}
        on:change={handleUpdate} />
    </div>
    {#each intermediateRangesUpper as severityValueRange, index}
      <div class="severity-row" data-testid="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.colorInverse(index + 1, severityLevels)}" />
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row" data-testid="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(0, severityLevels)}" />
      <input
        class="severity-value-end-input"
        title="End of gradient"
        type="number"
        name="userMax"
        data-testid="userMaxInput"
        required
        bind:this={userMaxInput}
        bind:value={userInputs[3]}
        on:change={handleUpdate} />
      <div class="severity-value-end">
        &gt; &gt; &gt;
      </div>
    </div>
    <div class="button-row">
      <button
        class="level-quantity-button"
        title="Add levels to gradient"
        data-testid="addButton"
        bind:this={addButton}
        on:click={addLevel}
        disabled={buttonsDisabled || severityLevels >= 8}>
        +
      </button>
      <button
        class="update-overlay-button"
        title="Update grid overlay with new values"
        data-testid="updateButton"
        bind:this={updateOverlayButton}
        on:click={updateOverlay}
        disabled={buttonsDisabled}>
        Update
      </button>
      <button
        class="update-overlay-button"
        title="Reset to defaults"
        data-testid="resetButton"
        bind:this={resetOverlayButton}
        on:click={resetOverlay}>
        Reset
      </button>
      <button
        class="level-quantity-button"
        title="Remove levels from gradient"
        data-testid="minusButton"
        bind:this={minusButton}
        on:click={decrementLevel}
        disabled={buttonsDisabled || severityLevels <= 3}>
        -
      </button>
    </div>
  </div>
</fieldset>
<div title = "Map range">
  Map range: {$mapMinMapMax.min} - {$mapMinMapMax.max} degree days
</div>
