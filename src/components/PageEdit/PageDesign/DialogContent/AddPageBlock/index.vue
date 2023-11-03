<template>
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

  <div align="center">
    <el-button type="primary" @click="addPageBlock($parent)">确 定</el-button>
  </div>
</template>

<script setup lang="ts">
import { inject,ref, nextTick, onMounted,watchEffect  } from "vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

//添加页面块
const pageBlockDataForm = ref({
  pageName: "",
  pageWidth: "",
  pageHeight: "",
});
import { useRoute } from "vue-router";
const route = useRoute();
const page_id = route.query.page_id;

const dialogFlag = inject('dialogFlag',"true");

const addPageBlock = ($parent) => {
    console.log("$parent",$parent);
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
      dialogFlag.value = false;
  }else{
    ElMessage.error("有未输入项");
  }
  
};

</script>

<style scoped></style>
