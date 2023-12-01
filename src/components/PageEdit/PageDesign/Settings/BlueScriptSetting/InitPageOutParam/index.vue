<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"
      ><span style="font-size: 18px">更新初始参数</span></el-divider
    >
    <el-button
      type="success"
      size="small"
      @click="InitPageOutParam"
      style="margin-left: 18px; "
      >更新初始参数</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { objectToString, stringToObject } from "@/common/js/objStr.js";

import {
  commonExcuteByBatchRequest
} from "@/common/js/request.js";
import { storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(
  pageRenderTreeDataStoreObj
);

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);

import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { blueScriptData, currentBlueScript } = storeToRefs(
  blueScriptDataStoreObj
);
const InitPageOutParam=()=>{
    //console.log("InitPageOutParam--currentBlueScript",currentBlueScript);
    //console.log("InitPageOutParam--pageRenderTreeData",pageRenderTreeData);
    console.log("InitPageOutParam--blueScriptData",blueScriptData);

    let page_id_Temp="";
    pageRenderTreeData.value.forEach(element => {
        if(element.ref==currentBlueScript.value.related_ref){
            page_id_Temp=element.page_id;
        }
    });
    console.log("page_id_Temp",page_id_Temp);
    //找出page_id需要更新的蓝图节点
    let updateBlueScriptData=[];
    blueScriptData.value.forEach(element => {
        if(element.page_id==page_id_Temp){
            //创建新对象（去除不必要的对象属性，如：graphNode,debugParamObj）
            element.config_str = objectToString(element.config);
            let objTemp = window._.cloneDeep(element);
            if (objTemp.debugParamObj) {
             delete objTemp.debugParamObj;
            }
            updateBlueScriptData.push(objTemp);
        }
    });

    let param = {};
    param.sql = "page_blue_script.onlyUpdatePageBlueScript";
    param.page_id = page_id_Temp;
    param.blueScriptData = updateBlueScriptData;
    console.log("saveBlueScript--param", param);
    commonExcuteByBatchRequest(window.axios, param, InitPageOutParamCallBack);
}
const InitPageOutParamCallBack=(result )=>{
    if ((result.state = "success")) {
        ElMessage.success("更新初始参数成功！");
    }
}
</script>

<style>

</style>