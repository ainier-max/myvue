<template>
  <div style="width: 100%; height: 100%; overflow: hidden">
    <div class="titleClass" align="center">页面块配置</div>
    <div v-if="currentPageRenderTreeNodeData">
      <div class="leftTitle">页面块Ref：</div>
      <el-input
        v-model="currentPageRenderTreeNodeData.ref"
        class="rightValue"
        disabled
        placeholder="页面块Ref"
      />
      <div class="leftTitle">页面块名称：</div>
      <el-input
        v-model="currentPageRenderTreeNodeData.label"
        class="rightValue"
        placeholder="页面块名称"
      />

      <div class="leftTitle">页面块高度：</div>
      <el-input
        v-model="currentPageRenderTreeNodeData.config.pageConfig.height"
        class="rightValue"
        @change="refreshLayouDesign"
        placeholder="页面块高度"
      />

      <div class="leftTitle">页面块宽度：</div>
      <el-input
        v-model="currentPageRenderTreeNodeData.config.pageConfig.width"
        class="rightValue"
        @change="refreshLayouDesign"
        placeholder="页面块宽度"
      />

      <div class="leftTitle">单位：</div>
      <el-input
        v-model="currentPageRenderTreeNodeData.config.pageConfig.unit"
        class="rightValue"
        placeholder="单位"
      />

      <div class="leftTitle">背景：</div>

      <div style="padding-left: 15px; margin-top: 10px; font-size: 12px">
        颜色
        <el-switch
          v-model="currentPageRenderTreeNodeData.config.pageConfig.backgroundType"
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
            v-if="currentPageRenderTreeNodeData.config.pageConfig.backgroundType == 'img'"
            otherParam=""
            :imgUUID="currentPageRenderTreeNodeData.config.pageConfig.backgroundImgValue"
            @getNewImgUrl="getNewImgUrlByTopPageBlock"
          ></ChooseImg>
          <el-color-picker
            v-if="currentPageRenderTreeNodeData.config.pageConfig.backgroundType == 'color'"
            v-model="currentPageRenderTreeNodeData.config.pageConfig.backgroundColorValue"
            show-alpha
          />
        </div>
      </div>

      <!-- <div align="center" style="margin-top: 15px">
        <el-button @click="updateBlockSetting" type="primary"
          >页面块更新</el-button
        >
      </div> -->
      <div class="titleClass" style="margin-top: 15px" align="center">
        插入内容
      </div>
      <div align="center" style="margin-top: 15px">
        <el-button @click="addFlex('flex-column')" type="success"
          >水平布局</el-button
        >
        <el-button @click="addFlex('flex-row')" type="success"
          >垂直布局</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { commonExcuteByBatchRequest } from "@/common/js/request.js";
import { objectToString, stringToObject } from "@/common/js/objStr.js";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { toDecimal } from "@/common/js/decimal.js";
import { uuid } from "@/common/js/uuid.js";
import ChooseImg from "@/common/component/ChooseImg/index.vue";
import { storeToRefs } from "pinia";

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentPageLayoutData } = storeToRefs(
  currentDealDataStoreObj
);


const route = useRoute();

const emit = defineEmits(["refreshLayouDesign"]);
const refreshLayouDesign = (event) => {
  emit("refreshLayouDesign");
};

// const updateBlockSetting = () => {
//   let param = {};
//   param.sql = "page_render_tree.updatePageRenderTreeByID";
//   param.id = props.currentPageRenderTreeNodeData.id;
//   param.name = props.currentPageRenderTreeNodeData.label;
//   param.page_id = route.query.page_id;
//   param.config_str = objectToString(props.currentPageRenderTreeNodeData.config);
//   commonExcuteByBatchRequest(axios, param, updateBlockSettingCallBack);
// };
// const updateBlockSettingCallBack = (result) => {
//   console.log("updateBlockSettingCallBack--result", result);
//   if (result.state == "success") {
//     // 使用
//     ElMessage.success("更新成功！");
//   }
// };
const addFlex = (type) => {
  let layoutTemp = {};
  layoutTemp.config = {};
  layoutTemp.config.x = 10;
  layoutTemp.config.y = 10;
  layoutTemp.config.w = 200;
  layoutTemp.config.h = 200;
  layoutTemp.config.zIndex = 100;
  layoutTemp.config.backgroundType="color";
  layoutTemp.config.backgroundColorValue = "rgba(0,0,0,0.8)";
  layoutTemp.config.backgroundImgValue = "";
  let blockWidthTemp = props.currentPageRenderTreeNodeData.config.pageConfig.width;
  let blockHeightTemp = props.currentPageRenderTreeNodeData.config.pageConfig.height;
  layoutTemp.config.xPer = toDecimal((10 / blockWidthTemp) * 100);
  layoutTemp.config.yPer = toDecimal((10 / blockHeightTemp) * 100);
  layoutTemp.config.wPer = toDecimal((200 / blockWidthTemp) * 100);
  layoutTemp.config.hPer = toDecimal((200 / blockHeightTemp) * 100);
  layoutTemp.id = "id-" + uuid();
  layoutTemp.pid = props.currentPageRenderTreeNodeData.id;
  if (type == "flex-column") {
    layoutTemp.label = "水平布局";
  } else if (type == "flex-row") {
    layoutTemp.label = "垂直布局";
  }
  layoutTemp.ref = "layoutRef-" + uuid();
  layoutTemp.type = type;
  pageEditStoreObj.addNodeByPID(layoutTemp.pid, layoutTemp);
};
const getNewImgUrlByTopPageBlock = (imgUUID, otherParam) => {
  props.currentPageRenderTreeNodeData.config.pageConfig.backgroundImgValue = imgUUID;
};

// 生命周期钩子
onMounted(() => {
});
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
