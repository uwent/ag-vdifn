<script lang="ts">
  const moment = require('moment')
  import { onDestroy, onMount, setContext } from 'svelte'
  import { get } from 'svelte/store'
  import {
    overlayLoading,
    afflictionValue,
    endDate,
    panelKey,
    startDate,
    tMinTmax,
    insectPanelParams,
    selectedPanel,
    PANELS,
    insectPanelState,
    selectedAffliction,
  } from '../../store/store'
  import ModelSelection from './ModelSelection.svelte'
  import ModelParameters from './ModelParameters.svelte'
  import DatePicker from './DatePicker.svelte'
  import TminMaxDisplay from './TminMaxDisplay.svelte'
  import Button from '../common/Button.svelte'
  import Loading from '../common/Loading.svelte'
  export let data
  export let defaultModel = ''
  const thisPanel = PANELS.INSECT
  const urlParams = new URLSearchParams(window.location.search)

  // TODO: change 'Insect' to thisPanel
  setContext(panelKey, {
    panelType: 'Insect',
    getCrops: () => data,
    dateToolTip: {
      startDate: 'Biofix date for insect',
      endDate: 'Date through which degree days are accumulated',
      startLabel: 'Biofix',
    },
    getAfflictionName: () => 'Insect',
    defaultStartDate: moment.utc().startOf('year').format('YYYY-MM-DD'),
  })

  function submit() {
    insectPanelState.update((state) => ({
      ...state,
      currentAffliction: get(selectedAffliction),
      loaded: true,
    }))
    insectPanelParams.set({
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      pest_id: $afflictionValue,
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_fahrenheit: $tMinTmax.in_fahrenheit,
    })
  }

  function updateParams(affliction) {
    urlParams.set('panel', thisPanel)
    urlParams.set('model', affliction.local_name)
    setUrlParams()
  }

  function setUrlParams() {
    let newUrl = window.location.pathname + "?" + urlParams.toString()
    console.log("Insect panel >> Setting url to " + newUrl)
    window.history.replaceState({}, null, newUrl)
  }

  onMount(() => {
    selectedPanel.set(thisPanel)
    if (!$insectPanelState.loaded) submit()
  })

  onDestroy(() => {
    // urlParams.delete('model')
    // setUrlParams()
  })

  $: {
    if ($insectPanelState.currentAffliction) {
      console.log("Insect Panel >> Submitted model: '" + $insectPanelState.currentAffliction.local_name + "'")
      updateParams($insectPanelState.currentAffliction)
    }
  }
</script>

<div data-testid="insect-panel">
  <ModelSelection defaultModel={defaultModel}/>
  <ModelParameters>
    <DatePicker />
    <TminMaxDisplay />
  </ModelParameters>
  <Button disabled={$overlayLoading} click={submit} />
  {#if $overlayLoading}
    <Loading />
  {/if}
</div>
