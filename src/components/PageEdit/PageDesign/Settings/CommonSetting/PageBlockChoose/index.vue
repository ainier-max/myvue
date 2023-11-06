<template>
  <div style="width: 100%; height: 100%">
    <el-button
      v-for="(pageBlock,index) in pageRenderTreeData"
      type="primary"
      @click="getPageBlock(pageBlock)"
    >
      {{ pageBlock.label }}
    </el-button>
  </div>
</template>

<script setup lang="ts">

import { uuid } from "@/common/js/uuid";
import { storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentTopPageBlockData, currentPageRenderTreeNodeData } = storeToRefs(
  currentDealDataStoreObj
);

const emit = defineEmits(["getChooseData"]);
import { useRoute } from "vue-router";
const route = useRoute();
const page_id = route.query.page_id;
const getPageBlock=(pageBlock)=>{
    console.log("getPageBlock--pageBlock",pageBlock);

    let obj={};
    obj.id="id-"+uuid();
    if(currentPageRenderTreeNodeData.value.type=="flex-row" || currentPageRenderTreeNodeData.value.type=="flex-column"){
      //当前节点为flex-row或者flex-column
      obj.pid=currentPageRenderTreeNodeData.value.id;
    }else{
      //当前节点为frontEndComponent/buildInComponent/packComponent
      obj.pid=currentPageRenderTreeNodeData.value.pid;
    }

    obj.label=pageBlock.label;
    obj.ref = pageBlock.ref;
    obj.type = "implantBlock";
    obj.page_id = page_id;
    obj.related_value = pageBlock.id;
    obj.config={};
    obj.config.attr={};

    obj.config.attr.flexBasis = 100;
    obj.config.attr.zIndex = 100;
    obj.config.attr.show = true;

    obj.config.attr.padding = {};
    obj.config.attr.padding.unit = "px";
    obj.config.attr.padding.top = "0";
    obj.config.attr.padding.bottom = "0";
    obj.config.attr.padding.left = "0";
    obj.config.attr.padding.right = "0";

    obj.config.attr.margin = {};
    obj.config.attr.margin.unit = "px";
    obj.config.attr.margin.top = "0";
    obj.config.attr.margin.bottom = "0";
    obj.config.attr.margin.left = "0";
    obj.config.attr.margin.right = "0";

    emit("getChooseData", obj);
}
</script>

<style scoped></style>
