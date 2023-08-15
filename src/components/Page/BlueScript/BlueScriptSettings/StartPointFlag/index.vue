<template>
  <div style="width: 100%;height: 100%" v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">启动点配置</span></el-divider>
    <div>
      <span style="color:rgba(255, 255, 255, 0.5)">是否为启动点：</span>
      <el-switch  @change="startPointChange" v-model="currentBlueScript.config.startPointFlag"/>
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
    startPointChange(val) {
      this.currentBlueScript.config.startPointFlag = val;
      if(this.currentBlueScript.config.startPointFlag==true){
        window.cbcBlueScriptInstance.ctx.addStartPointFlag(this.currentBlueScript.node, this.currentBlueScript.config);
      }else{
        window.cbcBlueScriptInstance.ctx.removeStartPointFlag(this.currentBlueScript.node);
      }
    },
  },
  created() {
    //console.log("currentBlueScript8891:",this.currentBlueScript);
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