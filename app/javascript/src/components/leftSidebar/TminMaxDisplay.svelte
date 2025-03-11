<style lang="scss">
  #t-min-wrapper {
    width: 50%;
  }

  #tMinMaxRange {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    display: flex;
    justify-content: space-between;
  }

  #degree_day_info {
    margin-top: 0.5em;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .label {
    padding: 0 5px;
    color: #484848;
    font-size: 0.75em;
  }

  .t-min-wrapper,
  .t-max-wrapper {
    width: 50%;
    text-align: center;
  }

  .t-min-wrapper {
    margin-right: 10px;
  }

  .tmin,
  .tmax {
    background-color: rgba(255, 255, 255, 0.7);
    background: #d0d0d0;
    padding: 5px;
    margin-top: 3px;
    border-radius: 0;
    border: 1px solid #d0d0d0;
    color: #525252;
    cursor: default;
    text-align: center;
  }

  .in-celcius {
    padding-left: 0.3em;
  }

  .in-fahrenheit {
    float: right;
    margin-right: 1.2em;
  }

  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    margin-left: 0;

    /* Hide default HTML checkbox */
    input {
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #6c6c6c;
    transition: 0.4s;

    &:before {
      position: absolute;
      content: '';
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
    }
  }

  /* Rounded sliders */
  .round {
    border-radius: 34px;

    &:before {
      border-radius: 50%;
    }
  }

  input:checked + .slider:before {
    transform: translateX(36px);
  }

  .symbol-wrapper {
    font-size: 0.75em;
    display: flex;
    justify-content: space-between;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte';
  import { f_to_c } from '@ts/utils';
  import { panelKey, selectedPest, selectedDDModel, tMinTmax } from '@store';
  import type { Pest, DegreeDayModel } from '@types';

  const { panelType } = getContext<any>(panelKey);

  let in_f = true;
  let tMinF: number | null;
  let tMaxF: number | null;
  let tMinC: number | null;
  let tMaxC: number | null;
  let tMinText = '';
  let tMaxText = '';

  // generate the temperature display text
  function makeText(temp) {
    if (temp === null || temp === undefined) return 'None';
    if (Number.isInteger(temp)) return temp.toFixed(0);
    return temp.toFixed(1);
  }

  // convert between units and update text
  function updateText(in_f: boolean) {
    const opts = in_f
      ? {
          t_min: tMinF,
          t_max: tMaxF,
          in_f: true,
        }
      : {
          t_min: tMinC,
          t_max: tMaxC,
          in_f: false,
        };
    $tMinTmax = opts;
    tMinText = makeText(opts.t_min);
    tMaxText = makeText(opts.t_max);
  }

  // Sets temperature values and updates display text
  function setTminTmax(model: Pest | DegreeDayModel) {
    if (model) {
      tMinF = model.t_min;
      tMaxF = model.t_max;
      tMinC = f_to_c(tMinF);
      tMaxC = f_to_c(tMaxF);
      updateText(in_f);
    }
  }

  $: updateText(in_f);
  $: setTminTmax(panelType === 'custom' ? $selectedDDModel : $selectedPest);
</script>

<div id="degree_day_info">
  <div class="temp-group" id="t-min-wrapper">
    <div id="tMinMaxRange">
      <div class="t-min-wrapper">
        <div class="label">Tmin</div>
        <div title="Min temp" class="tmin">{tMinText}</div>
      </div>
      <div class="t-max-wrapper">
        <div class="label">Tmax</div>
        <div title="Max temp" class="tmax">{tMaxText}</div>
      </div>
    </div>
  </div>
  <div title="Units" class="temp-group" id="in-fahren-wrapper">
    <div class="symbol-wrapper">
      <span class="in-celcius">&#8451;</span>
      <span class="in-fahrenheit">&#8457;</span>
    </div>
    <label class="switch">
      <input type="checkbox" title="temp-unit-toggle" bind:checked={in_f} />
      <span class="slider round"></span>
    </label>
  </div>
</div>
