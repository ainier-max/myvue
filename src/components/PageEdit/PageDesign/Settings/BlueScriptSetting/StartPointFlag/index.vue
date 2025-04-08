<template>
  <div style="width: 100%;height: 100%" v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">启动点配置</span></el-divider>
    <div>
      <span style="margin-left:18px">是否为启动点：</span>
      <el-switch  @change="startPointChange" v-model="currentBlueScript.config.startPointFlag"/>
      <br>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineStore, storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { currentBlueScript } = storeToRefs(blueScriptDataStoreObj);
import { addStartPointFlag,removeStartPointFlag } from "@/components/PageEdit/PageDesign/BlueScriptDesign/AntV/AntV.js";

console.log("currentBlueScript21323",currentBlueScript);
const startPointChange=(val)=>{
  currentBlueScript.value.config.startPointFlag = val;
  if(currentBlueScript.value.config.startPointFlag==true){
    addStartPointFlag(currentBlueScript.value.graphNode);
  }else{
    removeStartPointFlag(currentBlueScript.value.graphNode);
  }
}

</script>

<style scoped>


</style>