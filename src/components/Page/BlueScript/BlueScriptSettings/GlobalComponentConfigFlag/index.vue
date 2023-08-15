<template>
  <div style="width: 100%;height: 100%" v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">全局组件配置</span></el-divider>
    <div>
      <span style="color:rgba(255, 255, 255, 0.5)">是否为全局组件：</span>
      <el-switch  @change="GlobalComponentConfigChange" v-model="currentBlueScript.config.GlobalComponentConfigFlag"/>
      <br>
    </div>
  </div>
</template>

<script>


export default {
  props: {
    currentBlueScript: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {

    };
  },
  components: {

  },
  methods: {
    GlobalComponentConfigChange(val) {
      this.currentBlueScript.config.GlobalComponentConfigFlag = val;
    },
  },
  created() {
    console.log("GlobalComponentConfigFlag--this.currentBlueScript:",this.currentBlueScript);
  },
  mounted() {

  }
}
</script>

<style scoped>
:deep(.el-divider__text) {
  position: absolute;
  background-color: rgb(40, 44, 52);
  padding: 0 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

</style>