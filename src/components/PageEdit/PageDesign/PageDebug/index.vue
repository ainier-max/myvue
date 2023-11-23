<template>
  <div v-drag class="dragClass">
    <div align="right" id="operateMenuID">
      <el-button type="danger" size="small" @click="runProcess"
        >运行
      </el-button>
      <el-button type="danger" size="small" @click="resetProcess"
        >重置调试状态
      </el-button>
      <el-button type="danger" size="small" @click="stopDebugProcess"
        >关闭调试界面
      </el-button>
    </div>

    <div class="pageClass">
        <PageBrowse></PageBrowse>
    </div>

  </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import PageBrowse from "@/components/PageBrowse/index.vue";

import { defineStore, storeToRefs } from "pinia";

import { processDataStore } from "@/store/processData.ts";
const processDataStoreObj = processDataStore();


// 在模板中启用 v-focus
const vDrag = {
  mounted: (el, bindings) => {
    document.getElementById("operateMenuID").onmousedown = function (e) {
      let disx = e.pageX - el.offsetLeft;
      let disy = e.pageY - el.offsetTop;
      document.onmousemove = function (e) {
        el.style.left = e.pageX - disx + "px";
        el.style.top = e.pageY - disy + "px";
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
    };
  },
};

const runProcess = () => {
    processDataStoreObj.runAllProcess(true);
};
const resetProcess = () => {
  window.antVGraph.getEdges().forEach((element) => {
    element.attr("line", {
      stroke: "#ff00ff",
      strokeWidth: 1,
      strokeDasharray: 0,
      targetMarker: {
        name: "classic",
        size: 7,
      },
    });
  });
};

const debugProcessFlag = inject('debugProcessFlag');

const stopDebugProcess = () => {
  debugProcessFlag.value=false;
  resetProcess();
};
</script>

<style scope>
#operateMenuID {
  cursor: move;
  padding: 10px 10px 10px 10px;
  border-bottom: 1px solid gray;
}

.pageClass {
  overflow: auto;
  position: relative;
  height: 540px;
  overflow: hidden;
}
.dragClass {
  overflow: hidden;
  position: fixed;
  left: 50px;
  top: 20px;
  width: 900px;
  background: #ffffff;
  z-index: 1000;
  border-style: inset;
}
</style>
