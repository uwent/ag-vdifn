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

  button:disabled {
    background: grey;
    cursor: not-allowed;
  }
</style>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import GradientHelper from '@components/map/ts/gradientHelper';
  import ColorHelper from '@components/map/ts/colorHelper';
  import { strToNum } from '@ts/utils';
  import { mapRange, overlayGradient, threePointGradientState, selectedPalette } from '@store';

  // const gradientHelper = new GradientHelper();
  const opts = {
    defaultLevels: 5,
    minLevels: 3,
    maxLevels: 8,
  };

  let gradientHelper = $state(new GradientHelper($selectedPalette));
  let colorHelper = $state(new ColorHelper($selectedPalette));
  let userInputElements = $state<(HTMLInputElement | null)[]>([]);
  let severityLevels = $state(opts.defaultLevels);
  let userValues = $state([0, 0, 0, 0]);
  let userInputs = $state([0, 0, 0, 0]);
  let buttonsDisabled = $state(false);
  let gradientValidationMessage = $state('');

  // generate intermediate values for display
  let intermediateRanges = $derived.by(() => {
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
    return { lower: lower, upper: upper };
  });

  let gradient = $derived.by(() => {
    return gradientHelper.mapRangeToColors({
      min: userValues[0],
      middleMin: userValues[1],
      middleMax: userValues[2],
      max: userValues[3],
      totalLevels: severityLevels,
    });
  });

  // populate user values from map range
  function setMinMaxFromRange(range: { min: number; max: number }) {
    const x = (range.max - range.min) / (severityLevels * 2 - 1);
    userInputs = [
      Math.round(range.min + x),
      Math.round((range.min + range.max) / 2 - x / 2),
      Math.round((range.min + range.max) / 2 + x / 2),
      Math.round(range.max - x),
    ];
    validateInputs();
  }

  // validate inputs, write to values, and update intermediates
  function validateInputs() {
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
    if (!buttonsDisabled) userValues = ranges.slice(0, 4);
  }

  // handle button
  function resetValues() {
    if ($mapRange) setMinMaxFromRange($mapRange);
  }

  function resetAll() {
    severityLevels = opts.defaultLevels;
    resetValues();
  }

  function moreLevels() {
    if (severityLevels > opts.maxLevels) return;
    severityLevels += 1;
    resetValues();
  }

  function lessLevels() {
    if (severityLevels < opts.minLevels) return;
    severityLevels -= 1;
    resetValues();
  }

  // either reloads previous values or sets defaults
  onMount(() => {
    const state = $threePointGradientState;
    const range = $mapRange;
    if (state && range && state.range === range) {
      severityLevels = state.severityLevels || opts.defaultLevels;
      userInputs = state.userValues || [];
      validateInputs();
    } else {
      resetValues();
    }
  });

  onDestroy(() => {
    $threePointGradientState = {
      severityLevels,
      userValues,
      range: $mapRange,
      gradient: gradient,
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
      <div class="severity-color" style="background: {colorHelper.color(0, severityLevels)}"></div>
      <div class="severity-value-end">0</div>
      <input
        type="number"
        class="severity-value-end-input"
        title="Start of gradient"
        required
        bind:this={userInputElements[0]}
        bind:value={userInputs[0]}
        onchange={validateInputs}
        onemptied={validateInputs}
      />
    </div>
    {#each intermediateRanges.lower as range, index}
      <div class="severity-row">
        <div
          class="severity-color"
          style="background: {colorHelper.color(index + 1, severityLevels)}"
        ></div>
        <div class="severity-value-intermediate">
          {`${range[0]} - ${range[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row">
      <div
        class="severity-color"
        style="background: {colorHelper.color(severityLevels, severityLevels)}"
      ></div>
      <input
        type="number"
        class="severity-value-end-input"
        title="Lower middle range"
        required
        bind:this={userInputElements[1]}
        bind:value={userInputs[1]}
        oninput={validateInputs}
      />
      <input
        type="number"
        class="severity-value-end-input"
        title="Upper middle range"
        required
        bind:this={userInputElements[2]}
        bind:value={userInputs[2]}
        oninput={validateInputs}
      />
    </div>
    {#each intermediateRanges.upper as range, index}
      <div class="severity-row">
        <div
          class="severity-color"
          style="background: {colorHelper.colorInverse(index + 1, severityLevels)}"
        ></div>
        <div class="severity-value-intermediate">
          {`${range[0]} - ${range[1]}`}
        </div>
      </div>
    {/each}
    <div class="severity-row">
      <div class="severity-color" style="background: {colorHelper.color(0, severityLevels)}"></div>
      <input
        type="number"
        class="severity-value-end-input"
        title="End of gradient"
        required
        bind:this={userInputElements[3]}
        bind:value={userInputs[3]}
        oninput={validateInputs}
      />
      <div class="severity-value-end">&gt; &gt; &gt;</div>
    </div>
    <div class="button-row">
      <button
        class="level-quantity-button"
        title="Add levels to gradient"
        onclick={moreLevels}
        disabled={buttonsDisabled || severityLevels >= opts.maxLevels}>+</button
      >
      <button
        class="update-overlay-button"
        title="Evenly space gradient across map"
        onclick={resetValues}>Balance</button
      >
      <button class="update-overlay-button" title="Reset to defaults" onclick={resetAll}
        >Reset</button
      >
      <button
        class="level-quantity-button"
        title="Remove levels from gradient"
        onclick={lessLevels}
        disabled={buttonsDisabled || severityLevels <= opts.minLevels}>-</button
      >
    </div>
  </div>
  {#if gradientValidationMessage}
    <div class="validation-msg">
      {gradientValidationMessage}
    </div>
  {/if}
</fieldset>
