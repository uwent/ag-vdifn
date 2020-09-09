<div id="sidebar">
  <header>
    <hgroup>
      <a
        id="plantpath-logo"
        class="logo"
        href="http://www.plantpath.wisc.edu/wivegdis/"
        target="_blank">UW-Madison Plant Pathology</a>
      <a
        id="vegento-logo"
        class="logo"
        href="http://labs.russell.wisc.edu/vegento/"
        target="_blank">UW-Madison Vegetable Crop Entomology</a>
      <h1>
        <span>Vegetable Disease &amp;</span><span>Insect Forecasting Network</span>
      </h1>
    </hgroup>
  </header>

  <slot />

  <footer>
    <div id="uw-group">
      <a
        id="uw-madison"
        class="logo"
        href="http://www.wisc.edu"
        target="_blank">UW Madison</a>
      <a
        id="uw-extension"
        class="logo"
        href="http://www.uwex.edu"
        target="_blank">UW Extension</a>
    </div>
    <div id="potato-field" />
  </footer>
</div>

<style>
  #sidebar {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3),
      4px 0px 10px rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    left: 30px;
    z-index: 10;
    width: 305px;
    height: 100%;
  }

  header {
    width: 100%;
    display: block;
  }

  hgroup {
    display: block;
    padding: 0 10px 10px;
    text-align: center;
  }

  .logo {
    display: inline-block;
    background-repeat: no-repeat;
    text-indent: -9999em;
  }

  #plantpath-logo {
    width: 80px;
    height: 80px;
    margin: 12px 6px;
    background-image: url("../../../../assets/images/plantpath-logo.png");
  }

  #vegento-logo {
    width: 80px;
    height: 80px;
    margin: 12px 6px;
    background-image: url("../../../../assets/images/vegento-logo.png");
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

  h1 span:nth-of-type(2) {
    margin: -8px 0 0;
    font-size: 0.85em;
  }

  footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  #uw-group {
    position: relative;
    height: 100px;
    margin: 0 2px;
    padding: 5px 0;
    text-align: center;
    z-index: 10;
    vertical-align: middle;
  }

  #uw-madison {
    background-image: url("../../../../assets/images/uw-madison.png");
    width: 53px;
    height: 80px;
    vertical-align: middle;
  }

  #potato-field {
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: url("../../../../assets/images/potato-field.png");
    width: 100%;
    height: 182px;
    z-index: 5;
    opacity: 0.7;
  }
</style>

