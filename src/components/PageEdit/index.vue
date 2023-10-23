<template>
  <div class="mainClass" style="display: flex; flex-direction: row">
    <div style="flex-basis: 20%; border-right: 1px solid gray">
      <div style="height: 60%">
        <el-tree
          ref="pageRenderTreeRef"
          :data="pageRenderTreeData"
          node-key="id"
          :default-expand-all="true"
          :expand-on-click-node="false"
          :props="defaultProps"
          :highlight-current="true"
          @node-click="nodeClick"
        />
      </div>

      <!-- <div style="border-top: 1px solid gray">子页面</div> -->
    </div>
    <div style="flex-basis: 80%">
      <div style="width:100%;height:30px;background: #fc74fd;padding-top: 8px;">
        <span style="color: rgba(255, 255, 255, 1);font-weight:bold;padding-left:8px;cursor:pointer">界面设计</span>
        <span style="color: gray;font-weight:bold;padding-left:8px;cursor:pointer">蓝图设计</span>
        <el-button style="margin-left:200px;" type="success" size="small" @click="savePageRenderTree">保存</el-button>
      </div>
    </div>
  </div>



  <div id="resizeDiv" style="position:absolute;right:0px;top:0px;width:400px;height:100%;display: flex; flex-direction: row">
    <div style="width:5px;background:#c71585;cursor: move;" id="opResize"></div>
    <div style="width:395px;" id="rightResize">
        <BlockSetting
        v-if="settingParam?.type == 'mainBlock' || settingParam?.type == 'childBlock'" :settingParam="settingParam"></BlockSetting>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, nextTick,onMounted } from "vue";
import { useRoute } from "vue-router";
import {objectToString,stringToObject} from "@/common/js/objStr.js";
import { ElMessage } from "element-plus";

import BlockSetting from "@/components/PageEdit/PageDesign/Settings/BlockSetting/index.vue";

import {
  commonExcuteRequest,
  commonSelectRequest,
  commonExcuteByBatchRequest,
  commonBatchSelectRequest,
  commonExcuteRequestAndOtherParam,
} from "@/common/js/request.js";
import { getListData } from "@/common/js/tree.js";

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageEditStoreObj = pageRenderTreeDataStore();
import { storeToRefs } from "pinia";
const { pageRenderTreeData } = storeToRefs(pageEditStoreObj);

const defaultProps = { children: "children", label: "label" };

const route = useRoute();
const page_id = route.query.page_id;
//const page_debug_flag = route.query.page_debug_flag;
const settingParam = ref(null);
const pageRenderTreeRef= ref(null);

//console.log("page_id", page_id);
//console.log("page_debug_flag", page_debug_flag);

const nodeClick = (data) => {
  settingParam.value=data;
  console.log("nodeClick--settingParam:", settingParam);

};

//查询页面渲染树
const findAllPageRenderTreeByPageID=()=>{
    let param={};
    param.sql="page_render_tree.findAllPageRenderTreeByPageID",
    param.page_id=page_id;
    commonSelectRequest(axios, param, findAllPageRenderTreeByPageIDCallBack);
};
const findAllPageRenderTreeByPageIDCallBack = (result) => {
    for(let i=0;i<result.objects.length;i++){
        result.objects[i].config=eval("(" + result.objects[i].config_str + ")");
    }
    pageEditStoreObj.setData(getListData(result.objects, ["ref", "type","config","config_str"]));
    //找出type为mainBlock的数据
    let nodeTemp=pageEditStoreObj.getNodeForMainBlock();
    nextTick(() => {
        pageRenderTreeRef.value.setCurrentKey(nodeTemp.id);
        nodeClick(nodeTemp);
    });
}
//保存页面渲染树
const savePageRenderTree=()=>{
  let arrayTemp=pageEditStoreObj.getPageRenderTreeDataForArray();
  console.log("savePageRenderTree--arrayTemp",arrayTemp);
  let newArrayTemp=[];
  for(let i=0;i<arrayTemp.length;i++){
    let { id, pid,ref,type } = { ...arrayTemp[i] }
    let config_str=objectToString(arrayTemp[i].config);
    let name=arrayTemp[i].label;
    newArrayTemp.push({ id, pid,name,ref,type,page_id,config_str});
  }
  let param={};
  param.sql="page_render_tree.savePageRenderTree";
  param.page_id=page_id;
  param.pageRenderTreeData=newArrayTemp;
  console.log("传参param",param);
  commonExcuteByBatchRequest(window.axios, param, savePageRenderTreeCallBack);
}
const savePageRenderTreeCallBack=(result)=>{
  if (result.state == "success") {
    // 使用
    ElMessage.success("保存成功！");
  }
}




// 生命周期钩子
onMounted(() => {
    findAllPageRenderTreeByPageID();
    //div宽度可调整
    let opResize = document.getElementById("opResize");
    let resizeDiv=document.getElementById("resizeDiv");
    let rightResize=document.getElementById("rightResize");
    opResize.onmousedown = function(e) {
        let startX = e.clientX;
        let startWidth=parseInt(resizeDiv.style.width);
        console.log("startX",startX);
        document.onmousemove = function(e) {
          // 计算并应用位移量
          let endX = e.clientX;
          let moveLen = endX - startX;
          let newWidth=startWidth-moveLen;
          if(newWidth>100 && newWidth<1000){
            resizeDiv.style.width=newWidth+"px";
            rightResize.style.width=(newWidth-5)+"px";
          }
        };
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        };
    }
});
</script>

<style scoped>
.mainClass {
  height: 100%;
  overflow: hidden;
  margin: 0px;
}
</style>
