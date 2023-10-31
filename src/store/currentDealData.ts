import { defineStore, storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(pageEditStoreObj);
import { findParent,findNodeById } from "@/common/js/tree.js";

export const currentDealDataStore = defineStore("currentDealDataID", {
  state: () => ({
    currentPageRenderTreeNodeData: null,
    currentTopPageBlockData: null,
    currentTopPageLayoutData: null,
    timer:null
  }),
  getters: {

  },
  actions: {
    setCurrentPageRenderTreeNodeDataByID(id) {
      let nodeDataTemp = findNodeById(pageRenderTreeData.value, id);
      this.setCurrentPageRenderTreeNodeData(nodeDataTemp);
    },
    setCurrentPageRenderTreeNodeData(data) {
      console.log("设置当前节点--data",data);
      //设置当前渲染树节点
      this.currentPageRenderTreeNodeData = data;
      //获取渲染树节点的顶层block
      this.currentTopPageBlockData = findParent(pageRenderTreeData.value, data, [])[0];
      //获取渲染树节点的顶层layout
      this.currentTopPageLayoutData = findParent(pageRenderTreeData.value, data, [])[1];
      console.log("setCurrentPageRenderTreeNodeData--this.currentTopPageLayoutData",this.currentTopPageLayoutData);
      //console.log("setCurrentPageRenderTreeNodeData--currentTopPageBlockData",this.currentTopPageBlockData);
    },
    //刷新顶层的layout
    refreshCurrentTopPageLayoutData() {
      //如果当前选中的树节点是顶层页面块，则不刷新
      console.log("currentTopPageLayoutData666",this.currentTopPageLayoutData);
      if (this.currentTopPageLayoutData) {
        let the = this;
        this.currentTopPageLayoutData.config.attr.show = false;
        if (this.timer) {
          clearInterval(this.timer);
        }
        // 开启定时器
        this.timer = setTimeout(function () {
          // 调用函数fn
          the.currentTopPageLayoutData.config.attr.show = true;
        }, 200);
      }
    }
  },
});
