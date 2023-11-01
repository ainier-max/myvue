<template>
  <div style="width: 100%; height: 350px; overflow: auto">
    <el-tree
      :data="componentChooseTreeData"
      node-key="id"
      :default-expand-all="false"
      :default-expanded-keys="[1]"
      :expand-on-click-node="false"
      :props="defaultProps"
      :highlight-current="true"
      @node-click="pageCentreTreeNodeClick"
      style="margin-left: 10px"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, computed } from "vue";

import { commonSelectRequest } from "@/common/js/request.js";
import axios from "axios";
import { getListData } from "@/common/js/tree";
import { uuid } from "@/common/js/uuid";
import { ElMessage } from "element-plus";

const defaultProps = {
  children: "children",
  label: "label",
};
const componentChooseTreeData = ref([]);


const findPageComponentByID = (component_id) => {
  if (component_id == null || component_id == "") {
    ElMessage.error("当前选择不是组件！");
    return;
  }
  let param = {};
  param.sql = "page_component_frontend.find";
  param.component_id = component_id;
  console.log("findPageComponentByID--param", param);
  commonSelectRequest(axios, param, findPageComponentByIDCallBack);
};

const emit = defineEmits(["getFrontEndComponent"]);
import { storeToRefs } from "pinia";
import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentTopPageBlockData, currentPageRenderTreeNodeData } = storeToRefs(
  currentDealDataStoreObj
);
import { useRoute } from "vue-router";
const route = useRoute();
const page_id = route.query.page_id;

const findPageComponentByIDCallBack = (result) => {
  console.log("findPageComponentByIDCallBack--result", result);
  if (result.objects.length > 0) {
    let obj = {};
    /**
    obj.blue_script_in_out_config_str =
      result.objects[0].blue_script_in_out_config_str;
    obj.blue_script_logic_config_str =
      result.objects[0].blue_script_logic_config_str;
    obj.blue_script_node_config_str =
      result.objects[0].blue_script_node_config_str;
    obj.blue_script_visualize_config_str =
      result.objects[0].blue_script_visualize_config_str;

    obj.component_visualize_str = result.objects[0].component_visualize_str;
    obj.component_code = result.objects[0].component_code;
    obj.component_id = result.objects[0].component_id;
    obj.component_name = result.objects[0].component_name;

    obj.page_block_ref =currentTopPageBlockData.value.ref;
    obj.layout_ref =currentPageRenderTreeNodeData.value.ref;
    //obj.component_ref = "frontEndComponentRef-" + uuid();
    */
    obj.id="id"+uuid();
    if(currentPageRenderTreeNodeData.value.type=="flex-row" || currentPageRenderTreeNodeData.value.type=="flex-column"){
      //当前节点为flex-row或者flex-column
      obj.pid=currentPageRenderTreeNodeData.value.id;
    }else{
      //当前节点为frontEndComponent/buildInComponent/packComponent
      obj.pid=currentPageRenderTreeNodeData.value.pid;
    }

    obj.label=result.objects[0].component_name;
    obj.ref = "frontEndComponentRef-" + uuid();
    obj.type = result.objects[0].type;
    obj.page_id = page_id;
    obj.component_code = result.objects[0].component_code;
    obj.related_value = result.objects[0].component_id;
    obj.config_str = result.objects[0].component_config_str;
    obj.config = eval(
      "(" + result.objects[0].component_config_str + ")"
    );

    
    obj.config.attr.flexBasis = 100;
    obj.config.attr.padding = {};
    obj.config.attr.padding.unit = "px";
    obj.config.attr.padding.top = "0";
    obj.config.attr.padding.bottom = "0";
    obj.config.attr.padding.left = "0";
    obj.config.attr.padding.right = "0";

    obj.config.attr.margin = {};
    obj.config.attr.margin.unit = "px";
    obj.config.attr.margin.top = "0";
    obj.config.attr.margin.bottom = "0";
    obj.config.attr.margin.left = "0";
    obj.config.attr.margin.right = "0";

    obj.config.attr.zIndex = 100;
    obj.config.attr.show = true;
    obj.config.attr.backgroundType = "color";
    obj.config.attr.backgroundColorValue = null;
    obj.config.attr.backgroundImgValue = "";

    emit("getFrontEndComponent",obj);
  }
};
const findPageComponentTree = () => {
  let param = {};
  param.sql = "page_component_frontend_tree.find";
  commonSelectRequest(axios, param, findPageComponentTreeCallBack);
};
const findPageComponentTreeCallBack = (result) => {
  componentChooseTreeData.value = getListData(result.objects, ["component_id"]);
};

const pageCentreTreeClickCount = ref(0);
const pageCentreTreeNodeClick = (data, node) => {
  //记录点击次数
  pageCentreTreeClickCount.value = pageCentreTreeClickCount.value + 1;
  //单次点击次数超过2次不作处理,直接返回,也可以拓展成多击事件
  if (pageCentreTreeClickCount.value >= 2) {
    return;
  }
  //计时器,计算300毫秒为单位,可自行修改
  window.setTimeout(() => {
    if (pageCentreTreeClickCount.value == 1) {
      //把次数归零
      pageCentreTreeClickCount.value = 0;
      //单击事件处理
      //console.log('单击事件,可在此处理对应逻辑')
      

    } else if (pageCentreTreeClickCount.value > 1) {
      //把次数归零
      pageCentreTreeClickCount.value = 0;
      //双击事件
      //console.log('双击事件,可在此处理对应逻辑')
      findPageComponentByID(data.component_id);
    }
  }, 500);
};

// 生命周期钩子
onMounted(() => {
  findPageComponentTree();
  
});
</script>

<style scoped></style>
