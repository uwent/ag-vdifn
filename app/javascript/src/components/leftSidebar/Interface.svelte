<script lang="ts">
  import { onMount } from 'svelte'
  import DiseasePanel from './DiseasePanel.svelte'
  import InsectPanel from './InsectPanel.svelte'
  import DatabaseClient from '../common/TypeScript/databaseClient'
  import Loading from '../common/Loading.svelte'
  import CustomPanel from './CustomPanel.svelte'
  export let diseasePanelData
  export let insectPanelData
  let selected = 'disease'
  const databaseClient = new DatabaseClient()

  onMount(async () => {
    if (!diseasePanelData || !insectPanelData)
      diseasePanelData = await databaseClient.fetchDiseasePanel()
    insectPanelData = await databaseClient.fetchInsectPanel()
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
    -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
      0 1px rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
      0 1px rgba(255, 255, 255, 0.1);
    -webkit-transition: all 0.1s ease-in-out;
    -moz-transition: all 0.1s ease-in-out;
    -ms-transition: all 0.1s ease-in-out;
    -o-transition: all 0.1s ease-in-out;
    transition: all 0.1s ease-in-out;
    transition: all 0.1s ease-in-out;
  }

  .switch-field label:hover {
    cursor: pointer;
  }

  .switch-field input:checked + label {
    background-color: #a5dc86;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
</style>

<div class="options">
  <div class="inner">
    <fieldset id="interface">
      <div class="switch-field">
        <input
          title="disease-tab"
          type="radio"
          bind:group={selected}
          id="disease"
          name="interface"
          value="disease"
          checked={true} />
        <label for="disease">Disease</label>
        <input
          type="radio"
          bind:group={selected}
          id="insect"
          name="interface"
          value="insect" />
        <label for="insect">Insect</label>
        <input
          type="radio"
          bind:group={selected}
          id="custom"
          name="interface"
          value="custom" />
        <label for="custom">Custom</label>
      </div>
    </fieldset>
    {#if diseasePanelData && insectPanelData}
      {#if selected === 'disease'}
        <DiseasePanel data={diseasePanelData} />
      {:else if selected === 'insect'}
        <InsectPanel data={insectPanelData} />
      {:else if selected === 'custom'}
        <CustomPanel data={insectPanelData} />
      {/if}
    {:else}
      <Loading />
    {/if}
  </div>
</div>
