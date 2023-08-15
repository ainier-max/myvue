<template>
  <div >
    <el-divider content-position="left"><span style="font-size: 18px">名称设置</span></el-divider>
    <el-input v-model="currentBlueScript.name" style="width: 280px;padding-top: 10px"
              placeholder="输入参数字段名"/><br>
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
  data: function () {
    return {



    }
  },

  created() {

  },
  watch: {
    'currentBlueScript.name': {
      handler(newVal, oldVal) {
        //console.log("SetName--newVal",newVal);
        let nodesTemp = window.cbcBlueScriptInstance.data.graph.getNodes();
        console.log("SetName--nodesTemp",nodesTemp);
        console.log("SetName--this.currentBlueScript",this.currentBlueScript);
        for(let i=0;i<nodesTemp.length;i++){
          if(nodesTemp[i].blue_script_ref==this.currentBlueScript.blue_script_ref){
            nodesTemp[i].setAttrs({
              label: { text: newVal }
            })
          }
        }
      }
    }
  },

  methods: {

  },
  mounted() {


  }
}
</script>

<style scoped>

</style>