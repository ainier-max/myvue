<template>
  <div
    style="
      height: 100%;
      width: 100%;
      border: 1px solid white;
      position: relative;
    "
  >
    <vue-draggable-resizable
      v-for="(pageLayout, index) in pageRenderTreeData[pageBlockIndex].children"
      :key="index"
      :x="pageLayout.config.x"
      :y="pageLayout.config.y"
      :w="pageLayout.config.w"
      :h="pageLayout.config.h"
      @dragging="onDrag"
      @resizing="onResize"
      @resizestop="onResizstop"
      @dragstop="onDragstop"
      @activated="onActivated(pageLayout)"
      @deactivated="onDeactivated(pageLayout)"
      :parent="true"
      :preventDeactivation="true"
      :active="setActived(pageLayout)"
      :ref="'drag-' + pageLayout.ref"
      :scale="scale"
      :style="pageLayoutStyle(pageLayout)"
      @contextmenu="onContextMenu($event, pageLayout.ref)"
    >
      <!--透明蒙版-->
      <div class="mb"></div>
    </vue-draggable-resizable>
  </div>
</template>

<script setup lang="ts">
import VueDraggableResizable from "vue-draggable-resizable/src/components/vue-draggable-resizable.vue";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();
import { storeToRefs } from "pinia";
const { pageRenderTreeData } = storeToRefs(pageEditStoreObj);
import { ref, nextTick, onMounted, computed } from "vue";
import {toDecimal} from "@/common/js/decimal.js";


import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentPageLayoutData } = storeToRefs(
  currentDealDataStoreObj
);

const props = defineProps({
  topPageBlock: null,
  scale: null,
});
const pageBlockIndex = ref(0);
//console.log("顶层块123：",props.topPageBlock);
//console.log("pageRenderTreeData1123",pageRenderTreeData);
pageBlockIndex.value = _.findIndex(pageRenderTreeData.value, [
  "ref",
  props.topPageBlock.ref,
]);
//布局组件样式
const pageLayoutStyle = computed(() => {
  return function (pageLayout) {
    //console.log("vueDraggableResizableStyle--pageLayout", pageLayout);
    let styleObj = {};
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
    return styleObj;
  };
});

const setActived=(pageLayout)=>{
  if(pageLayout.ref==currentPageLayoutData.value.ref){
    return true
  }
}
const onActivated = (pageLayout) => {
  //console.log("onActivated");
  currentPageRenderTreeNodeData.value=pageLayout;
  currentPageLayoutData.value=pageLayout;
};

const onDrag = (x, y) => {
  currentPageLayoutData.value.config.x=x;
  currentPageLayoutData.value.config.y=y;
  currentPageLayoutData.value.config.xPer = toDecimal((x / pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.width) * 100);
  currentPageLayoutData.value.config.yPer = toDecimal((y / pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.height) * 100);
};
const onResize = (x, y, width, height) => {
  //位置
  currentPageLayoutData.value.config.x=x;
  currentPageLayoutData.value.config.y=y;
  currentPageLayoutData.value.config.xPer = toDecimal((x / pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.width) * 100);
  currentPageLayoutData.value.config.yPer = toDecimal((y / pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.height) * 100);
  //大小
  currentPageLayoutData.value.config.w=width;
  currentPageLayoutData.value.config.h=height;
  currentPageLayoutData.value.config.wPer = toDecimal((width / pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.width) * 100);
  currentPageLayoutData.value.config.hPer = toDecimal((height / pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.height) * 100);
};
const onDeactivated = (component) => {};
const onResizstop = (x, y, width, height) => {};
const onDragstop = (component) => {};
</script>

<style scoped></style>
