<template>
  <div :style="pageLayoutStyle(pageLayoutData)" class="pageLayoutClass">
    <div
      v-for="(item, index) in pageLayoutData.children"
      :style="setFlexStyle(item)"
      class="pageLayoutChildrenClass"
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

      <!--页面块渲染-->
      <PageBlockRender
        v-if="item.type == 'implantBlock'"
        :style="setStyle(item)"
        :pageBlockData="item"
      >
      </PageBlockRender>
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
import PageBlockRender from "./PageBlockRender/index.vue";

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
    if(pageLayout.config.attr.labelType == "flex"){
      let widthTemp=Number(pageLayout.config.attr.padding.left)+Number(pageLayout.config.attr.padding.right);
      let heightTemp=Number(pageLayout.config.attr.padding.top)+Number(pageLayout.config.attr.padding.bottom);
      let uintTemp=pageLayout.config.attr.padding.unit;
      styleObj.width = "calc(100% - "+widthTemp+uintTemp+")";
      styleObj.height = "calc(100% - "+heightTemp+uintTemp+")";
    } else{
      styleObj.width = "100%";
      styleObj.height = "100%";
    }
    
    styleObj.zIndex = pageLayout.config.attr.zIndex;

    //内边距
    styleObj.paddingTop =
      pageLayout.config.attr.padding.top + pageLayout.config.attr.padding.unit;
    styleObj.paddingBottom =
      pageLayout.config.attr.padding.bottom +
      pageLayout.config.attr.padding.unit;
    styleObj.paddingLeft =
      pageLayout.config.attr.padding.left + pageLayout.config.attr.padding.unit;
    styleObj.paddingRight =
      pageLayout.config.attr.padding.right +
      pageLayout.config.attr.padding.unit;

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
//设置布局里面的组件，页面块样式
const setStyle = computed(() => {
  return function (item) {
    console.log("setStyle--item", item);
    let styleObj = {};
    styleObj.boxSizing = "border-box";
    
    styleObj.minWidth = "0";
    styleObj.minHeight = "0";
    styleObj.overflow="hidden";
    //内边距
    styleObj.paddingTop =
      item.config.attr.padding.top + item.config.attr.padding.unit;
    styleObj.paddingBottom =
      item.config.attr.padding.bottom + item.config.attr.padding.unit;
    styleObj.paddingLeft =
      item.config.attr.padding.left + item.config.attr.padding.unit;
    styleObj.paddingRight =
      item.config.attr.padding.right + item.config.attr.padding.unit;

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

//页面Flex样式
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
    return styleObj;
  };
});
</script>

<style scoped></style>
