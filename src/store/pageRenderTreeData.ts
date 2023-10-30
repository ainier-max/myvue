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
      console.log("页面渲染树数据--pageRenderTreeData",this.pageRenderTreeData);
    },
    //找出type为mainBlock的数据
    getNodeForMainBlock() {
      return this.pageRenderTreeData[_.findIndex(this.pageRenderTreeData, { 'type': 'mainBlock'})];
    },
    //在父ID下添加节点
    addNodeByPID(pid,node) {
      let nodeTemp = findNodeById(this.pageRenderTreeData, pid);
      nodeTemp.children.push(node);
      console.log("addNodeByPID--this.pageRenderTreeData",this.pageRenderTreeData);
    },
    //布局组件添加前端组件、内置组件、打包组件、页面块时使用
    createOrReplaceNodeByPID(pid,node) {
      let nodeTemp = findNodeById(this.pageRenderTreeData, pid);
      if (nodeTemp.children.length>0) {
        nodeTemp.children[0]=node;
      } else {
        nodeTemp.children.push(node);
      }
      console.log("createOrReplaceNodeByPID--this.pageRenderTreeData",this.pageRenderTreeData);
    },
    //树节点转数组
    getPageRenderTreeDataForArray() {
      let arrayTemp = [];
      treeToArray(this.pageRenderTreeData, arrayTemp);
      return arrayTemp;
    }

  },
});
