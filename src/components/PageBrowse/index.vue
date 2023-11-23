<template>
  <div v-if="pageRenderTreeData && showFlag" :style="pageBlockStyle">
    <div
      v-for="(pageLayout, index) in pageRenderTreeData[0].children"
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
//import "default-passive-events";
import { provide, ref, nextTick, onMounted, computed } from "vue";
import PageLayoutRender from "@/common/component/PageLayoutRender/index.vue";
import { objectToString, stringToObject } from "@/common/js/objStr.js";

import { useRoute } from "vue-router";
import { getListData } from "@/common/js/tree.js";
import {
  commonExcuteRequest,
  commonSelectRequest,
  commonExcuteByBatchRequest,
  commonBatchSelectRequest,
  commonExcuteRequestAndOtherParam,
} from "@/common/js/request.js";
import { storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData, relativePageRenderTreeData } = storeToRefs(
  pageRenderTreeDataStoreObj
);

console.log("pageRenderTreeData44",pageRenderTreeData);

const showFlag = ref(true);
const route = useRoute();
const page_id = route.query.page_id;

//查询页面渲染树
const findAllPageRenderTreeByPageID = () => {
  let param = {};
  param.batchSql = [
    {
      sql: "page_render_tree.findAllPageRenderTreeByPageID",
      page_id: page_id,
      resultKey: "AllPageRenderTree",
    },
    {
      sql: "page_render_tree.findRalativePageRenderTreeByPageID",
      page_id: page_id,
      resultKey: "RalativePageRenderTree",
    },
  ];
  commonBatchSelectRequest(axios, param, findAllPageRenderTreeByPageIDCallBack);
};

let pageModel = "";

const findAllPageRenderTreeByPageIDCallBack = (result) => {
  //页面渲染树
  for (let i = 0; i < result["AllPageRenderTree"].length; i++) {
    result["AllPageRenderTree"][i].config = stringToObject(
      result["AllPageRenderTree"][i].config_str
    );
    //result.objects[i].config = eval("(" + result.objects[i].config_str + ")");
  }
  pageRenderTreeDataStoreObj.setPageRenderTreeData(
    getListData(result["AllPageRenderTree"], [
      "ref",
      "type",
      "config",
      "page_id",
      "config_str",
      "related_value",
      "component_code",
    ])
  );
  //关联页面渲染树
  for (let i = 0; i < result["RalativePageRenderTree"].length; i++) {
    result["RalativePageRenderTree"][i].config = stringToObject(
      result["RalativePageRenderTree"][i].config_str
    );
  }
  pageRenderTreeDataStoreObj.setRelativePageRenderTreeData(
    getListData(result["RalativePageRenderTree"], [
      "ref",
      "type",
      "config",
      "page_id",
      "config_str",
      "related_value",
      "component_code",
    ])
  );

  //console.log("pageRenderTreeData12", pageRenderTreeData);
  pageModel = pageRenderTreeData.value[0].config.attr.pageModel;
};
const page_type = route.query.page_type;
if(page_type=="edit"){
  pageModel = pageRenderTreeData.value[0].config.attr.pageModel;
}else if(page_type=="browse"){
  findAllPageRenderTreeByPageID();
}

//页面块样式
const pageBlockStyle = computed(() => {
  let blockData = pageRenderTreeData.value[0];

  let styleObj = {};
  if (pageModel == "reality") {
    //实际宽高
    styleObj.height = pageRenderTreeData.value[0].config.attr.h + "px";
    styleObj.width = pageRenderTreeData.value[0].config.attr.w + "px";
  } else if (pageModel == "adaptation") {
    //自适应(百分比)
    styleObj.height = "100%";
    styleObj.width = "100%";
  } else if (pageModel == "adaptationW-realityH") {
    //宽度自适应，实际高度
    styleObj.height = pageRenderTreeData.value[0].config.attr.h + "px";
    styleObj.width = "100%";
  }

  styleObj.position = "relative";
  if (
    blockData.config.attr.backgroundType == "img" &&
    blockData.config.attr.backgroundImgValue != ""
  ) {
    let imgURL =
      window.cbcConfig.getFileUrl +
      "?uuid=" +
      blockData.config.attr.backgroundImgValue +
      "&type=photo";
    styleObj.backgroundImage = "url(" + imgURL + ")";
    styleObj.backgroundSize = "100% 100%";
  } else if (
    blockData.config.attr.backgroundType == "color" &&
    blockData.config.attr.backgroundColorValue != ""
  ) {
    styleObj.background = blockData.config.attr.backgroundColorValue;
  }

  return styleObj;
});

//页面布局样式
const setPageLayoutStyle = computed(() => {
  return function (pageLayout) {
    //console.log("pageLayoutStyle--pageLayout", pageLayout);
    let styleObj = {};
    styleObj.position = "absolute";
    styleObj.zIndex = pageLayout.config.attr.zIndex;
    console.log("页面模式：", pageModel);
    if (pageModel == "reality") {
      //实际宽高
      styleObj.left = pageLayout.config.attr.x + "px";
      styleObj.top = pageLayout.config.attr.y + "px";
      styleObj.width = pageLayout.config.attr.w + "px";
      styleObj.height = pageLayout.config.attr.h + "px";
    } else if (pageModel == "adaptation") {
      //百分比宽高（自适应宽高）
      styleObj.left = pageLayout.config.attr.xPer + "%";
      styleObj.top = pageLayout.config.attr.yPer + "%";
      styleObj.width = pageLayout.config.attr.wPer + "%";
      styleObj.height = pageLayout.config.attr.hPer + "%";
    } else if (pageModel == "adaptationW-realityH") {
      //宽度自适应，实际高度
      styleObj.left = pageLayout.config.attr.xPer + "%";
      styleObj.top = pageLayout.config.attr.y + "px";
      styleObj.width = pageLayout.config.attr.wPer + "%";
      styleObj.height = pageLayout.config.attr.h + "px";
    }

    return styleObj;
  };
});

onMounted(() => {
  window.addEventListener("resize", () => {
    //console.log("页面变化");
    showFlag.value = false;
    nextTick(() => {
      showFlag.value = true;
    });
  });
});
</script>

<style></style>
