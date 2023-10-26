<template>
  <div class="mainClass" style="display: flex; flex-direction: row">
    <div style="flex-basis: 17%; border-right: 1px solid gray">
      <div style="height: 60%">
        <el-tree
          ref="pageRenderTreeRef"
          :data="pageRenderTreeData"
          node-key="id"
          :default-expand-all="true"
          :expand-on-click-node="false"
          :props="defaultProps"
          :highlight-current="true"
          :current-node-key="setNodeKey()"
          @node-click="nodeClick"
        />
      </div>

      <!-- <div style="border-top: 1px solid gray">子页面</div> -->
    </div>
    <div style="flex-basis: 65%">
      <div
        style="width: 100%; height: 30px; background: #fc74fd; padding-top: 8px"
      >
        <el-row>
          <el-col :span="12">
            <div>
              <span
                style="
                  color: rgba(255, 255, 255, 1);
                  font-weight: bold;
                  padding-left: 8px;
                  cursor: pointer;
                "
                >界面设计</span
              >
              <span
                style="
                  color: gray;
                  font-weight: bold;
                  padding-left: 8px;
                  cursor: pointer;
                "
                >蓝图设计</span
              >
            </div>
          </el-col>
          <el-col :span="12">
            <div align="right" style="margin-right: 20px">
              <el-button type="success" size="small" @click="savePageRenderTree"
                >保存</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>

      <div style="width: 100%; height: 100%; position: relative">
        <LayoutDesign
          v-if="currentPageRenderTreeNodeData && layoutDesignShowFlag"
        ></LayoutDesign>
      </div>
    </div>

    <div style="flex-basis: 18%">
      <BlockSetting
        v-if="
          currentPageRenderTreeNodeData?.type == 'mainBlock' ||
          currentPageRenderTreeNodeData?.type == 'childBlock'
        "
        @refreshLayouDesign="refreshLayouDesign"
      ></BlockSetting>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { useRoute } from "vue-router";
import { objectToString, stringToObject } from "@/common/js/objStr.js";
import { ElMessage } from "element-plus";

import BlockSetting from "@/components/PageEdit/PageDesign/Settings/BlockSetting/index.vue";

import LayoutDesign from "@/components/PageEdit/PageDesign/LayoutDesign/index.vue";

import {
  commonExcuteRequest,
  commonSelectRequest,
  commonExcuteByBatchRequest,
  commonBatchSelectRequest,
  commonExcuteRequestAndOtherParam,
} from "@/common/js/request.js";
import { getListData } from "@/common/js/tree.js";

import { storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(pageEditStoreObj);

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentPageLayoutData } = storeToRefs(
  currentDealDataStoreObj
);

const defaultProps = { children: "children", label: "label" };

const route = useRoute();
const page_id = route.query.page_id;
//const page_debug_flag = route.query.page_debug_flag;
const pageRenderTreeRef = ref(null);
const layoutDesignShowFlag = ref(true);

//console.log("page_id", page_id);
//console.log("page_debug_flag", page_debug_flag);

const setNodeKey = () => {
  //console.log("currentPageRenderTreeNodeData11",currentPageRenderTreeNodeData);
  if(currentPageRenderTreeNodeData.value){
    return currentPageRenderTreeNodeData.value.id;
  }else{
    return "";
  }
};

//布局设计页面刷新
const refreshLayouDesign = () => {
  console.log("布局设计页面刷新!");
  layoutDesignShowFlag.value = false;
  nextTick(() => {
    layoutDesignShowFlag.value = true;
  });
};

const nodeClick = (data) => {
  currentPageRenderTreeNodeData.value = data;
  currentPageLayoutData.value = data;
};

//查询页面渲染树
const findAllPageRenderTreeByPageID = () => {
  let param = {};
  (param.sql = "page_render_tree.findAllPageRenderTreeByPageID"),
    (param.page_id = page_id);
  commonSelectRequest(axios, param, findAllPageRenderTreeByPageIDCallBack);
};
const findAllPageRenderTreeByPageIDCallBack = (result) => {
  for (let i = 0; i < result.objects.length; i++) {
    result.objects[i].config = eval("(" + result.objects[i].config_str + ")");
  }
  pageEditStoreObj.setData(
    getListData(result.objects, ["ref", "type", "config", "config_str"])
  );
  //找出type为mainBlock的数据
  let nodeTemp = pageEditStoreObj.getNodeForMainBlock();
  nextTick(() => {
    pageRenderTreeRef.value.setCurrentKey(nodeTemp.id);
    nodeClick(nodeTemp);
  });
};
//保存页面渲染树
const savePageRenderTree = () => {
  let arrayTemp = pageEditStoreObj.getPageRenderTreeDataForArray();
  console.log("savePageRenderTree--arrayTemp", arrayTemp);
  let newArrayTemp = [];
  for (let i = 0; i < arrayTemp.length; i++) {
    let { id, pid, ref, type } = { ...arrayTemp[i] };
    let config_str = objectToString(arrayTemp[i].config);
    let name = arrayTemp[i].label;
    newArrayTemp.push({ id, pid, name, ref, type, page_id, config_str });
  }
  let param = {};
  param.sql = "page_render_tree.savePageRenderTree";
  param.page_id = page_id;
  param.pageRenderTreeData = newArrayTemp;
  console.log("传参param", param);
  commonExcuteByBatchRequest(window.axios, param, savePageRenderTreeCallBack);
};
const savePageRenderTreeCallBack = (result) => {
  if (result.state == "success") {
    // 使用
    ElMessage.success("保存成功！");
  }
};

// 生命周期钩子
onMounted(() => {
  findAllPageRenderTreeByPageID();
});
</script>

<style scoped>
.mainClass {
  height: 100%;
  overflow: hidden;
  margin: 0px;
}
</style>
