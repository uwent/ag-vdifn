<style global lang="scss">
  @import '../../node_modules/balloon-css/src/balloon.scss';

  // severity colors for point details
  $very_low: #00cc00;
  $low: #7dff23;
  $medium: #ffd700;
  $high: #ff8000;
  $very_high: #cc0000;

  html,
  body {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Lato', sans-serif;
    font-size: 16px;
    overflow: hidden;
  }

  legend,
  label {
    padding: 0 5px;
  }

  legend {
    color: #242424;
    font-size: 0.85em;
  }

  label {
    color: #484848;
    font-size: 0.75em;
  }

  thead th {
    background-color: #e2e6e6;
    max-width: 60px;
  }

  tr {
    text-align: left;
  }

  hgroup {
    padding: 0 10px 10px;
    text-align: center;
  }

  hgroup > * {
    display: inline-block;
  }

  th,
  td {
    padding: 2px 6px;
  }

  h1 {
    clear: both;
    margin: 0;
    text-align: center;
    font-family: Garamond, Times, serif;
    font-weight: normal;
    font-size: 1.65em;
  }

  h1 span {
    display: block;
    white-space: nowrap;
  }

  fieldset {
    background: rgba(234, 234, 234, 0.4);
    margin-bottom: 10px;
    padding: 10px;
  }

  // Point details info window //

  #iw-container {
    width: 275px;
    height: 350px;
  }

  #iw-content {
    margin: 0;
    overflow-y: visible;
    overflow-x: visible;
    height: 303px;
    font-size: 9pt;

    table th, table td {
      text-align: center;
    }
  }

  .iw-title {
    font-family: 'Open Sans Condensed', sans-serif;
    font-size: 22px;
    font-weight: 400;
    padding: 10px;
    background-color: #48b5e9;
    color: white;
    margin: 1px;
    border-radius: 2px 2px 0 0; /* In accordance with the rounding of the default infowindow corners. */
  }

  #loading {
    margin: 100px 90px;
  }

  table {
    width: 100%;
  }

  table .odd {
    background-color: #ebefef;
  }

  .info-icon {
    width: 10px;
    height: 10px;
    border: 1px solid black;
    border-radius: 50%;
    font-size: 9px;
    display: inline-flex;
    justify-content: center;
  }

  .severity-very_low { background: $very_low; }
  .severity-low { background: $low; }
  .severity-medium { background: $medium; }
  .severity-high { background: $high; }
  .severity-very_high { background: $very_high; }

</style>

<script lang="ts">
  import Map from './src/components/map/Map.svelte'
  import SeverityOverlay from './src/components/map/SeverityOverlay.svelte'
  import Sidebar from './src/components/leftSidebar/Sidebar.svelte'
  import Interface from './src/components/leftSidebar/Interface.svelte'
  import RightSidebar from './src/components/rightSidebar/RightSidebar.svelte'
  import SeverityLegend from './src/components/rightSidebar/SeverityLegend.svelte'
  import Status from './src/components/map/Status.svelte'
</script>

<main class="main">
  <Sidebar>
    <Interface />
  </Sidebar>
  <Map>
    <Status />
    <SeverityOverlay />
  </Map>
  <RightSidebar>
    <SeverityLegend />
  </RightSidebar>
</main>
