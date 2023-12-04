<template>
  <div style="width: 100%; height: 100%" v-if="currentPageRenderTreeNodeData">
    <div class="titleClass" align="center">输入配置</div>

    <div class="leftTitle">节点选择</div>
    <el-select
      v-model="nodeInValue"
      class="rightValue"
      @change="nodeInChange"
      placeholder="Select"
    >
      <el-option
        v-for="item in blueScriptData"
        :key="item.blue_script_ref"
        :label="item.blue_script_name"
        :value="item.blue_script_ref"
      />
    </el-select>

    <div class="leftTitle">端口选择</div>
    <el-select v-model="portInValue" class="rightValue" placeholder="Select">
      <el-option
        v-for="item in nodeInByChoose?.config?.blue_script_in_out_config?.in"
        :key="item.portID"
        :label="item.label"
        :value="item.portID"
      />
    </el-select>

    <div align="center" style="padding-top: 10px">
      <el-button type="success" size="small" @click="addInParam"
        >添加</el-button
      >
    </div>
    <div style="height: 15px"></div>
    <el-table
    
      :data="currentPageRenderTreeNodeData.config.blueScriptAttr.in"
      border
      style="width: 100%"
    >
      <el-table-column prop="blue_script_name" label="蓝图节点" />
      <el-table-column prop="label" label="节点端口" />

      <el-table-column
              fixed="right"
              label="操作"
              width="80">
            <template #default="scope">
              <el-icon size="20" color="red" style="cursor:pointer;padding-left: 10px">
                <Delete @click="deleteInParam(scope.row)"/>
              </el-icon>
            </template>
      </el-table-column>
    </el-table>

    <div style="height: 15px"></div>
    <div class="titleClass" align="center">输出配置</div>

    <div class="leftTitle">节点选择</div>
    <el-select
      v-model="nodeOutValue"
      class="rightValue"
      @change="nodeOutChange"
      placeholder="Select"
    >
      <el-option
        v-for="item in blueScriptData"
        :key="item.blue_script_ref"
        :label="item.blue_script_name"
        :value="item.blue_script_ref"
      />
    </el-select>

    <div class="leftTitle">端口选择</div>
    <el-select v-model="portOutValue" class="rightValue" placeholder="Select">
      <el-option
        v-for="item in nodeOutByChoose?.config?.blue_script_in_out_config?.out"
        :key="item.portID"
        :label="item.label"
        :value="item.portID"
      />
    </el-select>

    <div align="center" style="padding-top: 10px">
      <el-button type="success" size="small" @click="addOutParam"
        >添加</el-button
      >
    </div>
    <div style="height: 15px"></div>

    <el-table
      :data="currentPageRenderTreeNodeData.config.blueScriptAttr.out"
      border
      style="width: 100%"
    >
      <el-table-column prop="blue_script_name" label="蓝图节点" />
      <el-table-column prop="label" label="节点端口" />

      <el-table-column
              fixed="right"
              label="操作"
              width="80">
            <template #default="scope">
              <el-icon size="20" color="red" style="cursor:pointer;padding-left: 10px">
                <Delete @click="deleteOutParam(scope.row)"/>
              </el-icon>
            </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script setup lang="ts">
import { provide, ref, nextTick, onMounted, watchEffect, computed } from "vue";
import { ElMessage } from "element-plus";

import { storeToRefs } from "pinia";
import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { blueScriptData, currentBlueScript } = storeToRefs(
  blueScriptDataStoreObj
);

const nodeInByChoose = ref(null);
const nodeInValue = ref("");
const portInValue = ref("");

console.log("BlueScriptSettingForMainBlock--blueScriptData", blueScriptData);
const nodeInChange = (value) => {
  console.log("nodeInChange--value", value);
  nodeInByChoose.value = _.find(blueScriptData.value, [
    "blue_script_ref",
    value,
  ]);
  console.log("nodeInChange--nodeInByChoose", nodeInByChoose);
};
const deleteInParam=(row)=>{
    console.log("deleteInParam--row",row);
    for(let i=0;i<currentPageRenderTreeNodeData.value.config.blueScriptAttr.in.length;i++){
        if(currentPageRenderTreeNodeData.value.config.blueScriptAttr.in[i].portID==row.portID){
            currentPageRenderTreeNodeData.value.config.blueScriptAttr.in.splice(i,1);
            i=i-1;
        }
    }
}
const addInParam = () => {
  //console.log("BlueScriptSettingForMainBlock--pageRenderTreeData",pageRenderTreeData);
  let continueFlag = true;
  //重复判断
  currentPageRenderTreeNodeData.value.config.blueScriptAttr.in.forEach(
    (inItem) => {
      if (inItem.portID == portInValue.value) {
        ElMessage.error("该端口已存在！");
        continueFlag = false;
      }
    }
  );

  if (continueFlag == false) {
  } else {
    let obj = {};
    nodeInByChoose.value.config.blue_script_in_out_config.in.forEach(
      (inItem) => {
        if (inItem.portID == portInValue.value) {
          obj={...inItem}
          // obj.label = inItem.label;
          // obj.key=inItem.label;
          // obj.type=inItem.type;
          // obj.show=inItem.show;
        }
      }
    );

    obj.blue_script_ref = nodeInByChoose.value.blue_script_ref;
    blueScriptData.value.forEach((element) => {
      if (element.blue_script_ref == nodeInValue.value) {
        obj.blue_script_name = element.blue_script_name;
      }
    });
    console.log("BlueScriptSettingForMainBlock--obj", obj);
    currentPageRenderTreeNodeData.value.config.blueScriptAttr.in.push(obj);

    console.log(
      "BlueScriptSettingForMainBlock--pageRenderTreeData",
      pageRenderTreeData
    );
  }
};


const nodeOutByChoose = ref(null);
const nodeOutValue=ref("");
const portOutValue = ref("");
const nodeOutChange=(value)=>{
  console.log("nodeOutChange--value", value);
  nodeOutByChoose.value = _.find(blueScriptData.value, [
    "blue_script_ref",
    value,
  ]);
  console.log("nodeOutChange--nodeOutByChoose", nodeOutByChoose);
}

const addOutParam = () => {
  //console.log("BlueScriptSettingForMainBlock--pageRenderTreeData",pageRenderTreeData);
  let continueFlag = true;
  //重复判断
  currentPageRenderTreeNodeData.value.config.blueScriptAttr.out.forEach(
    (outItem) => {
      if (outItem.portID == portOutValue.value) {
        ElMessage.error("该端口已存在！");
        continueFlag = false;
      }
    }
  );

  if (continueFlag == false) {
  } else {
    let obj = {};
    nodeOutByChoose.value.config.blue_script_in_out_config.out.forEach(
      (outItem) => {
        if (outItem.portID == portOutValue.value) {
          obj={...outItem}
        }
      }
    );

    obj.blue_script_ref = nodeOutByChoose.value.blue_script_ref;
    blueScriptData.value.forEach((element) => {
      if (element.blue_script_ref == nodeOutValue.value) {
        obj.blue_script_name = element.blue_script_name;
      }
    });
    console.log("BlueScriptSettingForMainBlock--obj", obj);
    currentPageRenderTreeNodeData.value.config.blueScriptAttr.out.push(obj);

    console.log(
      "BlueScriptSettingForMainBlock--pageRenderTreeData",
      pageRenderTreeData
    );
  }
};
const deleteOutParam=(row)=>{
  console.log("deleteOutParam--row",row);
    for(let i=0;i<currentPageRenderTreeNodeData.value.config.blueScriptAttr.out.length;i++){
        if(currentPageRenderTreeNodeData.value.config.blueScriptAttr.out[i].portID==row.portID){
            currentPageRenderTreeNodeData.value.config.blueScriptAttr.out.splice(i,1);
            i=i-1;
        }
    }
}

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
.leftTitle {
  padding-left: 15px;
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
}
.rightValue {
  padding-top: 5px;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
