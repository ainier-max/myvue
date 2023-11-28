import { defineStore, storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(pageEditStoreObj);
import { findParent,findNodeById,findNodeByRef } from "@/common/js/tree.js";
import {  nextTick } from "vue";

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
    setCurrentPageRenderTreeNodeDataByRef(ref) {
      console.log("setCurrentPageRenderTreeNodeDataByRef--ref",ref);
      this.currentPageRenderTreeNodeData = findNodeByRef(pageRenderTreeData.value, ref);
      console.log("setCurrentPageRenderTreeNodeDataByRef--this.currentPageRenderTreeNodeData",this.currentPageRenderTreeNodeData);
    },
    setCurrentPageRenderTreeNodeDataByID(id) {
      let nodeDataTemp = findNodeById(pageRenderTreeData.value, id);
      this.setCurrentPageRenderTreeNodeData(nodeDataTemp);
    },
    setCurrentPageRenderTreeNodeData(data) {
      console.log("当前选中渲染树节点数据：",data);
      //设置当前渲染树节点
      this.currentPageRenderTreeNodeData = data;
      //|| data.type=="childBlock"
      if (data.type=="mainBlock") {
        this.currentTopPageBlockData = data;
        this.currentTopPageLayoutData = null;
      } else if (data.type=="childBlock" && !data.pid) {
        this.currentTopPageBlockData = data;
        this.currentTopPageLayoutData = null;
      } else {
        //获取渲染树节点的顶层block
        let parentPathArr = findParent(pageRenderTreeData.value, data, []);
        parentPathArr.push(data);
        //console.log("setCurrentPageRenderTreeNodeData--parentPathArr",parentPathArr);
        this.currentTopPageBlockData = parentPathArr[0];
        //console.log("setCurrentPageRenderTreeNodeData--currentTopPageBlockData",this.currentTopPageBlockData);
        //获取渲染树节点的顶层layout
        this.currentTopPageLayoutData = parentPathArr[1];
        //console.log("setCurrentPageRenderTreeNodeData--currentTopPageLayoutData",this.currentTopPageLayoutData);
      }
      
    },
    refreshCurrentPageRenderTreeNodeData() {
      console.log("refreshCurrentPageRenderTreeNodeData--this.currentPageRenderTreeNodeData",this.currentPageRenderTreeNodeData);
      if (this.currentPageRenderTreeNodeData.config.attr.show == true) {
        console.log("refreshCurrentPageRenderTreeNodeData--进入刷新");
        //刷新当前节点
        this.currentPageRenderTreeNodeData.config.attr.show=false;
        nextTick(()=>{
          this.currentPageRenderTreeNodeData.config.attr.show=true;
        });
      } else {
        
      }

      
    },

    //刷新顶层的layout
    refreshCurrentTopPageLayoutData() {
      //如果当前选中的树节点是顶层页面块，则不刷新
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
