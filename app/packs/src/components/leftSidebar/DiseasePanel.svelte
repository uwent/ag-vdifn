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
    diseasePanelParams,
    selectedPanel,
    diseasePanelState,
    selectedAffliction,
    PANELS,
  } from '../../store/store'
  import ModelSelection from './ModelSelection.svelte'
  import ModelParameters from './ModelParameters.svelte'
  import TminMaxDisplay from './TminMaxDisplay.svelte'
  import DatePicker from './DatePicker.svelte'
  import Button from '../common/Button.svelte'
  import Loading from '../common/Loading.svelte'
  export let data
  export let defaultModel = ''
  const thisPanel = PANELS.DISEASE
  const urlParams = new URLSearchParams(window.location.search)

  // TODO: change 'Disease' to thisPanel
  setContext(panelKey, {
    panelType: 'Disease',
    getCrops: () => data,
    dateToolTip: {
      startDate: 'Date of Emergence/Last Fungicide Application',
      endDate: 'Date through which disease severity values are accumulated',
      startLabel: 'Date of Emergence/Last Fungicide Application',
    },
    getAfflictionName: () => 'Disease',
    defaultStartDate: moment.utc().subtract(1, 'week').format('YYYY-MM-DD'),
  })

  function submit() {
    diseasePanelState.update((state) => ({
      ...state,
      currentAffliction: get(selectedAffliction),
      loaded: true,
    }))
    diseasePanelParams.set({
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      pest_id: $afflictionValue,
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
    console.log("Disease panel >> Setting url to " + newUrl)
    window.history.replaceState({}, null, newUrl)
  }

  onMount(() => {
    selectedPanel.set(thisPanel)
    if (!$diseasePanelState.loaded) submit()
  })

  onDestroy(() => {
    // urlParams.delete('model')
    // setUrlParams()
  })

  $: {
    if ($diseasePanelState.currentAffliction) {
      console.log("Disease Panel >> Submitted model: '" + $diseasePanelState.currentAffliction.local_name + "'")
      updateParams($diseasePanelState.currentAffliction)
    }
  }
</script>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>

<div data-testid="disease-panel">
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
