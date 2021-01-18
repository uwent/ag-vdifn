<script lang="ts">
  let expanded = true
</script>

<style type="scss">
  @import '../../scss/settings.scss';

  #sidebar {
    position: absolute;
    width: 100%;
    height: calc(100% - 50px);
    top: 0;
    overflow-y: auto;
    max-height: 100vh;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.3),
      4px 0px 10px rgba(0, 0, 0, 0.3);
    width: 100%;
    z-index: $z-index-modal;
    transition: $duration-promptly ease-in-out;
    transition-delay: 0.1s;

    @media #{$medium-up} {
      width: 350px;
      height: 100%;
      bottom: 0;

      button {
        display: none;
      }
    }

    button {
      height: 50px;
      position: fixed;
      bottom: 0;
      width: 100%;
      border-bottom: black 1px solid;
      background-image: url('../../../../assets/images/close.svg');
      background-color: white;
      border-top: 1px solid gray;
      border-left: none;
      border-right: none;
      border-bottom: none;
      background-repeat: no-repeat;
      background-position: center;
      transition: none;
      z-index: 1;
    }

    &[aria-expanded='true'] {
      top: 0;
    }

    &[aria-expanded='false'] {
      top: 100%;

      @media #{$medium-up} {
        top: 0;
      }

      button {
        background-image: url('../../../../assets/images/open.svg');
      }
    }
  }

  header {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 0 10px;
    text-align: center;
  }

  .logo {
    display: inline-block;
    background-repeat: no-repeat;
    text-indent: -9999em;
    width: 44px;
    height: 44px;
    margin: $spacing-xx-small $spacing-xx-small;
    background-size: contain;
  }

  #plantpath-logo {
    background-image: url('../../../../assets/images/plantpath-logo.png');
  }

  #vegento-logo {
    background-image: url('../../../../assets/images/vegento-logo.png');
  }

  #uw-madison {
    background-image: url('../../../../assets/images/uw-madison.png');
    background-position: center;
  }

  h1 {
    clear: both;
    margin: 0;
    text-align: center;
    font-family: Caudex, Garamond, Georgia, 'Times New Roman', Times, serif;
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
</style>

<div id="sidebar" aria-expanded={expanded}>
  <header>
    <div>
      <a
        id="uw-madison"
        href="http://www.wisc.edu"
        target="_blank"
        class="logo">
        Wisc Edu
      </a>
      <a
        id="plantpath-logo"
        class="logo"
        href="http://www.plantpath.wisc.edu/wivegdis/"
        target="_blank">
        UW-Madison Plant Pathology
      </a>
      <a
        id="vegento-logo"
        class="logo"
        href="http://vegento.russell.wisc.edu/"
        target="_blank">
        UW-Madison Vegetable Crop Entomology
      </a>
    </div>
    <h1>
      <span>Vegetable Disease &amp;</span>
      <span>Insect Forecasting Network</span>
    </h1>
  </header>

  <slot />

  <button on:click={() => (expanded = !expanded)} />
</div>
