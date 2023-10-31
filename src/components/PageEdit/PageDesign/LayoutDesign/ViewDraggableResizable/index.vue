<template>
  <div :style="pageBlockStyle">
    <vue-draggable-resizable
      style="border:1px solid #1987cf"
      v-for="(pageLayout, index) in pageRenderTreeData[pageBlockIndex].children"
      :key="index"
      :x="pageLayout.config.attr.x"
      :y="pageLayout.config.attr.y"
      :w="pageLayout.config.attr.w"
      :h="pageLayout.config.attr.h"
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
      <PageLayoutRender v-if="pageLayout.config.attr.show" :pageLayoutData="pageLayout"></PageLayoutRender>
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
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import ContextMenu from "@imengyu/vue3-context-menu";

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
const deleteLayout = (pageLayout) => {
  deleteNode(pageRenderTreeData.value, pageLayout.id);
};

//页面块样式
const pageBlockStyle = computed(() => {
  let styleObj = {};
  styleObj.height = "100%";
  styleObj.width = "100%";
  styleObj.border = "1px solid white";
  styleObj.position = "relative";
  let blockData = pageRenderTreeData.value[pageBlockIndex.value];
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
  currentPageRenderTreeNodeData.value.config.attr.x = x;
  currentPageRenderTreeNodeData.value.config.attr.y = y;
  currentPageRenderTreeNodeData.value.config.attr.xPer = toDecimal(
    (x / pageRenderTreeData.value[pageBlockIndex.value].config.attr.w) * 100
  );
  currentPageRenderTreeNodeData.value.config.attr.yPer = toDecimal(
    (y / pageRenderTreeData.value[pageBlockIndex.value].config.attr.h) * 100
  );
};
const onResize = (x, y, width, height) => {
  //位置
  currentPageRenderTreeNodeData.value.config.attr.x = x;
  currentPageRenderTreeNodeData.value.config.attr.y = y;
  currentPageRenderTreeNodeData.value.config.attr.xPer = toDecimal(
    (x / pageRenderTreeData.value[pageBlockIndex.value].config.attr.w) * 100
  );
  currentPageRenderTreeNodeData.value.config.attr.yPer = toDecimal(
    (y / pageRenderTreeData.value[pageBlockIndex.value].config.attr.h) * 100
  );
  //大小
  currentPageRenderTreeNodeData.value.config.attr.w = width;
  currentPageRenderTreeNodeData.value.config.attr.h = height;
  currentPageRenderTreeNodeData.value.config.attr.wPer = toDecimal(
    (width / pageRenderTreeData.value[pageBlockIndex.value].config.attr.w) * 100
  );
  currentPageRenderTreeNodeData.value.config.attr.hPer = toDecimal(
    (height / pageRenderTreeData.value[pageBlockIndex.value].config.attr.h) *
      100
  );
  //大小变化，重新渲染
  currentDealDataStoreObj.refreshCurrentTopPageLayoutData();
};


const onDeactivated = (component) => {};
const onResizstop = (x, y, width, height) => {};
const onDragstop = (component) => {};
</script>

<style scoped></style>
