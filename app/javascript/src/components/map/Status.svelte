<style type="scss">
  @import '../../scss/settings.scss';

  .model-status {
    font-style: italic;
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 10;
    padding: 5px 10px;
    border-bottom-right-radius: 0.2em;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3), 4px 0px 10px rgba(0, 0, 0, 0.3);
    @media #{$medium-up} {
      left: 350px;
    }
  }
</style>

<script lang="ts">
  import {
    insectPanelState,
    selectedPanel,
    diseasePanelState,
    customPanelState,
    customPanelParams
  } from '../../store/store'
</script>

<div class="model-status">
  {#if $selectedPanel == 'disease'}
    {$diseasePanelState.currentAffliction === undefined ? 'No model submitted' : $diseasePanelState.currentAffliction.name}
  {:else if $selectedPanel == 'insect'}
    {$insectPanelState.currentAffliction === undefined ? 'No model submitted' : $insectPanelState.currentAffliction.name}
  {:else}
    {#if !$customPanelState.loaded}
      No model submitted
    {:else}
      Degree day model: {$customPanelParams.t_min}{!$customPanelParams.t_max ? '' : `/${$customPanelParams.t_max}`}{$customPanelParams.in_fahrenheit ? '\u2109' : '\u2103'}
    {/if}
  {/if}
</div>
