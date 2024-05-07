<script lang="ts">
  import moment from 'moment';
  import { onMount, setContext } from 'svelte';
  import ModelSelection from './ModelSelection.svelte';
  import ModelParameters from './ModelParameters.svelte';
  import DatePicker from './DatePicker.svelte';
  import TminMaxDisplay from './TminMaxDisplay.svelte';
  import Button from '../common/Button.svelte';
  import Loading from '../common/Loading.svelte';
  import LoadStatus from '../common/LoadStatus.svelte';
  import {
    defaults,
    endDate,
    extents,
    insectPanelParams,
    insectPanelState,
    mapExtent,
    overlayLoading,
    panelKey,
    pestId,
    selectedInsect,
    selectedPanel,
    selectedPest,
    startDate,
    tMinTmax,
  } from '@store';
  import type { PanelType } from '@types';

  export let data;
  export let initialModelName = defaults.insect;
  export let submitOnLoad = false;

  const thisPanel: PanelType = 'insect';

  if ($insectPanelState.loaded) {
    let pest = $insectPanelState.selectedPest;
    $selectedInsect = pest;
    initialModelName = pest.local_name;
  } else {
    submitOnLoad = false;
    initialModelName = $selectedInsect.local_name;
  }
  setInsectPanelURL();

  setContext(panelKey, {
    panelType: thisPanel,
    getCrops: () => data,
    getPestName: () => 'Insect',
    dateToolTip: {
      startDate: 'Biofix date for insect',
      endDate: 'Date through which degree days are accumulated',
      startLabel: 'Biofix',
    },
    defaultStartDate: moment.utc().startOf('year').format('YYYY-MM-DD'),
  });

  function submit() {
    let pest = $selectedInsect;
    let params = {
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      pest_id: $pestId,
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_f: $tMinTmax.in_f,
      ...extents[$mapExtent],
    };
    insectPanelState.update((state) => ({
      ...state,
      selectedPest: pest,
      mapExtent: $mapExtent,
      loaded: true,
    }));
    $insectPanelParams = params;
    setInsectPanelURL();
    gtag('event', 'submit', {
      panel_name: thisPanel,
      model_name: pest.name,
      map_extent: $mapExtent,
    });
  }

  function setInsectPanelURL() {
    let title = 'VDIFN | Insect models';
    let url = window.location.pathname;
    let pest = $insectPanelState.selectedPest;
    url += '?type=' + thisPanel;
    if (pest) {
      initialModelName = pest.local_name;
      url += '&model=' + pest.local_name;
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
  $: if ($insectPanelState.loaded && $insectPanelState.mapExtent != $mapExtent) submit();
  $: $selectedPest = $selectedInsect;
</script>

<div data-testid="insect-panel">
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
    <LoadStatus loaded={$insectPanelState.loaded} />
  {/if}
</div>
