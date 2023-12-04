<template>
  <div v-if="currentPageRenderTreeNodeData">
    <div class="titleClass" align="center">
      <span
        v-if="
          currentPageRenderTreeNodeData.type == 'flex-row' ||
          currentPageRenderTreeNodeData.type == 'flex-column' ||
          currentPageRenderTreeNodeData.type == 'mainBlock' ||
          (currentPageRenderTreeNodeData.type == 'childBlock' &&
            !currentPageRenderTreeNodeData.pid)
        "
        >插入内容</span
      >
      <span v-else>替换内容</span>
    </div>

    <div
      align="center"
      v-if="
        (currentPageRenderTreeNodeData.type != 'mainBlock' &&
          currentPageRenderTreeNodeData.type != 'childBlock') ||
        (currentPageRenderTreeNodeData.type == 'childBlock' &&
          currentPageRenderTreeNodeData.pid)
      "
    >
      <el-button
        @click="addFlexInder('flex-row')"
        style="margin-top: 15px"
        type="success"
        >内部水平布局</el-button
      >
      <el-button
        @click="addFlexInder('flex-column')"
        style="margin-top: 15px"
        type="success"
        >内部垂直布局</el-button
      ><br />
      <el-button
        @click="addFrontEndComponent"
        style="margin-top: 15px"
        type="primary"
        >前端组件</el-button
      >

      <el-button
        @click="addPackComponent"
        style="margin-top: 15px"
        type="primary"
        >打包组件</el-button
      ><br />
      <el-button
        @click="addBuiltInComponent"
        style="margin-top: 15px"
        type="primary"
        >内置组件</el-button
      >
      <el-button @click="addPageBlock" style="margin-top: 15px" type="info"
        >页面块</el-button
      >
      <el-button @click="addPageOut" style="margin-top: 15px" type="info"
        >外部页面</el-button
      >
    </div>

    <div
      align="center"
      v-if="
        currentPageRenderTreeNodeData.type == 'mainBlock' ||
        (currentPageRenderTreeNodeData.type == 'childBlock' &&
          !currentPageRenderTreeNodeData.pid)
      "
    >
      <el-button
        style="margin-top: 15px"
        @click="addFlex('flex-row')"
        type="success"
        >水平布局</el-button
      >
      <el-button
        style="margin-top: 15px"
        @click="addFlex('flex-column')"
        type="success"
        >垂直布局</el-button
      >
    </div>

    <div style="padding-bottom:15px"></div>


    <el-dialog
      v-model="chooseDialogFlag"
      :title="dialogTitle"
      append-to-body
      :draggable="true"
      width="60%"
      top="10vh"
      @close="chooseDialogClose"
      style="height: 550px"
    >
      <FrontEndComponentChoose
        v-if="chooseDialogType == 'frontEndComponent'"
        ref="frontEndComponentChooseRef"
        @getChooseData="getChooseData"
      ></FrontEndComponentChoose>

      <BuiltInComponentChoose
        v-if="chooseDialogType == 'builtInComponent'"
        ref="BuiltInComponentChooseRef"
        @getChooseData="getChooseData"
      ></BuiltInComponentChoose>

      <PageBlockChoose
        v-if="chooseDialogType == 'pageBlock'"
        ref="PageBlockChooseRef"
        @getChooseData="getChooseData"
      ></PageBlockChoose>

      <PageOutChoose
        v-if="chooseDialogType == 'pageOut'"
        ref="PageOutChooseRef"
        @getChooseData="getChooseData"
      ></PageOutChoose>

      <PackComponentChoose
        v-if="chooseDialogType == 'packComponent'"
        ref="PackComponentChooseRef"
        @getChooseData="getChooseData"
      ></PackComponentChoose>
    </el-dialog>
  </div>

  
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { currentDealDataStore } from "@/store/currentDealData.ts";
import { toDecimal } from "@/common/js/decimal.js";
import { uuid } from "@/common/js/uuid.js";

const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(
  pageRenderTreeDataStoreObj
);

import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { blueScriptData, currentBlueScript } = storeToRefs(
  blueScriptDataStoreObj
);

const chooseDialogType = ref("");
const chooseDialogFlag = ref(false);
const dialogTitle = ref("");
//弹出窗口关闭
const chooseDialogClose = () => {
  chooseDialogType.value = "";
};

//获取选中的数据
const getChooseData = (chooseData) => {
  console.log("getChooseData--chooseData", chooseData);
  if (
    currentPageRenderTreeNodeData.value.type == "flex-row" ||
    currentPageRenderTreeNodeData.value.type == "flex-column"
  ) {
    pageRenderTreeDataStoreObj.addNodeByPID(
      currentPageRenderTreeNodeData.value.id,
      chooseData
    );
  } else {
    pageRenderTreeDataStoreObj.replaceNodeByData(
      currentPageRenderTreeNodeData,
      chooseData
    );
    //删除蓝图节点
    blueScriptDataStoreObj.deleteBlueScriptByRelatedRef(currentPageRenderTreeNodeData.value.ref);
  }
  chooseDialogFlag.value = false;
  //组件个数发生变化，重新渲染
  currentDealDataStoreObj.refreshCurrentTopPageLayoutData();
};
//添加前端组件
import FrontEndComponentChoose from "./FrontEndComponentChoose/index.vue";
const frontEndComponentChooseRef = ref(null);
const frontEndComponentChooseCloseHandle = () => {
  console.log("frontEndComponentChooseRef", frontEndComponentChooseRef);
  frontEndComponentChooseRef.value.getCheckNode();
};
const addFrontEndComponent = () => {
  chooseDialogType.value = "frontEndComponent";
  chooseDialogFlag.value = true;
  dialogTitle.value = "前端组件(双击选择组件)";
};
//添加打包组件
import PackComponentChoose from "./PackComponentChoose/index.vue";
const addPackComponent = () => {
  chooseDialogType.value = "packComponent";
  chooseDialogFlag.value = true;
  dialogTitle.value = "打包组件(双击选择组件)";
};

//添加内置组件
import BuiltInComponentChoose from "./BuiltInComponentChoose/index.vue";
const addBuiltInComponent = () => {
  chooseDialogType.value = "builtInComponent";
  chooseDialogFlag.value = true;
  dialogTitle.value = "内置组件(双击选择组件)";
};

//添加页面块
import PageBlockChoose from "./PageBlockChoose/index.vue";

const addPageBlock = () => {
  chooseDialogType.value = "pageBlock";
  chooseDialogFlag.value = true;
  dialogTitle.value = "页面块";
};

import PageOutChoose from "./PageOutChoose/index.vue";

//添加外部页面
const addPageOut = () => {
  chooseDialogType.value = "pageOut";
  chooseDialogFlag.value = true;
  dialogTitle.value = "外部页面";
};

//添加addFlexInder
const addFlexInder = (type) => {
  let layoutTemp = {};
  layoutTemp.config = {};

  layoutTemp.config.attr = {};
  layoutTemp.config.attr.flexBasis = 100;

  layoutTemp.config.attr.padding = {};
  //是否需要计算
  layoutTemp.config.attr.labelType = "flexInner";
  layoutTemp.config.attr.padding.unit = "px";
  layoutTemp.config.attr.padding.top = "0";
  layoutTemp.config.attr.padding.bottom = "0";
  layoutTemp.config.attr.padding.left = "0";
  layoutTemp.config.attr.padding.right = "0";

  layoutTemp.config.attr.zIndex = 100;
  layoutTemp.config.attr.show = true;
  layoutTemp.config.attr.backgroundType = "color";
  layoutTemp.config.attr.backgroundColorValue = null;
  layoutTemp.config.attr.backgroundImgValue = "";

  layoutTemp.id = "id-" + uuid();
  layoutTemp.children = [];
  if (type == "flex-row") {
    layoutTemp.label = "内部水平布局";
  } else if (type == "flex-column") {
    layoutTemp.label = "内部垂直布局";
  }
  layoutTemp.ref = "layoutRef-" + uuid();
  layoutTemp.type = type;

  if (
    currentPageRenderTreeNodeData.value.type == "flex-row" ||
    currentPageRenderTreeNodeData.value.type == "flex-column"
  ) {
    //插入内容
    layoutTemp.pid = currentPageRenderTreeNodeData.value.id;
    pageRenderTreeDataStoreObj.addNodeByPID(
      currentPageRenderTreeNodeData.value.id,
      layoutTemp
    );
  } else {
    //替换内容
    layoutTemp.pid = currentPageRenderTreeNodeData.value.pid;
    //替换内容
    pageRenderTreeDataStoreObj.replaceNodeByData(
      currentPageRenderTreeNodeData,
      layoutTemp
    );
    //删除蓝图节点
    blueScriptDataStoreObj.deleteBlueScriptByRelatedRef(currentPageRenderTreeNodeData.value.ref);
  }

  //布局个数发生变化，重新渲染
  currentDealDataStoreObj.refreshCurrentTopPageLayoutData();
};

const addFlex = (type) => {
  let layoutTemp = {};
  layoutTemp.config = {};

  layoutTemp.config.attr = {};

  layoutTemp.config.attr.padding = {};
  //是否需要计算
  layoutTemp.config.attr.labelType = "flex";
  layoutTemp.config.attr.padding.unit = "px";
  layoutTemp.config.attr.padding.top = "0";
  layoutTemp.config.attr.padding.bottom = "0";
  layoutTemp.config.attr.padding.left = "0";
  layoutTemp.config.attr.padding.right = "0";

  layoutTemp.config.attr.x = 10;
  layoutTemp.config.attr.y = 10;
  layoutTemp.config.attr.w = 200;
  layoutTemp.config.attr.h = 200;
  layoutTemp.config.attr.unit = "px";
  layoutTemp.config.attr.zIndex = 100;
  layoutTemp.config.attr.show = true;
  layoutTemp.config.attr.backgroundType = "color";
  layoutTemp.config.attr.backgroundColorValue = "rgba(24, 166, 54, 0.8)";
  layoutTemp.config.attr.backgroundImgValue = "";
  let blockWidthTemp = currentPageRenderTreeNodeData.value.config.attr.w;
  let blockHeightTemp = currentPageRenderTreeNodeData.value.config.attr.h;
  layoutTemp.config.attr.xPer = toDecimal((10 / blockWidthTemp) * 100);
  layoutTemp.config.attr.yPer = toDecimal((10 / blockHeightTemp) * 100);
  layoutTemp.config.attr.wPer = toDecimal((200 / blockWidthTemp) * 100);
  layoutTemp.config.attr.hPer = toDecimal((200 / blockHeightTemp) * 100);
  layoutTemp.id = "id-" + uuid();
  layoutTemp.pid = currentPageRenderTreeNodeData.value.id;
  layoutTemp.children = [];
  if (type == "flex-row") {
    layoutTemp.label = "水平布局";
  } else if (type == "flex-column") {
    layoutTemp.label = "垂直布局";
  }
  layoutTemp.ref = "layoutRef-" + uuid();
  layoutTemp.type = type;
  pageRenderTreeDataStoreObj.addNodeByPID(layoutTemp.pid, layoutTemp);
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
