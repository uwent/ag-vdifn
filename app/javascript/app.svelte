<script lang="ts">
  import Map from "./src/components/map/Map.svelte";
  import SeverityOverlay from "./src/components/map/SeverityOverlay.svelte";
  import Sidebar from "./src/components/leftSidebar/Sidebar.svelte";
  import Interface from "./src/components/leftSidebar/Interface.svelte";
  import RightSidebar from "./src/components/rightSidebar/RightSidebar.svelte";
  import SeverityLegend from "./src/components/rightSidebar/SeverityLegend.svelte";
  import Status from "./src/components/map/Status.svelte";
</script>

<style global type="scss">
  @import "node_modules/balloon-css/src/balloon.scss";

  html,
  body {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: "Lucida Grande", "Trebuchet MS", Trebuchet, Arial, sans-serif;
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
    font-family: Caudex, Garamond, Georgia, "Times New Roman", Times, serif;
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

  .iw-title {
    font-family: "Open Sans Condensed", sans-serif;
    font-size: 22px;
    font-weight: 400;
    padding: 10px;
    background-color: #48b5e9;
    color: white;
    margin: 1px;
    border-radius: 2px 2px 0 0; /* In accordance with the rounding of the default infowindow corners. */
  }
</style>

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
