<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>

<script lang="ts">
  const moment = require('moment')
  import { onMount, setContext, tick } from 'svelte'
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
  export let submitOnLoad = false
  const thisPanel = 'disease'

  setContext(panelKey, {
    panelType: thisPanel,
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
    let currentAffliction = get(selectedAffliction)
    let params = {
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      pest_id: $afflictionValue,
      in_fahrenheit: $tMinTmax.in_fahrenheit,
      ...extents[$mapExtent]
    }
    diseasePanelState.update(state => ({
      ...state,
      currentAffliction: currentAffliction,
      selectedExtent: $mapExtent,
      loaded: true
    }))
    diseasePanelParams.set(params)
    setDiseasePanelURL()
    gtag('event', 'submit', {
      panel_name: thisPanel,
      model_name: currentAffliction.name,
      map_extent: $mapExtent,
    })
  }

  function setDiseasePanelURL() {
    let model = $diseasePanelState.currentAffliction
    let url = window.location.pathname
    let title = 'VDIFN'
    if (model) {
      url += '?p=' + thisPanel
      url += '&m=' + model.local_name
      title = `${model.name} model - VDIFN`
    }
    window.history.replaceState({}, '', url)
    document.title = title
  }

  // submit once all components have rendered
  async function lazySubmit() {
    await tick()
    submit()
  }

  onMount(() => {
    selectedPanel.set(thisPanel)
    submitOnLoad ? lazySubmit() : setDiseasePanelURL()
  })

  // submit if data is loaded and then extent is changed
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
