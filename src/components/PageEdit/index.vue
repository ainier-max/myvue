<template>
  <div class="mainClass" style="display: flex; flex-direction: row">
    <div style="flex-basis: 17%; border-right: 1px solid gray">
      <div style="height: 60%">
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
          style="margin-top: 15px"
          type="primary"
          >添加页面块</el-button
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

      <div style="width: 100%; height: 100%; position: relative">
        <LayoutDesign
          v-if="currentPageRenderTreeNodeData && layoutDesignShowFlag"
        ></LayoutDesign>
      </div>
    </div>

    <div style="flex-basis: 18%">
      <!--基础配置（前端组件，内置组件，打包组件）-->
      <CommonSetting
        v-if="
          currentPageRenderTreeNodeData?.type == 'frontEndComponent' ||
          currentPageRenderTreeNodeData?.type == 'buildInComponent'||
          currentPageRenderTreeNodeData?.type == 'implantBlock' ||
          currentPageRenderTreeNodeData?.type == 'flex-column' ||
          currentPageRenderTreeNodeData?.type == 'flex-row'
        "
      ></CommonSetting>
      
      <!--页面块配置-->
      <BlockSetting
        v-if="
          currentPageRenderTreeNodeData?.type == 'mainBlock' ||
          currentPageRenderTreeNodeData?.type == 'childBlock'
        "
        @refreshLayouDesign="refreshLayouDesign"
      ></BlockSetting>
    </div>
  </div>

  <el-dialog
    title="新增页面块"
    v-model="addPageBlockDialogVisible"
    :close-on-click-modal="false"
    width="30%"
  >
    <el-form :model="pageBlockDataForm" label-width="100px">
      <el-form-item label="页面名称" prop="pageName">
        <el-input
          v-model="pageBlockDataForm.pageName"
          placeholder="页面名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="页面宽度" prop="pageWidth">
        <el-input
          v-model="pageBlockDataForm.pageWidth"
          placeholder="页面宽度(单位px)"
        ></el-input>
      </el-form-item>

      <el-form-item label="页面高度" prop="pageHeight">
        <el-input
          v-model="pageBlockDataForm.pageHeight"
          placeholder="页面高度(单位px)"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="addPageBlockCancle">取 消</el-button>
      <el-button type="primary" @click="addPageBlock">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">



//import 'default-passive-events';
import { ref, nextTick, onMounted,watchEffect  } from "vue";
import { useRoute } from "vue-router";
import { objectToString, stringToObject } from "@/common/js/objStr.js";
import { ElMessage } from "element-plus";

import BlockSetting from "@/components/PageEdit/PageDesign/Settings/BlockSetting/index.vue";

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
const { pageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

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

//
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
const refreshLayouDesign = () => {
  console.log("布局设计页面刷新!");
  layoutDesignShowFlag.value = false;
  nextTick(() => {
    layoutDesignShowFlag.value = true;
  });
};

watchEffect(() => {
  //console.log("watchEffect--currentDealDataStoreObj.$state.currentTopPageBlockData",currentDealDataStoreObj.$state.currentTopPageBlockData);
  if(currentDealDataStoreObj.$state.currentTopPageBlockData){
    refreshLayouDesign();
  }
})

const nodeClick = (data) => {
  //console.log("树节点点击事件--data",data);
  currentDealDataStoreObj.setCurrentPageRenderTreeNodeData(data);
  //点击的是子页面块，则切换编辑区
  // if(data.type=="childBlock" || data.type=="mainBlock"){
  //   console.log("点击的是子页面块，则切换编辑区");
    
  // }
};

//查询页面渲染树
const findAllPageRenderTreeByPageID = () => {
  let param = {};
  (param.sql = "page_render_tree.findAllPageRenderTreeByPageID"),
    (param.page_id = page_id);
  commonSelectRequest(axios, param, findAllPageRenderTreeByPageIDCallBack);
};
const findAllPageRenderTreeByPageIDCallBack = (result) => {
  for (let i = 0; i < result.objects.length; i++) {
    result.objects[i].config = stringToObject(result.objects[i].config_str);
    //result.objects[i].config = eval("(" + result.objects[i].config_str + ")");
  }
  pageRenderTreeDataStoreObj.setData(
    getListData(result.objects, [
      "ref",
      "type",
      "config",
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
    // 使用
    ElMessage.success("保存成功！");
  }
};

//添加页面块
const pageBlockDataForm = ref({
  pageName: "",
  pageWidth: "",
  pageHeight: "",
});
const addPageBlockDialogVisible = ref(false);
const showPageBlockDidlog = () => {
  pageBlockDataForm.value.pageName="";
  pageBlockDataForm.value.pageWidth="";
  pageBlockDataForm.value.pageHeight="";
  addPageBlockDialogVisible.value = true;
};
const addPageBlockCancle=()=>{
  addPageBlockDialogVisible.value = false;
}
const addPageBlock = () => {
  console.log("pageRenderTreeData12312",pageRenderTreeData);
  if(pageBlockDataForm.value.pageName && pageBlockDataForm.value.pageWidth && pageBlockDataForm.value.pageHeight){
    let obj = {};
    obj.page_id=page_id;
    obj.id="id-"+window.cbcuuid();
    obj.label=pageBlockDataForm.value.pageName;
    obj.ref='blockRef-'+window.cbcuuid();
    obj.type="childBlock";
    obj.index=pageRenderTreeData.value.length;
    obj.config={
        attr:{
          h:pageBlockDataForm.value.pageHeight,
          w:pageBlockDataForm.value.pageWidth,
          unit:"px",
          backgroundType:"color",
          backgroundColorValue:"rgba(0,0,0,0.8)",
          backgroundImgValue:"",
        },
        blueScriptAttr:{
          x:0,
          y:0,
          w:3000,
          h:2000
        }
      };
      obj.pid=null;
      pageRenderTreeData.value.push(obj);
      addPageBlockDialogVisible.value = false;
  }else{
    ElMessage.error("有未输入项");
  }
  
};


// 生命周期钩子
onMounted(() => {
  findAllPageRenderTreeByPageID();
});
</script>

<style scoped>
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
