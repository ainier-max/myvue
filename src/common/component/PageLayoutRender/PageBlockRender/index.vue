<template>
  <div style="height: 100%; width: 100%">
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
const { pageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

const props = defineProps({
  pageBlockData: null,
});

console.log("页面块数据--props.pageBlockData1", props.pageBlockData);
const pageBlockRenderData = ref(null);
pageBlockRenderData.value = findNodeById(
  pageRenderTreeData.value,
  props.pageBlockData.related_value
);
console.log("要渲染的页面块数据", pageBlockRenderData);
</script>

<style scoped></style>
