<script lang="ts">
  export let click;
  export let text = "Select";
  export let disabled: boolean = false;
</script>

<style>
  button:disabled {
    background: grey;
    cursor: not-allowed;
  }

  .button {
    display: inline-block;
    cursor: pointer;
    margin: 0 auto;
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#ebefef),
      to(#c2c3c3)
    );
    background: -moz-linear-gradient(top, #ebefef 0%, #c2c3c3);
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    border: 1px solid #7f7f7f;
  }

  .button-primary {
    background: #249dde;
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#29d4ff),
      to(#249dde)
    );
    background: -moz-linear-gradient(top, #29d4ff 0%, #249dde);
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    -webkit-box-shadow: 0px 1px 3px rgba(000, 000, 000, 0),
      inset 0px 0px 1px rgba(255, 255, 255, 1);
    -moz-box-shadow: 0px 1px 3px rgba(000, 000, 000, 0),
      inset 0px 0px 1px rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 3px rgba(000, 000, 000, 0),
      inset 0px 0px 1px rgba(255, 255, 255, 1);
    color: #fff;
    font-size: 0.85em;
    width: 100%;
    margin-top: 13px;
    padding: 10px;
  }
</style>

<button
  class="button button-primary"
  {disabled}
  on:click={click}>{text}</button>
