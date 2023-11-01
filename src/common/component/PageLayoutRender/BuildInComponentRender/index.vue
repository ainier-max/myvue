<template>
  <div style="width:100%;height:100%;">
    <component
      :ref="props.buildInComponentData.ref"
      v-if="
        showFlag &&
        props.buildInComponentData != null &&
        props.buildInComponentData.config.attr.show == true
      "
      :is="props.buildInComponentData.related_value"
      @event="eventFun"
      :component="props.buildInComponentData"
    >
    </component>

  </div>
  
</template>

<script setup lang="ts">
import {
  ref,
  nextTick,
  onMounted,
  computed,
  getCurrentInstance,
  defineAsyncComponent,
} from "vue";
let currentInstance = getCurrentInstance();
if (currentInstance.components == null) {
  currentInstance.components = [];
}
import pathConfigArr from "@/buildin/pathConfigArr.js";
const props = defineProps({
  buildInComponentData: null,
});
console.log("buildInComponentData", props.buildInComponentData);

const showFlag = ref(false);

const eventFun = (eventType, obj, component) => {
  //界面设计页面无需执行事件逻辑
  console.log("eventFun--事件类型：", eventType);
  console.log("eventFun--事件传递值：", obj);
  console.log("eventFun--当前组件信息：", component);
};

let pathUrl = "";
console.log("pathConfigArr11", pathConfigArr);
for (let i = 0; i < pathConfigArr.length; i++) {
  if (pathConfigArr[i].type == props.buildInComponentData.related_value) {
    pathUrl = "../../../../buildin/" + pathConfigArr[i].path;
  }
}

currentInstance.components[props.buildInComponentData.related_value] =
  defineAsyncComponent({
    loader: () => import(/* @vite-ignore */ pathUrl),
  });

nextTick(() => {
  showFlag.value = true;
});

onMounted(() => {});
</script>

<style scoped></style>
