<template>
  <div style="background: #0B0F18">
    DebugLayoutPageBlock
    <LayoutComponent></LayoutComponent>
  </div>

</template>

<script>

import LayoutComponent from "./LayoutComponent.vue";

export default {
  name:"DebugLayoutPageBlock",
  props: {},
  data() {
    return {

    }
  },

  created() {
    console.log("cbc-DebugLayoutPageBlock--created");
  },
  watch: {},
  components: {
    LayoutComponent:LayoutComponent
  },
  methods: {

  },

  mounted() {
    console.log("cbc-DebugLayoutPageBlock--mounted");
  },

}
</script>

<style scoped>

</style>
