<template>
  <div v-if="currentBlueScript?.config" style="margin-left: 18px">
    <el-divider content-position="left"
      ><span style="font-size: 18px">添加关联节点</span></el-divider
    >

    <div
      style="margin-top: 5px;font-size: 14px"
    >
      关联端口：
    </div>
    <el-select
      @change="portScriptSelectChange"
      :teleported="false"
      style="width: 200px"
      v-model="portSelectedValue"
      class="m-2"
      placeholder="Select"
    >
      <el-option
        v-for="item in portSelectOptions"
        :key="item.portID"
        :label="item.portName"
        :value="item.portID"
      />
    </el-select>

    <div
      style="margin-top: 5px; font-size: 14px"
    >
      被关联蓝图图层：
    </div>
    <el-select
      @change="blueScriptSelectChange"
      :teleported="false"
      style="width: 200px"
      v-model="blueScriptSelectedValue"
      class="m-2"
      placeholder="Select"
    >
      <el-option
        v-for="item in blueScriptSelectOptions"
        :key="item.blue_script_ref"
        :label="item.name"
        :value="item.blue_script_ref"
      />
    </el-select>
    <div
      style="margin-top: 5px;  font-size: 14px"
    >
      被关联端口：
    </div>
    <el-select
      @change="portedSelectChange"
      :teleported="false"
      style="width: 200px"
      v-model="portedSelectedValue"
      class="m-2"
      placeholder="Select"
    >
      <el-option
        v-for="item in portedSelectOptions"
        :key="item.portedID"
        :label="item.portedName"
        :value="item.portedID"
      />
    </el-select>
    <br />
    <el-button
      type="primary"
      size="small"
      style="margin-top: 15px"
      @click="addRelevancePort"
      >添加关联节点</el-button
    >

    <el-divider content-position="left"
      ><span style="font-size: 18px">已关联节点</span></el-divider
    >

    <el-table
      size="small"
      v-if="currentBlueScript?.config"
      :data="
        currentBlueScript.config.settings.RelevancePortSetProcessFlagToFalse
      "
      border
      stripe
      style="width: 100%; margin-top: 5px"
    >
      <el-table-column prop="portName" label="关联端口" width="70" />
      <el-table-column prop="relevancedName" label="被关联蓝图" />
      <el-table-column prop="portedName" label="被关联端口" />
      <el-table-column fixed="right" label="操作" width="60">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="deleteClick(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { currentBlueScript,blueScriptData } = storeToRefs(blueScriptDataStoreObj);
import { ElMessage } from "element-plus";

if(!currentBlueScript.value.config.settings.RelevancePortSetProcessFlagToFalse){
    currentBlueScript.value.config.settings.RelevancePortSetProcessFlagToFalse=[];
}

const portSelectedValue=ref("");
const blueScriptSelectedValue=ref("");

const blueScriptSelectOptions=ref([]);
blueScriptData.value.forEach(element => {
    if(element.blue_script_id=="DataModel"){
        let obj={};
        obj.blue_script_ref=element.blue_script_ref;
        obj.name=element.blue_script_name;
        blueScriptSelectOptions.value.push(obj);
    }
});

const portSelectOptions=ref([]);
currentBlueScript.value.config.blue_script_in_out_config.out.forEach(outItem => {
    let obj={};
      obj.portName=outItem.label;
      obj.portID=outItem.portID;
      portSelectOptions.value.push(obj); 
});
const portScriptSelectChange=()=>{

};
const portedSelectChange=(val)=>{
    console.log("val22",val);
};
const portedSelectOptions=ref([]);
const portedSelectedValue=ref("");
const blueScriptSelectChange=(val)=>{
    portedSelectOptions.value=[];
    portedSelectedValue.value="";
    console.log("blueScriptSelectChange--val",val);
    blueScriptData.value.forEach(element => {
        console.log("element111",element);
        if(element.blue_script_ref==val){
            console.log("element1112",element);
            element.config.blue_script_in_out_config.in.forEach(inItem => {
                let obj={};
                obj.portedName=inItem.label;
                obj.portedID=inItem.portID;
                portedSelectOptions.value.push(obj);
            });
        }
    });
}

const addRelevancePort=()=>{
    if(!blueScriptSelectedValue.value || !portSelectedValue.value  || !portedSelectedValue.value  ){
        ElMessage.error("关联端口,被关联蓝图图层或被关联端口未被选择！");
        return;
    }
    blueScriptData.value.forEach(element => {
        if(element.blue_script_ref==blueScriptSelectedValue.value){
            let obj={};
          obj.relevancedRef=blueScriptSelectedValue.value;
          obj.relevancedName=element.blue_script_name;
          obj.pordedID=portedSelectedValue.value;

          portedSelectOptions.value.forEach(portedSelectOption => {
            if(portedSelectOption.portedID==portedSelectedValue.value){
                obj.portedName=portedSelectOption.portedName;
            }
          });
          obj.pordID=portSelectedValue.value;

          portSelectOptions.value.forEach(portSelectOption => {
            if(portSelectOption.portID==portSelectedValue.value){
                obj.portName=portSelectOption.portName;
            }
          });
          currentBlueScript.value.config.settings.RelevancePortSetProcessFlagToFalse.push(obj);
        }
    });
}

const deleteClick=(scope)=>{
    for(let i=0;i< currentBlueScript.value.config.settings.RelevancePortSetProcessFlagToFalse.length;i++){
        if( currentBlueScript.value.config.settings.RelevancePortSetProcessFlagToFalse[i].port==scope.row.port){
            currentBlueScript.value.config.settings.RelevancePortSetProcessFlagToFalse.splice(i,1);
          break;
        }
      }
}

</script>

<style>
</style>