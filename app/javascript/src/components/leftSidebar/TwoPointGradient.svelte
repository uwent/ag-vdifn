<script lang="ts">
    import GradientHelper from "./TypeScript/gradientHelper";
    import ColorHelper from "../../components/map/TypeScript/colorHelper";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import {
        mapMinMapMax,
        twoPointGradientState,
    } from "../../store/store";
    import { get } from "svelte/store";
    const _ = require("lodash");
    const dispatch = createEventDispatcher();
    let gradientHelper = new GradientHelper();
    let severityLevels: number = 3;
    let userMin;
    let userMax;
    let intermediateRanges: number[][] = [];
    let addButton: HTMLInputElement;
    let minusButton: HTMLInputElement;
    let userMinInput: HTMLInputElement;
    let userMaxInput: HTMLInputElement;
    let updateOverlayButton: HTMLButtonElement;
    let buttonsDisabled: boolean = false;

    $: setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max);

    onMount(() => {
        const state = get(twoPointGradientState);
        if (_.size(state) > 0) {
            severityLevels = state.severityLevels;
            if (state.absoluteMin === $mapMinMapMax.min) {
                userMin = state.userMin;
                userMax = state.userMax;
                updateIntermediateValues();
            } else {
                setUserMinMax($mapMinMapMax.min, $mapMinMapMax.max);
            }
            updateUserMin(userMin);
            updateUserMax(userMax);
        }
    });

    onDestroy(() => {
        twoPointGradientState.set({
            severityLevels,
            userMin,
            userMax,
            absoluteMax: get(mapMinMapMax).max,
            absoluteMin: get(mapMinMapMax).min,
            gradient: getGradient()
        });
    });

    function setUserMinMax(absoluteMin, absoluteMax) {
        userMin = Math.round(absoluteMin + 10);
        userMax = Math.round(absoluteMax - 10);
        updateIntermediateValues();
    }

    function updateIntermediateValues() {
        const { intermediateValues } = gradientHelper.gradientValues({
            min: userMin,
            max: userMax,
            intermediateLevels: severityLevels - 2,
        });
        intermediateRanges = intermediateValues;
    }

    function addLevel() {
        if (
            severityLevels + 1 > 8 ||
            userMax > $mapMinMapMax.max ||
            userMin < $mapMinMapMax.min
        )
            return;
        severityLevels += 1;
        updateIntermediateValues();
    }

    function decrementLevel() {
        if (
            severityLevels - 1 < 3 ||
            userMax > $mapMinMapMax.max ||
            userMin < $mapMinMapMax.min
        )
            return;
        severityLevels -= 1;
        updateIntermediateValues();
    }

    function validateUserMinInput(value: number | typeof NaN): boolean {
        if (isNaN(value)) {
            return false;
        } else if (value >= userMax || value >= $mapMinMapMax.max) {
            userMinInput.setCustomValidity(
                "This value must be less than the chosen max and the map max"
            );
            return false;
        } else if (value < $mapMinMapMax.min) {
            userMinInput.setCustomValidity(
                "This value must be greater than the map minimum"
            );
            return false;
        } else {
            userMinInput.setCustomValidity("");
            return true;
        }
    }

    function maxInputValid(value: number | typeof NaN): boolean {
        if (isNaN(value)) {
            return false;
        } else if (value <= userMin || value <= $mapMinMapMax.min) {
            userMaxInput.setCustomValidity(
                "This value must be greater than the chosen min and the map min"
            );
            return false;
        } else if (value > $mapMinMapMax.max) {
            userMaxInput.setCustomValidity(
                "This value must be less than the map max"
            );
            return false;
        } else {
            userMaxInput.setCustomValidity("");
            return true;
        }
    }

    function handleUpdate(event) {
        const { valueAsNumber } = event.target;
        if (event.target.title === "userMin") {
            updateUserMin(valueAsNumber);
            updateUserMax(userMax);
        } else {
            updateUserMax(valueAsNumber);
            updateUserMin(userMin);
        }
        updateIntermediateValues();
    }

    function updateButtons() {
        if (userMinInput.validationMessage || userMaxInput.validationMessage) {
            buttonsDisabled = true;
        } else {
            buttonsDisabled = false;
        }
    }

    function updateUserMin(value: number) {
        if (validateUserMinInput(value)) userMin = value;
        updateButtons();
    }

    function updateUserMax(value) {
        if (maxInputValid(value)) userMax = value;
        updateButtons();
    }

    function getGradient() {
        return gradientHelper.mapRangeMinsToColors({
            min: userMin,
            max: userMax,
            intermediateLevels: severityLevels - 2,
            absoluteMax: $mapMinMapMax.max,
            totalLevels: severityLevels,
        });
    }

    function updateOverlay() {
        dispatch("updateOverlay", getGradient());
    }
</script>

<style type="scss">
    @import "../../scss/settings.scss";

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
        background: #249dde;
        background: -moz-linear-gradient(top, #29d4ff 0%, #249dde);
        border-radius: 3px;
        box-shadow: 0px 1px 3px rgba(000, 000, 000, 0),
            inset 0px 0px 1px rgba(255, 255, 255, 1);
        color: #fff;
        font-size: 0.85em;
        margin-top: 13px;
        padding: 10px;
        border: none;
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

    .button-row {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .level-quantity-button {
        @extend %severity-button;

        width: 20%;
    }

    .update-overlay-button {
        @extend %severity-button;

        width: 50%;
    }

    button:disabled {
        background: grey;
        cursor: not-allowed;
    }
</style>

<fieldset>
    <legend>Custom Degree-Day Values</legend>
    <div class="custom-values-wrapper">
        <div class="severity-row" title="severity-row">
            <div
                class="severity-color"
                style="background: {ColorHelper.color(0, severityLevels)}" />
            <div class="severity-value-end" title="absoluteMin">
                {$mapMinMapMax.min}
            </div>
            <input
                title="userMin"
                class="severity-value-end-input"
                type="number"
                name="userMin"
                required
                bind:this={userMinInput}
                on:change={handleUpdate}
                bind:value={userMin} />
        </div>
        {#each intermediateRanges as severityValueRange, index}
            <div class="severity-row" title="severity-row">
                <div
                    class="severity-color"
                    style="background: {ColorHelper.color(index + 1, severityLevels)}" />
                <div class="severity-value-intermediate" title="severity-range">
                    {`${severityValueRange[0]} - ${severityValueRange[1]}`}
                </div>
            </div>
        {/each}
        <div class="severity-row" title="severity-row">
            <div
                class="severity-color"
                style="background: {ColorHelper.color(severityLevels, severityLevels)}" />
            <input
                title="userMax"
                class="severity-value-end-input"
                type="number"
                name="userMax"
                required
                bind:this={userMaxInput}
                on:change={handleUpdate}
                bind:value={userMax} />
            <div class="severity-value-end" title="absoluteMax">
                {$mapMinMapMax.max}
            </div>
        </div>
    </div>
    <div class="button-row">
        <button
            class="level-quantity-button"
            bind:this={addButton}
            on:click={addLevel}
            disabled={buttonsDisabled || severityLevels >= 8}>+</button>
        <button
            class="update-overlay-button"
            bind:this={updateOverlayButton}
            on:click={updateOverlay}
            disabled={buttonsDisabled}>Update Overlay</button>
        <button
            class="level-quantity-button"
            bind:this={minusButton}
            on:click={decrementLevel}
            disabled={buttonsDisabled || severityLevels <= 3}>-</button>
    </div>
</fieldset>
