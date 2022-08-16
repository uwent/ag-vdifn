<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>

<script lang="ts">
  const moment = require('moment')
  import { onMount, setContext } from 'svelte'
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
    defaults,
    isDev,
    extents,
    mapExtent
  } from '../../store/store'
  import ModelSelection from './ModelSelection.svelte'
  import ModelParameters from './ModelParameters.svelte'
  import TminMaxDisplay from './TminMaxDisplay.svelte'
  import DatePicker from './DatePicker.svelte'
  import Button from '../common/Button.svelte'
  import Loading from '../common/Loading.svelte'
  export let data
  export let defaultModel = ''
  const thisPanel = 'disease'

  // TODO: change 'Disease' to thisPanel
  setContext(panelKey, {
    panelType: 'Disease',
    getCrops: () => data,
    dateToolTip: {
      startDate: 'Start of date range',
      endDate: 'Date through which disease severity values are accumulated',
      startLabel: 'Start date'
    },
    getAfflictionName: () => 'Disease',
    defaultStartDate: moment.utc().subtract(1, 'week').format('YYYY-MM-DD')
  })

  function submit() {
    diseasePanelState.update(state => ({
      ...state,
      currentAffliction: get(selectedAffliction),
      selectedExtent: $mapExtent,
      loaded: true
    }))
    let params = {
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      pest_id: $afflictionValue,
      in_fahrenheit: $tMinTmax.in_fahrenheit,
      ...extents[$mapExtent]
    }
    diseasePanelParams.set(params)
    updateUrlParams()
  }

  function updateUrlParams() {
    let model = $diseasePanelState.currentAffliction
    let title = 'AgVDIFN'
    let url = window.location.pathname
    if (model) {
      url += '?panel=' + thisPanel
      url += '&model=' + model.local_name
      title += ': Disease Models - ' + model.name
    }
    if (isDev) console.log('Disease panel >> Setting title to ' + title)
    if (isDev) console.log('Disease panel >> Setting url to ' + url)
    window.history.replaceState({}, title, url)
    document.title = title
  }

  onMount(() => {
    selectedPanel.set(thisPanel)
    updateUrlParams()
  })

  $: if (
    $selectedPanel == thisPanel &&
    $diseasePanelState.loaded &&
    $diseasePanelState.selectedExtent != $mapExtent
  ) submit()
</script>

<div data-testid="disease-panel">
  <ModelSelection {defaultModel} />
  <ModelParameters>
    <DatePicker />
    <TminMaxDisplay />
  </ModelParameters>
  <Button
    title="Submit parameters. Data load may take several seconds."
    disabled={$overlayLoading}
    click={submit}
  />
  {#if $overlayLoading}
    <Loading />
  {/if}
</div>
