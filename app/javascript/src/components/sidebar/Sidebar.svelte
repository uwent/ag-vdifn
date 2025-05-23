<style lang="scss">
  @use '../../scss/variables.scss' as vars;

  #sidebar {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.95);
    z-index: vars.$z-index-modal;
    transition: vars.$duration-promptly ease-in-out;
    transition-delay: 0.1s;

    @media #{vars.$medium-up} {
      width: 350px;
      height: 100%;
      bottom: 0;

      button {
        display: none;
      }
    }

    @media #{vars.$small-only} {
      position: absolute;
    }

    button {
      height: 50px;
      position: fixed;
      bottom: 0;
      width: 100%;
      border-bottom: black 1px solid;
      background-image: url('@public/images/close.svg');
      background-color: white;
      border-top: 1px solid gray;
      border-left: none;
      border-right: none;
      border-bottom: none;
      background-repeat: no-repeat;
      background-position: center;
      transition: none;
      z-index: 100;
    }

    &[aria-expanded='true'] {
      top: 0;
    }

    &[aria-expanded='false'] {
      top: 100%;

      @media #{vars.$medium-up} {
        top: 0;
      }

      button {
        background-image: url('@public/images/open.svg');
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

  .content {
    flex: 1;
  }

  footer {
    margin-top: 25px;
    margin-bottom: 10px;
    text-align: center;
    font-size: smaller;
    color: grey;

    a:hover,
    a:visited,
    a:link,
    a:active {
      color: #249dde;
      text-decoration: none;
    }
  }

  .logo {
    display: inline-block;
    background-repeat: no-repeat;
    text-indent: -9999em;
    width: 44px;
    height: 44px;
    margin: vars.$spacing-xx-small vars.$spacing-xx-small;
    background-size: contain;
    border-radius: 8px;
    background-position: center;
    border: 1px solid #fff;

    &:hover {
      border: 1px solid grey;
    }
  }

  #plantpath-logo {
    background-image: url('@public/images/plantpath-logo.png');
  }

  #vegento-logo {
    background-image: url('@public/images/vegento-logo.png');
  }

  #uw-madison {
    background-image: url('@public/images/uw-madison.png');
  }

  h1 span {
    display: block;
    white-space: nowrap;
  }

  h1 span:nth-of-type(2) {
    margin: -8px 0 0;
    font-size: 0.85em;
  }

  h1 a {
    color: inherit;
    text-decoration: inherit;
  }
</style>

<script lang="ts">
  import { format } from 'date-fns';
  let expanded = true;
</script>

<div id="sidebar" aria-expanded={expanded}>
  <header>
    <div>
      <a
        id="uw-madison"
        title="AgWeather Home"
        aria-label="AgWeather Home"
        class="logo"
        href="https://agweather.cals.wisc.edu"
        target="_blank"
      >
      </a>
      <a
        id="plantpath-logo"
        title="UW-Madison Plant Pathology"
        aria-label="UW-Madison Plant Pathology"
        class="logo"
        href="https://vegpath.plantpath.wisc.edu/"
        target="_blank"
      >
      </a>
      <a
        id="vegento-logo"
        title="UW-Madison Vegetable Entomology"
        aria-label="UW-Madison Vegetable Entomology"
        class="logo"
        href="https://vegento.russell.wisc.edu/"
        target="_blank"
      >
      </a>
    </div>
    <h1>
      <a id="home" title="VDIFN Home" href={window.location.pathname}>
        <span>Vegetable Disease &amp;</span>
        <span>Insect Forecasting Network</span>
      </a>
    </h1>
  </header>

  <div class="content">
    <slot />
  </div>

  <footer>
    <div>
      <a href="mailto:agweather@cals.wisc.edu">Contact Us</a><br />
      Copyright &copy;{format(new Date(), 'yyyy')} University of Wisconsin-Madison
    </div>
  </footer>

  <button
    onclick={() => (expanded = !expanded)}
    title={expanded ? 'Hide controls' : 'Show controls'}
    aria-label={expanded ? 'Hide controls' : 'Show controls'}
  ></button>
</div>
