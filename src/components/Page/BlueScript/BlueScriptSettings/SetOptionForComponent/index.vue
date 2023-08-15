<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">组件配置信息</span></el-divider>
    <el-button type="success" @click="showBlueScriptOptionDialog">组件配置信息</el-button>


    <el-dialog
        v-model="componentOptionDialogVisible"
        title="组件配置信息"
        append-to-body
        :draggable="true"
        width="60%"
        top="20vh"
        :close-on-click-modal="false"
        style="height: 500px;"
        :modal="false"
        @opened="openedHandle">
      <MyMonacoEditor v-if="componentOptionFlag" :id="SetComponentOptionEditorID" style="overflow-y: hidden;height: 300px;width: 100%"
                      :code="componentConfigStr" @update="updateConfig"></MyMonacoEditor>
      <template #footer>
      <span class="dialog-footer" style="padding-bottom:200px">
        <el-button @click="closeHandle">
          关 闭
        </el-button>
      </span>
      </template>
    </el-dialog>


  </div>
</template>

<script>

import MyMonacoEditor from '../../../../../common/component/CodeEditor/MyMonacoEditor/index.vue'

import {objectToString, stringToObject} from "../../../../../common/js/objStr";
import {js_beautify} from "js-beautify";

export default {
  props: {
    currentBlueScript: {
      type: Object,
      default: {}
    },
  },
  data: function () {
    return {
      SetComponentOptionEditorID:"SetComponentOptionEditorID",
      componentOptionFlag:false,
      componentOptionDialogVisible:false,
      componentConfigStr:"",
    }
  },
  components: {
    MyMonacoEditor:MyMonacoEditor,
  },

  created() {

  },
  watch: {

  },
  methods: {
    closeHandle(){
      this.componentOptionDialogVisible = false;
      this.componentOptionFlag=false;
    },
    openedHandle(){
      this.componentOptionFlag=false;
      if(typeof (this.currentBlueScript.config.optionStr)=="undefined"){
        this.currentBlueScript.config.optionStr='{\r\n    option: {\r\n   \r\n    }\r\n}';
        let the=this;
        this.$nextTick(()=>{
          the.componentOptionFlag=true;
        });
      }else{
        let the=this;
        this.$nextTick(()=>{
          the.componentOptionFlag=true;
        });
      }
    },
    showBlueScriptOptionDialog(){
      this.componentOptionDialogVisible=true;
    },
    updateConfig(code) {
      let component_ref=this.currentBlueScript.component_ref;
      let pageComponentsTemp=window.cbcPageInstance.data.pageComponents;
      for(let i=0;i<pageComponentsTemp.length;i++){
        if(component_ref==pageComponentsTemp[i].component_ref){
          console.log("SetOptionForComponent--pageComponentsTemp[i]",pageComponentsTemp[i]);
          pageComponentsTemp[i].component_config.option=stringToObject(code);
        }
      }

    },
  },
  mounted() {
    console.log("SetOptionForComponent--this.currentBlueScript",this.currentBlueScript);
    let component_ref=this.currentBlueScript.component_ref;
    let pageComponentsTemp=window.cbcPageInstance.data.pageComponents;
    for(let i=0;i<pageComponentsTemp.length;i++){
      if(component_ref==pageComponentsTemp[i].component_ref){
        console.log("SetOptionForComponent--pageComponentsTemp[i]",pageComponentsTemp[i]);
        this.componentConfigStr=js_beautify(objectToString(pageComponentsTemp[i].component_config.option));
      }
    }

  }
}
</script>

<style scoped>


</style>