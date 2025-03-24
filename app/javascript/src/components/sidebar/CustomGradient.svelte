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
    margin-top: 1rem;
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
  import { untrack } from 'svelte';
  import { strToNum } from '@ts/utils';
  import GradientHelper from '@components/map/ts/gradientHelper';
  import ColorHelper from '@components/map/ts/colorHelper';
  import {
    mapRange,
    overlayGradient,
    twoPointGradientState,
    threePointGradientState,
    selectedPalette,
    customPanelState,
  } from '@store';
  import type { GradientType, MapRange } from '@types';

  const opts = {
    defaultLevels: 5,
    minLevels: 3,
    maxLevels: 8,
  };

  let twoPointState = $state(
    $twoPointGradientState || {
      levels: opts.defaultLevels,
      values: [0, 0],
      inputs: [0, 0],
      inputElements: [] as HTMLInputElement[],
    },
  );
  let threePointState = $state(
    $threePointGradientState || {
      levels: opts.defaultLevels,
      values: [0, 0, 0, 0],
      inputs: [0, 0, 0, 0],
      inputElements: [] as HTMLInputElement[],
    },
  );
  let buttonsDisabled = $state(false);
  let gradientValidationMessage = $state('');

  // Derived values
  let gradientType = $derived<GradientType>($customPanelState.selectedGradient);
  let currentState = $derived(gradientType === 'two-point' ? twoPointState : threePointState);
  let gradientHelper = $derived(new GradientHelper($selectedPalette));
  let colorHelper = $derived(new ColorHelper($selectedPalette));

  // Generate intermediate values for display
  let twoPointRanges = $derived.by(() => {
    const state = twoPointState;
    const { intermediateValues: values } = gradientHelper.gradientValues({
      min: state.values[0],
      max: state.values[1],
      intermediateLevels: state.levels - 2,
    });
    return { values };
  });

  let threePointRanges = $derived.by(() => {
    const state = threePointState;
    const { intermediateValues: lower } = gradientHelper.gradientValues({
      min: state.values[0],
      max: state.values[1],
      intermediateLevels: state.levels - 2,
    });
    const { intermediateValues: upper } = gradientHelper.gradientValues({
      min: state.values[2],
      max: state.values[3],
      intermediateLevels: state.levels - 2,
    });
    return { lower, upper };
  });

  // Generate gradient colors
  let gradient = $derived.by(() => {
    const args =
      gradientType === 'two-point'
        ? {
            min: twoPointState.values[0],
            max: twoPointState.values[1],
            totalLevels: twoPointState.levels,
          }
        : {
            min: threePointState.values[0],
            middleMin: threePointState.values[1],
            middleMax: threePointState.values[2],
            max: threePointState.values[3],
            totalLevels: threePointState.levels,
          };
    return gradientHelper.mapRangeToColors(args);
  });

  // Populate user values from map range
  function setTwoPointRange(range: MapRange) {
    const x = (range.max - range.min) / twoPointState.levels;
    twoPointState.inputs = [Math.floor(range.min + x), Math.ceil(range.max - x)];
    validateInputs();
  }

  function setThreePointRange(range: MapRange) {
    const x = (range.max - range.min) / (threePointState.levels * 2 - 1);
    threePointState.inputs = [
      Math.round(range.min + x),
      Math.round((range.min + range.max) / 2 - x / 2),
      Math.round((range.min + range.max) / 2 + x / 2),
      Math.round(range.max - x),
    ];
    validateInputs();
  }

  // Validate inputs
  function validateInputs() {
    validateTwoPointInputs();
    validateThreePointInputs();
  }

  function validateTwoPointInputs() {
    const min = strToNum(twoPointState.inputs[0]);
    const max = strToNum(twoPointState.inputs[1]);

    let minMsg = '';
    let maxMsg = '';

    if (isNaN(min)) minMsg = 'No minimum value entered.';
    else if (min < 0) minMsg = 'Minimum must be greater than zero.';
    else if (min > max) minMsg = 'Minimum must be less than maximum.';

    if (isNaN(max)) maxMsg = 'No maximum value entered.';
    else if (max <= min) maxMsg = 'Maximum must be greater than the minimum.';

    twoPointState.inputElements[0]?.setCustomValidity(minMsg);
    twoPointState.inputElements[1]?.setCustomValidity(maxMsg);

    gradientValidationMessage = `${minMsg} ${maxMsg}`.trim();
    buttonsDisabled = !!gradientValidationMessage;

    if (!buttonsDisabled) twoPointState.values = [min, max];
  }

  function validateThreePointInputs() {
    const ranges = threePointState.inputs.map(strToNum).concat([Infinity]);
    let messages = [''];

    for (let i = 0; i <= 3; i++) {
      let msg = '';
      if (isNaN(ranges[i])) {
        msg = 'Please enter a number in each field.';
        messages.push(msg);
      } else if (i === 0 && ranges[0] < 0) {
        msg = 'Minimum value must be greater than zero.';
        messages.push(msg);
      } else if (i > 0 && ranges[i] <= ranges[i - 1]) {
        msg = 'All values must be in ascending order.';
        messages.push(msg);
      }
      if (threePointState.inputElements[i])
        threePointState.inputElements[i]?.setCustomValidity(msg);
    }

    gradientValidationMessage = [...new Set(messages)].join(' ').trim();
    buttonsDisabled = !!gradientValidationMessage;

    if (!buttonsDisabled) threePointState.values = ranges.slice(0, 4);
  }

  // Button handlers
  function resetValues() {
    if ($mapRange) {
      setTwoPointRange($mapRange);
      setThreePointRange($mapRange);
    }
  }

  function resetAll() {
    twoPointState.levels = opts.defaultLevels;
    threePointState.levels = opts.defaultLevels;
    resetValues();
  }

  function changeLevels(x: -1 | 1) {
    if (gradientType === 'two-point') {
      if (twoPointState.levels + x > opts.maxLevels) return;
      twoPointState.levels += x;
    } else {
      if (threePointState.levels + x > opts.maxLevels) return;
      threePointState.levels += x;
    }
    resetValues();
  }

  // reset values on map range change
  $effect(() => {
    if ($mapRange) {
      untrack(() => {
        setTwoPointRange($mapRange);
        setThreePointRange($mapRange);
      });
    }
  });

  // Update gradient store
  $effect(() => {
    if (gradient) $overlayGradient = gradient;
  });

  $effect(() => {
    $twoPointGradientState = {
      ...twoPointState,
      range: $mapRange,
    };
  });

  $effect(() => {
    $threePointGradientState = {
      ...threePointState,
      range: $mapRange,
    };
  });
</script>

{#snippet intermediateRangesSnippet(ranges: number[][], totalLevels: number)}
  {#each ranges as range, index}
    <div class="severity-row">
      <div
        class="severity-color"
        style="background: {colorHelper.color(index + 1, totalLevels)}"
      ></div>
      <div class="severity-value-intermediate">
        {`${range[0]} - ${range[1]}`}
      </div>
    </div>
  {/each}
{/snippet}

<fieldset title="Gradient specification">
  <legend>Custom Degree-Day Values</legend>

  {#if gradientType === 'two-point'}
    <div class="custom-values-wrapper">
      <div class="severity-row">
        <div
          class="severity-color"
          style="background: {colorHelper.color(0, twoPointState.levels)}"
        ></div>
        <div class="severity-value-end">0</div>
        <input
          type="number"
          class="severity-value-end-input"
          title="Start of gradient"
          required
          bind:this={twoPointState.inputElements[0]}
          bind:value={twoPointState.inputs[0]}
          oninput={validateInputs}
        />
      </div>

      {@render intermediateRangesSnippet(twoPointRanges.values, twoPointState.levels)}

      <div class="severity-row">
        <div
          class="severity-color"
          style="background: {colorHelper.color(twoPointState.levels, twoPointState.levels)}"
        ></div>
        <input
          type="number"
          class="severity-value-end-input"
          title="End of gradient"
          required
          bind:this={twoPointState.inputElements[1]}
          bind:value={twoPointState.inputs[1]}
          oninput={validateInputs}
        />
        <div class="severity-value-end">&gt; &gt; &gt;</div>
      </div>
    </div>
  {/if}

  {#if gradientType === 'three-point'}
    <div class="custom-values-wrapper">
      <div class="severity-row">
        <div
          class="severity-color"
          style="background: {colorHelper.color(0, threePointState.levels)}"
        ></div>
        <div class="severity-value-end">0</div>
        <input
          type="number"
          class="severity-value-end-input"
          title="Start of gradient"
          required
          bind:this={threePointState.inputElements[0]}
          bind:value={threePointState.inputs[0]}
          oninput={validateInputs}
        />
      </div>

      {@render intermediateRangesSnippet(threePointRanges.lower, threePointState.levels)}

      <div class="severity-row">
        <div
          class="severity-color"
          style="background: {colorHelper.color(threePointState.levels, threePointState.levels)}"
        ></div>
        <input
          type="number"
          class="severity-value-end-input"
          title="Lower middle range"
          required
          bind:this={threePointState.inputElements[1]}
          bind:value={threePointState.inputs[1]}
          oninput={validateInputs}
        />
        <input
          type="number"
          class="severity-value-end-input"
          title="Upper middle range"
          required
          bind:this={threePointState.inputElements[2]}
          bind:value={threePointState.inputs[2]}
          oninput={validateInputs}
        />
      </div>

      {@render intermediateRangesSnippet(threePointRanges.upper, threePointState.levels)}

      <div class="severity-row">
        <div
          class="severity-color"
          style="background: {colorHelper.color(0, threePointState.levels)}"
        ></div>
        <input
          type="number"
          class="severity-value-end-input"
          title="End of gradient"
          required
          bind:this={threePointState.inputElements[3]}
          bind:value={threePointState.inputs[3]}
          oninput={validateInputs}
        />
        <div class="severity-value-end">&gt; &gt; &gt;</div>
      </div>
    </div>
  {/if}

  <div class="button-row">
    <button
      class="level-quantity-button"
      title="Add levels to gradient"
      onclick={() => changeLevels(1)}
      disabled={buttonsDisabled || currentState.levels >= opts.maxLevels}
    >
      +
    </button>
    <button
      class="update-overlay-button"
      title="Evenly space gradient across map"
      onclick={resetValues}
    >
      Balance
    </button>
    <button class="update-overlay-button" title="Reset to defaults" onclick={resetAll}>
      Reset
    </button>
    <button
      class="level-quantity-button"
      title="Remove levels from gradient"
      onclick={() => changeLevels(-1)}
      disabled={buttonsDisabled || currentState.levels <= opts.minLevels}
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
