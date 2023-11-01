<template>
  <div style="width: 100%; height: 100%">
    <el-button
      type="primary"
      @click="getBuildInComponent('BuildInComponentColumn')"
    >
      栏目组件
    </el-button>

    <el-button
      type="primary"
      @click="getBuildInComponent('BuildInComponentLeafletMap')"
    >
      地图组件
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { uuid } from "@/common/js/uuid";
import pathConfigArr from "@/buildin/pathConfigArr.js";
import { storeToRefs } from "pinia";
import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentTopPageBlockData, currentPageRenderTreeNodeData } = storeToRefs(
  currentDealDataStoreObj
);
import { useRoute } from "vue-router";
const route = useRoute();
const page_id = route.query.page_id;
const emit = defineEmits(["getBuildInComponent"]);
const getBuildInComponent = (type) => {
  let param = {};
  for (let i = 0; i < pathConfigArr.length; i++) {
    if (pathConfigArr[i].type == type) {
      param = pathConfigArr[i];
      let optionPath =
        "../../../../../../buildin/" + pathConfigArr[i].optionPath;
      import(/* @vite-ignore */ optionPath).then((option) => {
        param.option = option;

        console.log("param111",param);

        let obj = {};
        obj.id = "id" + uuid();
        if (
          currentPageRenderTreeNodeData.value.type == "flex-row" ||
          currentPageRenderTreeNodeData.value.type == "flex-column"
        ) {
          //当前节点为flex-row或者flex-column
          obj.pid = currentPageRenderTreeNodeData.value.id;
        } else {
          //当前节点为frontEndComponent/buildInComponent/packComponent
          obj.pid = currentPageRenderTreeNodeData.value.pid;
        }
        obj.label = param.name;
        obj.ref = "buildInComponentRef-" + uuid();
        obj.type = "buildInComponent"
        obj.page_id = page_id;
        //obj.component_code = result.objects[0].component_code;
        obj.related_value = param.type;
        obj.config_str = "";
        obj.config =param.option.default.devOption;

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

        emit("getBuildInComponent", obj);
      });
    }
  }
};
</script>

<style scoped></style>
