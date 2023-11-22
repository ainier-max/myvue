<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"
      ><span style="font-size: 18px">蓝图添加输入参数</span></el-divider
    >

    <el-form :model="form" label-width="80px">
      <el-form-item label="字段名">
        <el-input v-model="form.paramName" style="margin-right:20px"/>
      </el-form-item>
      <el-form-item label="字段类型">
        <el-select
          v-model="form.paramType"
          class="m-2"
          style="width: 150px;"
          placeholder="Select"
        >
          <el-option
            v-for="item in paramTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-button
      type="success"
      size="small"
      @click="addParamIn"
      style="margin-left: 18px; "
      >增加</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { currentBlueScript } = storeToRefs(blueScriptDataStoreObj);
import { ElMessage } from "element-plus";

const form = ref({
  paramName: "",
  paramType: "string",
});

let paramTypes = [
  {
    value: "string",
    label: "string",
  },
  {
    value: "number",
    label: "number",
  },
  {
    value: "array",
    label: "array",
  },
];

const addParamIn = () => {
  if (form.value.paramName == "") {
    ElMessage.error("未输入参数名称！");
    return;
  }
  let obj = {};
  obj.key = form.value.paramName;
  obj.label = form.value.paramName;
  obj.type = form.value.paramType;
  obj.connected = false;
  obj.portID = "in_port_" + window.cbcuuid();
  if (obj.type == "string") {
    obj.value = "";
  } else if (obj.type == "number") {
    obj.value = 0;
  } else if (obj.type == "array") {
    obj.value = [];
  }
  obj.show = true;
  currentBlueScript.value.config.blue_script_in_out_config.in.push(obj);
  //重置
  form.value.paramName = "";
  //新增蓝图节点端口
  currentBlueScript.value.graphNode.addPort({
    key: obj.key,
    id: obj.portID,
    group: "in",
    attrs: {
      text: {
        text: obj.label, // 标签文本
        fill: "rgba(255,255,255,0.8)",
        fontSize: 12, // 文字大小
      },
    },
  });
};
</script>

<style scoped></style>
