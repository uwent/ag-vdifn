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
      if (
        state.absoluteMin === $mapMinMapMax.min &&
        state.mapMax === $mapMinMapMax.max
      ) {
        userMin = state.userMin
        userMax = state.userMax
        userMiddleMin = state.userMiddleMin
        userMiddleMax = state.userMiddleMax
        updateIntermediateValues()
      } else {
        setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
      }
      updateUserMin(userMin)
      updateUserMiddleMin(userMiddleMin)
      updateUserMiddleMax(userMiddleMax)
      updateUserMax(userMax)
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

  function setUserMinMax(mapMin, mapMax) {
    const x = (mapMax - mapMin) / (severityLevels + 2)
    userMin = Math.round(mapMin + x)
    userMax = Math.round(mapMax - x)
    userMiddleMin = Math.round((mapMin + mapMax) / 2 - x / 2)
    userMiddleMax = Math.round((mapMin + mapMax) / 2 + x / 2)
    updateIntermediateValues()
  }

  function updateIntermediateValues() {
    const { intermediateValues: lower } = gradientHelper.gradientValues({
      min: userMin,
      max: userMiddleMin,
      intermediateLevels: severityLevels - 3,
    })
    const { intermediateValues: upper } = gradientHelper.gradientValues({
      min: userMiddleMax,
      max: userMax,
      intermediateLevels: severityLevels - 3,
    })
    intermediateRangesLower = lower
    intermediateRangesUpper = upper
  }

  function addLevel() {
    if (severityLevels + 1 > 8) return
    severityLevels += 1
    updateIntermediateValues()
  }

  function decrementLevel() {
    if (severityLevels - 1 < 4) return
    severityLevels -= 1
    updateIntermediateValues()
  }

  function validateMin(value: number | typeof NaN): boolean {
    if (isNaN(value)) {
      return false
    } else if (value > userMax) {
      userMinInput.setCustomValidity(
        'This value must be less than the chosen maximum value',
      )
      return false
    } else if (value < 0) {
      userMinInput.setCustomValidity('This value must be greater than 0')
      return false
    } else if (value >= userMiddleMin || value >= userMiddleMax) {
      userMinInput.setCustomValidity(
        'This value must be less than both middle values',
      )
      return false
    } else {
      userMinInput.setCustomValidity('')
      return true
    }
  }

  function validateMiddleMin(value: number | typeof NaN): boolean {
    if (isNaN(value)) {
      return false
    } else if (value >= userMiddleMax || value >= userMax) {
      userMiddleInputMin.setCustomValidity(
        'This value must be less than the chosen middle and max',
      )
      return false
    } else if (value <= userMin) {
      userMiddleInputMin.setCustomValidity(
        'This value must be greater the chosen minimum',
      )
      return false
    } else {
      userMiddleInputMin.setCustomValidity('')
      return true
    }
  }

  function validateMiddleMax(value: number | typeof NaN): boolean {
    if (isNaN(value)) {
      return false
    } else if (value <= userMiddleMin || value <= userMin) {
      userMiddleInputMax.setCustomValidity(
        'This value must be greater the middle and min input values',
      )
      return false
    } else if (value >= userMax) {
      userMiddleInputMax.setCustomValidity(
        'This value must be less than the chosen max value',
      )
      return false
    } else {
      userMiddleInputMax.setCustomValidity('')
      return true
    }
  }

  function validateMax(value: number | typeof NaN): boolean {
    if (isNaN(value)) {
      return false
    } else if (value <= userMin) {
      userMaxInput.setCustomValidity(
        'This value must be greater than the chosen min value',
      )
      return false
    } else {
      userMaxInput.setCustomValidity('')
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
    const { name: name, valueAsNumber } = event.target
    if (name === 'userMin') {
      updateUserMin(valueAsNumber)
    } else {
      updateUserMin(userMin)
    }
    if (name === 'userMiddleMin') {
      updateUserMiddleMin(valueAsNumber)
    } else {
      updateUserMiddleMin(userMiddleMin)
    }
    if (name === 'userMiddleMax') {
      updateUserMiddleMax(valueAsNumber)
    } else {
      updateUserMiddleMax(userMiddleMax)
    }
    if (name === 'userMax') {
      updateUserMax(valueAsNumber)
    } else {
      updateUserMax(userMax)
    }
      updateIntermediateValues()
  }

  function updateUserMin(value: number) {
    if (validateMin(value)) userMin = value
    updateButtons()
  }

  function updateUserMax(value: number) {
    if (validateMax(value)) userMax = value
    updateButtons()
  }

  function updateUserMiddleMin(value: number) {
    if (validateMiddleMin(value)) userMiddleMin = value
    updateButtons()
  }

  function updateUserMiddleMax(value: number) {
    if (validateMiddleMax(value)) userMiddleMax = value
    updateButtons()
  }

  function getGradient() {
    return gradientHelper.mapRangeToColors({
      min: userMin,
      middleMin: userMiddleMin,
      middleMax: userMiddleMax,
      max: userMax,
      totalLevels: severityLevels - 1,
    })
  }

  function resetOverlay() {
    setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
    updateUserMin(userMin)
    updateUserMiddleMin(userMiddleMin)
    updateUserMiddleMax(userMiddleMax)
    updateUserMax(userMax)
    updateOverlay()
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

<fieldset title="Gradient specification">
  <legend>Custom Degree-Day Values</legend>
  <div class="custom-values-wrapper">
    <div class="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(0, severityLevels)}" />
      <div class="severity-value-end">
        &lt; &lt; &lt;
      </div>
      <input
        class="severity-value-end-input"
        type="number"
        name="userMin"
        title="Start of gradient"
        required
        bind:this={userMinInput}
        bind:value={userMin}
        on:change={handleUpdate} />
    </div>
    {#each intermediateRangesLower as severityValueRange, index}
      <div class="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.color(index + 1, severityLevels - 1)}" />
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(severityLevels, severityLevels)}" />
      <input
        class="severity-value-end-input"
        type="number"
        name="userMiddleMin"
        title="Lower middle range"
        required
        on:change={handleUpdate}
        bind:this={userMiddleInputMin}
        bind:value={userMiddleMin} />
      <input
        class="severity-value-end-input"
        type="number"
        name="userMiddleMax"
        title="Upper middle range"
        required
        on:change={handleUpdate}
        bind:this={userMiddleInputMax}
        bind:value={userMiddleMax} />
    </div>
    {#each intermediateRangesUpper as severityValueRange, index}
      <div class="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.colorInverse(index + 1, severityLevels - 1)}" />
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(0, severityLevels)}" />
      <input
        class="severity-value-end-input"
        type="number"
        name="userMax"
        title="End of gradient"
        required
        bind:value={userMax}
        bind:this={userMaxInput}
        on:change={handleUpdate} />
      <div class="severity-value-end">
        &gt; &gt; &gt;
      </div>
    </div>
    <div class="button-row">
      <button
        class="level-quantity-button"
        title="Add levels to gradient"
        bind:this={addButton}
        on:click={addLevel}
        disabled={buttonsDisabled || severityLevels >= 8}>
        +
      </button>
      <button
        class="update-overlay-button"
        title="Update grid overlay with new values"
        bind:this={updateOverlayButton}
        on:click={updateOverlay}
        disabled={buttonsDisabled}>
        Update
      </button>
      <button
        class="update-overlay-button"
        title="Reset to defaults"
        bind:this={resetOverlayButton}
        on:click={resetOverlay}>
        Reset
      </button>
      <button
        class="level-quantity-button"
        title="Remove levels from gradient"
        bind:this={minusButton}
        on:click={decrementLevel}
        disabled={buttonsDisabled || severityLevels <= 4}>
        -
      </button>
    </div>
  </div>
</fieldset>
Map range: {$mapMinMapMax.min} - {$mapMinMapMax.max} degree days
<div />
