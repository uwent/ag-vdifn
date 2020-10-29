<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { tMinTmax } from "../../store/store";
    import Temperature from "./TypeScript/temperature";
    let tMin = null;
    let tMax = null;
    let in_f: boolean = true;
    let tMaxDisabled: boolean = false;
    let valid: boolean = true;
    const dispatch = createEventDispatcher();

    function convert(event) {
        in_f = event.target.checked;
        if (in_f) {
            convertToFahrenheit();
        } else {
            convertToCelcius();
        }
    }

    function convertToFahrenheit() {
        tMin = Temperature.to_f(tMin);
        if (tMax !== null) tMax = Temperature.to_f(tMax);
    }

    function convertToCelcius() {
        tMin = Temperature.to_c(tMin);
        if (tMax !== null) tMax = Temperature.to_c(tMax);
    }

    function tMaxToggle(event) {
        tMax = null;
        tMaxDisabled = event.target.checked;
    }

    function validateTmin(event) {
        const {
            target,
            target: { value },
        } = event;
        if (tMaxDisabled) {
            target.setCustomValidity("");
            valid = true;
            return;
        }
        if (value >= tMax) {
            target.setCustomValidity("This value must be less than the tMax");
            valid = false;
        } else {
            target.setCustomValidity("");
            tMin = event.target.value;
            valid = true;
        }
    }

    function validateTmax(event) {
        const {
            target,
            target: { value },
        } = event;
        if (tMaxDisabled) {
            target.setCustomValidity("");
            valid = true;
            return;
        }
        if (value <= tMin) {
            target.setCustomValidity(
                "This value must be greater than the tMin"
            );
            valid = false;
        } else {
            target.setCustomValidity("");
            tMax = event.target.value;
            valid = true;
        }
    }

    onMount(() => {
        tMin = 50;
        tMax = null;
        tMaxDisabled = true;
    });

    $: dispatch("tMinMaxValid", { valid: valid });
    $: tMinTmax.set({ t_max: tMax, t_min: tMin, in_fahrenheit: in_f });
</script>

<style>
    input[type="number"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 99%;
        background-color: rgba(255, 255, 255, 0.7);
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
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
</style>

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
                bind:value={tMin} />
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
                    bind:value={tMax} />
            </div>
            <div class="tMaxToggle">
                <input
                    id="tMaxToggle"
                    type="checkbox"
                    on:change={tMaxToggle}
                    bind:checked={tMaxDisabled} />
                <label for="tMaxToggle">No TMax</label>
            </div>
        </div>
    </div>
    <div class="temp-group" id="in-fahren-wrapper">
        <div>
            <span class="in-celcius">&#8451;</span>
            <span class="in-fahrenheit">&#8457; </span>
        </div>
        <label class="switch">
            <input
                type="checkbox"
                title="temp-unit-toggle"
                on:change={convert}
                bind:checked={in_f} />
            <span class="slider round" />
        </label>
    </div>
</div>
