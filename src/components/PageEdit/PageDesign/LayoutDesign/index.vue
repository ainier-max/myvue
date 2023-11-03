<template>
  <div>
    <div id="wrapper" >
      <SketchRule
        v-if="sketchRuleWidth && sketchRuleHeight"
        :thick="thick"
        :scale="scale"
        :width="sketchRuleWidth"
        :height="sketchRuleHeight"
        :start-x="startX"
        :start-y="startY"
        :shadow="shadow"
        :hor-line-arr="[100, 200]"
        :ver-line-arr="[100, 200]"
        :corner-active="true"
        @onCornerClick="handleCornerClick"
      >
      </SketchRule>
      <div
        id="screens"
        ref="screensRef"
        @wheel="handleWheel"
        @scroll="handleScroll"
      >
        <div ref="containerRef" class="screen-container">
          <ViewDraggableResizable id="canvasID" :scale="scale" :style="canvasStyle" v-if="currentTopPageBlockData"></ViewDraggableResizable>
          <!-- <div id="canvasID" :style="canvasStyle"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { SketchRule } from "vue3-sketch-ruler";
import "vue3-sketch-ruler/lib/style.css";
import ViewDraggableResizable from "@/components/PageEdit/PageDesign/LayoutDesign/ViewDraggableResizable/index.vue";
import { ref, nextTick, onMounted, computed } from "vue";
import { findParent } from "@/common/js/tree.js";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();

import { storeToRefs } from "pinia";
const { pageRenderTreeData } = storeToRefs(pageEditStoreObj);


import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const {currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);

const rectWidth = parseInt(currentTopPageBlockData.value.config.attr.w);
const rectHeight = parseInt(currentTopPageBlockData.value.config.attr.h);
console.log("布局设计区：rectWidth",rectWidth);
const scale = ref(0.6);
const startX = ref(-50);//该值与canvasID的宽度一致
const startY = ref(-50);//该值与canvasID的宽度一致
const thick = ref(20);
const sketchRuleWidth = ref(null);
const sketchRuleHeight = ref(null);
const isShowRuler = ref(true);
const isShowReferLine = ref(true);
const shadow = computed(() => {
  return {
    x: 0,
    y: 0,
    width: rectWidth,
    height: rectHeight,
  };
});
const canvasStyle = computed(() => {
  let styleObj = {};
  styleObj.width = rectWidth+"px";
  styleObj.height = rectHeight+"px";
  styleObj.transform = "scale("+scale.value+")";
  return styleObj;
});

const screensRef = ref(null);
const containerRef = ref(null);

// 生命周期钩子
onMounted(() => {
  screensRef.value.scrollLeft =  -30 
  const wrapperDom = document.getElementById("wrapper");
  var wrapperDomStyle = window.getComputedStyle(wrapperDom);
  sketchRuleWidth.value = parseFloat(wrapperDomStyle.width) - 20;
  sketchRuleHeight.value = parseFloat(wrapperDomStyle.height) - 20;
});

const handleCornerClick = () => {
  console.log("点击了角落");
  return;
};
const handleScroll = () => {
  const screensRect = document
    .querySelector("#screens")
    .getBoundingClientRect();
  const canvasRect = document
    .querySelector("#canvasID")
    .getBoundingClientRect();
  // 标尺开始的刻度
  startX.value =
    (screensRect.left + thick.value - canvasRect.left) / scale.value;
  startY.value = (screensRect.top + thick.value - canvasRect.top) / scale.value;
  //console.log("startX", startX);
  //console.log("startY", startY);
};
const handleWheel = (e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    const nextScale = parseFloat(
      Math.max(0.2, scale.value - e.deltaY / 500).toFixed(2)
    );
    scale.value = nextScale;
  }
  nextTick(() => {
    handleScroll();
  });
};
</script>
<style scoped>
#wrapper {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: calc(100% - 38px);
  background-color: #f5f5f5;
  border: 1px solid #dadadc;
}
#screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: scroll;
}
.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}

#canvasID {
  position: absolute;
  top: 50px;
  left: 50px;
  background: white;
  transform-origin: 0 0;
}

</style>
