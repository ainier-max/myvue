<template>
  <el-row style="margin-bottom:50px">
    <el-col :span="6">
      <el-tree
        ref="pageTreeRef"
        :data="pageTreeData"
        node-key="id"
        :default-expand-all="true"
        :expand-on-click-node="false"
        :props="defaultProps"
        :highlight-current="true"
        @node-click="nodeClick"
      />
    </el-col>
    <el-col :span="18">
      <template v-for="(item,i) in pagesArr" >
        <el-button style="margin-top:15px;margin-left:20px" @click="addPage(item)">{{item.page_name}}</el-button>
      </template>

    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watchEffect } from "vue";
import { commonSelectRequest,commonExcuteRequest,commonExcuteRequestAndOtherParam } from "@/common/js/request.js";
import { getListData } from "@/common/js/tree.js";
import {uuid} from "@/common/js/uuid.js";
import { useRoute } from "vue-router";
import { objectToString, stringToObject } from "@/common/js/objStr.js";
const route = useRoute();
const page_id = route.query.page_id;


import { storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData,ralativePageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);


const pageTreeData = ref([]);
const pagesArr = ref([]);
const defaultProps = {
  children: "children",
  label: "label",
};
const findPageTree = () => {
  let param = {};
  param.sql = "page_centre_tree.find";
  commonSelectRequest(axios, param, findPageTreeCallBack);
};
const findPageTreeCallBack = (result) => {
  pageTreeData.value = getListData(result.objects, []);
  console.log("pageTreeData12",pageTreeData);
};
const nodeClick = (data) => {
  let param = {};
  param.sql = "page_centre.find";
  param.page_tree_id = data.id;
  commonSelectRequest(axios, param, nodeClickCallBack);
};
const nodeClickCallBack = (result) => {
  pagesArr.value = result.objects;
  console.log("pagesArr", pagesArr);
};


const addPage = (item) => {
  console.log("addPage--item",item);
  let param={};
  param.sql="page_centre_relative.insert";
  param.id="id-"+uuid();
  param.page_id=page_id;
  param.relative_page_id=item.page_id;
  commonExcuteRequestAndOtherParam(axios, param, addPageCallBack,item);
};
const addPageCallBack=(result,item)=>{
  if (result.state == "success") {
    let param = {};
    param.sql="page_render_tree.findAllPageRenderTreeByPageID";
    param.page_id=item.page_id;
    commonSelectRequest(axios, param, findRalativePageRenderTreeByPageIDCallBack);
  }
}
const findRalativePageRenderTreeByPageIDCallBack=(result)=>{
  //关联页面渲染树
  for (let i = 0; i < result.objects.length; i++) {
    result.objects[i].config = stringToObject(result.objects[i].config_str);
  }
  let dataTemp=getListData(result.objects, [
      "ref",
      "type",
      "config",
      "page_id",
      "config_str",
      "related_value",
      "component_code",
  ]);
  
  dataTemp=pageRenderTreeDataStoreObj.newSortForChildren(dataTemp);
  pageRenderTreeDataStoreObj.sortTree(dataTemp);
  console.log("findRalativePageRenderTreeByPageIDCallBack--dataTemp",dataTemp);
  if(dataTemp){
    ralativePageRenderTreeData.value.push(dataTemp[0]);
  }
  
  console.log("ralativePageRenderTreeData112",ralativePageRenderTreeData);

}

onMounted(()=>{
  findPageTree();
});

</script>

<style scoped></style>
