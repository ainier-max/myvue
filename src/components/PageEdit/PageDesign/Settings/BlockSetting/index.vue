<template>
  <div style="width: 100%; height: 100%; overflow: hidden">
    <div class="titleClass" align="center">页面块配置</div>
    <div v-if="settingParam">
      <div class="leftTitle">页面块Ref：</div>
      <el-input
        v-model="settingParam.ref"
        class="rightValue"
        disabled
        placeholder="页面块Ref"
      />
      <div class="leftTitle">页面块名称：</div>
      <el-input
        v-model="settingParam.label"
        class="rightValue"
        placeholder="页面块名称"
      />

      <div class="leftTitle">页面块高度：</div>
      <el-input
        v-model="settingParam.config.pageConfig.height"
        class="rightValue"
        placeholder="页面块高度"
      />

      <div class="leftTitle">页面块宽度：</div>
      <el-input
        v-model="settingParam.config.pageConfig.width"
        class="rightValue"
        placeholder="页面块宽度"
      />

      <div class="leftTitle">单位：</div>
      <el-input
        v-model="settingParam.config.pageConfig.unit"
        class="rightValue"
        placeholder="单位"
      />

      <div align="center" style="margin-top: 15px">
        <el-button @click="updateBlockSetting" type="primary"
          >页面块更新</el-button
        >
      </div>
      <div class="titleClass" style="margin-top: 15px" align="center">
        插入内容
      </div>
      <div align="center" style="margin-top: 15px">
        <el-button @click="addFlex('flex-column')" type="success"
          >水平布局</el-button
        >
        <el-button @click="addFlex('flex-row')" type="success">垂直布局</el-button>
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

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();

const props = defineProps({
  settingParam: null,
});

const route = useRoute();

const updateBlockSetting = () => {
  let param = {};
  param.sql = "page_render_tree.updatePageRenderTreeByID";
  param.id = props.settingParam.id;
  param.name = props.settingParam.label;
  param.page_id = route.query.page_id;
  param.config_str = objectToString(props.settingParam.config);
  commonExcuteByBatchRequest(axios, param, updateBlockSettingCallBack);
};
const updateBlockSettingCallBack = (result) => {
  console.log("updateBlockSettingCallBack--result", result);
  if (result.state == "success") {
    // 使用
    ElMessage.success("更新成功！");
  }
};
const addFlex = (type) => {
  let layoutTemp = {};
  layoutTemp.config = {};
  layoutTemp.config.x = 10;
  layoutTemp.config.y = 10;
  layoutTemp.config.w = 200;
  layoutTemp.config.h = 200;
  layoutTemp.config.zIndex = 100;
  layoutTemp.config.background = {};
  layoutTemp.config.background.type = "img";
  layoutTemp.config.background.value = "";
  let blockWidthTemp = props.settingParam.config.pageConfig.width;
  let blockHeightTemp = props.settingParam.config.pageConfig.height;
  layoutTemp.config.xPer = toDecimal((10 / blockWidthTemp) * 100);
  layoutTemp.config.yPer = toDecimal((10 / blockHeightTemp) * 100);
  layoutTemp.config.wPer = toDecimal((200 / blockWidthTemp) * 100);
  layoutTemp.config.hPer = toDecimal((200 / blockHeightTemp) * 100);
  layoutTemp.id = "id-" + uuid();
  layoutTemp.pid = props.settingParam.id;
  if(type=="flex-column"){
    layoutTemp.label="水平布局";
  }else if(type=="flex-row"){
    layoutTemp.label="垂直布局";
  }
  layoutTemp.ref="layoutRef-" + uuid();
  layoutTemp.type=type;

  pageEditStoreObj.addNodeByPID(layoutTemp.pid,layoutTemp);
  
};

// 生命周期钩子
onMounted(() => {
  console.log("接收到的参数值", props.settingParam);
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
