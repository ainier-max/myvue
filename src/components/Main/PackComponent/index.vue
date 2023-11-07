<template>
  <div style="height: calc(100% - 60px); margin: 20px">
    <div class="titleClass">打包组件</div>

    <div
      style="
        display: flex;
        flex-direction: row;
        height: calc(100% - 220px);
        padding: 20px;
      "
    >
      <div style="flex-basis: 50%">
        <el-divider content-position="left"
          ><span style="font-size: 18px">打包组件列表</span>
        </el-divider>

        <el-table :data="packComponentArrData" style="width: 100%; height: 95%">
          <el-table-column prop="component_name" label="组件名称" width="250">
          </el-table-column>

          <el-table-column prop="component_id" label="组件ID">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-icon size="20" color="cornflowerblue" style="cursor: pointer">
                <Upload @click="packComponentDeploy(scope.row)" />
              </el-icon>

              <el-icon
                size="20"
                color="cornflowerblue"
                style="cursor: pointer; padding-left: 10px"
              >
                <Download @click="packComponentDownload(scope.row)" />
              </el-icon>

              <el-icon
                size="20"
                color="red"
                style="cursor: pointer; padding-left: 10px"
              >
                <Delete @click="showDeletePackComponentWin(scope.row)" />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="flex-basis: 45%">
        <el-divider content-position="left" style="margin-left: 50px"
          ><span style="font-size: 18px">打包组件树</span>
        </el-divider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, nextTick, onMounted } from "vue";

import {
  commonExcuteRequest,
  commonSelectRequest,
  commonExcuteByBatchRequest,
  commonBatchSelectRequest,
  commonExcuteRequestAndOtherParam,
} from "@/common/js/request.js";

const packComponentArrData = ref([]);

const packComponentDeploy = () => {};
//显示删除对话框
const showDeletePackComponentWin = (row) => {
  console.log("showDeletePackComponentWin--row", row);
};
//下载工程代码
const packComponentDownload=(row)=>{
    window.open("/cbc/GetPageComponentPackProject.cbc?component_id=EchartMap");
}

const findAllPackComponent = () => {
  var param = {};
  param.sql = "page_component_pack.findAll";
  commonSelectRequest(axios, param, findAllPackComponentCallBack);
};
const findAllPackComponentCallBack = (result) => {
  packComponentArrData.value = result.objects;
};
findAllPackComponent();
</script>

<style scoped>
.titleClass {
  padding: 8px 16px;
  background-color: #fff6f7;
  border-radius: 4px;
  border-left: 5px solid #fe6c6f;
  margin: 10px 0;
  line-height: 40px;
}
</style>
