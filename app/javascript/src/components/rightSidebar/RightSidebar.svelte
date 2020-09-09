<script lang="ts">
  import QuestionSvg from '../common/SVG/QuestionSvg.svelte'
</script>
<div id="right-sidebar">
  <slot></slot>
  <fieldset id="definitions">
    <legend>Terms</legend>
    <ul>
      <li id="disease-forecasting">
        Disease Forecasting <span id="disease-forecasting-information" class="tooltip
            left" title="" data-tooltip="A plant disease management system that uses computer-based models to collect field weather data and predict the onset and potential severity of crop diseases. Current and forecasted weather conditions determine the risk for disease, and prompts disease management decisions (preventative pesticide applications)."><QuestionSvg /></span>
      </li>
      <li id="tomcast">
        TOMCAST <span id="tomcast-information" class="tooltip left" title="" data-tooltip="Disease forecasting model (adapted from a tomato disease model) used to predict the development of carrot foliar blights caused by Alternaria and Cercospora fungi, based on an accumulation of DSVs from past temperature and leaf wetness data combined with forecasted weather conditions."><QuestionSvg /></span>
      </li>
      <li id="blitecast">
        Blitecast <span id="blitecast-information" class="tooltip left" title="" data-tooltip="Disease forecasting model used to predict the development of late blight of potato/tomato caused by Phytophthora infestans, based on an accumulation of DSVs, which are generated from air temperature and relative humidity data."><QuestionSvg /></span>
      </li>
    </ul>
  </fieldset>
</div>

<style>
  #right-sidebar {
    position: absolute;
    bottom: 25px;
    right: 15px;
    z-index: 10;
    min-width: 200px;
    min-height: 75px;
    padding: 5px 10px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3),
      4px 0px 10px rgba(0, 0, 0, 0.3);
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
