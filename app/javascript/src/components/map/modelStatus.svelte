<script lang="ts">
  import { insectPanelState, selectedPanel, PANELS, diseasePanelState, customPanelState } from "../../store/store";
</script>

<style type="scss">
  @import "../../scss/settings.scss";

  .model-status {
    text-transform: capitalize;
    position: fixed;
    left: 10px;
    top: 10px;
    z-index: 10;
    padding: 10px 10px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3),
      4px 0px 10px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    @media #{$medium-up} {
      left: 430px;
    }
  }
</style>

{#if $selectedPanel === PANELS.INSECT}
  <div class="model-status">{PANELS.INSECT} - {$insectPanelState.currentAffliction === undefined ? "No Model Submitted" : $insectPanelState.currentAffliction.name}</div>
{:else if $selectedPanel === PANELS.DISEASE}
  <div class="model-status">{PANELS.DISEASE} - {$diseasePanelState.currentAffliction === undefined ? "No Model Submitted" : $diseasePanelState.currentAffliction.name}</div>
 {:else}
  <div class="model-status">{PANELS.CUSTOM} - TMin/Max: {!$customPanelState.t_min ? "None" : $customPanelState.t_min}/{!$customPanelState.t_max ? "None" : $customPanelState.t_max} {$customPanelState.in_fahrenheit ? "\u2109" : "\u2103"}</div>
{/if}
