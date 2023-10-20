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
    <div style="flex-basis: 80%">22</div>
  </div>



  <div id="resizeDiv" style="position:absolute;right:0px;top:0px;width:400px;height:100%;display: flex; flex-direction: row">
    <div style="width:5px;background:gray;cursor: move;" id="opResize"></div>
    <div style="flex-grow: 1;">
        <BlockSetting
        v-if="settingParam?.type == 'mainBlock' || settingParam?.type == 'childBlock'" :settingParam="settingParam"></BlockSetting>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, nextTick,onMounted } from "vue";
import { useRoute } from "vue-router";
import {objectToString,stringToObject} from "@/common/js/objStr.js";

import BlockSetting from "@/components/PageEdit/PageDesign/Settings/BlockSetting/index.vue";

import {
  commonExcuteRequest,
  commonSelectRequest,
  commonBatchSelectRequest,
  commonExcuteRequestAndOtherParam,
} from "@/common/js/request.js";
import { getListData } from "@/common/js/tree.js";

const defaultProps = { children: "children", label: "label" };

const route = useRoute();
const page_id = route.query.page_id;
//const page_debug_flag = route.query.page_debug_flag;
const pageRenderTreeData = ref([]);
const settingParam = ref(null);
const pageRenderTreeRef= ref(null);

//console.log("page_id", page_id);
//console.log("page_debug_flag", page_debug_flag);

const nodeClick = (data) => {
  settingParam.value=data;
  console.log("nodeClick--settingParam:", settingParam);

};

const findAllPageRenderTreeByPageID=()=>{
    let param={};
    param.sql="page_render_tree.findAllPageRenderTreeByPageID",
    param.page_id=page_id
    commonSelectRequest(axios, param, findAllPageRenderTreeByPageIDCallBack);
};

const findAllPageRenderTreeByPageIDCallBack = (result) => {
    for(let i=0;i<result.objects.length;i++){
        result.objects[i].config=eval("(" + result.objects[i].config_str + ")");;
    }
    pageRenderTreeData.value=getListData(result.objects, ["ref", "type","config","config_str"]);
    //找出type为mainBlock的数据
    let nodeTemp=pageRenderTreeData.value[_.findIndex(pageRenderTreeData.value, { 'type': 'mainBlock'})];
    nextTick(() => {
        pageRenderTreeRef.value.setCurrentKey(nodeTemp.id);
        nodeClick(nodeTemp);
    });
}


// 生命周期钩子
onMounted(() => {
    findAllPageRenderTreeByPageID();

    //div宽度可调整
    let opResize = document.getElementById("opResize");
    let resizeDiv=document.getElementById("resizeDiv");
    opResize.onmousedown = function(e) {
        let startX = e.clientX;
        let startWidth=parseInt(resizeDiv.style.width);
        console.log("startX",startX);
        document.onmousemove = function(e) {
          // 计算并应用位移量
          let endX = e.clientX;
          let moveLen = endX - startX;
          let newWidth=startWidth-moveLen;
          resizeDiv.style.width=newWidth+"px";
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
