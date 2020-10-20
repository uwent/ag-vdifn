<script lang="ts">
  const moment = require('moment')
  import { setContext } from "svelte";
  import { afflictionValue, endDate, panelKey, startDate, submitParams } from '../../store/store'
  import Button from "../common/Button.svelte";
  export let data;
  setContext(panelKey, {
    getCrops: () => data,
    dateToolTip: {
      startDate: "Date of Emergence/Last Fungicide Application",
      endDate: "Date through which disease severity values are accumulated",
      startLabel: "Application"
    },
    getAfflictionName: () => "Disease"
  });

  const submit = () => {
    submitParams.set({
      start_date: moment.utc($startDate).format("YYYY-MM-DD"),
      end_date: moment.utc($endDate).format("YYYY-MM-DD"),
      pest_id: $afflictionValue,
    })
  };
</script>

<div title="disease parameters">
  <slot></slot>
  <Button click={submit} />
</div>

