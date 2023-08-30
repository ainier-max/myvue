<template>
  <div style="height: 100%;">
    <component :ref="layoutComponentInfo.ref" v-if="showFlag"
               :style="{width: '100%',height: '100%'}" :is="layoutComponentInfo.name" :layoutComponentInfo="layoutComponentInfo"
               :component="componentInfo">
    </component>
  </div>
</template>

<script>
import * as Vue from 'vue'
import pathConfigArr from '../../../../../buildin/pathConfigArr.js'
import {getCurrentInstance} from "vue";

export default {
  props: {
    page_id: {
      type: String,
      default: ''
    },
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
    console.log("LayoutBuildInComponent--created123");

  },
  methods: {



  },
  mounted() {
    console.log("LayoutBuildInComponent--mounted--this.layoutComponentInfo",this.layoutComponentInfo);

    let instanceTemp=getCurrentInstance();
    let pathUrl="";
    for(let i=0;i<pathConfigArr.length;i++){
      if(pathConfigArr[i].type==this.layoutComponentInfo.name){
        pathUrl="../../../../../buildin/"+pathConfigArr[i].path;
      }
    }

    //"../../../buildin/Column/index.vue"

    this.$options.components[this.layoutComponentInfo.name] = Vue.defineAsyncComponent({
      loader: () => import(/* @vite-ignore */pathUrl)
    })

    let the = this;
    this.$nextTick(() => {
      the.showFlag = true;
      //console.log("LayoutBuildInComponent--mounted--layoutComponentInfo",the.layoutComponentInfo);
      the.$nextTick(()=>{
        instanceTemp.component_ref=the.layoutComponentInfo.ref;
        console.log("LayoutBuildInComponent--mounted--instanceTemp1",instanceTemp);
        /**
         * 如果存在则替换，不存在则添加
         * @type {number}
         */
        let flag=0;
        console.log("LayoutBuildInComponent--mounted--window",window);
        console.log("LayoutBuildInComponent--mounted--window",this.page_id);
        for(let i=0;i<window["page"+this.page_id].cbcDebugPageComponentsInstance.length;i++){
          if(window["page"+this.page_id].cbcDebugPageComponentsInstance[i].component_ref==the.layoutComponentInfo.ref){
            window["page"+this.page_id].cbcDebugPageComponentsInstance[i]=instanceTemp;
            flag=1
          }
        }
        if(flag==0){
          window["page"+this.page_id].cbcDebugPageComponentsInstance.push(instanceTemp);
        }
        console.log("LayoutBuildInComponent--mounted--window[\"page\"+this.page_id].cbcDebugPageComponentsInstance",window["page"+this.page_id].cbcDebugPageComponentsInstance);
      });
    });

  }
}

</script>

<style scoped>

</style>