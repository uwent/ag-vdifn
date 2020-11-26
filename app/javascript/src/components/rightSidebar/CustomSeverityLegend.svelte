<script lang="ts">
   export let gradientMapping;
</script>

<style type="scss">
    @import "../../scss/settings.scss";

    .severity-level-col {
        display: flex;
        flex-direction: column;
        width: 20px;
        height: 20px;
        margin-bottom: 5px;
    }

    .severity-level-row {
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
    }

    .severity-color {
        width: 15px;
        margin-right: 10px;
        padding: 10px;
    }

    .severity-range {
        width: 35px;
        height: 15px;
        content: "\2264";
    }

    span {
        display: inline;
    }
</style>

<fieldset id="dsv-legend">
    <legend>Degree-Day Legend:</legend>
    {#each gradientMapping.reverse() as severity}
        <div class="severity-level-col">
            <div class="severity-level-row">
                <div class="severity-color" style="background: {severity.color}"></div>
                <div class="severity-range"><span>&#8804;</span>{Math.round(severity.number)}</div>
            </div>
        </div>
    {/each}
</fieldset>
