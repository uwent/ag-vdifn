<script lang="ts">
  import GradientHelper from './TypeScript/gradientHelper'
  import ColorHelper from '../../components/map/TypeScript/colorHelper'
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { mapMinMapMax, threePointGradientState } from '../../store/store'
  import { get } from 'svelte/store'
  const _ = require('lodash')

  const dispatch = createEventDispatcher()
  let userMin: number
  let userMax: number
  let userMiddleMin: number
  let userMiddleMax: number
  let intermediateRangesUpper: number[][] = []
  let intermediateRangesLower: number[][] = []
  let gradientHelper = new GradientHelper()
  let severityLevels: number = 5
  let userMiddleInputMin: HTMLInputElement
  let userMiddleInputMax: HTMLInputElement
  let userMinInput: HTMLInputElement
  let userMaxInput: HTMLInputElement
  let addButton: HTMLButtonElement
  let minusButton: HTMLButtonElement
  let updateOverlayButton: HTMLButtonElement
  let resetOverlayButton: HTMLButtonElement
  let buttonsDisabled: boolean = false

  $: setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)

  onMount(() => {
    const state = get(threePointGradientState)
    if (_.size(state) > 0) {
      severityLevels = state.severityLevels
      if (state.absoluteMin === $mapMinMapMax.min) {
        userMin = state.userMin
        userMax = state.userMax
        userMiddleMin = state.userMiddleMin
        userMiddleMax = state.userMiddleMax
        updateIntermediateValuesUpper()
        updateIntermediateValuesLower()
      } else {
        setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
      }
      updateUserMin(userMin)
      updateUserMax(userMax)
      updateUserMiddleMin(userMiddleMin)
      updateUserMiddleMax(userMiddleMax)
    }
  })

  onDestroy(() => {
    threePointGradientState.set({
      severityLevels,
      userMin,
      userMax,
      userMiddleMax,
      userMiddleMin,
      absoluteMax: get(mapMinMapMax).max,
      absoluteMin: get(mapMinMapMax).min,
      gradient: getGradient(),
    })
  })

  // function setUserMinMax(absoluteMin, absoluteMax) {
  //   userMin = Math.round(absoluteMin + 10)
  //   userMax = Math.round(absoluteMax - 10)
  //   userMiddleMin = Math.round((userMax - userMin) / 2 + userMin - 10)
  //   userMiddleMax = Math.round((userMax - userMin) / 2 + userMin + 10)
  //   updateIntermediateValuesUpper()
  //   updateIntermediateValuesLower()
  // }

  function setUserMinMax(mapMin, mapMax) {
    const x = (mapMax - mapMin) / (severityLevels * 2)
    userMin = Math.round(mapMin + x)
    userMax = Math.round(mapMax - x)
    userMiddleMin = Math.round((mapMin + mapMax) / 2 - x)
    userMiddleMax = Math.round((mapMin + mapMax) / 2 + x)
    updateIntermediateValuesUpper()
    updateIntermediateValuesLower()
  }

  function updateIntermediateValuesUpper() {
    const { intermediateValues } = gradientHelper.gradientValues({
      min: userMin,
      max: userMiddleMin,
      intermediateLevels: severityLevels - 3,
    })
    intermediateRangesUpper = intermediateValues
  }

  function updateIntermediateValuesLower() {
    const { intermediateValues } = gradientHelper.gradientValues({
      min: userMiddleMax,
      max: userMax,
      intermediateLevels: severityLevels - 3,
    })
    intermediateRangesLower = intermediateValues
  }

  // function addLevel() {
  //   if (
  //     severityLevels + 1 > 8 ||
  //     userMax > $mapMinMapMax.max ||
  //     userMin < $mapMinMapMax.min
  //   )
  //     return
  //   severityLevels += 1
  //   updateIntermediateValuesUpper()
  //   updateIntermediateValuesLower()
  // }

  function addLevel() {
    if (severityLevels + 1 > 8) return
    severityLevels += 1
    updateIntermediateValuesUpper()
    updateIntermediateValuesLower()
  }

  // function decrementLevel() {
  //   if (
  //     severityLevels - 1 < 3 ||
  //     userMax > $mapMinMapMax.max ||
  //     userMin < $mapMinMapMax.min
  //   )
  //     return
  //   severityLevels -= 1
  //   updateIntermediateValuesUpper()
  //   updateIntermediateValuesLower()
  // }

  function decrementLevel() {
    if (severityLevels - 1 < 3) return
    severityLevels -= 1
    updateIntermediateValuesUpper()
    updateIntermediateValuesLower()
  }

  // Validation checks
  function userMinInputValid(value: number | typeof NaN): boolean {
    if (isNaN(value)) {
      return false
    } else if (value > userMax) {
      userMinInput.setCustomValidity('This value must be less than the chosen max and the map max')
      return false
    } else if (value < 0) {
      userMinInput.setCustomValidity('This value must be greater than 0')
      return false
    } else if (value >= userMiddleMin || value >= userMiddleMax) {
      userMinInput.setCustomValidity('This value must be less than both middle values')
      return false
    } else {
      userMinInput.setCustomValidity('')
      return true
    }
  }

  function maxInputValid(value: number | typeof NaN): boolean {
    if (isNaN(value)) {
      return false
    } else if (value <= userMin) {
      userMaxInput.setCustomValidity('This value must be greater than the chosen min and the map min')
      return false
    } else {
      userMaxInput.setCustomValidity('')
      return true
    }
  }

  function middleMaxInputValid(value: number | typeof NaN): boolean {
    if (isNaN(value)) {
      return false
    } else if (value <= userMiddleMin || value <= userMin) {
      userMiddleInputMax.setCustomValidity('This value must be greater the middle and min input values')
      return false
    } else if (value >= userMax) {
      userMiddleInputMax.setCustomValidity('This value must be less than the chosen and max values')
      return false
    } else {
      userMiddleInputMax.setCustomValidity('')
      return true
    }
  }

  function middleMinInputValid(value: number | typeof NaN): boolean {
    if (isNaN(value)) {
      return false
    } else if (value >= userMiddleMax || value >= userMax) {
      userMiddleInputMin.setCustomValidity('This value must be less than the chosen middle and max')
      return false
    } else if (value <= userMin) {
      userMiddleInputMin.setCustomValidity('This value must be greater the absolute minimum and the chosen minimum')
      return false
    } else {
      userMiddleInputMin.setCustomValidity('')
      return true
    }
  }

  function updateButtons() {
    if (
      userMinInput.validationMessage ||
      userMaxInput.validationMessage ||
      userMiddleInputMin.validationMessage ||
      userMiddleInputMax.validationMessage
    ) {
      buttonsDisabled = true
    } else {
      buttonsDisabled = false
    }
  }

  function handleUpdate(event) {
    const {
      dataset: { id: name },
      valueAsNumber,
    } = event.target
    if (name === 'userMin') {
      updateUserMin(valueAsNumber)
      updateIntermediateValuesUpper()
    } else if (name === 'userMax') {
      updateUserMax(valueAsNumber)
      updateIntermediateValuesLower()
    } else if (name === 'userMiddleMin') {
      updateUserMiddleMin(valueAsNumber)
      updateIntermediateValuesUpper()
    } else if (name === 'userMiddleMax') {
      updateUserMiddleMax(valueAsNumber)
      updateIntermediateValuesLower()
    }
  }

  function updateUserMin(value: number) {
    if (userMinInputValid(value)) userMin = value
    updateButtons()
  }

  function updateUserMax(value: number) {
    if (maxInputValid(value)) userMax = value
    updateButtons()
  }

  function updateUserMiddleMin(value: number) {
    if (middleMinInputValid(value)) userMiddleMin = value
    updateButtons()
  }

  function updateUserMiddleMax(value: number) {
    if (middleMaxInputValid(value)) userMiddleMax = value
    updateButtons()
  }

  function getLowerColorRange() {
    return gradientHelper.mapRangeToColors({
      min: userMin,
      max: userMiddleMin,
      intermediateLevels: severityLevels - 3,
      totalLevels: severityLevels - 1,
    })
  }

  function getUpperColorRange() {
    return gradientHelper.mapRangeToColors({
      min: userMiddleMax,
      max: userMax,
      intermediateLevels: severityLevels - 3,
      totalLevels: severityLevels - 1,
      inverse: true,
      toInfinity: true,
    })
  }

  function getGradient() {
    const upper = getUpperColorRange()
    const lower = getLowerColorRange()

    return { ...upper, ...lower }
  }

  function resetOverlay() {
    setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
    updateOverlay()
    updateButtons()
  }

  function updateOverlay() {
    dispatch('updateOverlay', getGradient())
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
    background: -moz-linear-gradient(top, #29d4ff 0%, #249dde);
    border-radius: 3px;
    box-shadow: 0px 1px 3px rgba(000, 000, 000, 0),
      inset 0px 0px 1px rgba(255, 255, 255, 1);
    color: #fff;
    font-size: 0.85em;
    margin-top: 13px;
    padding: 10px;
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

<fieldset>
  <legend>Custom Degree-Day Values</legend>
  <div class="custom-values-wrapper">
    <div class="severity-row" title="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(0, severityLevels)}" />
      <div class="severity-value-end" title="">
        &lt;
      </div>
      <input
        class="severity-value-end-input"
        type="number"
        data-id="userMin"
        title="Start of gradient"
        required
        bind:this={userMinInput}
        bind:value={userMin}
        on:change={handleUpdate} />
    </div>
    {#each intermediateRangesUpper as severityValueRange, index}
      <div class="severity-row" title="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.color(index + 1, severityLevels - 1)}" />
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row" title="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(severityLevels, severityLevels)}" />
      <input
        class="severity-value-end-input"
        type="number"
        data-id="userMiddleMin"
        title="userMiddleMin"
        required
        on:change={handleUpdate}
        bind:this={userMiddleInputMin}
        bind:value={userMiddleMin} />
      <input
        class="severity-value-end-input"
        type="number"
        data-id="userMiddleMax"
        title="userMiddleMax"
        required
        on:change={handleUpdate}
        bind:this={userMiddleInputMax}
        bind:value={userMiddleMax} />
    </div>

    {#each intermediateRangesLower as severityValueRange, index}
      <div class="severity-row" title="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.colorInverse(index + 1, severityLevels - 1)}" />
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row" title="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(0, severityLevels)}" />
      <input
        class="severity-value-end-input"
        type="number"
        data-id="userMax"
        title="End of gradient"
        required
        bind:value={userMax}
        bind:this={userMaxInput}
        on:change={handleUpdate} />
      <div class="severity-value-end" id="absoluteMax" title="">
        &lt;
      </div>
    </div>
    <div class="button-row">
      <button
        class="level-quantity-button"
        bind:this={addButton}
        on:click={addLevel}
        disabled={buttonsDisabled || severityLevels >= 8}>
        +
      </button>
      <button
        class="update-overlay-button"
        bind:this={updateOverlayButton}
        on:click={updateOverlay}
        disabled={buttonsDisabled}>
        Update
      </button>
      <button
        class="update-overlay-button"
        bind:this={resetOverlayButton}
        on:click={resetOverlay}>
        Reset
      </button>
      <button
        class="level-quantity-button"
        bind:this={minusButton}
        on:click={decrementLevel}
        disabled={buttonsDisabled || severityLevels <= 3}>
        -
      </button>
    </div>
  </div>
</fieldset>
Map range: {$mapMinMapMax.min} - {$mapMinMapMax.max} degree days
<div />
