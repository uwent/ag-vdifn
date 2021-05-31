<script lang="ts">
  import { onMount } from 'svelte'
  import { overlayLoading } from '../../store/store'
  import DiseasePanel from './DiseasePanel.svelte'
  import InsectPanel from './InsectPanel.svelte'
  import DatabaseClient from '../common/TypeScript/databaseClient'
  import Loading from '../common/Loading.svelte'
  import CustomPanel from './CustomPanel.svelte'
  import Modal from '../common/Modal.svelte'
  export let diseasePanelData
  export let insectPanelData
  let selected = 'disease'
  let showModal: boolean = false
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
          bind:group={selected}
          checked={true}
          disabled={$overlayLoading} />
        <label for="disease">Disease</label>
        <input
          name="interface"
          type="radio"
          id="insect"
          value="insect" 
          bind:group={selected}
          disabled={$overlayLoading}/>
        <label for="insect">Insect</label>
        <input
          name="interface"
          type="radio"
          id="custom"
          value="custom"
          bind:group={selected}
          disabled={$overlayLoading}/>
        <label for="custom">Custom</label>
        <button on:click={() => (showModal = true)}>?</button>
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
{#if showModal}
  <Modal on:close={() => (showModal = false)} name="How to use VDIFN">
    <div class="modal__pest-info">
      <h4>Introduction</h4>
      <p>One of the pillars of modern integrated pest and disease management strategies is the use of local climatic and environmental variables to model disease and insect pest risk for a particular field or region. Rather than treating for pests on a preset schedule or waiting for symptoms to appear, growers can anticipate the onset of increased pest risk using predictive models developed and tested for specific disease and insect risks to crops. The outcomes of the use of such models would be increased awareness of current and near future pest and disease risk, as well as the reduction in the use of pesticides and increased profits. This website, VDIFN, is a free tool for growers and residents of Wisconsin that currently includes plant disease models, insect growing degree-day models, and a custom degree-day map generator.</p>
      <p>VDIFN uses gridded weather data downloaded daily from National Oceanographic and Atmospheric Administration (NOAA) servers. Data include daily min/max temperatures and relative humidity, which are fed into various models and converted into daily disease severity values (or equivalents) or degree-days. These disease severity value and degree-day accumulations are then displayed on the map as color-coded risk scores based on the estimated risk to susceptible crops. Unfortunately VDIFN does not currently have the ability to use weather forecasts to run the models out into the future.</p>
      <h4>Navigation and usage</h4>
      <p>On the left you will find the navigation and settings pane, the map and pest severity display in the center, and a legend on the lower right. You can switch between disease, insect, and custom model modes with the buttons across the top of the left panel. Pick a model using the <b>Model Selection</b> section, and use the <b>question mark box</b> to get more information on the disease or insect. After selecting a model, note that the date range boxes populate with defaults for each model, but can be adjusted if desired.</p>
      <p>Click on an <b>individual grid point</b> to bring up more details for that specific location, including a detailed history of weather readings and daily and cumulative disease severity value or degree-days (depending on the model selected). For the following example, I brought up the Seedcorn Maggot insect model, which is indicating some level of risk across southern Wisconsin. The legend explains that this corresponds to the adult mating and egg-laying flight of the first (overwintering) generation. There will be several more successive generations this year occurring at different degree-day accumulations.</p>
      <h4>Disease models</h4>
      <p>Disease models generally rely on the accumulation of daily Disease Severity Values, DSVs, or sometimes Disease Infection Values, DIVs. These are calculated from weather data, including daily min/max temperatures and relative humidity. Be sure to correctly adjust the start date for the disease risk window (generally crop emergence or date of last fungicide application). When high risk is indicated on the map it is recommended to take management actions to prevent the development of the disease on susceptible crops.</p>
      <h4>Insect models</h4>
      <p>The insect models are based on annual accumulations of daily degree-day values. Most use Jan 1 as a biofix (start date), but several use other, midyear dates or scouting events (such as the first observation of egg masses). Be sure to correctly adjust the biofix if necessary. If a default biofix has not yet occurred this year, the calendar will default to last year. The risk score for the insect models represents the expected abundance of a damaging life stage (for instance, larval feeding, or adult flight), which is further explained in the legend and info box on the lower right of the map.</p>
      <h4>Custom models</h4>
      <p>The <b>custom tab</b> is a little more complicated to use, but essentially it allows you to generate and visualize any degree-day model of your choosing (or select the parameters of one of the insect models). Degree-days essentially quantify the amount of heat energy available in a given day for insect development and are calculated from daily min and max temperatures. The map then will show you how much heat has accumulated between the dates that you specify (generally Jan 1 to present). This is an easy way to visualize the progression of the seasons, or you can cross-reference the degree-days to plant or insect developmental milestones.</p>
      <p>The <b>color gradient</b> can be customized using the inputs on the lower left of the sidebar. The amount of gradations can be increased or decreased using the <b>plus/minus buttons</b>, and any adjustments to the min/max color points can be applied with the <b>update button</b>. Use the <b>reset button</b> to evenly space the color gradient between the minimum and maximum degree-days present on the map.</p>
      <p>The second gradient type can be used if you want to emulate the green-red-green color pattern of the insect models, and you can specify the start, peak, and end of the color gradient.</p>
    </div>
  </Modal>
{/if}
