<template>
  <div>
    <el-divider content-position="left"><span style="font-size: 18px">字段设置</span></el-divider>
    <div style="padding-top:5px;">
      结果字段：
    </div>
    <div style="padding-top: 10px">
      <el-tag style="margin-left: 10px" v-for="field in currentBlueScript.config.dataset.fields">
        {{ field }}
      </el-tag>
    </div>
    <div style="padding-top:5px;">
      数据字段设置：
    </div>
    <div style="padding-top: 10px">
      <el-tag style="margin-left: 10px" v-for="metric in currentBlueScript.config.dataset.metrics" :key="metric"
        class="mx-1" closable :disable-transitions="false" @close="handleMetricsTagClose(metric)" type="success">
        {{ metric }}
      </el-tag>
      <el-input v-if="metricsInputVisible" ref="metricsInputRef" v-model="metricsInputValue" class="ml-1 w-20"
        size="small" style="margin-left:10px;width: 60px" @keyup.enter="handleMetricsInputConfirm" />
      <el-button v-else class="button-new-tag ml-1" size="small" style="margin-left:10px;" @click="showMetricsInput">
        + New Tag
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { provide, ref, nextTick, onMounted, computed } from "vue";

import { defineStore, storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { currentBlueScript } = storeToRefs(blueScriptDataStoreObj);

console.log("SetDataField--currentBlueScript", currentBlueScript);
const metricsInputVisible=ref(false);
const metricsInputRef=ref(null);
const metricsInputValue = ref("");
const showMetricsInput = () => {
  let the = this;
  metricsInputVisible.value = true
  nextTick(() => {
    console.log("metricsInputRef",metricsInputRef);
    metricsInputRef.value.input.focus();
  });
}

const handleMetricsTagClose = (tab) => {
  console.log("SetDataField--tab",tab);
  for (let i = 0; i < currentBlueScript.value.config.dataset.metrics.length; i++) {
    if (currentBlueScript.value.config.dataset.metrics[i] == tab) {
      currentBlueScript.value.config.dataset.metrics.splice(i, 1);
      i = i - 1;
    }
  }
}

const handleMetricsInputConfirm=()=>{
  if (metricsInputValue.value) {
        currentBlueScript.value.config.dataset.metrics.push(metricsInputValue.value);
      }
      metricsInputVisible.value= false;
      metricsInputValue.value = '';
}



</script>


<style scoped></style>