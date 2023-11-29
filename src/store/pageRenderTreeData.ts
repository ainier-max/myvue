import { defineStore } from "pinia";
import { findNodeById,treeToArray,deleteNode } from "@/common/js/tree.js";
import { nextTick } from "vue";


export const pageRenderTreeDataStore = defineStore("pageRenderTreeDataID", {
  state: () => ({
    pageRenderTreeData: null,
    relativePageRenderTreeData: null,
    topPageRenderTreeData:null,
  }),
  getters: {

  },
  actions: {
    //设置关联页面数据
    setRelativePageRenderTreeData(data) {
      data = this.newSortForChildren(data);
      this.sortTree(data);
      this.relativePageRenderTreeData = data;
      console.log("关联页面渲染树数据--setRelativePageRenderTreeData", this.relativePageRenderTreeData);

      this.setIsRelativePage(this.relativePageRenderTreeData);
      this.relativePageRenderTreeData.forEach(element => {
        this.pageRenderTreeData.push(element);
      });

    },
    //设置节点isRelativePage为关联页面
    setIsRelativePage(nodes) {
      for (const node of nodes) {
        node.isRelativePage = true;
        if (node.children) {
          this.setIsRelativePage(node.children);
        }
      }
    },
    
    // setPageRenderTreeDataByReLativePageID(nodes, element) {
    //   for (const node of nodes) {
    //     if (node.related_value === element.id) {
    //       node.children.push(element);
    //       return;
    //     }
    //     if (node.children) {
    //       this.setPageRenderTreeDataByReLativePageID(node.children,element);
    //     }
    //   }
    // },

  

    //设置页面渲染树数据
    setPageRenderTreeData(data) {
      data = this.newSortForChildren(data);
      this.sortTree(data);
      this.pageRenderTreeData = data;
      this.topPageRenderTreeData = this.pageRenderTreeData[0];
      console.log("页面渲染树数据--pageRenderTreeData", this.pageRenderTreeData);
      this.getTopPageRenderTreeData();
    },
    getTopPageRenderTreeData() {
      this.pageRenderTreeData.forEach(element => {
        if (element.type == "mainBlock") {
          this.topPageRenderTreeData = element;
        }
      });
    },
    //根据index重新排序所有父节点的children数据
    sortTree(treeNode) {
      for (const node of treeNode) {
        if (node.children.length) {
          node.children = this.newSortForChildren(node.children);
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
      node.config.attr.index = nodeTemp.children.length;
      nodeTemp.children.push(node);
    },
    newSortForChildren(childrenArr) {
      //排序
      let tempArr=_.sortBy(childrenArr, function (o) {
        return o.config.attr.index;
      });
      //console.log("newSortForChildren--tempArr", tempArr);
      //重新赋值排序值
      for (let i = 0; i < tempArr.length;i++){
        tempArr[i].config.attr.index = i;
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
      data.config.attr.index = indexTemp;
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
