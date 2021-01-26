<script lang="ts">
  import GradientHelper from './TypeScript/gradientHelper'
  import ColorHelper from '../../components/map/TypeScript/colorHelper'
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { mapMinMapMax, twoPointGradientState } from '../../store/store'
  import { get } from 'svelte/store'
  const _ = require('lodash')
  const dispatch = createEventDispatcher()
  let gradientHelper = new GradientHelper()
  let severityLevels: number = 5
  let userMin: number
  let userMax: number
  let userMinInputValue: number
  let userMaxInputValue: number
  let intermediateRanges: number[][] = []
  let addButton: HTMLInputElement
  let minusButton: HTMLInputElement
  let userMinInput: HTMLInputElement
  let userMaxInput: HTMLInputElement
  let updateOverlayButton: HTMLButtonElement
  let resetOverlayButton: HTMLButtonElement
  let buttonsDisabled: boolean = false

  $: setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)

  // onMount(() => {
  //   const state = get(twoPointGradientState)
  //   if (_.size(state) > 0) {
  //     severityLevels = state.severityLevels
  //     if (state.mapMin === $mapMinMapMax.min && state.mapMax === $mapMinMapMax.max) {
  //       userMin = state.userMin
  //       userMax = state.userMax
  //     } else {
  //       setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
  //     }
  //   } else {
  //     setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
  //   }
  //   validateInputs()
  // })

  onMount(() => {
    const state = get(twoPointGradientState)
    if (_.size(state) > 0) {
      severityLevels = state.severityLevels
      userMinInputValue = state.userMin
      userMaxInputValue = state.userMax
      validateInputs()
    } else {
      setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
      updateIntermediateValues()
    }
  })

  onDestroy(() => {
    twoPointGradientState.set({
      severityLevels,
      userMin,
      userMax,
      mapMax: get(mapMinMapMax).max || 0,
      mapMin: get(mapMinMapMax).min || 0,
      gradient: getGradient(),
    })
  })

  function setUserMinMax(mapMin, mapMax) {
    const x = (mapMax - mapMin) / (severityLevels)
    userMin = userMinInputValue = Math.round(mapMin + x)
    userMax = userMaxInputValue = Math.round(mapMax - x)
    updateIntermediateValues()
  }

  function updateIntermediateValues() {
    const { intermediateValues } = gradientHelper.gradientValues({
      min: userMin,
      max: userMax,
      intermediateLevels: severityLevels - 2,
    })
    intermediateRanges = intermediateValues
  }

  function addLevel() {
    if (severityLevels + 1 > 8) return
    severityLevels += 1
    updateIntermediateValues()
  }

  function decrementLevel() {
    if (severityLevels - 1 < 3) return
    severityLevels -= 1
    updateIntermediateValues()
  }

  // function validateMinInput(value: number | typeof NaN): boolean {
  //   if (isNaN(value) || value === null) {
  //     userMaxInput.setCustomValidity('No value entered')
  //     return false
  //   } else if (value > userMax) {
  //     userMinInput.setCustomValidity('This value must be less than the chosen maximum')
  //     return false
  //   } else if (value < 0) {
  //     userMinInput.setCustomValidity('This value must be greater than 0')
  //     return false
  //   } else {
  //     userMinInput.setCustomValidity('')
  //     return true
  //   }
  // }

  // function validateMaxInput(value: number | typeof NaN): boolean {
  //   if (isNaN(value) || value === null) {
  //     userMaxInput.setCustomValidity('No value entered')
  //     return false
  //   } else if (value < userMin) {
  //     userMaxInput.setCustomValidity('This value must be greater than the chosen mininum')
  //     return false
  //   } else {
  //     userMaxInput.setCustomValidity('')
  //     return true
  //   }
  // }

  function validateInputs() {

    if (isNaN(userMinInputValue)) {
      userMinInput.setCustomValidity('No value entered')
    } else if (userMinInputValue > userMaxInputValue) {
      userMinInput.setCustomValidity('This value must be less than the chosen maximum')
    } else if (userMinInputValue < 0) {
      userMinInput.setCustomValidity('This value must be greater than 0')
    } else {
      userMinInput.setCustomValidity('')
      userMin = userMinInputValue
    }

    if (isNaN(userMaxInputValue)) {
      userMaxInput.setCustomValidity('No value entered')
    } else if (userMaxInputValue < userMinInputValue) {
      userMaxInput.setCustomValidity('This value must be greater than the chosen mininum')
    } else {
      userMaxInput.setCustomValidity('')
      userMax = userMaxInputValue
    }

    if (userMinInput.validationMessage || userMaxInput.validationMessage) {
      buttonsDisabled = true
    } else {
      buttonsDisabled = false
      updateIntermediateValues()
    }

  }


  // function handleUpdate(event) {
  //   const { valueAsNumber } = event.target
  //   if (event.target.name === 'userMin') {
  //     updateUserMin(valueAsNumber)
  //     updateUserMax(userMax)
  //   } else {
  //     updateUserMin(userMin)
  //     updateUserMax(valueAsNumber)
  //   }
  // }

  // function handleUpdate(event) {
  //   const { valueAsNumber } = event.target
  //   if (event.target.name === 'userMin') {
  //     updateUserValues(valueAsNumber)
  //     updateUserMax(userMax)
  //   } else {
  //     updateUserMin(userMin)
  //     updateUserMax(valueAsNumber)
  //   }
  // }

  // function updateButtons() {
  //   if (userMinInput.validationMessage || userMaxInput.validationMessage) {
  //     buttonsDisabled = true
  //   } else {
  //     buttonsDisabled = false
  //   }
  // }

  // function updateUserMin(value: number) {
  //   if (validateMinInput(value)) {
  //     userMin = value
  //     updateIntermediateValues()
  //   }
  //   updateButtons()
  // }

  // function updateUserMax(value: number) {
  //   if (validateMaxInput(value)) {
  //     userMax = value
  //     updateIntermediateValues()
  //   }
  //   updateButtons()
  // }

  // function updateMinMax(min: number, max: number) {
  //   if (validateMinInput(min)) userMin = min
  //   if (validateMaxInput(max)) userMax = max
  //   updateButtons()
  // }

  function getGradient() {
    return gradientHelper.mapRangeToColors({
      min: userMin,
      max: userMax,
      totalLevels: severityLevels,
    })
  }

  // function resetOverlay() {
  //   setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
  //   updateUserMin(userMin)
  //   updateUserMax(userMax)
  //   updateOverlay()
  // }

  function resetOverlay() {
    setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max)
    validateInputs()
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
        name="userMin"
        data-testid="userMinInput"
        type="number"
        required
        bind:this={userMinInput}
        on:change={validateInputs}
        bind:value={userMinInputValue} />
    </div>
    {#each intermediateRanges as severityValueRange, index}
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
        title="End of gradient"
        name="userMax"
        data-testid="userMaxInput"
        type="number"
        required
        bind:this={userMaxInput}
        on:change={validateInputs}
        bind:value={userMaxInputValue} />
      <div class="severity-value-end">
        &gt; &gt; &gt;
      </div>
    </div>
  </div>
  <div class="button-row">
    <button
      class="level-quantity-button"
      title="Add levels to gradient"
      data-testid="plusButton"
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
</fieldset>
<div title="Map range">
  Map range: {$mapMinMapMax.min} - {$mapMinMapMax.max} degree days
</div>
