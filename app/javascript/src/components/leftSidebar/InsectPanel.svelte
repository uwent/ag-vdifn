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
    insectPanelParams,
    selectedPanel,
    panelNames,
    insectPanelState,
    selectedAffliction,
    isDev
  } from '../../store/store'
  import ModelSelection from './ModelSelection.svelte'
  import ModelParameters from './ModelParameters.svelte'
  import DatePicker from './DatePicker.svelte'
  import TminMaxDisplay from './TminMaxDisplay.svelte'
  import Button from '../common/Button.svelte'
  import Loading from '../common/Loading.svelte'
  export let data
  export let defaultModel = ''
  const thisPanel = panelNames.insect

  setContext(panelKey, {
    panelType: 'Insect',
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
    insectPanelState.update(state => ({
      ...state,
      currentAffliction: get(selectedAffliction),
      loaded: true
    }))
    insectPanelParams.set({
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      pest_id: $afflictionValue,
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_fahrenheit: $tMinTmax.in_fahrenheit
    })
    updateUrlParams()
  }

  function updateUrlParams() {
    let url = window.location.pathname
    let title = 'AgVDIFN: Insect Models'
    url += '?panel=' + thisPanel
    url += '&model=' + $insectPanelState.currentAffliction.local_name
    title += ' - ' + $insectPanelState.currentAffliction.name
    if (isDev) console.log('Insect panel >> Setting title to ' + title)
    if (isDev) console.log('Insect panel >> Setting url to ' + url)
    window.history.replaceState({}, title, url)
    document.title = title
  }

  onMount(() => {
    selectedPanel.set(thisPanel)
    $insectPanelState.loaded ? updateUrlParams() : submit()
  })
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
