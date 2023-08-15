<template>
  <div style="background: #0B0F18">
    PageDebug
    <DebugLayoutPageBlock></DebugLayoutPageBlock>
  </div>

</template>

<script>

import DebugLayoutPageBlock from "./DebugLayoutPageBlock.vue";


export default {
  props: {},
  data() {
    return {

    }
  },

  created() {
    console.log("cbc-PageDebug--created");
  },
  watch: {},
  components: {
    "DebugLayoutPageBlock": DebugLayoutPageBlock
  },
  methods: {

  },

  mounted() {
    console.log("cbc-PageDebug--mounted");
  },

}
</script>

<style scoped>

</style>
