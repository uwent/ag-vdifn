<script lang="ts">
  import { untrack } from 'svelte';
  import { strToNum } from '@ts/utils';
  import GradientHelper from '@ts/gradientHelper';
  import ColorHelper from '@ts/colorHelper';
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
<fieldset class="text-center p-4 border border-gray-300 rounded-lg bg-white shadow-md">
  <legend class="text-lg font-medium mb-4">Custom Degree-Day Values</legend>

  <!-- Two-point gradient -->
  {#if gradientType === 'two-point'}
    <div class="space-y-4">
      <div class="grid grid-cols-[30px_1fr_1fr] items-center gap-x-4">
        <div class="w-[30px] h-[30px]" style="background: {colorHelper.color(0, twoPointState.levels)}"></div>
        <div class="flex items-center justify-center text-sm bg-gray-200 py-1 px-2 rounded">0</div>
        <input
          type="number"
          class="text-center border border-gray-300 rounded px-2 py-1 shadow-sm"
          required
          bind:this={twoPointState.inputElements[0]}
          bind:value={twoPointState.inputs[0]}
          oninput={validateInputs}
          title="Start of gradient"
        />
      </div>

      {@render intermediateRangesSnippet(twoPointRanges.values, twoPointState.levels)}

      <div class="grid grid-cols-[30px_1fr_1fr] items-center gap-x-4">
        <div class="w-[30px] h-[30px]" style="background: {colorHelper.color(twoPointState.levels, twoPointState.levels)}"></div>
        <input
          type="number"
          class="text-center border border-gray-300 rounded px-2 py-1 shadow-sm"
          required
          bind:this={twoPointState.inputElements[1]}
          bind:value={twoPointState.inputs[1]}
          oninput={validateInputs}
          title="End of gradient"
        />
        <div class="flex items-center justify-center text-sm bg-gray-200 py-1 px-2 rounded">&gt; &gt; &gt;</div>
      </div>
    </div>
  {/if}

  <!-- Three-point gradient -->
  {#if gradientType === 'three-point'}
    <div class="space-y-4">
      <div class="grid grid-cols-[30px_1fr_1fr] items-center gap-x-4">
        <div class="w-[30px] h-[30px]" style="background: {colorHelper.color(0, threePointState.levels)}"></div>
        <div class="flex items-center justify-center text-sm bg-gray-200 py-1 px-2 rounded">0</div>
        <input
          type="number"
          class="text-center border border-gray-300 rounded px-2 py-1 shadow-sm"
          required
          bind:this={threePointState.inputElements[0]}
          bind:value={threePointState.inputs[0]}
          oninput={validateInputs}
          title="Start of gradient"
        />
      </div>

      {@render intermediateRangesSnippet(threePointRanges.lower, threePointState.levels)}

      <div class="grid grid-cols-[30px_1fr_1fr] items-center gap-x-4">
        <div class="w-[30px] h-[30px]" style="background: {colorHelper.color(threePointState.levels, threePointState.levels)}"></div>
        <input
          type="number"
          class="text-center border border-gray-300 rounded px-2 py-1 shadow-sm"
          required
          bind:this={threePointState.inputElements[1]}
          bind:value={threePointState.inputs[1]}
          oninput={validateInputs}
          title="Lower middle range"
        />
        <input
          type="number"
          class="text-center border border-gray-300 rounded px-2 py-1 shadow-sm"
          required
          bind:this={threePointState.inputElements[2]}
          bind:value={threePointState.inputs[2]}
          oninput={validateInputs}
          title="Upper middle range"
        />
      </div>

      {@render intermediateRangesSnippet(threePointRanges.upper, threePointState.levels)}

      <div class="grid grid-cols-[30px_1fr_1fr] items-center gap-x-4">
        <div class="w-[30px] h-[30px]" style="background: {colorHelper.color(0, threePointState.levels)}"></div>
        <input
          type="number"
          class="text-center border border-gray-300 rounded px-2 py-1 shadow-sm"
          required
          bind:this={threePointState.inputElements[3]}
          bind:value={threePointState.inputs[3]}
          oninput={validateInputs}
          title="End of gradient"
        />
        <div class="flex items-center justify-center text-sm bg-gray-200 py-1 px-2 rounded">&gt; &gt; &gt;</div>
      </div>
    </div>
  {/if}

  <!-- Button Row -->
  <div class="flex justify-center gap-3 mt-6">
    <button
      class="w-8 py-1 px-2 bg-blue-500 text-white text-sm rounded shadow hover:bg-blue-600 disabled:bg-gray-400"
      title="Add levels to gradient"
      onclick={() => changeLevels(1)}
      disabled={buttonsDisabled || currentState.levels >= opts.maxLevels}
    >+
    </button>
    <button
      class="flex-1 px-4 py-1 bg-gray-500 text-white text-sm rounded shadow hover:bg-gray-600"
      title="Evenly space gradient across map"
      onclick={resetValues}
    >Auto
    </button>
    <button
      class="flex-1 px-4 py-1 bg-gray-500 text-white text-sm rounded shadow hover:bg-gray-600"
      title="Reset to defaults"
      onclick={resetAll}
    >Reset
    </button>
    <button
      class="w-8 py-1 px-2 bg-blue-500 text-white text-sm rounded shadow hover:bg-blue-600 disabled:bg-gray-400"
      title="Remove levels from gradient"
      onclick={() => changeLevels(-1)}
      disabled={buttonsDisabled || currentState.levels <= opts.minLevels}
    >-
    </button>
  </div>

  {#if gradientValidationMessage}
    <div class="text-sm italic text-red-600 mt-3">{gradientValidationMessage}</div>
  {/if}
</fieldset>
