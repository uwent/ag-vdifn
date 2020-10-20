<script lang="ts">
  import Map from './src/components/map/Map.svelte'
  import SeverityOverlay from './src/components/map/SeverityOverlay.svelte'
  import Sidebar from './src/components/leftSidebar/Sidebar.svelte';
  import Interface from './src/components/leftSidebar/Interface.svelte';
  import RightSidebar from './src/components/rightSidebar/RightSidebar.svelte';
  import SeverityLegend from './src/components/rightSidebar/SeverityLegend.svelte'
</script>

<Sidebar>
  <Interface />
</Sidebar>
<Map>
  <SeverityOverlay />
</Map>
<RightSidebar>
  <SeverityLegend />
</RightSidebar>

<style>
  :global(html, body) {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: "Lucida Grande", "Trebuchet MS", Trebuchet, Arial, sans-serif;
}

:global(legend, label) {
  padding: 0 5px;
}
  :global(legend) {
    color: #242424;
    font-size: 0.85em;
  }

  :global(label) {
    color: #484848;
    font-size: 0.75em;
  }

  :global(thead th) {
    background-color: #e2e6e6;
  }

  :global(tr) {
    text-align: left;
  }

  :global(hgroup) {
    padding: 0 10px 10px;
    text-align: center;
  }

  :global(hgroup > *) {
    display: inline-block;
  }

  :global(th, td) {
    padding: 2px 6px;
  }

  :global(h1) {
    clear: both;
    margin: 0;
    text-align: center;
    font-family: Caudex, Garamond, Georgia, "Times New Roman", Times, serif;
    font-weight: normal;
    font-size: 1.65em;
  }

  :global(h1 span) {
    display: block;
    white-space: nowrap;
  }

  :global(fieldset) {
    background: rgba(200, 200, 200, 0.4);
    margin-bottom: 10px;
    padding: 10px;
  }

  :global(.tooltip svg) {
    width: 18px;
  }

  :global(.tooltip) {
    cursor: help;
  }

  :global(.tooltip:hover:before) {
    opacity: 1;
    display: block;
  }

  :global(.tooltip:after) {
    content: "";
    position: absolute;
    left: 100%;
    margin-left: -5px;
    top: 50%;
    transform: translateY(-100%);
    display: none;
    opacity: 0;
    transition: 0.3s;
  }

  :global(.tooltip:hover:after) {
    content: attr(data-tooltip);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 100%;
    margin-left: 15px;
    width: 200px;
    padding: 10px;
    border-radius: 10px;
    background: #504848;
    color: #fff;
    text-align: center;
    opacity: 1;
    transition: 0.3s opacity;
  }

  :global(.tooltip:hover:before,
  .tooltip:hover:after) {
    display: block;
  }

  :global(.tooltip.left:after) {
    left: initial;
    margin: initial;

    right: 100%;
    margin-right: 50px;
    transform: translateY(-107%) translateX(19%);
  }

  :global(#iw-container) {
    width: 275px;
    height: 350px;
  }

  :global(#iw-content) {
    margin:0;
    overflow-y: visible;
    overflow-x: visible;
    height: 303px;
    font-size: 9pt;
  }

  :global(#loading) {
    margin: 100px 90px;
  }

  :global(.loading-text) {
    font-size: 16px;
    color: #656565;
  }

  :global(table) {
    width: 100%;
  }

  :global(table .odd) {
    background-color: #ebefef;
  }

  :global(.iw-title) {
    font-family: 'Open Sans Condensed', sans-serif;
    font-size: 22px;
    font-weight: 400;
    padding: 10px;
    background-color: #48b5e9;
    color: white;
    margin: 1px;
    border-radius: 2px 2px 0 0; /* In accordance with the rounding of the default infowindow corners. */
  }

</style>
