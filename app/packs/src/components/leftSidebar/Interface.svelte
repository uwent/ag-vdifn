<script lang="ts">
  import { onMount } from 'svelte'
  import { overlayLoading, panelNames, defaults } from '../../store/store'
  import DiseasePanel from './DiseasePanel.svelte'
  import InsectPanel from './InsectPanel.svelte'
  import DatabaseClient from '../common/TypeScript/databaseClient'
  import Loading from '../common/Loading.svelte'
  import CustomPanel from './CustomPanel.svelte'
  import Modal from '../common/Modal.svelte'
  import Help from './Help.svelte'
  export let diseasePanelData
  export let insectPanelData
  const databaseClient = new DatabaseClient()
  const urlBase = window.location.pathname
  const urlParams = new URLSearchParams(window.location.search)
  let selectedPanel = defaults.panel
  let queryModel: string
  let showHelp = false

  if (panelNames.all.includes(urlParams.get('panel'))) {
    selectedPanel = urlParams.get('panel')
  }

  function handleParams() {
    if (urlParams.has('panel') || urlParams.has('model')) {
      let url = urlBase
      if (panelNames.all.includes(urlParams.get('panel'))) {
        selectedPanel = urlParams.get('panel')
        url += "?panel=" + selectedPanel
        if (urlParams.has('model')) {
          queryModel = urlParams.get('model')
          url += "&model=" + queryModel
        }
      }
    console.log("Interface >> Setting url to " + url)
    window.history.replaceState({}, null, url)
    }
  }

  function handlePanelChange() {
    const baseTitle = 'AgVDIFN'
    let title = baseTitle
    switch (selectedPanel) {
      case defaults.panel:
        if (!urlParams.has('panel')) break
      case 'disease':
        title = baseTitle + ': Disease Models'
        break
      case 'insect':
        title = baseTitle + ': Insect Models'
        break
      case 'custom':
        title = baseTitle + ': Degree Day Viewer'
        break
    }
    document.title = title
    urlParams.set('panel', selectedPanel)
    console.log("Interface >> Setting page title to " + title)
    window.history.replaceState({}, title, null)
  }

  onMount(async () => {
    if (!diseasePanelData) diseasePanelData = await databaseClient.fetchDiseasePanel()
    if (!insectPanelData) insectPanelData = await databaseClient.fetchInsectPanel()
    handleParams()
  })

</script>

<style>
  .options {
    width: 100%;
  }

  .inner {
    overflow-y: auto;
    margin: 0 10px;
  }

  fieldset {
    margin-bottom: 10px;
    padding: 10px;
  }

  .switch-field {
    font-family: 'Lucida Grande', Tahoma, Verdana, sans-serif;
    overflow: hidden;
    display: flex;
    justify-content: space-evenly;
  }

  input {
    opacity: 0;
    position: absolute;
    width: 0;
  }

  input:checked + label {
    background-color: #a5dc86;
    box-shadow: none;
    color: rgba(0, 0, 0, 0.9);
  }

  label {
    width: 20%;
    background-color: #e4e4e4;
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    text-shadow: none;
    padding: 6px 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
    transition: all 0.1s ease-in-out;
  }

  .switch-field label:hover {
    cursor: pointer;
  }

  .switch-field input:checked + label {
    background-color: #a5dc86;
    box-shadow: none;
  }
</style>

<div class="options">
  <div class="inner">
    <fieldset id="interface">
      <div class="switch-field">
        <input
          name="interface"
          type="radio"
          id="disease"
          value="disease"
          bind:group={selectedPanel}
          on:change={handlePanelChange}
          disabled={$overlayLoading} />
        <label for="disease">Disease</label>
        <input
          name="interface"
          type="radio"
          id="insect"
          value="insect" 
          bind:group={selectedPanel}
          on:change={handlePanelChange}
          disabled={$overlayLoading}/>
        <label for="insect">Insect</label>
        <input
          name="interface"
          type="radio"
          id="custom"
          value="custom"
          bind:group={selectedPanel}
          on:change={handlePanelChange}
          disabled={$overlayLoading}/>
        <label for="custom">Custom</label>
        <button on:click={() => (showHelp = true)}>?</button>
      </div>
    </fieldset>
    {#if diseasePanelData && insectPanelData}
      {#if selectedPanel === panelNames.disease}
        <DiseasePanel
          data={diseasePanelData}
          defaultModel={queryModel ? queryModel : defaults.disease} />
      {:else if selectedPanel === panelNames.insect}
        <InsectPanel
          data={insectPanelData}
          defaultModel={queryModel ? queryModel : defaults.insect} />
      {:else if selectedPanel === panelNames.custom}
        <CustomPanel data={insectPanelData} />
      {/if}
    {:else}
      <Loading />
    {/if}
  </div>
</div>
{#if showHelp}
  <Modal on:close={() => (showHelp = false)} name="How to use VDIFN">
    <Help />
  </Modal>
{/if}
