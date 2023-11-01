import { defineStore } from "pinia";
import { findNodeById,treeToArray,deleteNode } from "@/common/js/tree.js";
import { nextTick } from "vue";


export const pageRenderTreeDataStore = defineStore("pageRenderTreeDataID", {
  state: () => ({
    pageRenderTreeData: null,
  }),
  getters: {

  },
  actions: {
    //设置数据
    setData(data) {
      //this.pageRenderTreeData = data;
      
      this.sortTree(data);
      this.pageRenderTreeData = data;
      console.log("页面渲染树数据--pageRenderTreeData",this.pageRenderTreeData);
    },
    //根据flexIndex重新排序所有父节点的children数据
    sortTree(treeNode) {
      for (const node of treeNode) {
        if (node.children.length) {
          node.children = this.newSortForChildren(node.children);
          // node.sumFlexBasis = _.reduce(node.children, function (sum, o) {
          //   if (o.config.attr.flexBasis) {
          //     return sum + o.config.attr.flexBasis;
          //   } else {
          //     return sum;
          //   }
          // }, 0);
          this.sortTree(node.children);
        }
      }
    },

    //找出type为mainBlock的数据
    getNodeForMainBlock() {
      return this.pageRenderTreeData[_.findIndex(this.pageRenderTreeData, { 'type': 'mainBlock'})];
    },
    deleteNodeByData(nodeData) {
      //删除节点
      deleteNode(this.pageRenderTreeData, nodeData.id);
      //父节点的children新排序
      let nodeTemp = findNodeById(this.pageRenderTreeData, nodeData.pid);
      nodeTemp.children = this.newSortForChildren(nodeTemp.children);
      console.log("deleteNodeByData--this.pageRenderTreeData",this.pageRenderTreeData);
    },
    //在父ID下添加节点
    addNodeByPID(pid, node) {
      console.log("addNodeByPID--this.pageRenderTreeData", this.pageRenderTreeData);
      let nodeTemp = findNodeById(this.pageRenderTreeData, pid);
      console.log("addNodeByPID--nodeTemp", nodeTemp);
      //children新排序
      nodeTemp.children=this.newSortForChildren(nodeTemp.children);
      node.config.attr.flexIndex = nodeTemp.children.length;
      nodeTemp.children.push(node);

    },
    newSortForChildren(childrenArr) {
      //排序
      let tempArr=_.sortBy(childrenArr, function (o) {
        return o.config.attr.flexIndex;
      });
      //console.log("newSortForChildren--tempArr", tempArr);
      //重新赋值排序值
      for (let i = 0; i < tempArr.length;i++){
        tempArr[i].config.attr.flexIndex = i;
      }
      //console.log("newSortForChildren--tempArr", tempArr);
      return tempArr;
    },
    //布局组件添加前端组件、内置组件、打包组件、页面块时使用
    replaceNodeByData(currentPageRenderTreeNodeData,data) {
      console.log("replaceNodeByData--data",data);
      let nodeTemp = findNodeById(this.pageRenderTreeData, data.pid);
      console.log("replaceNodeByData--nodeTemp",nodeTemp);
      let indexTemp = _.findIndex(nodeTemp.children, function (o) {
        return o.id == currentPageRenderTreeNodeData.value.id;
      });
      data.flexIndex=currentPageRenderTreeNodeData.value.flexIndex;
      nodeTemp.children[indexTemp] = data;
      nextTick(() => {
        currentPageRenderTreeNodeData.value = nodeTemp.children[indexTemp];
      });
      console.log("replaceNodeByData--indexTemp", indexTemp);
    },
    //树节点转数组
    getPageRenderTreeDataForArray() {
      let arrayTemp = [];
      treeToArray(this.pageRenderTreeData, arrayTemp);
      return arrayTemp;
    }

  },
});
