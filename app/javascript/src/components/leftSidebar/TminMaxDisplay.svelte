<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { panelKey, selectedAffliction } from "../../store/store";
    import Temperature from "./TypeScript/temperature";
    let tMin = "";
    let tMax = "";
    let in_f = true;
    const { getCrops } = getContext(panelKey);
    function setTminTMax(affliction) {
        if (affliction) {
            tMin = affliction.t_min;
            tMax = affliction.t_max || "None";
        }
    }

    function convertToFahrenheit() {
        tMin = Temperature.to_f(tMin);

        if (tMax === null || tMax === "None") {
            tMax = "None";
        } else {
            tMax = Temperature.to_f(tMax);
        }
    }

    function convertToCelcius() {
        tMin = Temperature.to_c(tMin);
        if (tMax === null || tMax === "None") {
            tMax = "None";
        } else {
            tMax = Temperature.to_c(tMax);
        }
    }

    onMount(() => {
        if (getCrops().length > 0) {
            tMin = getCrops()[0].afflictions[0].t_min;
            tMax = getCrops()[0].afflictions[0].t_max || "None";
        }
    });

    $: in_f ? convertToFahrenheit() : convertToCelcius();
    $: setTminTMax($selectedAffliction);
</script>

<style>
    #tMinMaxRange {
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 99%;
        background-color: rgba(255, 255, 255, 0.7);
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0;
        border: 1px solid #d0d0d0;
        padding: 5px 0;
        background: #d0d0d0;
        color: #525252;
        cursor: default;
        display: flex;
        flex-direction: row;
        justify-content: center;
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
        <label for="tmin">Tmin - Tmax Range</label>
        <div title="tMinTmaxDisplay" type="text" id="tMinMaxRange">
            {tMin} - {tMax}
        </div>
    </div>
    <div class="temp-group" id="in-fahren-wrapper">
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
