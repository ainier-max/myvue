<template>
  <div id="container" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { provide, ref, nextTick, onMounted, watchEffect } from "vue";
import { Graph, Shape, Edge } from "@antv/x6";
import axios from "axios";
import { objectToString } from "@/common/js/objStr.js";
import insertCss from "insert-css";
import AntV from "./AntV/index.vue";

import { storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { blueScriptData } = storeToRefs(
  blueScriptDataStoreObj
);

onMounted(() => {
  //初始化编辑区域
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


   
});
</script>

<style scoped></style>
