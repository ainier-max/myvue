<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"
      ><span style="font-size: 18px">对象取值设置</span></el-divider
    >
    <div style="margin-top: 5px; font-size: 14px">返回值：</div>

    <el-select
      v-model="currentBlueScript.config.settings.GetValueFromObjectSetting"
      class="m-2"
      style="width: 150px; padding-top: 10px"
      placeholder="Select"
    >
      <el-option
        v-for="item in returnValues"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { currentBlueScript } = storeToRefs(blueScriptDataStoreObj);

const returnValues = computed(() => {
  let returnValuesTemp = [];
  Object.keys(
    currentBlueScript.value.config.blue_script_in_out_config.in[0].value
  ).forEach((inItem) => {
    let obj = {};
    obj.value = inItem;
    obj.label = inItem;
    returnValuesTemp.push(obj);
  });
  //console.log("returnValuesTemp1232",returnValuesTemp);
  return returnValuesTemp;
});
</script>

<style scoped></style>
