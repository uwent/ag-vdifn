<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>

<script lang="ts">
  import moment from 'moment';
  import { onMount, setContext } from 'svelte';
  import ModelSelection from './ModelSelection.svelte';
  import ModelParameters from './ModelParameters.svelte';
  import TminMaxDisplay from './TminMaxDisplay.svelte';
  import DatePicker from './DatePicker.svelte';
  import Button from '../common/Button.svelte';
  import Loading from '../common/Loading.svelte';
  import {
    overlayLoading,
    pestId,
    endDate,
    panelKey,
    startDate,
    tMinTmax,
    diseasePanelParams,
    selectedPanel,
    diseasePanelState,
    selectedDisease,
    extents,
    mapExtent,
    defaults,
    selectedPest,
  } from '@store';
  import LoadStatus from '@components/common/LoadStatus.svelte';

  export let data;
  export let initialModelName = defaults.disease;
  export let submitOnLoad = false;

  const thisPanel = 'disease';

  if ($diseasePanelState.loaded) {
    let pest = $diseasePanelState.selectedPest;
    $selectedDisease = pest;
    initialModelName = pest.local_name;
  } else {
    submitOnLoad = false;
    initialModelName = $selectedDisease.local_name;
  }
  setDiseasePanelURL();

  setContext(panelKey, {
    panelType: thisPanel,
    getCrops: () => data,
    dateToolTip: {
      startDate: 'Start of date range',
      endDate: 'Date through which disease severity values are accumulated',
      startLabel: 'Start date',
    },
    getPestName: () => 'Disease',
    defaultStartDate: moment.utc().subtract(1, 'week').format('YYYY-MM-DD'),
  });

  function submit() {
    let pest = $selectedDisease;
    let params = {
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      pest_id: $pestId,
      in_f: $tMinTmax.in_f,
      ...extents[$mapExtent],
    };
    diseasePanelState.update((state) => ({
      ...state,
      selectedPest: pest,
      mapExtent: $mapExtent,
      loaded: true,
    }));
    $diseasePanelParams = params;
    setDiseasePanelURL();
    gtag('event', 'submit', {
      panel_name: thisPanel,
      model_name: pest.name,
      map_extent: $mapExtent,
    });
  }

  function setDiseasePanelURL() {
    let pest = $diseasePanelState.selectedPest;
    let url = window.location.pathname;
    let title = 'VDIFN: Plant disease and insect risk models';
    if (pest) {
      initialModelName = pest.local_name;
      url += '?model=' + pest.local_name;
      title = `VDIFN | ${pest.name} model`;
    }
    window.history.replaceState({}, '', url);
    document.title = title;
  }

  onMount(() => {
    $selectedPanel = thisPanel;
    if (submitOnLoad) submit();
  });

  // submit if data is loaded and then extent is changed
  $: if ($diseasePanelState.loaded && $diseasePanelState.mapExtent != $mapExtent) submit();
  $: $selectedPest = $selectedDisease;
</script>

<div data-testid="disease-panel">
  <ModelSelection initialModel={initialModelName} />
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
  {:else}
    <LoadStatus loaded={$diseasePanelState.loaded} />
  {/if}
</div>
