<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { panelKey, selectedAffliction, tMinTmax } from "../../store/store";
    import Temperature from "./TypeScript/temperature";
    let tMin = "";
    let tMax = "";
    let in_f = true;
    const { getCrops } = getContext(panelKey);

    function setTminTMax(affliction) {
        in_f = true;
        if (affliction) {
            tMin = affliction.t_min;
            tMax = affliction.t_max || "None";
        }
        if (tMax === "None") {
            tMinTmax.update(state => ({...state, t_min: tMin, t_max: null, in_fahrenheit: in_f}))
        } else {
            tMinTmax.update(state => ({...state, t_min: tMin, t_max: tMax, in_fahrenheit: in_f}))
        }
    }


    // function setTminTMax(affliction) {
    //     tMinF = affliction.t_min;
    //     tMaxF = affliction.t_max;
    //     tMinC = ((tMinF - 32.0) * (5/9)).toFixed(1);
    //     if (tMaxF === null) {
    //       tMaxC = null;
    //     } else {
    //       tMaxC = ((tMinF - 32.0) * (5/9)).toFixed(1);
    //     }
    //     in_f = true;
    //     tMinTmax.update(state => ({...state, t_min: tMinText, t_max: tMaxText, in_fahrenheit: in_f}))
    // }

    // function showF() {
    //   tMinText = string(tMinF);
    //   if (tMaxF === null) {
    //     tMaxText = "None";
    //   } else {
    //     tMaxText = string(tMaxF);
    //   }
    //   in_f = true;
    //   tMinTmax.update(state => ({...state, t_min: tMinText, t_max: tMaxText, in_fahrenheit: in_f}))
    // }
    //
    // function showC() {
    //   tMinText = string(tMinC);
    //   if (tMaxC === null) {
    //     tMaxText = "None";
    //   } else {
    //     tMaxText = string(tMaxC);
    //   }
    //   in_f = false;
    //   tMinTmax.update(state => ({...state, t_min: tMinText, t_max: tMaxText, in_fahrenheit: in_f}))
    // }



    function convertToFahrenheit() {
        tMin = Temperature.to_f(tMin);
        if (tMax === null || tMax === "None") {
            tMax = "None";
        } else {
            tMax = Temperature.to_f(tMax);
        }
        in_f = true;
        tMinTmax.update(state => ({...state, t_min: tMin, t_max: tMax, in_fahrenheit: in_f}))
    }

    function convertToCelcius() {
        tMin = Temperature.to_c(tMin);
        if (tMax === null || tMax === "None") {
            tMax = "None";
        } else {
            tMax = Temperature.to_c(tMax);
        }
        in_f = false;
        tMinTmax.update(state => ({...state, t_min: tMin, t_max: tMax, in_fahrenheit: in_f}))
    }

    onMount(() => {
        if (getCrops().length > 0) {
            tMin = getCrops()[0].afflictions[0].t_min;
            tMax = getCrops()[0].afflictions[0].t_max || "None";
            if (tMax === "None") {
                tMinTmax.update(state => ({...state, t_min: tMin, t_max: null, in_fahrenheit: in_f}))
            } else {
                tMinTmax.update(state => ({...state, t_min: tMin, t_max: tMax, in_fahrenheit: in_f}))
            }
        }
    });

    // onMount(() => {
    //     if (getCrops().length > 0) {
    //         setTminTMax(getCrops()[0].afflictions[0]);
    //       }
    // });


    $: in_f ? convertToFahrenheit() : convertToCelcius();
    // $: in_f ? showF() : showC();
    $: setTminTMax($selectedAffliction);
</script>

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

    .t-min-wrapper, .t-max-wrapper {
      width: 50%;
      text-align: center;

    }

    .t-min-wrapper {
      margin-right: 10px;
    }

    .tmin, .tmax {
      background-color: rgba(255, 255, 255, 0.7);
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
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
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(36px);
        -ms-transform: translateX(36px);
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

<div id="degree_day_info">
    <div class="temp-group" id="t-min-wrapper">
        <div id="tMinMaxRange">
        <div class="t-min-wrapper">
          <label for="tmin">Tmin</label>
            <div title="Min temp" type="text" class="tmin">{tMin}</div>
            </div>
          <div class="t-max-wrapper">
            <label for="tmax">Tmax</label>
            <div title="Max temp" type="text" class="tmax">{tMax}</div>
          </div>
        </div>
    </div>
    <div title="Units" class="temp-group" id="in-fahren-wrapper">
        <div class="symbol-wrapper">
            <span class="in-celcius">&#8451;</span>
            <span class="in-fahrenheit">&#8457; </span>
        </div>
        <label class="switch">
            <input
                type="checkbox"
                title="temp-unit-toggle"
                bind:checked={in_f} />
            <span class="slider round" />
        </label>
    </div>
</div>
