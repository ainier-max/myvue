<template>
  <div style="width: 100%; height: 100%" class="ttt">
    <component
      :id="'id_' + props.packComponentData.ref"
      :ref="props.packComponentData.ref"
      v-if="
        showFlag &&
        props.packComponentData != null &&
        props.packComponentData.config.attr.show == true
      "
      :is="props.packComponentData.related_value"
      @event="eventFun"
      :component="props.packComponentData"
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
import { commonSelectRequest } from "@/common/js/request.js";
import { objectToString, stringToObject } from "@/common/js/objStr.js";

let currentInstance = getCurrentInstance();
if (currentInstance.components == null) {
  currentInstance.components = [];
}
const showFlag = ref(false);
const props = defineProps({
  packComponentData: null,
});
console.log("props.packComponentData:", props.packComponentData);

const eventFun = (eventType, obj, component) => {
  //界面设计页面无需执行事件逻辑
  console.log("eventFun--事件类型：", eventType);
  console.log("eventFun--事件传递值：", obj);
  console.log("eventFun--当前组件信息：", component);
};

const findComponentConfig = () => {
  let param = {};
  param.sql = "page_component_pack.findComponentConfig";
  param.component_id = props.packComponentData.component_id;
  commonSelectRequest(axios, param, findComponentConfigCallBack);
};
const findComponentConfigCallBack = (result) => {
  console.log("findComponentConfigCallBack--result", result);
  if (result.objects.length > 0) {
    props.packComponentData.component_config = stringToObject(
      result.objects[0].component_config_str
    );
    showFlag.value = true;
  }
};

// 生命周期钩子
onMounted(() => {
  let url =
    "/cbc/GetPageComponentPackmjs.cbc?component_id=" +
    props.packComponentData.related_value;
  import(/* @vite-ignore */ url)
    .then((module) => {
      //console.log("module111333", module);
      //局部动态注册组件
      currentInstance.components[props.packComponentData.related_value] =
        module.default;
      findComponentConfig();
    })
    .catch((error) => {
      // 捕获错误
      console.log("打包组件加载异常", error);
    });
});
</script>

<style scoped></style>
