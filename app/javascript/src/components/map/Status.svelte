<script lang="ts">
  import {
    insectPanelState,
    selectedPanel,
    PANELS,
    diseasePanelState,
    customPanelState,
  } from '../../store/store'
</script>

<style type="scss">
  @import '../../scss/settings.scss';

  .model-status {
    text-transform: capitalize;
    font-style: italic;
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 10;
    padding: 5px 10px;
    border-bottom-right-radius: 0.2em;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3),
      4px 0px 10px rgba(0, 0, 0, 0.3);
    @media #{$medium-up} {
      left: 350px;
    }
  }
</style>

{#if $selectedPanel === PANELS.DISEASE}
  <div class="model-status">
    {$diseasePanelState.currentAffliction === undefined ? 'No Model Submitted' : $diseasePanelState.currentAffliction.name}
  </div>
{:else if $selectedPanel === PANELS.INSECT}
  <div class="model-status">
    {$insectPanelState.currentAffliction === undefined ? 'No Model Submitted' : $insectPanelState.currentAffliction.name}
  </div>
{:else}
  <div class="model-status">
    Custom model: {!$customPanelState.t_min === undefined ? 'None' : $customPanelState.t_min}/{!$customPanelState.t_max ? 'None' : $customPanelState.t_max} {$customPanelState.in_fahrenheit ? '\u2109' : '\u2103'}
  </div>
{/if}
