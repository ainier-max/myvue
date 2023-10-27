<template>
  <div :style="pageBlockStyle">
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
    >
      <!--@contextmenu="onContextMenu($event, pageLayout)"-->
      <!--透明蒙版-->
      <div class="mb"></div>
      <PageLayoutRender :pageLayoutData="pageLayout" ></PageLayoutRender>
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
import { toDecimal } from "@/common/js/decimal.js";
import { deleteNode } from "@/common/js/tree.js";
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

import PageLayoutRender from "@/components/PageEdit/PageDesign/LayoutDesign/ViewDraggableResizable/PageLayoutRender/index.vue";


import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentTopPageBlockData, currentPageRenderTreeNodeData } = storeToRefs(
  currentDealDataStoreObj
);

const props = defineProps({
  scale: null,
});
const pageBlockIndex = ref(0);
//找出ref=topPageBlock的下标值
pageBlockIndex.value = _.findIndex(pageRenderTreeData.value, [
  "ref",
  currentTopPageBlockData.value.ref,
]);

const onContextMenu = (e, pageLayout) => {
  //选中布局
  currentDealDataStoreObj.setCurrentPageRenderTreeNodeData(pageLayout);
  //删除布局
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      // {
      //   label: "取消选中",
      //   onClick: () => {
      //     cancelChoosedLayout(pageLayout);
      //   },
      // },
      {
        label: "删除",
        onClick: () => {
          deleteLayout(pageLayout);
        },
      },
    ],
  });
};
const deleteLayout=(pageLayout)=>{
  deleteNode(pageRenderTreeData.value,pageLayout.id);
}

//页面块样式
const pageBlockStyle = computed(() => {
  let styleObj = {};
  styleObj.height = "100%";
  styleObj.width = "100%";
  styleObj.border = "1px solid white";
  styleObj.position = "relative";
  let blockData = pageRenderTreeData.value[pageBlockIndex.value];
  if (
    blockData.config.pageConfig.backgroundType == "img" &&
    blockData.config.pageConfig.backgroundImgValue != ""
  ) {
    let imgURL =
      window.cbcConfig.getFileUrl +
      "?uuid=" +
      blockData.config.pageConfig.backgroundImgValue +
      "&type=photo";
    styleObj.backgroundImage = "url(" + imgURL + ")";
    styleObj.backgroundSize = "100% 100%";
  } else if (
    blockData.config.pageConfig.backgroundType == "color" &&
    blockData.config.pageConfig.backgroundColorValue != ""
  ) {
    styleObj.background = blockData.config.pageConfig.backgroundColorValue;
  }

  return styleObj;
});


const setActived = (pageLayout) => {
  if (pageLayout.ref == currentPageRenderTreeNodeData.value.ref) {
    return true;
  }
};
const onActivated = (pageLayout) => {
  //选中布局
  currentDealDataStoreObj.setCurrentPageRenderTreeNodeData(pageLayout);
  //console.log("onActivated");
};

const onDrag = (x, y) => {
  currentPageRenderTreeNodeData.value.config.x = x;
  currentPageRenderTreeNodeData.value.config.y = y;
  currentPageRenderTreeNodeData.value.config.xPer = toDecimal(
    (x /
      pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.width) *
      100
  );
  currentPageRenderTreeNodeData.value.config.yPer = toDecimal(
    (y /
      pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.height) *
      100
  );
};
const onResize = (x, y, width, height) => {
  //位置
  currentPageRenderTreeNodeData.value.config.x = x;
  currentPageRenderTreeNodeData.value.config.y = y;
  currentPageRenderTreeNodeData.value.config.xPer = toDecimal(
    (x /
      pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.width) *
      100
  );
  currentPageRenderTreeNodeData.value.config.yPer = toDecimal(
    (y /
      pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.height) *
      100
  );
  //大小
  currentPageRenderTreeNodeData.value.config.w = width;
  currentPageRenderTreeNodeData.value.config.h = height;
  currentPageRenderTreeNodeData.value.config.wPer = toDecimal(
    (width /
      pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.width) *
      100
  );
  currentPageRenderTreeNodeData.value.config.hPer = toDecimal(
    (height /
      pageRenderTreeData.value[pageBlockIndex.value].config.pageConfig.height) *
      100
  );
};
const onDeactivated = (component) => {};
const onResizstop = (x, y, width, height) => {};
const onDragstop = (component) => {};
</script>

<style scoped></style>
