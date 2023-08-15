<template>
  <div style="width: 100%;height: 100%;">
    <el-button type="primary" @click="getBuildInComponent('BuildInComponentColumn')">
      栏目组件
    </el-button>
  </div>

</template>

<script>
import pathConfigArr from '../../../../../../buildin/pathConfigArr.js'

export default {
  props: {

  },
  data: function () {
    return {


    }
  },

  created() {

  },
  components: {},
  methods: {
    getBuildInComponent(type){
      let param={};
      for(let i=0;i<pathConfigArr.length;i++){
        if(pathConfigArr[i].type==type){
          param=pathConfigArr[i];
        }
      }
      this.$emit("getBuildInComponent",param);
    }

  },
  mounted() {

  }
}
</script>

<style scoped>

</style>