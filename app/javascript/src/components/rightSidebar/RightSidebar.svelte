<script lang="ts">
  import QuestionSvg from "../common/SVG/QuestionSvg.svelte";
  let expanded = false;
</script>

<style type="scss">
  @import "../../scss/settings.scss";

  .tooltip {
    border: none;
    background-color: transparent;
  }

  #right-sidebar-expand-button {
    position: fixed;
    width: 100px;
    right: 10px;
    top: 70px;
    z-index: 100;
    padding: 10px 15px;
    border-radius: 20px 20px;
    border: none;
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3);

    @media #{$medium-up} {
      display: none;
    }
  }

  #right-sidebar {
    position: fixed;
    bottom: 115px;
    right: 10px;
    z-index: 10;
    min-width: 200px;
    min-height: 75px;
    padding: 5px 10px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3),
      4px 0px 10px rgba(0, 0, 0, 0.3);

    &[aria-expanded="true"] {
      visibility: visible;
      @media #{$medium-up} {
        visibility: visible;
        position: absolute;
        right: 15px;
      }
    }

    &[aria-expanded="false"] {
      @media #{$medium-up} {
        visibility: visible;
        position: absolute;
        right: 15px;
      }
      visibility: hidden;
    }
  }

  ul {
    list-style-type: none;
  }

  fieldset {
    margin-top: 10px;
    background: rgba(200, 200, 200, 0.4);
    margin-bottom: 10px;
    padding: 10px;
  }

  legend {
    padding: 0 5px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    font-size: 0.8em;
  }

  ul li {
    color: #424242;
  }
</style>

<button
  id="right-sidebar-expand-button"
  on:click={() => (expanded = !expanded)}>{expanded ? 'Hide Legend' : 'Show Legend'}</button>

<div id="right-sidebar" aria-expanded={expanded}>
  <slot />
  <fieldset id="definitions">
    <legend>Terms</legend>
    <ul>
      <li id="disease-forecasting">
        Disease Forecasting <button
          class="tooltip"
          id="disease-forecasting-information"
          data-balloon-length="medium"
          data-balloon-pos={expanded ? 'up-right' : 'left'}
          aria-label="A plant disease management system that uses computer-based models to collect field weather data and predict the onset and potential severity of crop diseases. Current and forecasted weather conditions determine the risk for disease, and prompts disease management decisions (preventative pesticide applications)."><QuestionSvg /></button>
      </li>
      <li id="tomcast">
        TOMCAST <button
          class="tooltip"
          id="tomcast-information"
          data-balloon-length="medium"
          data-balloon-pos={expanded ? 'up-right' : 'left'}
          aria-label="Disease forecasting model (adapted from a tomato disease model) used to predict the development of carrot foliar blights caused by Alternaria and Cercospora fungi, based on an accumulation of DSVs from past temperature and leaf wetness data combined with forecasted weather conditions."><QuestionSvg /></button>
      </li>
      <li id="blitecast">
        Blitecast <button
          class="tooltip"
          id="blitecast-information"
          data-balloon-length="medium"
          data-balloon-pos={expanded ? 'up-right' : 'left'}
          aria-label="Disease forecasting model used to predict the development of late blight of potato/tomato caused by Phytophthora infestans, based on an accumulation of DSVs, which are generated from air temperature and relative humidity data."><QuestionSvg /></button>
      </li>
    </ul>
  </fieldset>
</div>
