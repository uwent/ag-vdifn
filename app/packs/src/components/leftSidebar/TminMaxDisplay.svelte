<style>
  #t-min-wrapper {
    width: 50%;
  }

  #tMinMaxRange {
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

  label {
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

  .symbol-wrapper {
    font-size: 0.75em;
    display: flex;
    justify-content: space-between;
  }
</style>

<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import { panelKey, selectedAffliction, tMinTmax } from '../../store/store'
  let in_f = true
  let tMinF: number
  let tMaxF: number
  let tMinC: number
  let tMaxC: number
  let tMinText: string
  let tMaxText: string
  const { getCrops } = getContext(panelKey)

  function f_to_c(f) {
    if (f === null) return null
    return Math.round((f - 32) * (5 / 9) * 10) / 10
  }

  // generate the temperature display text
  function makeText(temp) {
    if (temp === null || temp === undefined) {
      return 'None'
    } else if (Number.isInteger(temp)) {
      return temp.toFixed(0)
    } else {
      return temp.toFixed(1)
    }
  }

  // convert between units and update text
  function updateText(in_f) {
    if (in_f) {
      tMinText = makeText(tMinF)
      tMaxText = makeText(tMaxF)
      tMinTmax.update(state => ({
        ...state,
        t_min: tMinF,
        t_max: tMaxF,
        in_fahrenheit: true
      }))
    } else {
      tMinText = makeText(tMinC)
      tMaxText = makeText(tMaxC)
      tMinTmax.update(state => ({
        ...state,
        t_min: tMinC,
        t_max: tMaxC,
        in_fahrenheit: false
      }))
    }
  }

  // Sets temperature values and updates display text
  function setTminTmax(affliction) {
    if (affliction) {
      in_f = true
      tMinF = affliction.t_min
      tMaxF = affliction.t_max
      tMinC = f_to_c(tMinF)
      tMaxC = f_to_c(tMaxF)
      updateText(in_f)
    }
  }

  onMount(() => {
    if (getCrops().length > 0) {
      setTminTmax(getCrops()[0].afflictions[0])
    } else {
      setTminTmax($selectedAffliction)
    }
  })

  $: updateText(in_f)
  $: setTminTmax($selectedAffliction)
</script>

<div id="degree_day_info">
  <div class="temp-group" id="t-min-wrapper">
    <div id="tMinMaxRange">
      <div class="t-min-wrapper">
        <label for="tmin">Tmin</label>
        <div title="Min temp" type="text" class="tmin">{tMinText}</div>
      </div>
      <div class="t-max-wrapper">
        <label for="tmax">Tmax</label>
        <div title="Max temp" type="text" class="tmax">{tMaxText}</div>
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
      <span class="slider round" />
    </label>
  </div>
</div>
