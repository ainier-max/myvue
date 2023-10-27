import { defineStore, storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(pageEditStoreObj);
import { findParent } from "@/common/js/tree.js";

export const currentDealDataStore = defineStore("currentDealDataID", {
  state: () => ({
    currentPageRenderTreeNodeData: null,
    currentTopPageBlockData:null,
  }),
  getters: {

  },
  actions: {
    setCurrentPageRenderTreeNodeData(data) {
      console.log("设置当前节点--data",data);
      //设置当前渲染树节点
      this.currentPageRenderTreeNodeData = data;
      //获取渲染树节点的顶层block
      this.currentTopPageBlockData = findParent(pageRenderTreeData.value, data, [])[0];
      //console.log("setCurrentPageRenderTreeNodeData--currentTopPageBlockData",this.currentTopPageBlockData);
    }

  },
});
