<template>
  <div style="width: 100%; height: 100%">
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
        <el-button @click="updateBlockSetting" type="primary">页面块更新</el-button>
      </div>
      <div class="titleClass" style="margin-top: 15px" align="center">插入内容</div>
      <div align="center" style="margin-top: 15px">
        <el-button @click="addFlexColumn" type="success">水平布局</el-button>
        <el-button @click="addFlexRow" type="success">垂直布局</el-button>
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
// 生命周期钩子
onMounted(() => {
  console.log("接收到的参数值", props.settingParam);
});
</script>

<style scoped>
.titleClass {
  width: 100%;
  height: 30px;
  background: #000000;
  color: rgba(255, 255, 255, 0.6);
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
