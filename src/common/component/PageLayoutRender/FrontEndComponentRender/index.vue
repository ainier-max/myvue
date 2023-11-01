<template>
  <div style="width:100%;height:100%;">
    <component
      :id="'id_' + props.frontEndComponentData.ref"
      :ref="props.frontEndComponentData.ref"
      v-if="
        showFlag &&
        props.frontEndComponentData != null &&
        props.frontEndComponentData.config.attr.show == true
      "
      :is="props.frontEndComponentData.related_value"
      @event="eventFun"
      :component="props.frontEndComponentData"
    >
    </component>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, computed, getCurrentInstance } from "vue";
import * as Vue from "vue";

let currentInstance = getCurrentInstance();
if (currentInstance.components == null) {
  currentInstance.components = [];
}

const props = defineProps({
  frontEndComponentData: null,
});

const showFlag = ref(false);
console.log("frontEndComponentData", props.frontEndComponentData);
props.frontEndComponentData.component_config =
  props.frontEndComponentData.config;

const eventFun = (eventType, obj, component) => {
  //界面设计页面无需执行事件逻辑
  console.log("eventFun--事件类型：", eventType);
  console.log("eventFun--事件传递值：", obj);
  console.log("eventFun--当前组件信息：", component);
};


const registerComponent = (component_code) => {
  var option = {
    moduleCache: { vue: Vue, echarts: window["echarts"] },
    getFile(url) {
      return Promise.resolve(component_code);
    },
    addStyle(textContent) {
      //console.log("textContent",textContent);
      const style = Object.assign(document.createElement("style"), {
        textContent,
      });
      const ref = document.head.getElementsByTagName("style")[0] || null;
      document.head.insertBefore(style, ref);
    },
  };
  let component = loadModule("./Main.vue", option);
  //局部动态注册组件
  currentInstance.components[props.frontEndComponentData.related_value] =
    Vue.defineAsyncComponent(() => component);
  //console.log("this.$options:",this.$options);
  //全局动态注册组件
  //window.cbcApp.component(this.componentInfo.component_id, Vue.defineAsyncComponent(() => component));
  console.log("注册组件", props.frontEndComponentData.related_value);
  nextTick(() => {
    showFlag.value = true;
  });
};
registerComponent(props.frontEndComponentData.component_code);
onMounted(() => {});
</script>

<style scoped></style>
