<template>
  <div style="width: 100%;height: 100%">
    <div v-if="currentBlueScript!=null">
      <el-divider  content-position="left"><span style="font-size: 18px">蓝图Ref</span></el-divider>
      <div style="font-size: 14px;color: rgba(255, 255, 255, 0.6);">{{currentBlueScript.blue_script_ref}}</div>
      <el-divider  content-position="left"><span style="font-size: 18px">类型</span></el-divider>
      <div style="font-size: 14px;color: rgba(255, 255, 255, 0.6);">{{currentBlueScript.blue_script_id}}</div>
    </div>

    <div v-if="currentBlueScript!=null && currentBlueScript?.config?.visualize_config?.describe">
      <el-divider  content-position="left"><span style="font-size: 18px">描述</span></el-divider>
      <div style="font-size: 14px;color: rgba(255, 255, 255, 0.6);">{{currentBlueScript.config.visualize_config.describe}}</div>
    </div>


    <div v-if="currentBlueScript!=null  && currentBlueScript?.config">
      <el-divider content-position="left"><span style="font-size: 18px">蓝图执行逻辑</span></el-divider>
      <el-button type="success" @click="showBlueScriptLogicDialog">蓝图执行逻辑</el-button>
    </div>


    <div v-if="currentBlueScript?.config && showFlag" v-for="(item, index) in currentBlueScript.config.visualize_config.settings">
      <StartPointFlag  v-if="item=='StartPointFlag'"  :currentBlueScript="currentBlueScript"></StartPointFlag>
      <AddInPortAndParam v-if="item=='AddInPortAndParam'" :currentBlueScript="currentBlueScript"></AddInPortAndParam>
      <ShowInParam v-if="item=='ShowInParam'"  :currentBlueScript="currentBlueScript"></ShowInParam>
      <ShowOutParam v-if="item=='ShowOutParam'"  :currentBlueScript="currentBlueScript"></ShowOutParam>
      <SetDataField v-if="item=='SetDataField'" :currentBlueScript="currentBlueScript"></SetDataField>
      <SetDimensionsAndMetrics v-if="item=='SetDimensionsAndMetrics'"  :currentBlueScript="currentBlueScript"></SetDimensionsAndMetrics>
      <ExecFunction v-if="item=='ExecFunction'" :currentBlueScript="currentBlueScript"></ExecFunction>
      <SetName v-if="item=='SetName'"  :currentBlueScript="currentBlueScript"></SetName>
      <SetOption v-if="item=='SetOption'"  :currentBlueScript="currentBlueScript"></SetOption>
      <SetPhoto v-if="item=='SetPhoto'"  :currentBlueScript="currentBlueScript"></SetPhoto>
      <SetXYFromArray v-if="item=='SetXYFromArray'"  :currentBlueScript="currentBlueScript"></SetXYFromArray>
      <SetXYFromObject v-if="item=='SetXYFromObject'"  :currentBlueScript="currentBlueScript"></SetXYFromObject>

      <SetOptionForComponent v-if="item=='SetOptionForComponent'"  :currentBlueScript="currentBlueScript"></SetOptionForComponent>
      <SetParam v-if="item=='SetParam'"  :currentBlueScript="currentBlueScript"></SetParam>

      <RelevanceGlobalSettingParamField v-if="item=='RelevanceGlobalSettingParamField'"  :currentBlueScript="currentBlueScript"></RelevanceGlobalSettingParamField>
      <SetGlobalSettingsField v-if="item=='SetGlobalSettingsField'"  :currentBlueScript="currentBlueScript"></SetGlobalSettingsField>
      <GlobalComponentConfigFlag v-if="item=='GlobalComponentConfigFlag'"  :currentBlueScript="currentBlueScript"></GlobalComponentConfigFlag>
      <GetValueFromArraySetting v-if="item=='GetValueFromArraySetting'" :currentBlueScript="currentBlueScript"></GetValueFromArraySetting>
      <GetValueFromObjectSetting v-if="item=='GetValueFromObjectSetting'" :currentBlueScript="currentBlueScript"></GetValueFromObjectSetting>
      <RelevancePortSetProcessFlagToFalse v-if="item=='RelevancePortSetProcessFlagToFalse'" :currentBlueScript="currentBlueScript"></RelevancePortSetProcessFlagToFalse>
      <RelevanceBlueScriptsRefresh v-if="item=='RelevanceBlueScriptsRefresh'"  :currentBlueScript="currentBlueScript"></RelevanceBlueScriptsRefresh>
      <RelevanceComponents v-if="item=='RelevanceComponents'"  :currentBlueScript="currentBlueScript"></RelevanceComponents>
      <RelevanceBlock v-if="item=='RelevanceBlock'"  :currentBlueScript="currentBlueScript"></RelevanceBlock>

      <RelevanceLayout v-if="item=='RelevanceLayout'"  :currentBlueScript="currentBlueScript"></RelevanceLayout>

    </div>
    <div style="height: 40px;"></div>

    <!--
    <div class="codeDiv"  v-if="blueScriptLogicDialogVisible">
      <MyMonacoEditor  v-if="currentBlueScript?.config" :code="currentBlueScript.config.logic_config_str" @update="updateConfig"></MyMonacoEditor>
    </div>
    -->
    <el-dialog
        v-model="blueScriptLogicDialogVisible"
        title="蓝图执行逻辑"
        append-to-body
        :draggable="true"
        width="80%"
        top="10vh"
        :close-on-click-modal="false"
        style="height: 700px;"
        :modal="false"
        @opened="openedHandle">
      <MyMonacoEditor :id="blueScriptSettingsEditorID" v-if="blueScriptLogicFlag && currentBlueScript?.config" :code="currentBlueScript.config.logic_config_str"
                       @update="updateConfig" style="height:520px;"></MyMonacoEditor>
      <template #footer>
      <span class="dialog-footer" style="padding-bottom:200px">
        <el-button  v-if="debugDisabledFlag" type="primary"  @click="showDebugProcessWin">
          打开调试界面
        </el-button>
        <el-button type="success" :disabled="debugDisabledFlag" @click="debugBlueScriptLogic">
          调 试
        </el-button>
        <el-button type="primary"  @click="blueScriptLogicSave">
          保存为通用逻辑
        </el-button>
        <el-button @click="blueScriptLogicDialogVisible = false">
          关 闭
        </el-button>
        <div v-if="debugDisabledFlag" style="color: red;">需先打开调试界面，并走一次执行流程，方可进行调试</div>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {getCurrentInstance} from "vue"
import MyMonacoEditor from '../../../../common/component/CodeEditor/MyMonacoEditor/index.vue'

import StartPointFlag from './StartPointFlag/index.vue'
import AddInPortAndParam from './AddInPortAndParam/index.vue'
import ShowInParam from './ShowInParam/index.vue'
import ShowOutParam from './ShowOutParam/index.vue'
import SetDataField from './SetDataField/index.vue'
import ExecFunction from './ExecFunction/index.vue'
import SetDimensionsAndMetrics from './SetDimensionsAndMetrics/index.vue'
import RelevanceComponents from './RelevanceComponents/index.vue'
import RelevancePortSetProcessFlagToFalse from './RelevancePortSetProcessFlagToFalse/index.vue'
import SetName from './SetName/index.vue'
import RelevanceBlock from './RelevanceBlock/index.vue'
import RelevanceBlueScriptsRefresh from './RelevanceBlueScriptsRefresh/index.vue'
import GetValueFromObjectSetting from './GetValueFromObjectSetting/index.vue'
import GetValueFromArraySetting from './GetValueFromArraySetting/index.vue'
import GlobalComponentConfigFlag from './GlobalComponentConfigFlag/index.vue'
import SetGlobalSettingsField from './SetGlobalSettingsField/index.vue'
import SetOption from './SetOption/index.vue'
import SetPhoto from './SetPhoto/index.vue'
import SetXYFromArray from './SetXYFromArray/index.vue'
import RelevanceGlobalSettingParamField from './RelevanceGlobalSettingParamField/index.vue'
import SetXYFromObject from './SetXYFromObject/index.vue'

import SetOptionForComponent from './SetOptionForComponent/index.vue'
import SetParam from './SetParam/index.vue'
import RelevanceLayout from './RelevanceLayout/index.vue'



import {
  commonExcuteRequest,
  commonSelectRequest,
  commonSelectRequestAndOtherParam,
  commonExcuteRequestAndOtherParam
} from "../../../../common/js/request.js";

import {js_beautify} from "js-beautify";
import axios from "axios";

export default {
  props: {},

  data() {
    return {
      blueScriptSettingsEditorID:"blueScriptSettingsEditorID",
      blueScriptLogicDialogVisible:false,
      blueScriptLogicFlag:false,
      currentBlueScript: null,
      showFlag:true,
      debugDisabledFlag:true,
    };
  },

  components: {
    MyMonacoEditor:MyMonacoEditor,
    StartPointFlag: StartPointFlag,
    AddInPortAndParam:AddInPortAndParam,
    ShowInParam:ShowInParam,
    ShowOutParam:ShowOutParam,
    SetDataField:SetDataField,
    SetDimensionsAndMetrics:SetDimensionsAndMetrics,
    ExecFunction:ExecFunction,
    RelevanceComponents:RelevanceComponents,
    RelevancePortSetProcessFlagToFalse:RelevancePortSetProcessFlagToFalse,
    SetName:SetName,
    RelevanceBlock:RelevanceBlock,
    RelevanceBlueScriptsRefresh:RelevanceBlueScriptsRefresh,
    GetValueFromObjectSetting:GetValueFromObjectSetting,
    GetValueFromArraySetting:GetValueFromArraySetting,
    GlobalComponentConfigFlag:GlobalComponentConfigFlag,
    SetGlobalSettingsField:SetGlobalSettingsField,
    SetOption:SetOption,
    SetPhoto:SetPhoto,
    SetXYFromArray:SetXYFromArray,
    RelevanceGlobalSettingParamField:RelevanceGlobalSettingParamField,
    SetXYFromObject:SetXYFromObject,
    SetOptionForComponent:SetOptionForComponent,
    SetParam:SetParam,
    RelevanceLayout:RelevanceLayout
  },
  methods: {
    showDebugProcessWin(){
      window.cbcBlueScriptSettingsInstance.data.blueScriptLogicDialogVisible=false;
      window.cbcPageInstance.ctx.showDebugProcessWin(false);
    },
    setCurrentBlueScriptByDebug(blueScript){
      this.showFlag=false;
      let the=this;
      this.$nextTick(()=>{
        the.currentBlueScript=blueScript;
        the.showFlag=true;
      });

    },
    showBlueScriptLogicDialog(){
      this.blueScriptLogicDialogVisible=true;
      this.blueScriptLogicFlag=false;
      if(typeof (this.currentBlueScript.debugParamObj)=="undefined"){
        this.debugDisabledFlag=true;
      }else{
        this.debugDisabledFlag=false;
      }
    },
    openedHandle(){
      this.blueScriptLogicFlag=true;
    },
    debugBlueScriptLogic(){
      console.log("debugBlueScriptLogic--currentBlueScript",this.currentBlueScript);
      if(typeof (this.currentBlueScript.config.execFunctionStr)!="undefined" && this.currentBlueScript.config.execFunctionStr!=""){
        this.currentBlueScript.execFunction=eval("(" + this.currentBlueScript.config.execFunctionStr + ")");
      }
      this.currentBlueScript.debugParamObj.blueScript=this.currentBlueScript;
      this.currentBlueScript.debugParamObj.debugFlag=true;
      this.currentBlueScript.logic_config.logicFun(this.currentBlueScript.debugParamObj);
    },

    updateConfig(code){
      this.currentBlueScript.logic_config=eval("(" + code + ")");
      this.currentBlueScript.config.logic_config_str= js_beautify(code);
    },

    blueScriptLogicCancle(){
      this.blueScriptLogicDialogVisible=false;
    },
    blueScriptLogicSave(){
      console.log("blueScriptLogicSave--this.currentBlueScript",this.currentBlueScript);
      let param = {};
      if(typeof (this.currentBlueScript.component_ref)!="undefined" && this.currentBlueScript.component_ref!=""){
        param.sql = "page_component.updateBlueScriptLogicConfig";
        param.component_id = this.currentBlueScript.type;
        param.blue_script_logic_config_str = this.currentBlueScript.config.logic_config_str;

      }else{
        param.sql = "page_blue_script_tools.updateBlueScriptLogicConfig";
        param.blue_script_id = this.currentBlueScript.type;
        param.blue_script_logic_config_str = this.currentBlueScript.config.logic_config_str;
      }
      console.log("blueScriptLogicSave--param",param);
      commonExcuteRequest(axios, param, this.blueScriptLogicSaveCallBack);
    },
    blueScriptLogicSaveCallBack(result) {
      if (result.state = "success") {
        this.$message.success('保存成功！');
      }
    },
    setCurrentBlueScript(node) {
      //console.log("setCurrentBlueScript--window.cbcPageInstance.data.pageBlueScripts",window.cbcPageInstance.data.pageBlueScripts);
      //console.log("setCurrentBlueScript--node",node);
      for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
        if (window.cbcPageInstance.data.pageBlueScripts[i].blue_script_ref == node.blue_script_ref) {
          this.currentBlueScript = window.cbcPageInstance.data.pageBlueScripts[i];
          console.log("当前选中蓝图节点信息：", this.currentBlueScript);
          //蓝图图层高亮选择
          window.cbcBlueScriptBlockTreeInstance.ctx.blueScriptActiveFun(this.currentBlueScript);
        }
      }
    },


  },
  mounted() {
    window.cbcBlueScriptSettingsInstance = getCurrentInstance();
  }
}
</script>

<style scoped>
:deep(.el-dialog__footer) {
  padding-top: 0px;
  text-align: right;
  box-sizing: border-box;
}

:deep(.el-divider__text) {
  position: absolute;
  background-color: rgb(40, 44, 52);
  padding: 0 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.codeDiv{
  z-index: 9999;
  background-color: #fff;
  border-style:inset;
  width: 80%;
  height: 80%;
  margin: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

}
</style>