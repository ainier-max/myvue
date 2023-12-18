<template>
  <div v-if="currentBlueScript?.config" style="margin-left: 18px">
    <el-divider content-position="left"
      ><span style="font-size: 18px">蓝图执行函数</span></el-divider
    >
    <el-button type="success" @click="showBlueScriptFunDialog"
      >蓝图执行函数</el-button
    >

    <el-dialog
      v-model="blueScriptFunDialogVisible"
      title="蓝图执行方法"
      append-to-body
      :draggable="true"
      width="60%"
      top="20vh"
      :close-on-click-modal="false"
      style="height: 700px"
      :modal="false"
      @opened="openedHandle"
    >

    <div >
        <span
        v-for="(item,index) in Object.keys(execFunctionConfigTemp)"
        class="designButton" :style="activeName == item ? { color: 'rgba(0, 0, 0, 1)' }: { color: 'gray' }"
        @click="tabsHandleClick(item)">{{item}}</span>
        <div   v-for="(item,index) in Object.keys(execFunctionConfigTemp)">
            <MyMonacoEditor
            :id="'blueScriptSettingsEditorID'+item"
            v-if="activeName==item && execFunctionConfigTemp.dataDeal"
            :code="execFunctionConfigTemp.dataDeal"
            @update="updateConfig"
            style="height: 450px;padding-top:15px;"
            ></MyMonacoEditor>
        </div>
        
    </div>

      <template #footer>
        <span class="dialog-footer" style="padding-bottom: 200px">
          <el-button @click="closeHandle"> 关 闭 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script setup lang="ts">
import { ref, nextTick } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { currentBlueScript,blueScriptData } = storeToRefs(blueScriptDataStoreObj);
import { ElMessage } from "element-plus";
import { js_beautify } from "js-beautify";

import MyMonacoEditor from '@/common/component/CodeEditor/MyMonacoEditor/index.vue';

const blueScriptFunFlag=ref(false);
const blueScriptFunDialogVisible=ref(false);
const activeName = ref('')

const execFunctionConfigTemp=ref({});

if(!currentBlueScript.value.config.settings.execFunction){
    currentBlueScript.value.config.settings.execFunction={};
    currentBlueScript.value.config.settings.execFunction.dataDeal=function anonymous(param){
        console.log("eventToString--param",param);
        return param;
    }
}


const tabsHandleClick=(tab)=>{
  activeName.value=tab;
}

const closeHandle=()=>{
    blueScriptFunDialogVisible.value=false;
    activeName.value="";
}
const openedHandle=()=>{
    console.log("当前节点currentBlueScript",currentBlueScript);
    activeName.value="";
    execFunctionConfigTemp.value.dataDeal=js_beautify(currentBlueScript.value.config.settings.execFunction.dataDeal.toString());
    console.log("execFunctionConfigTemp.value.dataDeal",execFunctionConfigTemp.value.dataDeal);
    nextTick(()=>{
        activeName.value="dataDeal";
    });
}

const showBlueScriptFunDialog=()=>{
    blueScriptFunDialogVisible.value=true;
}

const updateConfig=(code)=>{
    if(code){
        execFunctionConfigTemp.value.dataDeal=code;
        currentBlueScript.value.config.settings.execFunction.dataDeal = eval(
            "(" + code + ")"
        );
    }
}


</script>
<style scoped>
.designButton {
  font-weight: bold;
  padding-left: 8px;
  cursor: pointer;
}
</style>

