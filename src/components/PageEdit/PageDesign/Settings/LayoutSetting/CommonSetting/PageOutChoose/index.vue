<template>
  <el-row style="margin-bottom: 50px">
    <el-col :span="6">
      <el-tree
        ref="pageTreeRef"
        :data="pageTreeData"
        node-key="id"
        :default-expand-all="true"
        :expand-on-click-node="false"
        :props="defaultProps"
        :highlight-current="true"
        @node-click="nodeClick"
      />
    </el-col>
    <el-col :span="18">
      <template v-for="(item, i) in pagesArr">
        <el-button
          :disabled="item.disabled"
          style="margin-top: 15px; margin-left: 20px"
          @click="findAllPageRenderTreeByPageID(item)"
          >{{ item.page_name }}</el-button
        >
      </template>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import {
  commonSelectRequest,
  commonExcuteRequest,
  commonExcuteRequestAndOtherParam,
} from "@/common/js/request.js";
import { uuid } from "@/common/js/uuid";
import { storeToRefs } from "pinia";
import { objectToString, stringToObject } from "@/common/js/objStr.js";

import { getListData } from "@/common/js/tree.js";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData, relativePageRenderTreeData } = storeToRefs(
  pageRenderTreeDataStoreObj
);

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentTopPageBlockData, currentPageRenderTreeNodeData } = storeToRefs(
  currentDealDataStoreObj
);
const defaultProps = {
  children: "children",
  label: "label",
};
const pageTreeData = ref([]);
const pagesArr = ref([]);

const emit = defineEmits(["getChooseData"]);
import { useRoute } from "vue-router";
const route = useRoute();
const page_id = route.query.page_id;

const findAllPageRenderTreeByPageID=(item)=>{
  let param = {};
    param.sql = "page_render_tree.findAllPageRenderTreeByPageID";
    param.page_id = item.page_id;
    commonSelectRequest(
      axios,
      param,
      findRelativePageRenderTreeByPageIDCallBack
    );
}

const findRelativePageRenderTreeByPageIDCallBack = (result) => {
  //关联页面渲染树
  for (let i = 0; i < result.objects.length; i++) {
    result.objects[i].config = stringToObject(result.objects[i].config_str);
  }
  let dataTemp = getListData(result.objects, [
    "ref",
    "type",
    "config",
    "page_id",
    "config_str",
    "related_value",
    "component_code",
  ]);

  dataTemp = pageRenderTreeDataStoreObj.newSortForChildren(dataTemp);
  pageRenderTreeDataStoreObj.sortTree(dataTemp);
  console.log("findRalativePageRenderTreeByPageIDCallBack--dataTemp", dataTemp);
  if (dataTemp) {
    relativePageRenderTreeData.value.push(dataTemp[0]);
  }
  getPageOut(dataTemp[0]);
  console.log("relativePageRenderTreeData112", relativePageRenderTreeData);
};


const getPageOut = (pageOut) => {
  console.log("getPageOut--getPageOut", pageOut);
  let obj = {};
  obj.id = "id-" + uuid();
  if (
    currentPageRenderTreeNodeData.value.type == "flex-row" ||
    currentPageRenderTreeNodeData.value.type == "flex-column"
  ) {
    //当前节点为flex-row或者flex-column
    obj.pid = currentPageRenderTreeNodeData.value.id;
  } else {
    //当前节点为frontEndComponent/buildInComponent/packComponent
    obj.pid = currentPageRenderTreeNodeData.value.pid;
  }
  obj.label = pageOut.label;
  obj.ref = pageOut.ref;
  obj.type = "pageOut";
  obj.page_id = page_id;
  obj.related_value = pageOut.id;
  obj.config = {};
  obj.config.attr = {};

  obj.config.attr.flexBasis = 100;
  obj.config.attr.zIndex = 100;
  obj.config.attr.show = true;

  obj.config.attr.padding = {};
  obj.config.attr.padding.unit = "px";
  obj.config.attr.padding.top = "0";
  obj.config.attr.padding.bottom = "0";
  obj.config.attr.padding.left = "0";
  obj.config.attr.padding.right = "0";

  obj.config.attr.margin = {};
  obj.config.attr.margin.unit = "px";
  obj.config.attr.margin.top = "0";
  obj.config.attr.margin.bottom = "0";
  obj.config.attr.margin.left = "0";
  obj.config.attr.margin.right = "0";
  emit("getChooseData", obj);
};

const nodeClick = (data) => {
  console.log("nodeClick--data",data);
  let param = {};
  param.sql = "page_centre.find";
  param.page_tree_id = data.id;
  commonSelectRequest(axios, param, nodeClickCallBack);
};
const nodeClickCallBack = (result) => {
  console.log("nodeClickCallBack--result", result);
  //去掉顶层页面块选择
  let topPageBlockTemp = pageRenderTreeData.value[0];
  console.log("nodeClickCallBack", topPageBlockTemp);
  for (let i = 0; i < result.objects.length; i++) {
    if (result.objects[i].page_id == topPageBlockTemp.page_id) {
      result.objects[i].disabled = true;
    } else {
      //首次赋值为false
      result.objects[i].disabled = false;
    }
  }
  pagesArr.value = result.objects;
};

const findPageTree = () => {
  let param = {};
  param.sql = "page_centre_tree.find";
  commonSelectRequest(axios, param, findPageTreeCallBack);
};
const findPageTreeCallBack = (result) => {
  pageTreeData.value = getListData(result.objects, []);
  console.log("pageTreeData12", pageTreeData);
};
onMounted(() => {
  findPageTree();
});
</script>

<style scoped></style>
