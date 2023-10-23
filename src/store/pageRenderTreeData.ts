import { defineStore } from "pinia";
import { findNodeById,treeToArray } from "@/common/js/tree.js";


export const pageRenderTreeDataStore = defineStore("pageRenderTreeDataID", {
  state: () => ({
    pageRenderTreeData: null,
  }),
  getters: {

  },
  actions: {
    //设置数据
    setData(data) {
      this.pageRenderTreeData = data;
    },
    //找出type为mainBlock的数据
    getNodeForMainBlock() {
      return this.pageRenderTreeData[_.findIndex(this.pageRenderTreeData, { 'type': 'mainBlock'})];
    },
    //在父ID下添加节点
    addNodeByPID(pid,node) {
      let nodeTemp = findNodeById(this.pageRenderTreeData, pid);
      nodeTemp.children.push(node);
    },
    //树节点转数组
    getPageRenderTreeDataForArray() {
      let arrayTemp = [];
      treeToArray(this.pageRenderTreeData, arrayTemp);
      return arrayTemp;
    }

  },
});
