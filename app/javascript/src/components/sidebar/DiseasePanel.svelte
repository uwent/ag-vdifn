<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
  }
</style>

<script lang="ts">
  import { format, parseISO, subWeeks } from 'date-fns';
  import { onMount, setContext } from 'svelte';
  import ModelSelection from './ModelSelection.svelte';
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
  import type { PanelType } from '@types';

  const thisPanel: PanelType = 'disease';

  let {
    data = undefined,
    initialModelName = defaults.disease,
    submitOnLoad = false,
  } = $props<{
    data: any;
    initialModelName?: string;
    submitOnLoad?: boolean;
  }>();

  if ($diseasePanelState.loaded) {
    let pest = $diseasePanelState.selectedPest;
    $selectedDisease = pest;
    initialModelName = pest.local_name;
    submitOnLoad = false;
  } else {
    initialModelName = $selectedDisease?.local_name;
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
    defaultStartDate: format(subWeeks(new Date(), 1), 'yyyy-MM-dd'),
  });

  function submit() {
    let pest = $selectedDisease;
    let params = {
      start_date: format(parseISO($startDate), 'yyyy-MM-dd'),
      end_date: format(parseISO($endDate), 'yyyy-MM-dd'),
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

  // Reactive statements
  $effect(() => {
    if ($diseasePanelState.loaded && $diseasePanelState.mapExtent != $mapExtent) submit();
  });

  $effect(() => {
    $selectedPest = $selectedDisease;
  });
</script>

<div data-testid="disease-panel">
  <ModelSelection initialModel={initialModelName} />
  <fieldset>
    <legend>Model parameters</legend>
    <DatePicker />
    <TminMaxDisplay />
  </fieldset>
  <Button
    title="Submit parameters. Data load may take several seconds."
    ariaLabel="Submit parameters"
    disabled={$overlayLoading}
    click={submit}
  />
  {#if $overlayLoading}
    <Loading />
  {:else}
    <LoadStatus loaded={$diseasePanelState.loaded} />
  {/if}
</div>
