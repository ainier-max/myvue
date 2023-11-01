<template>
  <div :style="pageLayoutStyle(pageLayoutData)">
    <div
      v-for="(item, index) in pageLayoutData.children"
      :style="setFlexStyle(item)"
    >
      <!--内部水平布局和垂直布局的渲染-->
      <PageLayoutRender
        v-if="item.type == 'flex-row' || item.type == 'flex-column'"
        :pageLayoutData="item"
        :style="setStyle(item)"
      ></PageLayoutRender>
      <!--前端组件渲染-->
      <FrontEndComponentRender
        :style="setStyle(item)"
        :frontEndComponentData="item"
        v-if="item.type == 'frontEndComponent'"
      >
      </FrontEndComponentRender>
      <!--内置组件渲染-->
      <BuildInComponentRender
        :style="setStyle(item)"
        :buildInComponentData="item"
        v-if="item.type == 'buildInComponent'"
      >
      </BuildInComponentRender>

      
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "PageLayoutRender", //给组件命名
};
</script>

<script setup lang="ts">
import FrontEndComponentRender from "./FrontEndComponentRender/index.vue";
import BuildInComponentRender from "./BuildInComponentRender/index.vue";

import { ref, nextTick, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();

const { currentPageRenderTreeNodeData } = storeToRefs(currentDealDataStoreObj);

const props = defineProps({
  pageLayoutData: null,
});

console.log(
  "页面布局数据--props.pageLayoutData",
  props.pageLayoutData.children
);

//页面布局样式
const pageLayoutStyle = computed(() => {
  return function (pageLayout) {
    console.log("pageLayoutStyle--pageLayout", pageLayout);
    let styleObj = {};
    styleObj.width = "100%";
    styleObj.height = "100%";
    styleObj.cursor = "move";
    styleObj.zIndex = pageLayout.config.attr.zIndex;
    if (
      pageLayout.config.attr.backgroundType == "img" &&
      pageLayout.config.attr.backgroundImgValue != ""
    ) {
      let imgURL =
        window.cbcConfig.getFileUrl +
        "?uuid=" +
        pageLayout.config.attr.backgroundImgValue +
        "&type=photo";
      styleObj.backgroundImage = "url(" + imgURL + ")";
      styleObj.backgroundSize = "100% 100%";
    } else if (
      pageLayout.config.attr.backgroundType == "color" &&
      pageLayout.config.attr.backgroundColorValue != ""
    ) {
      styleObj.background = pageLayout.config.attr.backgroundColorValue;
    }

    if (pageLayout.type == "flex-column") {
      styleObj.display = "flex";
      styleObj.flexDirection = "column";
    }
    if (pageLayout.type == "flex-row") {
      styleObj.display = "flex";
      styleObj.flexDirection = "row";
    }
    console.log("pageLayoutStyle--styleObj", styleObj);
    return styleObj;
  };
});

const setStyle = computed(() => {
  return function (item) {
    console.log("setStyle--item", item);
    let styleObj = {};
    styleObj.boxSizing = "border-box";
    //内边距
    styleObj.paddingTop =
      item.config.attr.padding.top + item.config.attr.padding.unit;
    styleObj.paddingBottom =
      item.config.attr.padding.bottom + item.config.attr.padding.unit;
    styleObj.paddingLeft =
      item.config.attr.padding.left + item.config.attr.padding.unit;
    styleObj.paddingRight =
      item.config.attr.padding.right + item.config.attr.padding.unit;
    //外边距
    styleObj.marginTop =
      item.config.attr.margin.top + item.config.attr.margin.unit;
    styleObj.marginBottom =
      item.config.attr.margin.bottom + item.config.attr.margin.unit;
    styleObj.marginLeft =
      item.config.attr.margin.left + item.config.attr.margin.unit;
    styleObj.marginRight =
      item.config.attr.margin.right + item.config.attr.margin.unit;

    //背景
    styleObj.zIndex = item.config.attr.zIndex;
    if (
      item.config.attr.backgroundType == "img" &&
      item.config.attr.backgroundImgValue != ""
    ) {
      let imgURL =
        window.cbcConfig.getFileUrl +
        "?uuid=" +
        item.config.attr.backgroundImgValue +
        "&type=photo";
      styleObj.backgroundImage = "url(" + imgURL + ")";
      styleObj.backgroundSize = "100% 100%";
    } else if (
      item.config.attr.backgroundType == "color" &&
      item.config.attr.backgroundColorValue != ""
    ) {
      styleObj.background = item.config.attr.backgroundColorValue;
    }

    return styleObj;
  };
});

//页面布局样式
const setFlexStyle = computed(() => {
  return function (item) {
    //console.log("setFlexStyle--item", item);
    let styleObj = {};
    //内部布局组件样式
    styleObj.flexBasis = item.config.attr.flexBasis + "%";
    if (currentPageRenderTreeNodeData.value.ref == item.ref) {
      //选中边框样式
      styleObj.border = "2px solid blue";
    } else {
      styleObj.border = "1px dashed yellow";
    }
    //内边距
    // styleObj.paddingTop = item.config.attr.padding.top + item.config.attr.padding.unit;
    // styleObj.paddingBottom =
    //   item.config.attr.padding.bottom + item.config.attr.padding.unit;
    // styleObj.paddingLeft = item.config.attr.padding.left + item.config.attr.padding.unit;
    // styleObj.paddingRight =
    //   item.config.attr.padding.right + item.config.attr.padding.unit;
    //外边距
    // styleObj.marginTop = item.config.attr.margin.top + item.config.attr.margin.unit;
    // styleObj.marginBottom = item.config.attr.margin.bottom + item.config.attr.margin.unit;
    // styleObj.marginLeft = item.config.attr.margin.left + item.config.attr.margin.unit;
    // styleObj.marginRight = item.config.attr.margin.right + item.config.attr.margin.unit;

    return styleObj;
  };
});
</script>

<style scoped></style>