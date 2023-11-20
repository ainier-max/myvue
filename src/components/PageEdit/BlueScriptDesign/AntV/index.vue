<template>
  <div id="container" style="width: 100%; height: 100%"></div>

  <div v-if="menuFlag" :style="menuStyle">
    <div style="height: 5px"></div>
    <div class="menuItemClass" @click="menuItemDelete">删除</div>
    <div class="menuItemClass" @click="menuClose">关闭</div>
    <div style="height: 5px"></div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, nextTick, onMounted, watchEffect } from "vue";
import { Graph, Shape, Edge } from "@antv/x6";
import axios from "axios";
import { objectToString } from "@/common/js/objStr.js";
import insertCss from "insert-css";

import { storeToRefs } from "pinia";

import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { blueScriptData, currentBlueScriptNode } = storeToRefs(
  blueScriptDataStoreObj
);

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { topPageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

onMounted(() => {
  //初始化画布区域
  initGraph();
  //定位并且上node节点
  console.log("topPageRenderTreeData", topPageRenderTreeData);
  window.antVGraph.zoomToRect({
    x: topPageRenderTreeData.value.config.blueScriptAttr.x,
    y: topPageRenderTreeData.value.config.blueScriptAttr.y,
    width: topPageRenderTreeData.value.config.blueScriptAttr.w,
    height: topPageRenderTreeData.value.config.blueScriptAttr.h,
  });

  blueScriptData.value.forEach((element) => {
    blueScriptDataStoreObj.addAntVGraphNode(element);
  });
});

//右击菜单
const menuFlag = ref(false);
const menuStyle = ref("");
const menuItemDelete = () => {
  if (currentBlueScriptNode) {
    blueScriptDataStoreObj.delete(currentBlueScriptNode.value);
    menuFlag.value = false;
  }
};
const menuClose = () => {
  menuFlag.value = false;
};

const initGraph = () => {
  const containerDom = document.getElementById("container");
  let containerDomStyle = window.getComputedStyle(containerDom);
  let widthTemp = parseFloat(containerDomStyle.width);
  let heightTemp = parseFloat(containerDomStyle.height);

  window.antVGraph = new Graph({
    container: document.getElementById("container"),
    grid: true,
    autoResize: false,
    width: widthTemp,
    height: heightTemp,
    embedding: {
      enabled: true,
      findParent({ node }) {
        const bbox = node.getBBox();
        return this.getNodes().filter((node) => {
          const data = node.getData();
          if (data && data.parent) {
            const targetBBox = node.getBBox();
            return bbox.isIntersectWithRect(targetBBox);
          }
          return false;
        });
      },
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      connector: "rounded",
      connectionPoint: "boundary",
      createEdge() {
        return new Shape.Edge({
          router: {
            name: "metro",
          },
          zIndex: 10,
          attrs: {
            line: {
              stroke: "#ffffff",
              strokeWidth: 1,
              targetMarker: {
                name: "classic",
                size: 7,
              },
            },
          },
        });
      },
    },
    mousewheel: {
      enabled: true,
      modifiers: ["ctrl"],
    },
    panning: {
      enabled: true,
      modifiers: "ctrl",
    },
  });
  window.antVGraph.on("node:moved", ({ e, x, y, node, view }) => {
    //console.log(x,y);
    console.log("node:moved--node", node);
    console.log("node:moved--blueScriptData", blueScriptData);
    blueScriptData.value.forEach((element) => {
      if (element.blue_script_ref == node.blue_script_ref) {
        let position = node.position();
        element.config.blue_script_node_config.x = position.x;
        element.config.blue_script_node_config.y = position.y;
      }
    });
  });
  window.antVGraph.on("node:contextmenu", ({ e, x, y, node, view }) => {
    //console.log("node右击e", e);
    currentBlueScriptNode.value = node;
    if (menuFlag.value == true) {
      menuFlag.value = false;
    }
    menuStyle.value =
      "position:fixed;left:" +
      e.clientX +
      "px;top:" +
      e.clientY +
      "px;background: #FFFFF0;width: 100px;";
    //console.log("menuStyle", menuStyle);
    menuFlag.value = true;
  });
};
</script>

<style scoped>
.menuItemClass {
  z-index: 9999;
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
}

.menuItemClass:hover {
  z-index: 9999;
  background: #c0d9d9;
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
}
</style>
