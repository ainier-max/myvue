<template>
  <div style="height: 100%; width: 100%;position: relative" v-if="pageBlockRenderData && props.pageBlockData.config.attr.show == true">
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
const { pageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

const props = defineProps({
  pageBlockData: null,
});

console.log("页面块--props.pageBlockData", props.pageBlockData);
console.log("页面渲染树数据--pageRenderTreeData.value", pageRenderTreeData.value);

const pageBlockRenderData = ref(null);

pageBlockRenderData.value = findNodeById(
  pageRenderTreeData.value,
  props.pageBlockData.related_value
);

console.log("要渲染的页面块数据", pageBlockRenderData);
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
