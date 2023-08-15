<template>
  <div style="height: 100%;">
    <component :ref="layoutComponentInfo.ref" v-if="showFlag"
               :style="{width: '100%',height: '100%'}" :is="layoutComponentInfo.name"
               :layoutComponentInfo="layoutComponentInfo" :component="componentInfo">
    </component>
  </div>
</template>

<script>
import * as Vue from 'vue'
import pathConfigArr from '../../../../../buildin/pathConfigArr.js'
import {getCurrentInstance} from "vue";

export default {
  props: {
    layoutComponentInfo: {
      type: Object,
      default: null
    },
    componentInfo: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      showFlag:false,

    }
  },
  components: {

  },
  created() {

    console.log("LayoutBuildInComponent--created--componentInfo",this.componentInfo);

  },
  methods: {



  },
  mounted() {
    console.log("LayoutBuildInComponent--mounted--componentInfo",this.componentInfo);
    let pathUrl="";
    for(let i=0;i<pathConfigArr.length;i++){
      if(pathConfigArr[i].type=this.layoutComponentInfo.name){
        pathUrl="../../../../../buildin/"+pathConfigArr[i].path;
      }
    }

    console.log("LayoutBuildInComponent--mounted--pathUrl",pathUrl);

    //"../../../../buildin/Column/index.vue"
    this.$options.components[this.layoutComponentInfo.name] = Vue.defineAsyncComponent({
      loader: () => import(/* @vite-ignore */pathUrl)
    })
    let the = this;
    this.$nextTick(() => {
      the.showFlag = true;
      //console.log("LayoutBuildInComponent--mounted--layoutComponentInfo",the.layoutComponentInfo);

    });

  }
}

</script>

<style scoped>

</style>