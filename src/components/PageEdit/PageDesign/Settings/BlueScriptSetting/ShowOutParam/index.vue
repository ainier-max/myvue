<template>
  <div v-if="currentBlueScript?.config" style="margin-left: 18px">
    <el-divider content-position="left"
      ><span style="font-size: 18px">输出参数</span></el-divider
    >
    <div
      v-for="(item, index) in currentBlueScript.config.blue_script_in_out_config
        .out"
      :key="index"
    >
      <div style="font-size: 14px">
        {{ index + 1 }}.{{ item.label }}({{ item.type }})

        <el-switch
          v-model="item.show"
          size="large"
          active-text="开"
          inactive-text="关"
          @change="handleChange($event, item)"
        />
      </div>

      <!--输出参数的格式为array时,用表格展示数据-->
      <div v-if="item.type == 'array'">
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag != true
          "
          disabled
          :value="JSON.stringify(item.value)"
          style="width: 250px"
          placeholder=""
        />
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag == true
          "
          disabled
          :value="item.value.noSaveDescribe"
          style="width: 250px"
          placeholder=""
        />
        <el-input
          v-if="typeof item.value == 'number' || typeof item.value == 'string'"
          disabled
          :value="item.value"
          style="width: 250px"
          placeholder=""
        />
      </div>

      <div v-if="item.type == 'string'">
        <el-input v-model="item.value" style="width: 250px" placeholder="" />
      </div>

      <div v-if="item.show == true && item.type == 'event'">
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag != true
          "
          disabled
          :value="JSON.stringify(item.value)"
          style="width: 250px"
          placeholder=""
        />
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag == true
          "
          disabled
          :value="item.value.noSaveDescribe"
          style="width: 250px"
          placeholder="12"
        />
        <el-input
          v-if="typeof item.value != 'object'"
          disabled
          :value="item.value"
          style="width: 250px"
          placeholder=""
        />
      </div>

      <div v-if="item.show == true && item.type == 'object'">
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag != true
          "
          disabled
          :value="JSON.stringify(item.value)"
          style="width: 250px"
          placeholder=""
        />
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag == true
          "
          disabled
          :value="item.value.noSaveDescribe"
          style="width: 250px"
          placeholder="12"
        />
      </div>

      <!--不确定输出类型-->
      <div v-if="item.show == true && item.type == 'doubtful'">
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag != true
          "
          disabled
          :value="JSON.stringify(item.value)"
          style="width: 250px"
          placeholder=""
        />
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag == true
          "
          disabled
          :value="item.value.noSaveDescribe"
          style="width: 250px"
          placeholder="12"
        />
        <el-input
          v-if="typeof item.value == 'number' || typeof item.value == 'string'"
          disabled
          :value="item.value"
          style="width: 250px"
          placeholder=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { currentBlueScript } = storeToRefs(blueScriptDataStoreObj);
import { ElMessage } from "element-plus";

const handleChange = (event, item) => {
  if (event == false) {
    currentBlueScript.value.graphNode.removePort(item.portID);
  } else {
    currentBlueScript.value.graphNode.addPort({
      key: item.key,
      id: item.portID,
      group: "out",
      markup: [
        {
          tagName: "rect",
          selector: "rect",
        },
      ],
      attrs: {
        rect: {
          magnet: true,
          stroke: "#31d0c6",
          fill: "#ffffff",
          strokeWidth: 2,
          width: 10,
          height: 10,
          x: -5,
          y: -5,
        },
        text: {
          text: item.label, // 标签文本
          fill: "rgba(255,255,255,0.8)",
          fontSize: 12, // 文字大小
        },
      },
    });
  }
};
</script>

<style scoped></style>
