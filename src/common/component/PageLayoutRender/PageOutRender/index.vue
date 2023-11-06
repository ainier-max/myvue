<template>
  <div style="height: 100%; width: 100%;position: relative" v-if="pageBlockRenderData">
    <div v-for="(pageLayout, index) in pageBlockRenderData.children"
    :style="setPageLayoutStyle(pageLayout)">
      <PageLayoutRender
        v-if="pageLayout.config.attr.show"
        :pageLayoutData="pageLayout"
      ></PageLayoutRender>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageLayoutRender from "@/common/component/PageLayoutRender/index.vue";
import { ref, nextTick, onMounted, computed } from "vue";
import { findNodeById } from "@/common/js/tree.js";

import { storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { relativePageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

const props = defineProps({
  pageBlockData: null,
});

console.log("当前外部页面数据--props.pageBlockData", props.pageBlockData);

const pageBlockRenderData = ref(null);

let indexTemp = _.findIndex(relativePageRenderTreeData.value, function (o) {
  return o.id == props.pageBlockData.related_value;
});
pageBlockRenderData.value = relativePageRenderTreeData.value[indexTemp];

console.log("要渲染的外部页面数据", pageBlockRenderData);

//页面布局样式
const setPageLayoutStyle = computed(() => {
  return function (pageLayout) {
    console.log("pageLayoutStyle--pageLayout", pageLayout);
    let styleObj = {};
    styleObj.position="absolute";
    styleObj.left=pageLayout.config.attr.xPer+"%";
    styleObj.top=pageLayout.config.attr.yPer+"%";
    styleObj.height=pageLayout.config.attr.hPer+"%";
    styleObj.width=pageLayout.config.attr.wPer+"%";
    return styleObj;
  };
});

</script>

<style scoped></style>
