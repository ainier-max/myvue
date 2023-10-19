<template>
  <div class="mainClass" style="display: flex; flex-direction: row">
    <div style="flex-basis: 20%; border-right: 1px solid gray">
        <div style="height:60%">
            <el-tree
                ref="pageRenderTreeRef"
                :data="pageRenderTreeData"
                node-key="id"
                :default-expand-all="true"
                :expand-on-click-node="false"
                :props="defaultProps"
                :highlight-current="true"
                @node-click="nodeClick"
                style=""
            />
        </div>

        <div style="border-top:1px solid gray">
           子页面
        </div>
      
    </div>
    <div style="flex-basis: 60%">22</div>
    <div style="flex-basis: 20%; border-left:1px solid gray">
        <BlockSetting v-if="settingType=='block'" settingValue=""></BlockSetting>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import BlockSetting from "@/components/PageEdit/PageDesign/Settings/BlockSetting/index.vue";

import {
  commonExcuteRequest,
  commonSelectRequest,
  commonExcuteRequestAndOtherParam,
} from "@/common/js/request.js";
import { getListData } from "@/common/js/tree.js";

const defaultProps = { children: "children", label: "label" };

const route = useRoute();
const page_id = route.query.page_id;
const page_debug_flag = route.query.page_debug_flag;
const pageRenderTreeData = ref([]);
const settingType = ref("");

//console.log("page_id", page_id);
//console.log("page_debug_flag", page_debug_flag);

//根据page_id查询所有的页面块
const findAllBlockByPageID = () => {
  let param = {};
  param.sql = "page_block.findAllBlockByPageID";
  param.page_id = page_id;
  commonSelectRequest(axios, param, findAllBlockByPageIDCallBack);
};
const findAllBlockByPageIDCallBack = (result) => {
  console.log("findAllPageBlockComponentCallBack--result:", result);
  
};
//根据page_id查询渲染树内容
const findAllPageRenderTreeByPageID = () => {
  let param = {};
  param.sql = "page_render_tree.findAllPageRenderTreeByPageID";
  param.page_id = page_id;
  commonSelectRequest(axios, param, findAllPageRenderTreeByPageIDCallBack);
};
const findAllPageRenderTreeByPageIDCallBack = (result) => {
  console.log("findAllPageRenderTreeByPageIDCallBack--result:", result);
  pageRenderTreeData.value = getListData(result.objects, ["ref", "type"]);
  console.log(
    "findAllPageRenderTreeByPageIDCallBack--pageRenderTreeData:",
    pageRenderTreeData
  );
};
const nodeClick = (data) => {
  console.log("nodeClick--data:", data);
  settingType.value=data.type;
};

// 生命周期钩子
onMounted(() => {
  findAllBlockByPageID();
  findAllPageRenderTreeByPageID();
});
</script>

<style scoped>
.mainClass {
  height: 100%;
  overflow: hidden;
  margin: 0px;
}
</style>
