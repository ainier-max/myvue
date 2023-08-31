<template>
  <div style="height: 100%;">
    <component :ref="layoutComponentInfo.ref" v-if="showFlag"
               :style="{width: '100%',height: '100%'}" :is="layoutComponentInfo.name"
               @event="eventFun"
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
    renderType: {
      type: String,
      default: ''
    },
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
    topPageBlockRef: {
      type: String,
      default: ''
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
    if (this.renderType=="View") {
      this.topPageBlockInstance=window.cbcDebugPageInstance[this.topPageBlockRef];
    }
    console.log("LayoutBuildInComponent--created--componentInfo",this.componentInfo);

  },
  methods: {
    eventFun(eventType, obj, component) {
      //界面设计页面无需执行事件逻辑
      if (this.renderType == "Edit") {
        return;
      }
      console.log("eventFun--事件类型：", eventType);
      console.log("eventFun--事件传递值：", obj);
      console.log("eventFun--当前组件信息：", component);
      console.log("eventFun--当前组件对象：", this.$refs[component.component_ref]);

      let pageBlueScriptsTemp=this.topPageBlockInstance.data.pageBlueScripts;
      //console.log("pageBlueScriptsTemp",pageBlueScriptsTemp);
      for(let i=0;i<pageBlueScriptsTemp.length;i++){
        if(pageBlueScriptsTemp[i].component_ref==component.component_ref){
          //console.log("当前组件对象对应的蓝图对象：",pageBlueScriptsTemp[i]);
          //设置全局组件对象
          if(pageBlueScriptsTemp[i].config.GlobalComponentConfigFlag==true){
            let flagTemp=0;
            for(let m=0;m<window.cbcGlobalSettings.components.length;m++){
              if(window.cbcGlobalSettings.components[m].component.component_ref==component.component_ref){
                flagTemp=1;
              }
            }
            if(flagTemp==0){
              window.cbcGlobalSettings.components.push(this.$refs[component.component_ref]);
            }
            console.log("全局组件配置window.cbcGlobalSettings：",window.cbcGlobalSettings);
          }

          if(typeof(pageBlueScriptsTemp[i].config.in_out_config.out)=="undefined" || pageBlueScriptsTemp[i].config.in_out_config.out.length==0){

          }else{
            //pageBlueScriptsTemp[i].config.in_out_config.out[0].value=obj;
            console.log("当前蓝图：",pageBlueScriptsTemp[i]);
            //设置蓝图所关联的蓝图节点的运行状态为false
            if(typeof (pageBlueScriptsTemp[i].config.settings)!="undefined" && typeof (pageBlueScriptsTemp[i].config.settings.RelevancePortSetProcessFlagToFalse)!="undefined"){
              for(let j=0;j<pageBlueScriptsTemp[i].config.settings.RelevancePortSetProcessFlagToFalse.length;j++){
                let relevanceBlueScriptTemp=pageBlueScriptsTemp[i].config.settings.RelevancePortSetProcessFlagToFalse[j];
                this.setProcessFlag(relevanceBlueScriptTemp.relevancedRef,relevanceBlueScriptTemp.pordedID);
              }
            }

            let outTemp=pageBlueScriptsTemp[i].config.in_out_config.out;
            for(let m=0;m<outTemp.length;m++){
              //console.log("outTemp[m].key",outTemp[m].key);
              //console.log("eventType",eventType);
              if(outTemp[m].label==eventType){
                console.log("当前蓝图节点执行并赋值：",outTemp[m]);
                //赋值
                outTemp[m].value=obj;
                //如果有连接线，则执行下一个蓝图节点
                let connectedTargetArrTemp=outTemp[m].connectedTargetArr;
                for(let j=0;j<connectedTargetArrTemp.length;j++){
                  this.runProcessByRefForEvent(outTemp[m].connectedSource,connectedTargetArrTemp[j],obj);
                }
              }
            }
          }
        }
      }
    },
    //根据蓝图ref执行蓝图节点
    runProcessByRefForEvent(connectedSource,connectedTarget,obj){
      console.log("runProcessByRefForEvent--connectedSource,connectedTarget,obj");
      console.log(connectedSource,connectedTarget,obj);
      let pageBlueScriptsTemp=this.topPageBlockInstance.data.pageBlueScripts;
      for(let i=0;i<pageBlueScriptsTemp.length;i++){
        if(pageBlueScriptsTemp[i].blue_script_ref==connectedTarget.cell){
          let inTemp=pageBlueScriptsTemp[i].config.in_out_config.in;
          for(let j=0;j<inTemp.length;j++){
            if(inTemp[j].portID==connectedTarget.port){
              //蓝图端口赋值并修改其运行状态
              inTemp[j].value=obj;
              inTemp[j].ifProcessFlag=true;
            }
          }
          console.log("下一个蓝图节点执行：",pageBlueScriptsTemp[i]);
          this.topPageBlockInstance.ctx.runBlueScriptProcess(connectedSource.port,connectedTarget.port,pageBlueScriptsTemp[i]);
        }
      }
    },



  },
  mounted() {
    console.log("LayoutBuildInComponent--mounted--componentInfo", this.componentInfo);
    console.log("LayoutBuildInComponent--mounted--renderType", this.renderType);

    
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
      if (the.renderType=="View") {
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
      }
  
    });

  }
}

</script>

<style scoped>

</style>