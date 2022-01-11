<style type="scss">
  @import '../../scss/settings.scss';

  .button {
    display: inline-block;
    cursor: pointer;
    margin: 0 auto;
    background: #c2c3c3;
    background: linear-gradient(to bottom, #ebefef 0%, #c2c3c3);
    border-radius: 2px;
    border: 1px solid #7f7f7f;
  }

  .button-primary {
    background: #249dde;
    background: linear-gradient(to bottom, $btn-color-1 0%, $btn-color-2);
    border-radius: 3px;
    box-shadow: 0px 1px 3px rgba(000, 000, 000, 0),
      inset 0px 0px 1px rgba(255, 255, 255, 1);
    color: #fff;
    font-size: 0.85em;
    width: 100%;
    margin-top: 13px;
    margin-bottom: 13px;
    padding: 10px;
  }

  .button-primary:hover {
    background: linear-gradient(to bottom, $btn-color-2 0%, $btn-color-3);
  }

  button:disabled {
    background: grey;
    cursor: not-allowed;
  }
</style>

<script lang="ts">
  export let click
  export let text = 'Submit'
  export let title = ''
  export let disabled = false
</script>

<button class="button button-primary" {title} on:click={click} {disabled}>
  {text}
</button>
