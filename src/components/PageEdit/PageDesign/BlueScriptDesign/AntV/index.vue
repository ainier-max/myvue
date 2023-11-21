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
import { addEdge } from "./AntV.js";

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
  //蓝图节点的名称
  

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
    //添加节点
    blueScriptDataStoreObj.addAntVGraphNode(element);
    addEdge(element.config.blue_script_in_out_config);
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
              stroke: "#ff00ff",
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
    blueScriptDataStoreObj.setCurrentBlueScriptNode(node);
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

    window.antVGraph.getNodes().forEach((element) => {
      if (element.data && element.data.parent == true) {
        element.getAttrs().body.fill = "rgb(255,251,230,0.8)";
        element.setAttrs(element.getAttrs().body.fill);
      } else {
        element.getAttrs().body.fill = "rgba(40, 44, 52,0.9)";
        element.setAttrs(element.getAttrs().body.fill);
      }
    });
    //点击节点高亮
    node.getAttrs().body.fill = "rgba(95, 149, 255, 0.80)";
    node.setAttrs(node.getAttrs().body.fill);
  });

  insertCss(`
      @keyframes ant-line {
        to {
            stroke-dashoffset: -1000
        }
      }
    `);

  window.antVGraph.on("edge:connected", ({ isNew, edge }) => {
    console.log("edge:connected--isNew", isNew, edge);
    if (isNew) {
      let valueTemp = null;
      //赋值out状态
      blueScriptData.value.forEach((element) => {
        console.log("edge:connected--element", element);
        if (element.graphNode.id == edge.source.cell) {
          element.config.blue_script_in_out_config.out.forEach((item) => {
            if (item.portID == edge.source.port) {
              item.connected = true;
              item.connectedSource = edge.source;
              valueTemp = item.value;
              item.connectedTargetArr.push(edge.target);
            }
          });
        }
      });
      //赋值in状态
      blueScriptData.value.forEach((element) => {
        console.log("edge:connected--element", element);
        if (element.graphNode.id == edge.target.cell) {
          element.config.blue_script_in_out_config.in.forEach((item) => {
            if (item.portID == edge.target.port) {
              item.connected = true;
              item.value = valueTemp;
            }
          });
        }
      });
    }
  });

  window.antVGraph.on("edge:removed", ({ edge, options }) => {
    console.log("要删除连接线的起点：", edge.animation.cell.source);
    console.log("要删除连接线的终点：", edge.animation.cell.target);
    blueScriptData.value.forEach((element) => {
      if (element.blue_script_ref == edge.animation.cell.source.cell) {
        element.config.blue_script_in_out_config.out.forEach((outItem) => {
          for (let n = 0; n < outItem.connectedTargetArr.length; n++) {
            if (
              outItem.connectedTargetArr[n].cell ==
                edge.animation.cell.target.cell &&
              outItem.connectedTargetArr[n].port ==
                edge.animation.cell.target.port
            ) {
              outItem.connectedTargetArr.splice(n, 1);
              n = n - 1;
            }
          }
          //如果连接的端口都没有，则设置connected为false
          if (outItem.connectedTargetArr.length == 0) {
            outItem.connected = false;
            outItem.connectedSource = {};
          }
        });
      }

      if (element.blue_script_ref == edge.animation.cell.target.cell) {
        element.config.blue_script_in_out_config.in.forEach((inItem) => {
          if (inItem.portID == edge.animation.cell.target.port) {
            inItem.connected = false;
          }
        });
      }
    });
  });

  window.antVGraph.on("node:mouseenter", ({ node }) => {
    node.addTools({
      name: "boundary",
      args: {
        padding: 5,
        attrs: {
          fill: "#7c68fc",
          stroke: "#9254de",
          strokeWidth: 1,
          fillOpacity: 0.2,
        },
      },
    });
  });

  window.antVGraph.on("node:click", ({ e, x, y, node, view }) => {
    console.log("当前选中的node:", node);
    blueScriptDataStoreObj.setCurrentBlueScriptNode(node);

    window.antVGraph.getNodes().forEach((element) => {
      if (element.data && element.data.parent == true) {
        element.getAttrs().body.fill = "rgb(255,251,230,0.8)";
        element.setAttrs(element.getAttrs().body.fill);
      } else {
        element.getAttrs().body.fill = "rgba(40, 44, 52,0.9)";
        element.setAttrs(element.getAttrs().body.fill);
      }
    });
    //点击节点高亮
    node.getAttrs().body.fill = "rgba(95, 149, 255, 0.80)";
    node.setAttrs(node.getAttrs().body.fill);
    //window.cbcBlueScriptSettingsInstance.ctx.setCurrentBlueScript(node);
  });

  window.antVGraph.on("node:mouseleave", ({ node }) => {
    node.removeTool("boundary");
  });

  window.antVGraph.on("edge:mouseenter", ({ edge }) => {
    edge.addTools([
      "source-arrowhead",
      "target-arrowhead",
      {
        name: "button-remove",
        args: {
          distance: -30,
        },
      },
    ]);
  });
  window.antVGraph.on("edge:mouseleave", ({ edge }) => {
    edge.removeTools();
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
