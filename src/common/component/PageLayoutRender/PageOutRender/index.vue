<template>
  <div
    style="height: 100%; width: 100%; position: relative"
    v-if="pageBlockRenderData && props.pageBlockData.config.attr.show == true"
  >
    <div
      v-for="(pageLayout, index) in pageBlockRenderData.children"
      :style="setPageLayoutStyle(pageLayout)"
    >
      <PageLayoutRender
        v-if="pageLayout.config.attr.show"
        :pageLayoutData="pageLayout"
      ></PageLayoutRender>
    </div>
  </div>
</template>

<script setup lang="ts">
import { objectToString, stringToObject } from "@/common/js/objStr.js";

import PageLayoutRender from "@/common/component/PageLayoutRender/index.vue";
import { ref, nextTick, onMounted, computed } from "vue";
import { findNodeById } from "@/common/js/tree.js";
import { commonSelectRequest } from "@/common/js/request.js";
import { storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { relativePageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);
import { useRoute, useRouter } from "vue-router";
import { getListData, deleteNode, findParent } from "@/common/js/tree.js";

const route = useRoute();
const page_id = route.query.page_id;

console.log(
  "外部页面数据12--relativePageRenderTreeData",
  relativePageRenderTreeData.value
);
const props = defineProps({
  pageBlockData: null,
});

console.log("当前外部页面数据12--props.pageBlockData", props.pageBlockData);

const findRalativePageRenderTreeByPageID = () => {
  let param = {};
  param.sql = "page_render_tree.findRalativePageRenderTreeByPageID";
  param.page_id = props.pageBlockData.page_id;
  commonSelectRequest(
    window.axios,
    param,
    findRalativePageRenderTreeByPageIDCallBack
  );
};
const findRalativePageRenderTreeByPageIDCallBack = (result) => {
  //关联页面渲染树
  for (let i = 0; i < result.objects.length; i++) {
    result.objects[i].config = stringToObject(result.objects[i].config_str);
  }
  console.log(
    "findRalativePageRenderTreeByPageIDCallBack--result",
    result.objects
  );
  let dataTemp = getListData(result.objects, [
    "ref",
    "type",
    "config",
    "page_id",
    "config_str",
    "related_value",
    "component_code",
  ]);
  console.log("findRalativePageRenderTreeByPageIDCallBack--dataTemp", dataTemp);
  pageRenderTreeDataStoreObj.addToPageRenderTreeData(dataTemp);
  pageBlockRenderData.value = dataTemp[0];
  console.log("要渲染的外部页面数据123", pageBlockRenderData);
};
const pageBlockRenderData = ref(null);
if (
  props.pageBlockData.type == "pageOut" &&
  props.pageBlockData.page_id != page_id
) {
  findRalativePageRenderTreeByPageID();
} else {
  let indexTemp = _.findIndex(relativePageRenderTreeData.value, function (o) {
    return o.id == props.pageBlockData.related_value;
  });
  pageBlockRenderData.value = relativePageRenderTreeData.value[indexTemp];

  console.log("要渲染的外部页面数据123", pageBlockRenderData);
}

//递归查询
/**
const findNode = (itemArr, related_value) => {
  itemArr.forEach((item) => {
    if (item.id == related_value || item.related_value == related_value) {
      pageBlockRenderData.value = item;
    } else {
      if (item.children) {
        findNode(item.children, related_value);
      }
    }
  });
};
findNode(relativePageRenderTreeData.value, props.pageBlockData.related_value);
*/
/***/

//页面布局样式
const setPageLayoutStyle = computed(() => {
  return function (pageLayout) {
    //console.log("pageLayoutStyle--pageLayout", pageLayout);
    let styleObj = {};
    styleObj.position = "absolute";
    styleObj.left = pageLayout.config.attr.xPer + "%";
    styleObj.top = pageLayout.config.attr.yPer + "%";
    styleObj.height = pageLayout.config.attr.hPer + "%";
    styleObj.width = pageLayout.config.attr.wPer + "%";
    return styleObj;
  };
});
</script>

<style scoped></style>
