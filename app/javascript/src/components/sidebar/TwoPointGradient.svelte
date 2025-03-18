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
    gap: 5px;
  }

  .level-quantity-button {
    @extend %severity-button;
    width: 2rem;
  }

  .update-overlay-button {
    @extend %severity-button;
    flex: 1;
  }
</style>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { strToNum } from '@ts/utils';
  import GradientHelper from '@components/map/ts/gradientHelper';
  import ColorHelper from '@components/map/ts/colorHelper';
  import { mapRange, overlayGradient, twoPointGradientState } from '@store';

  const gradientHelper = new GradientHelper();
  const opts = {
    defaultLevels: 5,
    minLevels: 3,
    maxLevels: 8,
  };

  let inputMinValue: HTMLInputElement;
  let inputMaxValue: HTMLInputElement;

  let severityLevels = $state(opts.defaultLevels);
  let userValues = $state([0, 0]);
  let userInputs = $state([0, 0]);
  let buttonsDisabled = $state(false);
  let gradientValidationMessage = $state('');

  let intermediateRanges = $derived.by<number[][]>(() => {
    const { intermediateValues: values } = gradientHelper.gradientValues({
      min: userValues[0],
      max: userValues[1],
      intermediateLevels: severityLevels - 2,
    });
    return values;
  });

  let gradient = $derived.by(() => {
    return gradientHelper.mapRangeToColors({
      min: userValues[0],
      max: userValues[1],
      totalLevels: severityLevels,
    });
  });

  // populate user values from map range
  function setMinMaxFromRange(range: { min: number; max: number }) {
    const x = (range.max - range.min) / severityLevels;
    userValues = userInputs = [Math.floor(range.min + x), Math.ceil(range.max - x)];
    validateInputs();
  }

  function validateInputs() {
    const min = strToNum(userInputs[0]);
    const max = strToNum(userInputs[1]);
    const minMsg = validateMin(min, max);
    const maxMsg = validateMax(min, max);
    inputMinValue.setCustomValidity(minMsg);
    inputMaxValue.setCustomValidity(maxMsg);
    gradientValidationMessage = `${minMsg} ${maxMsg}`.trim();
    buttonsDisabled = !!gradientValidationMessage;
    if (!buttonsDisabled) userValues = [min, max];
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

  // handle buttons
  function resetValues() {
    if ($mapRange) setMinMaxFromRange($mapRange);
  }

  function resetAll() {
    severityLevels = opts.defaultLevels;
    resetValues();
  }

  function moreLevels() {
    if (severityLevels + 1 > opts.maxLevels) return;
    severityLevels += 1;
    resetValues();
  }

  function lessLevels() {
    if (severityLevels - 1 < opts.minLevels) return;
    severityLevels -= 1;
    resetValues();
  }

  // either reloads previous values or sets defaults
  onMount(() => {
    const state = $twoPointGradientState;
    const range = $mapRange;
    if (state && range && state.range === range) {
      severityLevels = state.severityLevels || opts.defaultLevels;
      userInputs = state.userValues || [];
      validateInputs();
    } else {
      resetValues();
    }
  });

  // save state
  onDestroy(() => {
    $twoPointGradientState = {
      severityLevels,
      userValues,
      range: $mapRange,
      gradient,
    };
  });

  // update gradient store
  $effect(() => {
    if (gradient) $overlayGradient = gradient;
  });
</script>

<fieldset title="Gradient specification">
  <legend>Custom Degree-Day Values</legend>
  <div class="custom-values-wrapper">
    <div class="severity-row">
      <div class="severity-color" style="background: {ColorHelper.color(0, severityLevels)}"></div>
      <div class="severity-value-end">0</div>
      <input
        type="number"
        class="severity-value-end-input"
        title="Start of gradient"
        required
        bind:this={inputMinValue}
        bind:value={userInputs[0]}
        oninput={validateInputs}
      />
    </div>
    {#each intermediateRanges as severityValueRange, index}
      <div class="severity-row">
        <div
          class="severity-color"
          style="background: {ColorHelper.color(index + 1, severityLevels)}"
        ></div>
        <div class="severity-value-intermediate">
          {`${severityValueRange[0]} - ${severityValueRange[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row">
      <div
        class="severity-color"
        style="background: {ColorHelper.color(severityLevels, severityLevels)}"
      ></div>
      <input
        type="number"
        class="severity-value-end-input"
        title="End of gradient"
        required
        bind:this={inputMaxValue}
        bind:value={userInputs[1]}
        oninput={validateInputs}
      />
      <div class="severity-value-end">&gt; &gt; &gt;</div>
    </div>
  </div>
  <div class="button-row">
    <button
      class="level-quantity-button"
      title="Add levels to gradient"
      onclick={moreLevels}
      disabled={buttonsDisabled || severityLevels >= opts.maxLevels}
    >
      +
    </button>
    <button
      class="update-overlay-button"
      title="Evenly space gradient across map"
      onclick={resetValues}>Balance</button
    >
    <button class="update-overlay-button" title="Reset to defaults" onclick={resetAll}>
      Reset
    </button>
    <button
      class="level-quantity-button"
      title="Remove levels from gradient"
      onclick={lessLevels}
      disabled={buttonsDisabled || severityLevels <= opts.minLevels}
    >
      -
    </button>
  </div>
  {#if gradientValidationMessage}
    <div class="validation-msg">
      {gradientValidationMessage}
    </div>
  {/if}
</fieldset>
