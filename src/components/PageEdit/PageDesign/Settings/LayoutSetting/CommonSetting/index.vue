<template>
  <div style="width: 100%;">
    <div class="titleClass" align="center">基础配置</div>
    <div
      align="center"
      v-if="
        currentPageRenderTreeNodeData &&
        currentPageRenderTreeNodeData.type == 'pageOut'
      "
    >
      <div style="margin-top: 10px">属于《外部页面》类型</div>
      <el-button type="success" style="margin-top: 10px" @click="toPageEdit"
        >打开配置地址</el-button
      >
    </div>
    <div
      v-if="
        currentPageRenderTreeNodeData &&
        currentPageRenderTreeNodeData.type != 'pageOut'
      "
    >
      <div class="leftTitle" style="font-weight: bolder">
        类型：
        <span v-if="currentPageRenderTreeNodeData.type == 'mainBlock'"
          >主页面块</span
        >
        <span v-if="currentPageRenderTreeNodeData.type == 'childBlock'"
          >子页面块</span
        >
        <span v-if="currentPageRenderTreeNodeData.type == 'flex-row'"
          >水平布局</span
        >
        <span v-if="currentPageRenderTreeNodeData.type == 'flex-column'"
          >垂直布局</span
        >
        <span v-if="currentPageRenderTreeNodeData.type == 'frontEndComponent'"
          >前端组件</span
        >
        <span v-if="currentPageRenderTreeNodeData.type == 'buildInComponent'"
          >内置组件</span
        >
      </div>

      <div class="leftTitle">ref：</div>
      <el-input
        v-model="currentPageRenderTreeNodeData.ref"
        class="rightValue"
        disabled
        placeholder="Ref"
      />
      <div class="leftTitle">名称：</div>
      <el-input
        @input="changeBlueScriptNodeLabel"
        v-model="currentPageRenderTreeNodeData.label"
        class="rightValue"
        placeholder="名称"
      />

      <!--mainBlock/childBlock类型的高度，宽度-->
      <template
        v-if="
          currentPageRenderTreeNodeData.type == 'mainBlock' ||
          currentPageRenderTreeNodeData.type == 'childBlock'
        "
      >
        <div class="leftTitle">页面块高度：</div>
        <el-input
          v-model="currentPageRenderTreeNodeData.config.attr.h"
          class="rightValue"
          @change="refreshLayoutDesign"
          placeholder="页面块高度"
        />
        <div class="leftTitle">页面块宽度</div>
        <el-input
          v-model="currentPageRenderTreeNodeData.config.attr.w"
          class="rightValue"
          @change="refreshLayoutDesign"
          placeholder="页面块宽度"
        />

        <template v-if="currentPageRenderTreeNodeData.type=='mainBlock'">
          <div class="leftTitle">页面模式</div>
          <el-radio-group class="rightValue" v-model=" currentPageRenderTreeNodeData.config.attr.pageModel">
            <el-radio label="adaptation" size="small">自适应</el-radio>
            <el-radio label="reality" size="small">实际宽高</el-radio>
            <el-radio label="adaptationW-realityH" size="small">宽度自适应，实际高度</el-radio>
          </el-radio-group>
        </template>
        

      </template>

      <!--非mainBlock/childBlock类型的高度，宽度-->
      <template
        v-if="
          currentPageRenderTreeNodeData.type != 'mainBlock' &&
          currentPageRenderTreeNodeData.type != 'childBlock' &&
          currentPageRenderTreeNodeData.config.attr.labelType == 'flex'
        "
      >
        <div class="leftTitle">
          X坐标：<span
            >{{ currentPageRenderTreeNodeData.config.attr.xPer }}%</span
          >
        </div>
        <el-input
          @input="handleInput('x')"
          v-model.number="currentPageRenderTreeNodeData.config.attr.x"
          class="rightValue"
          placeholder="X坐标"
        />

        <div class="leftTitle">
          Y坐标：<span
            >{{ currentPageRenderTreeNodeData.config.attr.yPer }}%</span
          >
        </div>
        <el-input
          @input="handleInput('y')"
          v-model.number="currentPageRenderTreeNodeData.config.attr.y"
          class="rightValue"
          placeholder="Y坐标"
        />
        <div class="leftTitle">
          高度：<span
            >{{ currentPageRenderTreeNodeData.config.attr.hPer }}%</span
          >
        </div>
        <el-input
          @input="handleInput('h')"
          v-model.number="currentPageRenderTreeNodeData.config.attr.h"
          class="rightValue"
          placeholder="高度"
        />
        <div class="leftTitle">
          宽度：<span
            >{{ currentPageRenderTreeNodeData.config.attr.wPer }}%</span
          >
        </div>
        <el-input
          @input="handleInput('w')"
          v-model.number="currentPageRenderTreeNodeData.config.attr.w"
          class="rightValue"
          placeholder="宽度"
        />
      </template>

      <template v-if="currentPageRenderTreeNodeData.config.attr.unit">
        <div class="leftTitle">单位：</div>
        <el-input
          v-model="currentPageRenderTreeNodeData.config.attr.unit"
          class="rightValue"
          placeholder="单位"
        />
      </template>

      <template v-if="currentPageRenderTreeNodeData.config.attr.flexBasis">
        <div class="leftTitle">
          占比
          <el-popover
            placement="left-start"
            :width="520"
            trigger="hover"
            @show="showPopover"
          >
            <div class="custom-content" v-html="customContent"></div>
            <template #reference>
              <WarningFilled
                style="width: 1em; height: 1em; color: gray"
              ></WarningFilled>
            </template>
          </el-popover>
        </div>
        <el-input
          v-model="currentPageRenderTreeNodeData.config.attr.flexBasis"
          class="rightValue"
          @input="changeToRefresh"
        />
      </template>

      <el-collapse
        accordion
        style="margin: 20px"
        v-if="
          currentPageRenderTreeNodeData.config.attr.padding ||
          currentPageRenderTreeNodeData.config.attr.margin
        "
      >
        <el-collapse-item
          title="内边距(padding)"
          name="1"
          v-if="currentPageRenderTreeNodeData.config.attr.padding"
        >
          <div class="leftTitle">单位：</div>
          <el-input
            size="small"
            v-model="currentPageRenderTreeNodeData.config.attr.padding.unit"
            class="rightValue"
          />
          <div class="leftTitle">上边距：</div>
          <el-input
            size="small"
            v-model="currentPageRenderTreeNodeData.config.attr.padding.top"
            class="rightValue"
            @input="changeToRefresh"
          />
          <div class="leftTitle">下边距：</div>
          <el-input
            size="small"
            v-model="currentPageRenderTreeNodeData.config.attr.padding.bottom"
            class="rightValue"
            @input="changeToRefresh"
          />
          <div class="leftTitle">左边距：</div>
          <el-input
            size="small"
            v-model="currentPageRenderTreeNodeData.config.attr.padding.left"
            class="rightValue"
            @input="changeToRefresh"
          />
          <div class="leftTitle">右边距：</div>
          <el-input
            size="small"
            v-model="currentPageRenderTreeNodeData.config.attr.padding.right"
            class="rightValue"
            @input="changeToRefresh"
          />
        </el-collapse-item>
      </el-collapse>

      <template v-if="currentPageRenderTreeNodeData.config.attr.zIndex">
        <div class="leftTitle">层级：</div>
        <el-input
          v-model="currentPageRenderTreeNodeData.config.attr.zIndex"
          class="rightValue"
          placeholder="层级"
        />
      </template>

      <div class="leftTitle">背景：</div>

      <div style="padding-left: 15px; margin-top: 10px; font-size: 12px">
        颜色
        <el-switch
          v-model="currentPageRenderTreeNodeData.config.attr.backgroundType"
          class="mb-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-value="img"
          inactive-value="color"
        />
        图片
        <div></div>
        <div>
          <!--otherParam 会跟着子组件调用父组件的事件参数-->
          <ChooseImg
            v-if="
              currentPageRenderTreeNodeData.config.attr.backgroundType == 'img'
            "
            otherParam=""
            :imgUUID="
              currentPageRenderTreeNodeData.config.attr.backgroundImgValue
            "
            @getNewImgUrl="getNewImgUrlByTopPageBlock"
          ></ChooseImg>
          <el-color-picker
            v-if="
              currentPageRenderTreeNodeData.config.attr.backgroundType ==
              'color'
            "
            v-model="
              currentPageRenderTreeNodeData.config.attr.backgroundColorValue
            "
            show-alpha
          />
        </div>
      </div>

      
      
      
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { toDecimal } from "@/common/js/decimal.js";
import ChooseImg from "@/common/component/ChooseImg/index.vue";
import { storeToRefs } from "pinia";
import { findNodeById } from "@/common/js/tree.js";

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData, relativePageRenderTreeData } = storeToRefs(
  pageRenderTreeDataStoreObj
);

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);

import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { blueScriptData } = storeToRefs(
  blueScriptDataStoreObj
);

const getNewImgUrlByTopPageBlock = (imgUUID, otherParam) => {
  currentPageRenderTreeNodeData.value.config.attr.backgroundImgValue = imgUUID;
};

const emit = defineEmits(["refreshLayoutDesign"]);
const refreshLayoutDesign = (event) => {
  emit("refreshLayoutDesign");
};

const toPageEdit = () => {
  //console.log("toPageEdit--relativePageRenderTreeData",relativePageRenderTreeData);
  //console.log("toPageEdit--currentPageRenderTreeNodeData",currentPageRenderTreeNodeData);

  let indexTemp = _.findIndex(relativePageRenderTreeData.value, function (o) {
    return o.id == currentPageRenderTreeNodeData.value.related_value;
  });
  let page_id_Temp = relativePageRenderTreeData.value[indexTemp].page_id;
  //console.log("toPageEdit--page_id_Temp",page_id_Temp);
  window.open("/PageEdit?page_id=" + page_id_Temp + "&page_type=edit");
};

const customContent = ref("");
const showPopover = () => {
  let nodeTemp = findNodeById(
    pageRenderTreeData.value,
    currentPageRenderTreeNodeData.value.pid
  );
  let sumFlexBasic = 0;
  for (let i = 0; i < nodeTemp.children.length; i++) {
    console.log("nodeTemp.children[i]", nodeTemp.children[i]);
    sumFlexBasic =
      sumFlexBasic + parseInt(nodeTemp.children[i].config.attr.flexBasis);
  }
  console.log("showPopover--sumFlexBasic", sumFlexBasic);
  let strTemp = "";
  strTemp =
    strTemp +
    "该节点的父节点是《" +
    nodeTemp.label +
    "》，其《布局占比总和》为：" +
    sumFlexBasic +
    "<br>";
  for (let i = 0; i < nodeTemp.children.length; i++) {
    let labelTemp = nodeTemp.children[i].label;
    let flexBasisTemp = nodeTemp.children[i].config.attr.flexBasis;
    strTemp =
      strTemp +
      "布局" +
      (i + 1) +
      "《" +
      labelTemp +
      "》当前占比为：" +
      flexBasisTemp +
      "，比例大小为：" +
      flexBasisTemp +
      "/" +
      sumFlexBasic +
      "≈" +
      ((flexBasisTemp / sumFlexBasic) * 100).toFixed(2) +
      "%<br>";
  }
  strTemp = strTemp + "建议《布局占比总和》等于100！可以更好的计算<br/>";
  customContent.value = strTemp;
};


//刷新布局
const changeToRefresh = () => {
  console.log("刷新布局changeToRefresh");
  currentDealDataStoreObj.refreshCurrentTopPageLayoutData();
};

const handleInput = (type) => {
  //大小设置
  currentPageRenderTreeNodeData.value.config.attr.xPer = toDecimal(
    (currentPageRenderTreeNodeData.value.config.attr.x /
      currentTopPageBlockData.value.config.attr.w) *
      100
  );
  currentPageRenderTreeNodeData.value.config.attr.yPer = toDecimal(
    (currentPageRenderTreeNodeData.value.config.attr.y /
      currentTopPageBlockData.value.config.attr.h) *
      100
  );
  currentPageRenderTreeNodeData.value.config.attr.wPer = toDecimal(
    (currentPageRenderTreeNodeData.value.config.attr.w /
      currentTopPageBlockData.value.config.attr.w) *
      100
  );
  currentPageRenderTreeNodeData.value.config.attr.hPer = toDecimal(
    (currentPageRenderTreeNodeData.value.config.attr.h /
      currentTopPageBlockData.value.config.attr.h) *
      100
  );
  if (type == "h" || type == "w") {
    //大小变化，重新渲染
    currentDealDataStoreObj.refreshCurrentTopPageLayoutData();
  }
};


const changeBlueScriptNodeLabel=()=>{
  //console.log("changeBlueScriptNodeLabel--blueScriptData",blueScriptData.value);
  //console.log("changeBlueScriptNodeLabel--currentPageRenderTreeNodeData",currentPageRenderTreeNodeData.value);
  blueScriptData.value.forEach(element => {
    if(element.related_ref==currentPageRenderTreeNodeData.value.ref){
      element.blue_script_name=currentPageRenderTreeNodeData.value.label;
      element.config.blue_script_node_config.label=currentPageRenderTreeNodeData.value.label;
    }
  });
  //console.log("changeBlueScriptNodeLabel--blueScriptData",blueScriptData.value);
}
// 生命周期钩子
onMounted(() => {});
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

:deep(.el-radio-group) {
  display: block;
}

:deep(.el-radio) {
 display: block;
}
</style>
