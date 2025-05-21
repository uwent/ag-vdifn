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
<fieldset class="border border-gray-300 p-4 rounded-md" title="Gradient specification">
  <legend class="font-semibold text-base mb-2">Custom Degree-Day Values</legend>

  {#if gradientType === 'two-point'}
    <div class="space-y-2">
      <div class="grid grid-cols-[26px_1fr_1fr] gap-x-4 items-center text-center">
        <div
          class="w-[30px] h-[30px]"
          style="background: {colorHelper.color(0, twoPointState.levels)}"
        ></div>
        <div class="flex items-center justify-center text-sm bg-gray-200 shadow w-full">0</div>
        <input
          type="number"
          class="flex items-center justify-center text-sm bg-white shadow w-full text-center border border-gray-300 px-2 py-1"
          title="Start of gradient"
          required
          bind:this={twoPointState.inputElements[0]}
          bind:value={twoPointState.inputs[0]}
          oninput={validateInputs}
        />
      </div>

      {#each twoPointRanges.values as range, index}
        <div class="grid grid-cols-[26px_1fr] gap-x-4 items-center text-center">
          <div
            class="w-[30px] h-[30px]"
            style="background: {colorHelper.color(index + 1, twoPointState.levels)}"
          ></div>
          <div class="flex items-center justify-center text-sm bg-gray-200 shadow w-full">
            {`${range[0]} - ${range[1]}`}
          </div>
        </div>
      {/each}

      <div class="grid grid-cols-[26px_1fr_1fr] gap-x-4 items-center text-center">
        <div
          class="w-[30px] h-[30px]"
          style="background: {colorHelper.color(twoPointState.levels, twoPointState.levels)}"
        ></div>
        <input
          type="number"
          class="flex items-center justify-center text-sm bg-white shadow w-full text-center border border-gray-300 px-2 py-1"
          title="End of gradient"
          required
          bind:this={twoPointState.inputElements[1]}
          bind:value={twoPointState.inputs[1]}
          oninput={validateInputs}
        />
        <div class="flex items-center justify-center text-sm bg-gray-200 shadow w-full">
          &gt;&gt;&gt;
        </div>
      </div>
    </div>
  {/if}

  {#if gradientType === 'three-point'}
    <div class="space-y-2">
      <div class="grid grid-cols-[1fr_26px] gap-x-4 items-center text-center">
        <div class="flex items-center justify-center text-sm bg-gray-200 shadow w-full">0</div>
        <div
          class="w-[30px] h-[30px]"
          style="background: {colorHelper.color(0, threePointState.levels)}"
        ></div>
      </div>
      <div class="grid grid-cols-[1fr_26px] gap-x-4 items-center text-center">
        <input
          type="number"
          class="flex items-center justify-center text-sm bg-white shadow w-full text-center border border-gray-300 px-2 py-1"
          title="Start of gradient"
          required
          bind:this={threePointState.inputElements[0]}
          bind:value={threePointState.inputs[0]}
          oninput={validateInputs}
        />
        <div></div>
      </div>

      {#each threePointRanges.lower as range, index}
        <div class="grid grid-cols-[1fr_26px] gap-x-4 items-center text-center">
          <div class="flex items-center justify-center text-sm bg-gray-200 shadow w-full">
            {`${range[0]} - ${range[1]}`}
          </div>
          <div
            class="w-[30px] h-[30px]"
            style="background: {colorHelper.color(index + 1, threePointState.levels)}"
          ></div>
        </div>
      {/each}

      <div class="grid grid-cols-[1fr_26px] gap-x-4 items-center text-center">
        <div class="flex flex-col gap-1">
          <input
            type="number"
            class="flex items-center justify-center text-sm bg-white shadow w-full text-center border border-gray-300 px-2 py-1"
            title="Lower middle range"
            required
            bind:this={threePointState.inputElements[1]}
            bind:value={threePointState.inputs[1]}
            oninput={validateInputs}
          />
          <input
            type="number"
            class="flex items-center justify-center text-sm bg-white shadow w-full text-center border border-gray-300 px-2 py-1"
            title="Upper middle range"
            required
            bind:this={threePointState.inputElements[2]}
            bind:value={threePointState.inputs[2]}
            oninput={validateInputs}
          />
        </div>
        <div
          class="w-[30px] h-[30px]"
          style="background: {colorHelper.color(threePointState.levels, threePointState.levels)}"
        ></div>
      </div>

      {#each threePointRanges.upper as range, index}
        <div class="grid grid-cols-[1fr_26px] gap-x-4 items-center text-center">
          <div class="flex items-center justify-center text-sm bg-gray-200 shadow w-full">
            {`${range[0]} - ${range[1]}`}
          </div>
          <div
            class="w-[30px] h-[30px]"
            style="background: {colorHelper.color(index + 1, threePointState.levels)}"
          ></div>
        </div>
      {/each}

      <div class="grid grid-cols-[1fr_26px] gap-x-4 items-center text-center">
        <input
          type="number"
          class="flex items-center justify-center text-sm bg-white shadow w-full text-center border border-gray-300 px-2 py-1"
          title="End of gradient"
          required
          bind:this={threePointState.inputElements[3]}
          bind:value={threePointState.inputs[3]}
          oninput={validateInputs}
        />
        <div
          class="w-[30px] h-[30px]"
          style="background: {colorHelper.color(0, threePointState.levels)}"
        ></div>
      </div>
    </div>
  {/if}

  <div class="flex justify-evenly gap-2 mt-4">
    <button
      class="w-8 bg-gradient-to-b from-[#249dde] to-[#1c87c9] border border-gray-500 text-white text-sm py-2 rounded shadow-inner hover:from-[#1c87c9] hover:to-[#176da8] disabled:bg-gray-400 disabled:cursor-not-allowed"
      onclick={() => changeLevels(1)}
      disabled={buttonsDisabled || currentState.levels >= opts.maxLevels}
    >
      +
    </button>
    <button
      class="flex-1 bg-gradient-to-b from-[#249dde] to-[#1c87c9] border border-gray-500 text-white text-sm py-2 rounded shadow-inner hover:from-[#1c87c9] hover:to-[#176da8] disabled:bg-gray-400 disabled:cursor-not-allowed"
      onclick={resetValues}
    >
      Auto
    </button>
    <button
      class="flex-1 bg-gradient-to-b from-[#249dde] to-[#1c87c9] border border-gray-500 text-white text-sm py-2 rounded shadow-inner hover:from-[#1c87c9] hover:to-[#176da8] disabled:bg-gray-400 disabled:cursor-not-allowed"
      onclick={resetAll}
    >
      Reset
    </button>
    <button
      class="w-8 bg-gradient-to-b from-[#249dde] to-[#1c87c9] border border-gray-500 text-white text-sm py-2 rounded shadow-inner hover:from-[#1c87c9] hover:to-[#176da8] disabled:bg-gray-400 disabled:cursor-not-allowed"
      onclick={() => changeLevels(-1)}
      disabled={buttonsDisabled || currentState.levels <= opts.minLevels}
    >
      -
    </button>
  </div>

  {#if gradientValidationMessage}
    <div class="mt-2 text-sm italic text-red-600 text-center">
      {gradientValidationMessage}
    </div>
  {/if}
</fieldset>
