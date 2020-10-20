<script lang="ts">
  const moment = require('moment')
  import { setContext } from "svelte";
  import { afflictionValue, endDate, panelKey, startDate, submitParams } from '../../store/store'
  import Button from '../common/Button.svelte'
  export let data;
  
  setContext(panelKey, {
    getCrops: () => data,
    dateToolTip: {
      startDate: "Biofix date for insect",
      endDate: "Date through which degree days are accumulated",
      startLabel: "Biofix"
    },
    getAfflictionName: () => "Insect"
  })

  function submit() {
    submitParams.set({
      start_date: moment.utc($startDate).format("YYYY-MM-DD"),
      end_date: moment.utc($endDate).format("YYYY-MM-DD"),
      pest_id: $afflictionValue,
    })
  };

</script>

<div title="Insect Parameters">
  <slot></slot>
  <Button click={submit} />
</div>

