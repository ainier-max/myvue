<template>
  <div style="width: 100%; height: 100%" v-if="currentBlueScript">
    <div class="titleClass" align="center">蓝图配置</div>
    <div class="leftTitle">ref：</div>
    <el-input v-model="currentBlueScript.blue_script_ref" class="rightValue" disabled placeholder="ref：" />

    <div class="leftTitle">类型：</div>
    <el-input v-model="currentBlueScript.blue_script_id" class="rightValue" disabled placeholder="类型：" />

    <div class="leftTitle">名称：</div>
    <el-input
      @input="changeBlueScriptNodeLabel"
      v-model="currentBlueScript.blue_script_name"
      class="rightValue"
      :disabled="currentBlueScript.type != 'blueScriptTool'"
      placeholder="名称："
    />

    <div v-if="currentBlueScript?.config?.blue_script_visualize_config?.describe">
      <div class="leftTitle">描述：</div>
      <el-input v-model="currentBlueScript.config.blue_script_visualize_config.describe" class="rightValue" disabled placeholder="描述：" />
    </div>

    <div v-if="currentBlueScript != null && currentBlueScript?.config && currentBlueScript?.blue_script_id != 'pageOut'" style="margin-left: 18px">
      <el-divider content-position="left"><span style="font-size: 18px">蓝图执行逻辑</span></el-divider>

      <el-button type="success" @click="showBlueScriptLogicDialog">蓝图执行逻辑</el-button><br />
      <span style="color: red; font-size: 12px">仅对管理员开放</span>
    </div>

    <div v-if="currentBlueScript?.config" v-for="(item, index) in currentBlueScript?.config?.blue_script_visualize_config?.settings">
      <StartPointFlag v-if="item == 'StartPointFlag'"></StartPointFlag>
      <DataModelChoose v-if="item == 'DataModelChoose'"></DataModelChoose>
      <AddInPortAndParam v-if="item == 'AddInPortAndParam'"></AddInPortAndParam>
      <ShowInParam v-if="item == 'ShowInParam'"></ShowInParam>
      <ShowOutParam v-if="item == 'ShowOutParam'"></ShowOutParam>
      <SetDimensionsAndMetrics v-if="item == 'SetDimensionsAndMetrics'"></SetDimensionsAndMetrics>
      <GetValueFromObjectSetting v-if="item == 'GetValueFromObjectSetting'"></GetValueFromObjectSetting>
      <InitPageOutParam v-if="item == 'InitPageOutParam'"></InitPageOutParam>
      <RelevancePortSetProcessFlagToFalse v-if="item == 'RelevancePortSetProcessFlagToFalse'"></RelevancePortSetProcessFlagToFalse>
      <ExecFunction v-if="item == 'ExecFunction'"></ExecFunction>
    </div>

    <div style="height: 20px"></div>
  </div>

  <el-dialog
    v-model="blueScriptLogicDialogVisible"
    title="蓝图执行逻辑"
    append-to-body
    :draggable="true"
    width="80%"
    top="10vh"
    :close-on-click-modal="false"
    style="height: 700px"
    :modal="false"
    @opened="openedHandle"
  >
    <div>
      <span
        v-for="(item, index) in Object.keys(blueScriptLogicConfigTemp)"
        class="designButton"
        :style="activeName == item ? { color: 'rgba(0, 0, 0, 1)' } : { color: 'gray' }"
        @click="tabsHandleClick(item)"
        >{{ item }}</span
      >
      <div v-for="(item, index) in Object.keys(blueScriptLogicConfigTemp)">
        <MyMonacoEditor
          :id="'blueScriptSettingsEditorID' + item"
          v-if="activeName == item && blueScriptLogicConfigTemp[item]"
          :code="blueScriptLogicConfigTemp[item]"
          @update="updateConfig"
          style="height: 450px; padding-top: 15px"
        ></MyMonacoEditor>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer" style="padding-bottom: 200px">
        <el-button v-if="!currentBlueScript?.debugParamObj" type="primary" @click="showDebugProcessWin"> 打开调试界面 </el-button>
        <el-button type="success" :disabled="!currentBlueScript?.debugParamObj" @click="debugBlueScriptLogic"> 调 试 </el-button>
        <el-button type="primary" @click="blueScriptLogicSave"> 保存为通用逻辑 </el-button>
        <el-button @click="blueScriptLogicDialogVisible = false"> 关 闭 </el-button>
        <div v-if="!currentBlueScript?.debugParamObj" style="color: red">需先打开调试界面，并走一次执行流程，方可进行调试</div>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { nextTick, ref } from "vue";
  import { defineStore, storeToRefs } from "pinia";
  import { blueScriptDataStore } from "@/store/blueScriptData.ts";
  const blueScriptDataStoreObj = blueScriptDataStore();
  const { blueScriptData, currentBlueScript } = storeToRefs(blueScriptDataStoreObj);

  import MyMonacoEditor from "@/common/component/CodeEditor/MyMonacoEditor/index.vue";
  import { objectToString } from "@/common/js/objStr.js";
  import { js_beautify } from "js-beautify";

  import StartPointFlag from "./StartPointFlag/index.vue";
  import DataModelChoose from "./DataModelChoose/index.vue";
  import AddInPortAndParam from "./AddInPortAndParam/index.vue";
  import ShowInParam from "./ShowInParam/index.vue";
  import ShowOutParam from "./ShowOutParam/index.vue";
  import SetDimensionsAndMetrics from "./SetDimensionsAndMetrics/index.vue";
  import GetValueFromObjectSetting from "./GetValueFromObjectSetting/index.vue";
  import InitPageOutParam from "./InitPageOutParam/index.vue";
  import RelevancePortSetProcessFlagToFalse from "./RelevancePortSetProcessFlagToFalse/index.vue";
  import ExecFunction from "./ExecFunction/index.vue";

  import { ElMessage } from "element-plus";

  import {
    commonExcuteRequest,
    commonSelectRequest,
    commonSelectRequestAndOtherParam,
    commonExcuteByBatchRequest,
    commonBatchSelectRequest,
    commonExcuteRequestAndOtherParam
  } from "@/common/js/request.js";

  const blueScriptLogicDialogVisible = ref(false);
  const blue_script_logic_config_str = ref("");

  const activeName = ref("");

  console.log("当前节点的蓝图配置：", currentBlueScript.value);
  const changeBlueScriptNodeLabel = () => {
    currentBlueScript.value.config.blue_script_node_config.label = currentBlueScript.value.blue_script_name;
    window.antVGraph.getNodes().forEach((element) => {
      if (element.blue_script_ref == currentBlueScript.value.blue_script_ref) {
        element.setAttrs({
          label: { text: currentBlueScript.value.blue_script_name }
        });
      }
    });
  };

  const blueScriptLogicConfigTemp = ref({});
  const tabsHandleClick = (tab) => {
    activeName.value = tab;
  };

  const updateConfig = (code) => {
    console.log("updateConfig--code", code);
    if (code) {
      blueScriptLogicConfigTemp.value[activeName.value] = code;
      blue_script_logic_config_str.value = objectToString(blueScriptLogicConfigTemp.value);
      currentBlueScript.value.config.blue_script_logic_config.logicFun = eval("(" + code + ")");

      blueScriptData.value.forEach((element) => {
        if (element.blue_script_ref == currentBlueScript.value.blue_script_ref) {
          Object.keys(blueScriptLogicConfigTemp.value).forEach((item) => {
            element.config.blue_script_logic_config[item] = eval("(" + blueScriptLogicConfigTemp.value[item] + ")");
          });
        }
      });
    }
  };
  const blueScriptLogicSave = () => {
    console.log("blueScriptLogicSave--currentBlueScript", currentBlueScript.value);
    let param = {};

    if (currentBlueScript.value.type == "blueScriptTool") {
      //蓝图执行逻辑保存
      param.sql = "page_blue_script_tools.updateBlueScriptLogicConfig";
      param.blue_script_id = currentBlueScript.value.blue_script_id;
      param.blue_script_logic_config_str = objectToString(blueScriptLogicConfigTemp.value);
    } else if (currentBlueScript.value.type == "frontEndComponent") {
      //前端组件执行逻辑保存
      param.sql = "page_component_frontend.updateBlueScriptLogicConfig";
      param.component_id = currentBlueScript.value.blue_script_id;
      param.blue_script_logic_config_str = objectToString(blueScriptLogicConfigTemp.value);
    } else if (currentBlueScript.value.type == "packComponent") {
      //前端组件执行逻辑保存
      param.sql = "page_component_pack.updateBlueScriptLogicConfig";
      param.component_id = currentBlueScript.value.blue_script_id;
      param.blue_script_logic_config_str = objectToString(blueScriptLogicConfigTemp.value);
    }
    console.log("blueScriptLogicSave--param", param);
    commonExcuteRequest(axios, param, blueScriptLogicSaveCallBack);
  };

  const blueScriptLogicSaveCallBack = (result) => {
    if ((result.state = "success")) {
      ElMessage.success("保存成功！");
    }
  };

  const debugBlueScriptLogic = () => {
    if (currentBlueScript.value.config.execFunctionStr) {
      currentBlueScript.value.execFunction = eval("(" + currentBlueScript.value.config.execFunctionStr + ")");
    }
    currentBlueScript.value.debugParamObj.blueScript = currentBlueScript.value;
    currentBlueScript.value.debugParamObj.debugFlag = true;
    currentBlueScript.value.config.blue_script_logic_config.logicFun(currentBlueScript.value.debugParamObj);
  };

  const showBlueScriptLogicDialog = () => {
    blueScriptLogicConfigTemp.value = {};
    nextTick(() => {
      console.log("showBlueScriptLogicDialog--currentBlueScript", currentBlueScript.value);
      for (let key in currentBlueScript.value.config.blue_script_logic_config) {
        blueScriptLogicConfigTemp.value[key] = js_beautify(currentBlueScript.value.config.blue_script_logic_config[key].toString());
      }
      console.log("showBlueScriptLogicDialog--blueScriptLogicConfigTemp", blueScriptLogicConfigTemp);
      let code = currentBlueScript.value.config.blue_script_logic_config.logicFun.toString();
      //console.log("showBlueScriptLogicDialog--code",code);
      blue_script_logic_config_str.value = js_beautify(code);
      blueScriptLogicDialogVisible.value = true;
    });
  };

  const openedHandle = () => {
    activeName.value = "";
    nextTick(() => {
      activeName.value = "logicFun";
    });
  };

  const showDebugProcessWin = () => {};
</script>

<style scoped>
  .titleClass {
    width: 100%;
    height: 30px;
    background: #fc74fd;
    color: rgba(255, 255, 255, 1);
    padding-top: 8px;
    font-weight: bold;
  }
  .leftTitle {
    padding-left: 15px;
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 14px;
  }
  .rightValue {
    padding-top: 5px;
    padding-left: 15px;
    padding-right: 15px;
  }

  .designButton {
    font-weight: bold;
    padding-left: 8px;
    cursor: pointer;
  }
</style>
