<template>
  <div style="height: 100%; width: 100%" v-if="pageBlockRenderData">
    <template v-for="(pageLayout, index) in pageBlockRenderData.children">
      <PageLayoutRender
        v-if="pageLayout.config.attr.show"
        :pageLayoutData="pageLayout"
      ></PageLayoutRender>
    </template>
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

console.log("要渲染的页面块数据", pageBlockRenderData);
</script>

<style scoped></style>
