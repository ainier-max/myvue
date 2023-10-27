<template>
  <div style="width: 100%; height: 100%; overflow: auto">
    <div class="titleClass" align="center">布局组件配置</div>
    <div v-if="currentPageRenderTreeNodeData">
      <div
        class="leftTitle"
        style="font-weight: bolder"
        v-if="currentPageRenderTreeNodeData.pid == currentTopPageBlockData.id"
      >
        布局组件类型：{{
          currentPageRenderTreeNodeData.type == "flex-row"
            ? "水平布局"
            : "垂直布局"
        }}
      </div>

      <div
        class="leftTitle"
        style="font-weight: bolder"
        v-if="currentPageRenderTreeNodeData.pid != currentTopPageBlockData.id"
      >
        布局组件类型：{{
          currentPageRenderTreeNodeData.type == "flex-row"
            ? "内部水平布局"
            : "内部垂直布局"
        }}
      </div>

      <div class="leftTitle">布局组件Ref：</div>
      <el-input
        v-model="currentPageRenderTreeNodeData.ref"
        class="rightValue"
        disabled
        placeholder="布局组件Ref"
      />
      <div class="leftTitle">布局组件名称：</div>
      <el-input
        v-model="currentPageRenderTreeNodeData.label"
        class="rightValue"
        placeholder="布局组件名称"
      />
      <div
        v-if="currentPageRenderTreeNodeData.pid == currentTopPageBlockData.id"
      >
        <div class="leftTitle">
          布局组件X坐标：<span
            >{{ currentPageRenderTreeNodeData.config.xPer }}%</span
          >
        </div>
        <el-input
          @input="handleInput"
          v-model.number="currentPageRenderTreeNodeData.config.x"
          class="rightValue"
          placeholder="布局组件X坐标"
        />
        <div class="leftTitle">
          布局组件Y坐标：<span
            >{{ currentPageRenderTreeNodeData.config.yPer }}%</span
          >
        </div>
        <el-input
          @input="handleInput"
          v-model.number="currentPageRenderTreeNodeData.config.y"
          class="rightValue"
          placeholder="布局组件Y坐标"
        />
        <div class="leftTitle">
          布局组件高度：<span
            >{{ currentPageRenderTreeNodeData.config.hPer }}%</span
          >
        </div>
        <el-input
          @input="handleInput"
          v-model.number="currentPageRenderTreeNodeData.config.h"
          class="rightValue"
          placeholder="布局组件高度"
        />
        <div class="leftTitle">
          布局组件宽度：<span
            >{{ currentPageRenderTreeNodeData.config.wPer }}%</span
          >
        </div>
        <el-input
          @input="handleInput"
          v-model.number="currentPageRenderTreeNodeData.config.w"
          class="rightValue"
          placeholder="布局组件宽度"
        />

        <div class="leftTitle">单位：</div>
        <el-input
          v-model="currentPageRenderTreeNodeData.config.unit"
          class="rightValue"
          placeholder="单位"
        />
      </div>

      <div
        v-if="currentPageRenderTreeNodeData.pid != currentTopPageBlockData.id"
      >
        <div class="leftTitle">
          布局组件占比
          <WarningFilled
            style="width: 1em; height: 1em; color: gray; "
          ></WarningFilled>
        </div>
        <el-input
          v-model="currentPageRenderTreeNodeData.config.flexBasis"
          class="rightValue"
        />
        <el-collapse v-model="activeName" accordion style="margin: 20px">
          <el-collapse-item title="内边距(padding)" name="1">
            <div class="leftTitle">单位：</div>
            <el-input
              size="small"
              v-model="currentPageRenderTreeNodeData.config.padding.unit"
              class="rightValue"
            />
            <div class="leftTitle">上边距：</div>
            <el-input
              size="small"
              v-model="currentPageRenderTreeNodeData.config.padding.top"
              class="rightValue"
            />
            <div class="leftTitle">下边距：</div>
            <el-input
              size="small"
              v-model="currentPageRenderTreeNodeData.config.padding.bottom"
              class="rightValue"
            />
            <div class="leftTitle">左边距：</div>
            <el-input
              size="small"
              v-model="currentPageRenderTreeNodeData.config.padding.left"
              class="rightValue"
            />
            <div class="leftTitle">右边距：</div>
            <el-input
              size="small"
              v-model="currentPageRenderTreeNodeData.config.padding.right"
              class="rightValue"
            />
          </el-collapse-item>
          <el-collapse-item title="外边距(margin)" name="2">
            <div class="leftTitle">单位：</div>
            <el-input
              size="small"
              v-model="currentPageRenderTreeNodeData.config.margin.unit"
              class="rightValue"
            />
            <div class="leftTitle">上边距：</div>
            <el-input
              size="small"
              v-model="currentPageRenderTreeNodeData.config.margin.top"
              class="rightValue"
            />
            <div class="leftTitle">下边距：</div>
            <el-input
              size="small"
              v-model="currentPageRenderTreeNodeData.config.margin.bottom"
              class="rightValue"
            />
            <div class="leftTitle">左边距：</div>
            <el-input
              size="small"
              v-model="currentPageRenderTreeNodeData.config.margin.left"
              class="rightValue"
            />
            <div class="leftTitle">右边距：</div>
            <el-input
              size="small"
              v-model="currentPageRenderTreeNodeData.config.margin.right"
              class="rightValue"
            />
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="leftTitle">层级：</div>
      <el-input
        v-model="currentPageRenderTreeNodeData.config.zIndex"
        class="rightValue"
        placeholder="层级"
      />

      <div class="leftTitle">背景：</div>

      <div style="padding-left: 15px; margin-top: 10px; font-size: 12px">
        颜色
        <el-switch
          v-model="currentPageRenderTreeNodeData.config.backgroundType"
          class="mb-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-value="img"
          inactive-value="color"
        />
        图片
        <div></div>
        <div>
          <!--otherParam 会跟着子组件调用父组件的事件参数-->
          <ChooseImg
            v-if="currentPageRenderTreeNodeData.config.backgroundType == 'img'"
            otherParam=""
            :imgUUID="currentPageRenderTreeNodeData.config.backgroundImgValue"
            @getNewImgUrl="getNewImgUrlByTopPageBlock"
          ></ChooseImg>
          <el-color-picker
            v-if="
              currentPageRenderTreeNodeData.config.backgroundType == 'color'
            "
            v-model="currentPageRenderTreeNodeData.config.backgroundColorValue"
            show-alpha
          />
        </div>
      </div>

      <div class="titleClass" style="margin-top: 15px" align="center">
        插入内容
      </div>
      <div align="center">
        <el-button
          @click="addFlex('flex-row')"
          style="margin-top: 15px"
          type="success"
          >内部水平布局</el-button
        >
        <el-button
          @click="addFlex('flex-column')"
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
      </div>
    </div>
    <div style="height: 50px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { toDecimal } from "@/common/js/decimal.js";
import { uuid } from "@/common/js/uuid.js";
import ChooseImg from "@/common/component/ChooseImg/index.vue";
import { storeToRefs } from "pinia";

const activeName = ref(null);

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);

const getNewImgUrlByTopPageBlock = (imgUUID, otherParam) => {
  currentPageRenderTreeNodeData.value.config.backgroundImgValue = imgUUID;
};

console.log("currentPageRenderTreeNodeData1", currentTopPageBlockData);

//添加前端组件
const addFrontEndComponent = () => {};
//添加打包组件
const addPackComponent = () => {};
//添加内置组件
const addBuiltInComponent = () => {};
//添加页面块
const addPageBlock = () => {};

//添加布局组件
const addFlex = (type) => {
  let layoutTemp = {};
  layoutTemp.config = {};
  layoutTemp.config.flexBasis = 50;

  layoutTemp.config.padding = {};
  layoutTemp.config.padding.unit = "px";
  layoutTemp.config.padding.top = "0";
  layoutTemp.config.padding.bottom = "0";
  layoutTemp.config.padding.left = "0";
  layoutTemp.config.padding.right = "0";

  layoutTemp.config.margin = {};
  layoutTemp.config.margin.unit = "px";
  layoutTemp.config.margin.top = "0";
  layoutTemp.config.margin.bottom = "0";
  layoutTemp.config.margin.left = "0";
  layoutTemp.config.margin.right = "0";

  layoutTemp.config.zIndex = 100;
  layoutTemp.config.backgroundType = "color";
  layoutTemp.config.backgroundColorValue = null;
  layoutTemp.config.backgroundImgValue = "";
  layoutTemp.id = "id-" + uuid();
  layoutTemp.pid = currentPageRenderTreeNodeData.value.id;
  layoutTemp.children = [];
  if (type == "flex-row") {
    layoutTemp.label = "内部水平布局";
  } else if (type == "flex-column") {
    layoutTemp.label = "内部垂直布局";
  }
  layoutTemp.ref = "layoutRef-" + uuid();
  layoutTemp.type = type;
  pageEditStoreObj.addNodeByPID(layoutTemp.pid, layoutTemp);
};

const handleInput = () => {
  //大小设置
  currentPageRenderTreeNodeData.value.config.xPer = toDecimal(
    (currentPageRenderTreeNodeData.value.config.x /
      currentTopPageBlockData.value.config.pageConfig.width) *
      100
  );
  currentPageRenderTreeNodeData.value.config.yPer = toDecimal(
    (currentPageRenderTreeNodeData.value.config.y /
      currentTopPageBlockData.value.config.pageConfig.height) *
      100
  );
  currentPageRenderTreeNodeData.value.config.wPer = toDecimal(
    (currentPageRenderTreeNodeData.value.config.w /
      currentTopPageBlockData.value.config.pageConfig.width) *
      100
  );
  currentPageRenderTreeNodeData.value.config.hPer = toDecimal(
    (currentPageRenderTreeNodeData.value.config.h /
      currentTopPageBlockData.value.config.pageConfig.height) *
      100
  );
};

// 生命周期钩子
onMounted(() => {});
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
