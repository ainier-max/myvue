<template>
  <div style="width: 100%; height: 100%" v-if="currentBlueScript?.config">
    <el-divider content-position="left"
      ><span style="font-size: 18px" >数据模型</span></el-divider
    >
    <div>
      <el-button
        @click="showDataModelChooseDidlog()"
        style="margin-left: 18px"
        type="primary"
        size="small"
        >数据模型</el-button
      >
      <span
        style="margin-left: 5px"
        v-if="currentBlueScript?.config?.dataModel?.label"
        >{{ currentBlueScript.config.dataModel.label }}</span
      >
    </div>
  </div>

  <el-dialog
    title="数据模型选择（单击选中）"
    v-model="dialogFlag"
    :close-on-click-modal="false"
    width="30%"
  >
    <el-tree
      ref="dataModelTreeRef"
      :data="dataModelTreeData"
      node-key="id"
      :default-expand-all="false"
      :expand-on-click-node="false"
      :props="defaultProps"
      :highlight-current="true"
      :default-expanded-keys="['1']"
      @node-click="handleNodeClick"
      style="margin-left: 50px; height: 300px; overflow-y: auto"
    >
    </el-tree>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { currentBlueScript } = storeToRefs(blueScriptDataStoreObj);

import { getListData, findNodeById } from "@/common/js/tree.js";
import { commonSelectRequest } from "@/common/js/request.js";
let defaultProps = {
  children: "children",
  label: "label",
};
const dialogFlag = ref(false);
const dataModelTreeData = ref(null);

//查找组件树
const findDataModelTree = () => {
  let param = {};
  param.sql = "page_data_model_tree.find";
  commonSelectRequest(window.axios, param, findDataModelTreeCallBack);
};
const findDataModelTreeCallBack = (result) => {
  dataModelTreeData.value = getListData(result.objects, [
    "name_space",
    "data_model_id",
    "data_model_type",
    "data_model_sql",
    "data_model_param",
    "is_cache",
  ]);
  console.log("dataModelTreeData", dataModelTreeData);
};
findDataModelTree();

const showDataModelChooseDidlog = () => {
  dialogFlag.value = true;
};
const handleNodeClick = (item, data) => {
  if (item.data_model_id) {
    currentBlueScript.value.config.dataModel = {};
    currentBlueScript.value.config.dataModel.data_model_type =
      item.data_model_type;
    currentBlueScript.value.config.dataModel.label = item.label;
    currentBlueScript.value.config.dataModel.sql =
      item.name_space + "." + item.data_model_id;
      dialogFlag.value = false;
  }
};
</script>
<style scoped></style>
