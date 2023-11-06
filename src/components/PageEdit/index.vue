<template>
  <div class="mainClass" style="display: flex; flex-direction: row">
    <div style="flex-basis: 17%">
      <div class="titleClass" align="center">页面渲染树</div>

      <div style="height: 40%">
        <el-tree
          ref="pageRenderTreeRef"
          :data="pageRenderTreeData"
          node-key="id"
          :default-expand-all="true"
          :expand-on-click-node="false"
          :props="defaultProps"
          :highlight-current="true"
          :current-node-key="setNodeKey()"
          @node-click="nodeClick"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span v-if="data.type == 'mainBlock'">
                <Folder style="width: 1em; height: 1em" />
                {{ node.label }}
              </span>
              <span v-else>
                <Folder style="width: 1em; height: 1em" />
                {{ node.label }}
                <!-- <span v-if="data.sumFlexBasis">({{data.sumFlexBasis}})</span>
                <span v-else>({{data.config.attr.flexBasis}})</span> -->
              </span>
              <span>
                <Delete
                  v-if="
                    data.type != 'mainBlock' &&
                    currentPageRenderTreeNodeData &&
                    currentPageRenderTreeNodeData.id == data.id
                  "
                  style="width: 1em; height: 1em; color: red; margin-left: 8px"
                  @click.stop="() => treeRemove(data)"
                ></Delete>
              </span>
            </span>
          </template>
        </el-tree>
      </div>

      <div align="center">
        <el-button
          @click="showPageBlockDidlog"
          style="margin-top: 15px; margin-bottom: 15px"
          type="primary"
          >添加页面块</el-button
        >
      </div>
      <div class="titleClass" align="center">外部页面</div>

      <div style="height: 35%">
        <el-table
          :data="relativePageRenderTreeData"
          style="width: 100%; height: 100%"
        >
          <el-table-column prop="label" label="页面块名称" width="250">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              {{ scope.row.label }}
              <el-icon
                size="20"
                color="red"
                style="cursor: pointer; padding-left: 10px"
              >
                <Delete @click="deleteRelativePageRenderTreeData(scope)" />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div align="center">
        <el-button
          @click="showPageOutDidlog"
          style="margin-top: 15px; margin-bottom: 15px"
          type="primary"
          >添加外部页面</el-button
        >
      </div>

      <!-- <div style="border-top: 1px solid gray">子页面</div> -->
    </div>
    <div style="flex-basis: 65%">
      <div
        style="width: 100%; height: 30px; background: #fc74fd; padding-top: 8px"
      >
        <el-row>
          <el-col :span="12">
            <div>
              <span
                style="
                  color: rgba(255, 255, 255, 1);
                  font-weight: bold;
                  padding-left: 8px;
                  cursor: pointer;
                "
                >界面设计</span
              >
              <span
                style="
                  color: gray;
                  font-weight: bold;
                  padding-left: 8px;
                  cursor: pointer;
                "
                >蓝图设计</span
              >
            </div>
          </el-col>
          <el-col :span="12">
            <div align="right" style="margin-right: 20px">
              <el-button type="success" size="small" @click="savePageRenderTree"
                >保存</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>

      <div style="width: calc(100% - 2px); height: 100%; position: relative">
        <LayoutDesign
          v-if="currentPageRenderTreeNodeData && layoutDesignShowFlag"
        ></LayoutDesign>
      </div>
    </div>

    <div style="flex-basis: 18%">
      <!--基础配置-->
      <CommonSetting @refreshLayoutDesign="refreshLayoutDesign"></CommonSetting>
    </div>
  </div>

  <el-dialog
    title="新增页面块"
    v-model="dialogFlag"
    :close-on-click-modal="false"
    :width="dialogWidth"
  >
    <AddPageBlock v-if="dialogType == 'AddPageBlock'"></AddPageBlock>
    <AddPageOutChoose
      v-if="dialogType == 'AddPageOutChoose' && dialogFlag"
    ></AddPageOutChoose>
  </el-dialog>
</template>

<script setup lang="ts">
//import 'default-passive-events';
import { provide, ref, nextTick, onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { objectToString, stringToObject } from "@/common/js/objStr.js";
import { ElMessage } from "element-plus";

import AddPageBlock from "@/components/PageEdit/PageDesign/DialogContent/AddPageBlock/index.vue";
import AddPageOutChoose from "@/components/PageEdit/PageDesign/DialogContent/AddPageOutChoose/index.vue";
import CommonSetting from "@/components/PageEdit/PageDesign/Settings/CommonSetting/index.vue";
import LayoutDesign from "@/components/PageEdit/PageDesign/LayoutDesign/index.vue";

import {
  commonExcuteRequest,
  commonSelectRequest,
  commonExcuteByBatchRequest,
  commonBatchSelectRequest,
  commonExcuteRequestAndOtherParam,
} from "@/common/js/request.js";
import { getListData, deleteNode } from "@/common/js/tree.js";

import { storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData, relativePageRenderTreeData } = storeToRefs(
  pageRenderTreeDataStoreObj
);

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);

const defaultProps = { children: "children", label: "label" };

const route = useRoute();
const page_id = route.query.page_id;
//const page_debug_flag = route.query.page_debug_flag;
const pageRenderTreeRef = ref(null);
const layoutDesignShowFlag = ref(true);

//console.log("page_id", page_id);
//console.log("page_debug_flag", page_debug_flag);

const setNodeKey = () => {
  //console.log("currentPageRenderTreeNodeData11",currentPageRenderTreeNodeData);
  if (currentPageRenderTreeNodeData.value) {
    return currentPageRenderTreeNodeData.value.id;
  } else {
    return "";
  }
};

//删除树节点
const treeRemove = (nodeData) => {
  //删除节点
  pageRenderTreeDataStoreObj.deleteNodeByData(nodeData);
  //如果删除的节点为当前选中的节点，则设置为当前节点的父节点
  if (nodeData.id == pageRenderTreeRef.value.getCurrentKey()) {
    currentDealDataStoreObj.setCurrentPageRenderTreeNodeDataByID(nodeData.pid);
  }
  //组件个数发生变化，重新渲染
  currentDealDataStoreObj.refreshCurrentTopPageLayoutData();
};

//布局设计页面刷新
const refreshLayoutDesign = () => {
  console.log("布局设计页面刷新!");
  layoutDesignShowFlag.value = false;
  nextTick(() => {
    layoutDesignShowFlag.value = true;
  });
};

//顶层节点页面块发生变化时刷新设计编辑区
watchEffect(() => {
  //console.log("watchEffect--currentDealDataStoreObj.$state.currentTopPageBlockData",currentDealDataStoreObj.$state.currentTopPageBlockData);
  if (currentDealDataStoreObj.$state.currentTopPageBlockData) {
    refreshLayoutDesign();
  }
});
//树节点点击事件
const nodeClick = (data) => {
  currentDealDataStoreObj.setCurrentPageRenderTreeNodeData(data);
};

//查询页面渲染树
const findAllPageRenderTreeByPageID = () => {
  let param = {};
  param.batchSql = [
    {
      sql: "page_render_tree.findAllPageRenderTreeByPageID",
      page_id: page_id,
      resultKey: "AllPageRenderTree",
    },
    {
      sql: "page_render_tree.findRalativePageRenderTreeByPageID",
      page_id: page_id,
      resultKey: "RalativePageRenderTree",
    },
  ];
  commonBatchSelectRequest(axios, param, findAllPageRenderTreeByPageIDCallBack);
};
const findAllPageRenderTreeByPageIDCallBack = (result) => {
  //页面渲染树
  for (let i = 0; i < result["AllPageRenderTree"].length; i++) {
    result["AllPageRenderTree"][i].config = stringToObject(
      result["AllPageRenderTree"][i].config_str
    );
    //result.objects[i].config = eval("(" + result.objects[i].config_str + ")");
  }
  pageRenderTreeDataStoreObj.setPageRenderTreeData(
    getListData(result["AllPageRenderTree"], [
      "ref",
      "type",
      "config",
      "page_id",
      "config_str",
      "related_value",
      "component_code",
    ])
  );
  //关联页面渲染树
  for (let i = 0; i < result["RalativePageRenderTree"].length; i++) {
    result["RalativePageRenderTree"][i].config = stringToObject(
      result["RalativePageRenderTree"][i].config_str
    );
  }
  pageRenderTreeDataStoreObj.setRelativePageRenderTreeData(
    getListData(result["RalativePageRenderTree"], [
      "ref",
      "type",
      "config",
      "page_id",
      "config_str",
      "related_value",
      "component_code",
    ])
  );

  //找出type为mainBlock的数据
  let nodeTemp = pageRenderTreeDataStoreObj.getNodeForMainBlock();
  nextTick(() => {
    pageRenderTreeRef.value.setCurrentKey(nodeTemp.id);
    nodeClick(nodeTemp);
  });
};
//保存页面渲染树
const savePageRenderTree = () => {
  let arrayTemp = pageRenderTreeDataStoreObj.getPageRenderTreeDataForArray();
  console.log("savePageRenderTree--arrayTemp", arrayTemp);
  let newArrayTemp = [];
  for (let i = 0; i < arrayTemp.length; i++) {
    let { id, pid, ref, type, related_value } = { ...arrayTemp[i] };
    let config_str = objectToString(arrayTemp[i].config);
    let name = arrayTemp[i].label;
    newArrayTemp.push({
      id,
      pid,
      name,
      ref,
      type,
      related_value,
      page_id,
      config_str,
    });
  }
  let param = {};
  param.sql = "page_render_tree.savePageRenderTree";
  param.page_id = page_id;
  param.pageRenderTreeData = newArrayTemp;
  console.log("传参param", param);
  commonExcuteByBatchRequest(window.axios, param, savePageRenderTreeCallBack);
};
const savePageRenderTreeCallBack = (result) => {
  if (result.state == "success") {
    ElMessage.success("保存成功！");
  }
};

const dialogTitle = ref("");
const dialogType = ref("");
const dialogFlag = ref(false);
const dialogWidth = ref("30%");
//注入
provide("dialogFlag", dialogFlag);
//添加外部页面
const showPageOutDidlog = () => {
  dialogWidth.value = "50%";
  dialogTitle.value = "添加外部页面";
  dialogFlag.value = true;
  dialogType.value = "AddPageOutChoose";
};
const deleteRelativePageRenderTreeData = (scope) => {
  console.log("deleteRelativePageRenderTreeData--scope", scope);

  //是否被渲染树调用，如果没有调用，则删除。
  console.log("isUsedPage--pageRenderTreeData.value",pageRenderTreeData.value);
  console.log("isUsedPage--scope.row",scope.row);
  let isUsedNode = isUsedPage(pageRenderTreeData.value, scope.row);
  console.log("isUsedNode",isUsedNode);
  if(isUsedNode==null){
    let param = {};
    param.sql = "page_centre_relative.delete";
    param.page_id = page_id;
    param.relative_page_id = scope.row.page_id;
    commonExcuteRequestAndOtherParam(
      window.axios,
      param,
      deleteRelativePageRenderTreeDataCallBack,
      scope
    );
  }else{
    ElMessage.info("该页面已经被使用，请先把页面渲染树使用到的页面删除，再执行该操作！");
    pageRenderTreeRef.value.setCurrentKey(isUsedNode.id);
    nodeClick(isUsedNode);
  }
};

//如果有使用，则返回该节点，如果没有使用，则返回null
const isUsedPage = (nodes, element) => {
  for (const node of nodes) {
    if (node.related_value == element.id) {
      console.log("返回true");
      return node;
    }
    if (node.children) {
      return isUsedPage(node.children, element);
    }
  }
  console.log("返回false");
  return null;
};

const deleteRelativePageRenderTreeDataCallBack = (result, scope) => {
  console.log("deleteRelativePageRenderTreeDataCallBack--scope", scope);
  if (result.state == "success") {
    //删除节点
    deleteNode(relativePageRenderTreeData.value, scope.row.id);
    ElMessage.success("删除成功！");
  }
};

//添加页面块弹窗
const showPageBlockDidlog = () => {
  dialogWidth.value = "30%";
  dialogTitle.value = "添加页面块";
  dialogFlag.value = true;
  dialogType.value = "AddPageBlock";
};

// 生命周期钩子
onMounted(() => {
  findAllPageRenderTreeByPageID();
});
</script>

<style scoped>
.titleClass {
  width: 100%;
  height: 30px;
  background: #fc74fd;
  color: rgba(255, 255, 255, 1);
  padding-top: 8px;
  font-weight: bold;
}

.mainClass {
  height: 100%;
  overflow: hidden;
  margin: 0px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
