<template>
  <div id="container" style="width: 100%; height: 100%"></div>

  <div v-if="menuFlag" :style="menuStyle">
    <div style="height: 5px"></div>
    <div class="menuItemClass" @click="menuCopy" v-if="!currentBlueScriptNode.copyFlag">复制</div>
    <div class="menuItemClass" @click="menuItemDelete">删除</div>
    <div class="menuItemClass" @click="menuClose">关闭</div>
    <div style="height: 5px"></div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, nextTick, onMounted, watchEffect } from "vue";
import axios from "axios";
import { addEdge,initGraph,highLightNode } from "./AntV.js";
import { objectToString, stringToObject } from "@/common/js/objStr.js";

import { storeToRefs } from "pinia";

import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { blueScriptData, currentBlueScriptNode } = storeToRefs(
  blueScriptDataStoreObj
);

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { topPageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);


onMounted(() => {
  //初始化画布区域
  window.antVGraph = initGraph("container");
  //添加事件
  addGraphEvent();
  //定位并且上node节点
  console.log("topPageRenderTreeData", topPageRenderTreeData);
  window.antVGraph.zoomToRect({
    x: topPageRenderTreeData.value.config.blueScriptAttr.x,
    y: topPageRenderTreeData.value.config.blueScriptAttr.y,
    width: topPageRenderTreeData.value.config.blueScriptAttr.w,
    height: topPageRenderTreeData.value.config.blueScriptAttr.h,
  });

  //添加节点
  blueScriptData.value.forEach((element) => {
    //只添加非关联页面的蓝图节点
    if(!element.isRelativePage){
      blueScriptDataStoreObj.addAntVGraphNode(element);
    }else{
      element.config = stringToObject(element.config_str);
    }
  });
  //节点添加完成后，添加连线
  blueScriptData.value.forEach((element) => {
    //只添加非关联页面的蓝图节点
    if(!element.isRelativePage){
      addEdge(element.config.blue_script_in_out_config);
    }
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

const menuCopy=()=>{
  console.log("menuCopy--currentBlueScriptNode",currentBlueScriptNode);
  console.log("menuCopy--blueScriptData",blueScriptData);
  blueScriptData.value.forEach(element => {
    if(element.blue_script_ref==currentBlueScriptNode.value.blue_script_ref){
      blueScriptDataStoreObj.copy(element);
    }
  });
  menuFlag.value = false;
}

const menuClose = () => {
  menuFlag.value = false;
};

const addGraphEvent = () => {
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

    //节点高亮
    highLightNode(node);
  });

  window.antVGraph.on("edge:connected", ({ isNew, edge }) => {
    console.log("edge:connected--blueScriptData", blueScriptData.value);
    console.log("edge:connected--isNew", isNew, edge);
    if (isNew) {
      let valueTemp = null;
      //赋值out状态
      blueScriptData.value.forEach((element) => {
        console.log("edge:connected--element", element);
        
        //if (element.graphNode.id == edge.source.cell) {
        if (element.blue_script_ref == edge.source.cell) {
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
        if (element.blue_script_ref == edge.target.cell) {
          element.config.blue_script_in_out_config.in.forEach((item) => {
            if (item.portID == edge.target.port) {
              item.connected = true;
              item.value = valueTemp;
              if(element.config?.dataset?.data){
                console.log("element1232",element);
                //设置dataset数据
                element.config.dataset.data=valueTemp;
                //设置dataset字段
                if (element.config.dataset.data && element.config.dataset.data.length > 0) {
                  let objTemp = element.config.dataset.data[0];
                  element.config.dataset.fields = [];
                  for (let key in objTemp) {
                    element.config.dataset.fields.push(key);
                  }
                }
              }
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

    //currentPageRenderTreeNodeData

    //节点高亮
    highLightNode(node);
    menuFlag.value = false;
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
