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
  export let data: any
  const thisPanelName = PANELS.INSECT

  // TODO: change 'Insect' to thisPanelName
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

  onMount(() => {
    selectedPanel.set(thisPanelName)
    window.history.pushState({}, null, "?panel=" + thisPanelName)
    submit()
  })
</script>

<div data-testid="insect-panel">
  <ModelSelection />
  <ModelParameters>
    <DatePicker />
    <TminMaxDisplay />
  </ModelParameters>
  <Button disabled={$overlayLoading} click={submit} />
  {#if $overlayLoading}
    <Loading />
  {/if}
</div>
