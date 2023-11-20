<template>
  <div style="width: 100%; height: 350px; overflow: auto">
    <el-tree
      :data="blueScriptToolChooseTreeData"
      node-key="id"
      :default-expand-all="false"
      :default-expanded-keys="[1]"
      :expand-on-click-node="false"
      :props="defaultProps"
      :highlight-current="true"
      @node-click="blueScriptToolTreeNodeClick"
      style="margin-left: 10px"
    />
  </div>
</template>

<script setup lang="ts">

import { ref, nextTick, onMounted, computed } from "vue";
import { commonSelectRequest } from "@/common/js/request.js";
import axios from "axios";
import { getListData } from "@/common/js/tree";
import { ElMessage } from "element-plus";

const defaultProps = {
  children: "children",
  label: "label",
};
const blueScriptToolChooseTreeData = ref([]);

const findBlueScriptToolChooseTreeData = () => {
  let param = {};
  param.sql = "page_blue_script_tools_tree.find";
  commonSelectRequest(axios, param, findBlueScriptToolChooseTreeDataCallBack);
};
const findBlueScriptToolChooseTreeDataCallBack = (result) => {
    blueScriptToolChooseTreeData.value = getListData(result.objects, ["blue_script_id"]);
};
findBlueScriptToolChooseTreeData();

const treeClickCount = ref(0);
const blueScriptToolTreeNodeClick = (data, node) => {
  //记录点击次数
  treeClickCount.value = treeClickCount.value + 1;
  //单次点击次数超过2次不作处理,直接返回,也可以拓展成多击事件
  if (treeClickCount.value >= 2) {
    return;
  }
  //计时器,计算300毫秒为单位,可自行修改
  window.setTimeout(() => {
    if (treeClickCount.value == 1) {
      //把次数归零
      treeClickCount.value = 0;
      //单击事件处理
      //console.log('单击事件,可在此处理对应逻辑')
    } else if (treeClickCount.value > 1) {
      //把次数归零
      treeClickCount.value = 0;
      //双击事件
      //console.log('双击事件,可在此处理对应逻辑')
      console.log("添加蓝图节点",data);
      findBlueScriptToolByID(data.blue_script_id);
      
    }
  }, 500);
};
const findBlueScriptToolByID=(blue_script_id)=>{
    if (blue_script_id == null || blue_script_id == "") {
    ElMessage.error("当前选择不是蓝图工具！");
    return;
  }
  let param = {};
  param.sql = "page_blue_script_tools.find";
  param.blue_script_id = blue_script_id;
  commonSelectRequest(axios, param, findBlueScriptToolByIDCallBack);
}

const emit = defineEmits(["getChooseBlueScriptTool"]);

const findBlueScriptToolByIDCallBack = (result) => {
    //console.log("findBlueScriptToolByIDCallBack--result",result);
    emit("getChooseBlueScriptTool",result.objects[0]);
}

</script>

<style>

</style>