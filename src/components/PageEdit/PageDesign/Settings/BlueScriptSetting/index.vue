<template>
  <div
    style="width: 100%; height: 100%; overflow: auto"
    v-if="currentBlueScript"
  >
    <div class="titleClass" align="center">蓝图配置</div>
    <div class="leftTitle">ref：</div>
    <el-input
      v-model="currentBlueScript.blue_script_ref"
      class="rightValue"
      disabled
      placeholder="ref："
    />

    <div class="leftTitle">类型：</div>
    <el-input
      v-model="currentBlueScript.blue_script_id"
      class="rightValue"
      disabled
      placeholder="类型："
    />
    <template
      v-if="currentBlueScript?.config?.blue_script_visualize_config?.describe"
    >
      <div class="leftTitle">描述：</div>
      <el-input
        v-model="currentBlueScript.config.blue_script_visualize_config.describe"
        class="rightValue"
        disabled
        placeholder="描述："
      />
    </template>

    <div class="leftTitle">名称：</div>
    <el-input
      @input="changeBlueScriptNodeLabel"
      v-model="currentBlueScript.blue_script_name"
      class="rightValue"
      :disabled="currentBlueScript.type != 'blueScriptTool'"
      placeholder="名称："
    />
  </div>
</template>

<script setup lang="ts">
import { defineStore, storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { currentBlueScript } = storeToRefs(blueScriptDataStoreObj);

console.log("当前节点的蓝图配置：", currentBlueScript.value);
const changeBlueScriptNodeLabel = () => {
  currentBlueScript.value.config.blue_script_node_config.label =
    currentBlueScript.value.blue_script_name;
  window.antVGraph.getNodes().forEach((element) => {
    if (element.blue_script_ref == currentBlueScript.value.blue_script_ref) {
      element.setAttrs({
        label: { text: currentBlueScript.value.blue_script_name },
      });
    }
  });
};
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
</style>
