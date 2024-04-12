<script lang="ts">
  import moment from 'moment'
  import { onMount, setContext, tick } from 'svelte'
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
    insectPanelState,
    selectedAffliction,
    extents,
    mapExtent,
  } from '../../store/store'
  import ModelSelection from './ModelSelection.svelte'
  import ModelParameters from './ModelParameters.svelte'
  import DatePicker from './DatePicker.svelte'
  import TminMaxDisplay from './TminMaxDisplay.svelte'
  import Button from '../common/Button.svelte'
  import Loading from '../common/Loading.svelte'
  export let data
  export let defaultModel = ''
  export let submitOnLoad = false
  const thisPanel = 'insect'

  setContext(panelKey, {
    panelType: thisPanel,
    getCrops: () => data,
    dateToolTip: {
      startDate: 'Biofix date for insect',
      endDate: 'Date through which degree days are accumulated',
      startLabel: 'Biofix'
    },
    getAfflictionName: () => 'Insect',
    defaultStartDate: moment.utc().startOf('year').format('YYYY-MM-DD')
  })

  function submit() {
    let currentAffliction = get(selectedAffliction)
    let params = {
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      pest_id: $afflictionValue,
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_fahrenheit: $tMinTmax.in_fahrenheit,
      ...extents[$mapExtent]
    }
    insectPanelState.update(state => ({
      ...state,
      currentAffliction: currentAffliction,
      selectedExtent: $mapExtent,
      loaded: true
    }))
    insectPanelParams.set(params)
    setInsectPanelURL()
    gtag('event', 'submit', {
      panel_name: thisPanel,
      model_name: currentAffliction.name,
      map_extent: $mapExtent,
    })
  }

  function setInsectPanelURL() {
    let title = 'Insect models - VDIFN'
    let url = window.location.pathname
    let model = $insectPanelState.currentAffliction
    url += '?p=' + thisPanel
    if (model) {
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
    submitOnLoad ? lazySubmit() : setInsectPanelURL()
  })

  // submit if data is loaded and then extent is changed
  $: if (
    $selectedPanel == thisPanel &&
    $insectPanelState.loaded &&
    $insectPanelState.selectedExtent != $mapExtent
    ) submit()
</script>

<div data-testid="insect-panel">
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
