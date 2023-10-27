<template>
  <div :style="pageLayoutStyle(pageLayoutData)">
    <div v-for="(item, index) in pageLayoutData.children" :style="setStyle(item)">
      <PageLayoutRender
        v-if="item.type == 'flex-row' || item.type == 'flex-column'"
        :pageLayoutData="item"
      ></PageLayoutRender>
    </div>
  </div>
</template>

<script lang="ts">
    export default {
        name: 'PageLayoutRender' //给组件命名
    }
</script>

<script setup lang="ts">
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
    styleObj.zIndex = pageLayout.config.zIndex;
    if (
      pageLayout.config.backgroundType == "img" &&
      pageLayout.config.backgroundImgValue != ""
    ) {
      let imgURL =
        window.cbcConfig.getFileUrl +
        "?uuid=" +
        pageLayout.config.backgroundImgValue +
        "&type=photo";
      styleObj.backgroundImage = "url(" + imgURL + ")";
      styleObj.backgroundSize = "100% 100%";
    } else if (
      pageLayout.config.backgroundType == "color" &&
      pageLayout.config.backgroundColorValue != ""
    ) {
      styleObj.background = pageLayout.config.backgroundColorValue;
    }

    if(pageLayout.type=="flex-column"){
      styleObj.display="flex";
      styleObj.flexDirection="column"
    }
    if(pageLayout.type=="flex-row"){
      styleObj.display="flex";
      styleObj.flexDirection="row"
    }
    console.log("pageLayoutStyle--styleObj",styleObj);
    return styleObj;
  };
});

//页面布局样式
const setStyle = computed(() => {
  return function (item) {
    console.log("setStyle--item", item);
    let styleObj = {};
    styleObj.flexBasis = item.config.flexBasis + "%";
    if (currentPageRenderTreeNodeData.value.ref == item.ref) {
      //选中边框样式
      styleObj.border = "2px solid blue";
    } else {
      styleObj.border = "1px dashed yellow";
    }
    //内边距
    styleObj.paddingTop=item.config.padding.top+item.config.padding.unit;
    styleObj.paddingBottom=item.config.padding.bottom+item.config.padding.unit;
    styleObj.paddingLeft=item.config.padding.left+item.config.padding.unit;
    styleObj.paddingRight=item.config.padding.right+item.config.padding.unit;
    //外边距
    styleObj.marginTop=item.config.margin.top+item.config.margin.unit;
    styleObj.marginBottom=item.config.margin.bottom+item.config.margin.unit;
    styleObj.marginLeft=item.config.margin.left+item.config.margin.unit;
    styleObj.marginRight=item.config.margin.right+item.config.margin.unit;

    return styleObj;
  };
});
</script>

<style scoped></style>
