<style>
  input[type='number'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 99%;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 0;
    border: 1px solid #d0d0d0;
    padding: 5px 0;
    cursor: pointer;
  }

  input:disabled {
    background: #d0d0d0;
    color: #d0d0d0;
    cursor: default;
  }

  input:invalid {
    background: lightcoral;
  }

  #degree_day_info {
    display: flex;
    justify-content: space-evenly;
  }

  .temp-group {
    width: 5em;
    float: left;
  }

  label {
    padding: 0 5px;
    color: #484848;
    font-size: 0.75em;
  }

  #tmax,
  #tmin {
    width: 5em;
    margin-top: 0.3em;
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
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
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
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
  }

  input:checked + .slider:before {
    transform: translateX(36px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .temp-group-tmax {
    display: flex;
    flex-direction: column;
  }

  .tMaxToggle label {
    padding-left: 0;
  }

  .tMaxToggle input {
    margin-left: 0;
  }

  /* .tMinTMaxOptions {
    display: flex;
    margin: 15px;
    overflow: hidden;
    justify-content: center;
  }

  .tMinTMaxOptions input {
    position: absolute !important;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    width: 1px;
    border: 0;
    overflow: hidden;
  }

  .tMinTMaxOptions label {
    background-color: #e4e4e4;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    line-height: 1;
    text-align: center;
    padding: 8px 16px;
    margin-right: -1px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
    transition: all 0.1s ease-in-out;
  }

  .tMinTMaxOptions label:hover {
    cursor: pointer;
  }

  .tMinTMaxOptions input:checked + label {
    background-color: #a5dc86;
    box-shadow: none;
  }

  .tMinTMaxOptions label:first-of-type {
    border-radius: 4px 0 0 4px;
  }

  .tMinTMaxOptions label:last-of-type {
    border-radius: 0 4px 4px 0;
  } */
</style>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { tMinTmax, defaults } from '../../store/store';
  import { f_to_c, c_to_f } from '../common/ts/utils';
  let in_f = $tMinTmax.in_fahrenheit;
  let tMin = $tMinTmax.t_min || defaults.t_min;
  let tMax = $tMinTmax.t_max;
  let tMaxDisabled = $tMinTmax.t_max === null;
  let valid = true;
  const dispatch = createEventDispatcher();

  function convert(event: any) {
    in_f = event.target.checked;
    if (in_f) {
      tMin = c_to_f(tMin);
      tMax = c_to_f(tMax);
    } else {
      tMin = f_to_c(tMin);
      tMax = f_to_c(tMax);
    }
  }

  function tMaxToggle(event: any) {
    tMaxDisabled = event.target.checked;
    if (tMaxDisabled) {
      valid = true;
    } else if (!tMaxDisabled && !tMax) {
      valid = false;
    }
  }

  function validateTmin(event: any) {
    let msg = '';
    const {
      target,
      target: { value },
    } = event;
    if (tMaxDisabled) {
      valid = true;
    } else if (value >= tMax) {
      msg = 'This value must be less than the Tmax';
      valid = false;
    } else {
      tMin = Number(event.target.value);
      valid = true;
    }
    target.setCustomValidity(msg);
    target.title = msg;
  }

  function validateTmax(event: any) {
    let msg = '';
    const {
      target,
      target: { value },
    } = event;
    if (tMaxDisabled) {
      valid = true;
    } else if (value <= tMin) {
      msg = 'This value must be greater than the Tmin';
      valid = false;
    } else {
      tMax = Number(event.target.value);
      valid = true;
    }
    target.setCustomValidity(msg);
    target.title = msg;
  }

  function updateTminTmax(tMin: number, tMax: number, in_f: boolean, tMaxDisabled: boolean) {
    if (tMaxDisabled) {
      tMinTmax.set({
        t_min: tMin,
        t_max: null,
        in_fahrenheit: in_f,
      });
    } else {
      tMinTmax.set({
        t_min: tMin,
        t_max: tMax,
        in_fahrenheit: in_f,
      });
    }
  }

  // onMount(() => {
  // })

  $: dispatch('tMinMaxValid', { valid: valid });
  $: updateTminTmax(tMin, tMax, in_f, tMaxDisabled);
</script>

<div id="degree_day_info">
  <div class="t-minmax-wrapper">
    <div class="temp-group" id="t-min-wrapper">
      <label for="tmin">Tmin</label>
      <input
        on:change={validateTmin}
        type="number"
        id="tmin"
        maxlength="4"
        step="0.1"
        bind:value={tMin}
        title={this.validationMessage}
      />
    </div>
    <div class="temp-group-tmax">
      <div class="temp-group" id="t-max-wrapper">
        <label for="tmax">Tmax</label>
        <input
          on:change={validateTmax}
          type="number"
          id="tmax"
          maxlength="4"
          step="0.1"
          disabled={tMaxDisabled}
          bind:value={tMax}
        />
      </div>
      <div class="tMaxToggle">
        <input id="tMaxToggle" type="checkbox" on:change={tMaxToggle} bind:checked={tMaxDisabled} />
        <label for="tMaxToggle">No Tmax</label>
      </div>
    </div>
  </div>
  <div class="temp-group" id="in-fahren-wrapper">
    <div>
      <span class="in-celcius">&#8451;</span>
      <span class="in-fahrenheit">&#8457;</span>
    </div>
    <label class="switch">
      <input type="checkbox" title="temp-unit-toggle" on:change={convert} bind:checked={in_f} />
      <span class="slider round" />
    </label>
  </div>
</div>
