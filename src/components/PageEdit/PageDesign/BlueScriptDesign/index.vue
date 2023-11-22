<template>
  <div id="wrapper">
    <AntV v-if="antvFlag"></AntV>
  </div>
</template>

<script setup lang="ts">
//import "default-passive-events";
import { provide, ref, nextTick, onMounted, watchEffect } from "vue";
import axios from "axios";
import { objectToString } from "@/common/js/objStr.js";
import AntV from "./AntV/index.vue";

const antvFlag = ref(true);
let timer = null;

onMounted(() => {
  window.addEventListener("resize", debounce);
});
const debounce = (e) => {
  // 有定时器,则清除
  if (timer) {
    clearInterval(timer);
  }
  // 开启定时器
  timer = setTimeout(function () {
    console.log("蓝图编辑区页面发生变化！");
    // 调用函数fn
    antvFlag.value = false;
    nextTick(() => {
      antvFlag.value = true;
    });
  }, 200);
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
</style>
