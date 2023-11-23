<template>
  <div v-if="currentBlueScript.config.dataset">
    <el-divider content-position="left"
      ><span style="font-size: 18px">字段设置</span></el-divider
    >
    <div style="padding-top: 5px">结果字段：</div>
    <div style="padding-top: 10px">
      <el-tag
        style="margin-left: 10px"
        v-for="field in currentBlueScript.config.dataset?.fields"
      >
        {{ field }}
      </el-tag>
    </div>

    <div style="padding-top: 5px">维度字段设置：</div>
    <div style="padding-top: 10px">
      <el-tag
        style="margin-left: 10px"
        v-for="dimension in currentBlueScript.config.dataset?.dimensions"
        :key="dimension"
        class="mx-1"
        closable
        :disable-transitions="false"
        @close="handleDimensionTagClose(dimension)"
        type="success"
      >
        {{ dimension }}
      </el-tag>
      <el-input
        v-if="dimensionInputVisible"
        ref="dimensionInputRef"
        v-model="dimensionInputValue"
        class="ml-1 w-20"
        size="small"
        style="margin-left: 10px; width: 60px"
        @keyup.enter="handleDimensionInputConfirm"
      />
      <el-button
        v-else
        class="button-new-tag ml-1"
        size="small"
        style="margin-left: 10px"
        @click="showDimensionInput"
      >
        + New Tag
      </el-button>
    </div>
    <div style="padding-top: 5px">指标字段设置：</div>
    <div style="padding-top: 10px">
      <el-tag
        style="margin-left: 10px"
        v-for="metric in currentBlueScript.config.dataset?.metrics"
        :key="metric"
        class="mx-1"
        closable
        :disable-transitions="false"
        @close="handleMetricsTagClose(metric)"
        type="success"
      >
        {{ metric }}
      </el-tag>
      <el-input
        v-if="metricsInputVisible"
        ref="metricsInputRef"
        v-model="metricsInputValue"
        class="ml-1 w-20"
        size="small"
        style="margin-left: 10px; width: 60px"
        @keyup.enter="handleMetricsInputConfirm"
      />
      <el-button
        v-else
        class="button-new-tag ml-1"
        size="small"
        style="margin-left: 10px"
        @click="showMetricsInput"
      >
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

console.log("SetDimensionsAndMetrics--currentBlueScript", currentBlueScript);

const dimensionInputVisible = ref(false);
const dimensionInputValue = ref("");
const metricsInputVisible = ref(false);
const metricsInputValue = ref("");

const dimensionInputRef = ref(null);
const showDimensionInput = () => {
  dimensionInputVisible.value = true;
  nextTick(() => {
    console.log("dimensionInputRef",dimensionInputRef)
    dimensionInputRef.value.input.focus();
  });
};

const metricsInputRef= ref(null);
const showMetricsInput=()=>{
  metricsInputVisible.value=true;
  nextTick(() => {
    console.log("metricsInputRef",metricsInputRef)
    metricsInputRef.value.input.focus();
  });
}



const handleDimensionTagClose = (tab) => {
  for (let i = 0; i < currentBlueScript.value.config.dataset.dimensions.length; i++) {
    if (currentBlueScript.value.config.dataset.dimensions[i] == tab) {
      currentBlueScript.value.config.dataset.dimensions.splice(i, 1);
      i = i - 1;
    }
  }
};


</script>

<style></style>
