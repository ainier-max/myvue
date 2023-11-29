<template>
  <div>
    <div class="titleClass" align="center">
      <span>开发者配置</span>
    </div>
    <div style="padding-top: 15px" align="center">
      <el-button
        type="success"
        @click="showDevConfigDialog"
        style="margin-left: 15px"
        >开发者配置</el-button
      >
    </div>
  </div>

  <el-dialog
    v-model="devConfigDialogFlag"
    title="开发者配置"
    append-to-body
    :draggable="true"
    width="50%"
    top="10vh"
    style="height: 700px"
    @opened="openedHandle"
  >
    <MyMonacoEditor
      v-if="devConfigFlag"
      id="devConfigID"
      :code="js_beautify(objectToString(currentPageRenderTreeNodeData.config))"
      @update="updateConfig"
      style="height: 520px"
    ></MyMonacoEditor>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="closeHandle"> 关 闭 </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import MyMonacoEditor from "@/common/component/CodeEditor/MyMonacoEditor/index.vue"
import { objectToString, stringToObject } from "@/common/js/objStr.js";
import {js_beautify} from "js-beautify";
import { storeToRefs } from "pinia";
import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData } = storeToRefs(
  currentDealDataStoreObj
);

//console.log("currentPageRenderTreeNodeData123214",currentPageRenderTreeNodeData);

const devConfigDialogFlag = ref(false);
const devConfigFlag = ref(false);
const showDevConfigDialog = () => {
  devConfigDialogFlag.value = true;
};
const closeHandle = () => {
  devConfigDialogFlag.value = false;
  devConfigFlag.value = false;
};
const openedHandle = () => {
  devConfigFlag.value = false;
  nextTick(() => {
    devConfigFlag.value = true;
  });
};
const updateConfig = (code) => {
  console.log("updateConfig--code", code);
  currentPageRenderTreeNodeData.value.config = stringToObject(code);
  console.log("updateConfig--currentPageRenderTreeNodeData",currentPageRenderTreeNodeData);
  currentDealDataStoreObj.refreshCurrentPageRenderTreeNodeData();
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
