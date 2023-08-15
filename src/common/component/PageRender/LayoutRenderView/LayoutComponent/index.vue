<template>
  <div style="height: 100%;">
    <component :ref="componentInfo.component_ref" v-if="showFlag && componentInfo!=null && componentInfo.component_config.attr.show==true"
               :style="{width: '100%',height: '100%',zIndex:componentInfo.component_config.attr.zIndex}" :is="componentInfo.component_type"
               @event="eventFun"
               :component="componentInfo">
    </component>
    <!--
    <div v-if="showFlag && componentInfo==null"
         style="width: 100%;height: 100%;background-image: linear-gradient(180deg,#274351,#1a2646);align:center;">

    </div>
    -->
  </div>
</template>

<script>
//解决echart的警告:Added non-passive event listener to a scroll-blocking ‘mousewheel’ event
//但是codeMirror可能会报错：Unable to preventDefault inside passive event listener invocation.
//import 'default-passive-events'
import * as Vue from 'vue'
import {getCurrentInstance} from "vue";


export default {
  props: {
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
      showFlag: true,
      type: "type",
      componentStyle: null,
      //component_type为空时，警告：Invalid vnode type when creating vnode: .
      component_type: 'component_type',
      component: null,
      topPageBlockInstance:null,
    }
  },
  //供动态注册组件使用,不可删除
  components: {},

  created() {
    this.topPageBlockInstance=window.cbcDebugPageInstance[this.topPageBlockRef];
    //console.log("cbc-LayoutComponent--created");

    //console.log(this.componentInfo.component_ref+",组件信息");
    //console.log("组件信息：",this.componentInfo);


    if(this.componentInfo!=null && typeof (this.componentInfo.component_config.dataset)=="undefined"){
      this.componentInfo.component_config.dataset={};
      this.componentInfo.component_config.dataset.data=[];
      this.componentInfo.component_config.dataset.fields=[];
      this.componentInfo.component_config.dataset.metrics=[];
      this.componentInfo.component_config.dataset.dimension=[];
    }
    if(this.componentInfo!=null && typeof (this.componentInfo.component_config.dataset.data)=="undefined"){
      this.componentInfo.component_config.dataset.data=[];
    }

    this.setComponentInfo(this.componentInfo);
  },
  methods: {
    excuteComponentFun(methodName){
      this.$refs[this.componentInfo.component_ref][methodName]();
    },

    eventFun(eventType, obj, component) {


      console.log("LayoutComponent--事件类型：", eventType);
      console.log("LayoutComponent--事件传递值：", obj);
      console.log("LayoutComponent--当前组件信息：", component);
      console.log("LayoutComponent--当前组件对象：", this.$refs[component.component_ref]);


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
    setProcessFlag(relevancedRef,pordedID){
      console.log("setProcessFlag为false--relevancedRef,pordedID",relevancedRef,pordedID);
      for(let i=0;i<this.topPageBlockInstance.data.pageBlueScripts.length;i++){
        if(this.topPageBlockInstance.data.pageBlueScripts[i].blue_script_ref==relevancedRef){
          let inTemp=this.topPageBlockInstance.data.pageBlueScripts[i].config.in_out_config.in;
          //console.log("要设置关联的蓝图节点1235inTemp：",inTemp);
          for(let j=0;j<inTemp.length;j++){
            if(inTemp[j].portID==pordedID){
              inTemp[j].ifProcessFlag=false;
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


    //清除组件
    clearComponent() {
      this.$options.components[this.component_type] = null;
    },
    refreshFun(component) {
      //console.log("更新的组件信息：", component);

      let the = this;
      the.showFlag = false;
      //如果组件的属性show为false,则不进行展示
      if (typeof (component.component_config.attr) == "undefined") {
        console.log("配置内容无attr属性！")
        return;
      } else if (component.component_config.attr.show == false) {
        console.log(component.component_type + "组件被隐藏")
        return;
      }
      this.resetPageComponents(component);
    },
    //重新设置PageComponents的数据
    resetPageComponents(component) {
      for (let i = 0; i < this.topPageBlockInstance.data.pageComponents.length; i++) {
        if (this.topPageBlockInstance.data.pageComponents[i].component_ref == component.component_ref) {
          this.topPageBlockInstance.data.pageComponents[i] = component;
        }
      }
      let the = this;
      the.$nextTick(() => {
        the.showFlag = true;
      });
    },

    //设置组件代码
    setComponentInfo(componentInfo) {
      if (componentInfo == null) {
        this.type = "no";
      } else {
        this.type = "component";
        this.component = componentInfo;
        this.component_type = componentInfo.component_type;
        let componentTemp = this.$options.components[this.component_type];
        //console.log("componentTemp",componentTemp);
        this.showFlag = false;

        if (typeof (componentTemp) == "undefined" || this.$options.components[this.component_type] == null) {
          this.registerComponent(componentInfo.component_code);
        } else {
          let the = this;
          this.$nextTick(() => {
            the.showFlag = true;
          });
        }
      }
    },
    //注册组件
    registerComponent(component_code) {
      var option = {
        moduleCache: {vue: Vue, echarts: window['echarts']},
        getFile(url) {
          return Promise.resolve(component_code);
        },
        addStyle(textContent) {
          //console.log("textContent",textContent);
          const style = Object.assign(document.createElement('style'), {textContent});
          const ref = document.head.getElementsByTagName('style')[0] || null;
          document.head.insertBefore(style, ref);
        },
      };
      let component = window.loadModule("./Main.vue", option);
      //局部动态注册组件
      this.$options.components[this.component_type] = Vue.defineAsyncComponent(() => component);
      //console.log("this.$options:",this.$options);
      //全局动态注册组件
      //window.cbcApp.component(this.componentInfo.component_type, Vue.defineAsyncComponent(() => component));
      console.log("cbc-注册组件", this.component_type);
      let the = this;
      this.$nextTick(() => {
        the.showFlag = true;
      });

    }
  },
  mounted() {
    console.log("加入组件实例");
    console.log("LayoutComponent--mounted--this.componentInfo",this.componentInfo);
    if(this.componentInfo.component_type=="cbc-menu-horizontal"){
      console.log("qqqqqqq",this.componentInfo);
    }

    let instanceTemp=getCurrentInstance();
    instanceTemp.component_ref=this.componentInfo.component_ref;
    window["page"+this.componentInfo.page_id].cbcDebugPageComponentsInstance.push(instanceTemp);
  }
}

</script>

<style scoped>
:deep(.el-divider__text) {
  position: absolute;
  background-color: rgb(240, 244, 252);
  padding: 0 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

</style>