<template>
  <div style="width: 100%; height: 100%; overflow: auto">
    <div class="titleClass" align="center">基础配置</div>
    <div v-if="currentPageRenderTreeNodeData">
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
        <span v-if="currentPageRenderTreeNodeData.type == 'implantBlock'"
          >内嵌页面块</span
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
      </template>

      <!--非mainBlock/childBlock类型的高度，宽度-->
      <template
        v-if="currentPageRenderTreeNodeData.type != 'mainBlock' &&
          currentPageRenderTreeNodeData.type != 'childBlock' &&
          currentPageRenderTreeNodeData.config.attr.labelType == 'flex'"
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

      <div class="titleClass" style="margin-top: 15px" align="center">
        <span
          v-if="
            currentPageRenderTreeNodeData.type == 'flex-row' ||
            currentPageRenderTreeNodeData.type == 'flex-column'
          "
          >插入内容</span
        >
        <span v-else>替换内容</span>
      </div>
      <div
        align="center"
        v-if="
          currentPageRenderTreeNodeData.type != 'mainBlock' &&
          currentPageRenderTreeNodeData.type != 'childBlock'
        "
      >
        <el-button
          @click="addFlexInder('flex-row')"
          style="margin-top: 15px"
          type="success"
          >内部水平布局</el-button
        >
        <el-button
          @click="addFlexInder('flex-column')"
          style="margin-top: 15px"
          type="success"
          >内部垂直布局</el-button
        ><br />
        <el-button
          @click="addFrontEndComponent"
          style="margin-top: 15px"
          type="primary"
          >前端组件</el-button
        >

        <el-button
          @click="addPackComponent"
          style="margin-top: 15px"
          type="primary"
          >打包组件</el-button
        ><br />
        <el-button
          @click="addBuiltInComponent"
          style="margin-top: 15px"
          type="primary"
          >内置组件</el-button
        >
        <el-button @click="addPageBlock" style="margin-top: 15px" type="info"
          >页面块</el-button
        >
        <el-button @click="addPageOut" style="margin-top: 15px" type="info"
          >外部页面</el-button
        >
      </div>

      <div
        align="center"
        v-if="
          currentPageRenderTreeNodeData.type == 'mainBlock' ||
          currentPageRenderTreeNodeData.type == 'childBlock'
        "
      >
        <el-button
          style="margin-top: 15px"
          @click="addFlex('flex-row')"
          type="success"
          >水平布局</el-button
        >
        <el-button
          style="margin-top: 15px"
          @click="addFlex('flex-column')"
          type="success"
          >垂直布局</el-button
        >
      </div>
    </div>
    <div style="height: 50px"></div>
  </div>

  <el-dialog
    v-model="chooseDialogFlag"
    :title="dialogTitle"
    append-to-body
    :draggable="true"
    width="60%"
    top="10vh"
    style="height: 550px"
  >
    <FrontEndComponentChoose
      v-if="chooseDialogType == 'frontEndComponent'"
      ref="frontEndComponentChooseRef"
      @getChooseData="getChooseData"
    ></FrontEndComponentChoose>

    <BuiltInComponentChoose
      v-if="chooseDialogType == 'builtInComponent'"
      ref="BuiltInComponentChooseRef"
      @getChooseData="getChooseData"
    ></BuiltInComponentChoose>

    <PageBlockChoose
      v-if="chooseDialogType == 'pageBlock'"
      ref="PageBlockChooseRef"
      @getChooseData="getChooseData"
    ></PageBlockChoose>

    <PageOutChoose
      v-if="chooseDialogType == 'pageOut'"
      ref="PageOutChooseRef"
      @getChooseData="getChooseData"
    ></PageOutChoose>


  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { toDecimal } from "@/common/js/decimal.js";
import { uuid } from "@/common/js/uuid.js";
import ChooseImg from "@/common/component/ChooseImg/index.vue";
import { storeToRefs } from "pinia";
import { findNodeById } from "@/common/js/tree.js";

const activeName = ref(null);
const chooseDialogFlag = ref(false);
const chooseDialogType = ref("");
const dialogTitle = ref("");

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);

const getNewImgUrlByTopPageBlock = (imgUUID, otherParam) => {
  currentPageRenderTreeNodeData.value.config.attr.backgroundImgValue = imgUUID;
};

const emit = defineEmits(["refreshLayoutDesign"]);
const refreshLayoutDesign = (event) => {
  emit("refreshLayoutDesign");
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
//获取选中的数据
const getChooseData = (chooseData) => {
  console.log("getChooseData--chooseData", chooseData);
  if (
    currentPageRenderTreeNodeData.value.type == "flex-row" ||
    currentPageRenderTreeNodeData.value.type == "flex-column"
  ) {
    pageRenderTreeDataStoreObj.addNodeByPID(
      currentPageRenderTreeNodeData.value.id,
      chooseData
    );
  } else {
    pageRenderTreeDataStoreObj.replaceNodeByData(
      currentPageRenderTreeNodeData,
      chooseData
    );
  }
  chooseDialogFlag.value = false;
  //组件个数发生变化，重新渲染
  currentDealDataStoreObj.refreshCurrentTopPageLayoutData();
};

//添加前端组件
import FrontEndComponentChoose from "@/components/PageEdit/PageDesign/Settings/CommonSetting/FrontEndComponentChoose/index.vue";
const frontEndComponentChooseRef = ref(null);
const frontEndComponentChooseCloseHandle = () => {
  console.log("frontEndComponentChooseRef", frontEndComponentChooseRef);
  frontEndComponentChooseRef.value.getCheckNode();
};
const addFrontEndComponent = () => {
  chooseDialogType.value = "frontEndComponent";
  chooseDialogFlag.value = true;
  dialogTitle.value = "前端组件(双击选择组件)";
};
//添加打包组件
const addPackComponent = () => {};

//添加内置组件
import BuiltInComponentChoose from "@/components/PageEdit/PageDesign/Settings/CommonSetting/BuiltInComponentChoose/index.vue";
const addBuiltInComponent = () => {
  chooseDialogType.value = "builtInComponent";
  chooseDialogFlag.value = true;
  dialogTitle.value = "内置组件(双击选择组件)";
};

//添加页面块
import PageBlockChoose from "@/components/PageEdit/PageDesign/Settings/CommonSetting/PageBlockChoose/index.vue";

const addPageBlock = () => {
  chooseDialogType.value = "pageBlock";
  chooseDialogFlag.value = true;
  dialogTitle.value = "页面块";
};

import PageOutChoose from "@/components/PageEdit/PageDesign/Settings/CommonSetting/PageOutChoose/index.vue";

//添加外部页面
const addPageOut = () => {
  chooseDialogType.value = "pageOut";
  chooseDialogFlag.value = true;
  dialogTitle.value = "外部页面";
};

//刷新布局
const changeToRefresh = () => {
  console.log("刷新布局changeToRefresh");
  currentDealDataStoreObj.refreshCurrentTopPageLayoutData();
};

//添加addFlexInder
const addFlexInder = (type) => {
  let layoutTemp = {};
  layoutTemp.config = {};

  layoutTemp.config.attr = {};
  layoutTemp.config.attr.flexBasis = 100;

  layoutTemp.config.attr.padding = {};
  //是否需要计算
  layoutTemp.config.attr.labelType = "flexInner";
  layoutTemp.config.attr.padding.unit = "px";
  layoutTemp.config.attr.padding.top = "0";
  layoutTemp.config.attr.padding.bottom = "0";
  layoutTemp.config.attr.padding.left = "0";
  layoutTemp.config.attr.padding.right = "0";

  layoutTemp.config.attr.zIndex = 100;
  layoutTemp.config.attr.show = true;
  layoutTemp.config.attr.backgroundType = "color";
  layoutTemp.config.attr.backgroundColorValue = null;
  layoutTemp.config.attr.backgroundImgValue = "";

  layoutTemp.id = "id-" + uuid();
  layoutTemp.children = [];
  if (type == "flex-row") {
    layoutTemp.label = "内部水平布局";
  } else if (type == "flex-column") {
    layoutTemp.label = "内部垂直布局";
  }
  layoutTemp.ref = "layoutRef-" + uuid();
  layoutTemp.type = type;
  
  if (
    currentPageRenderTreeNodeData.value.type == "flex-row" ||
    currentPageRenderTreeNodeData.value.type == "flex-column"
  ) {
    //插入内容
    layoutTemp.pid = currentPageRenderTreeNodeData.value.id;
    pageRenderTreeDataStoreObj.addNodeByPID(
      currentPageRenderTreeNodeData.value.id,
      layoutTemp
    );
  } else {
    //替换内容
    layoutTemp.pid = currentPageRenderTreeNodeData.value.pid;
    pageRenderTreeDataStoreObj.replaceNodeByData(
      currentPageRenderTreeNodeData,
      layoutTemp
    );
  }

  //布局个数发生变化，重新渲染
  currentDealDataStoreObj.refreshCurrentTopPageLayoutData();
};

const addFlex = (type) => {
  let layoutTemp = {};
  layoutTemp.config = {};

  layoutTemp.config.attr = {};

  layoutTemp.config.attr.padding = {};
  //是否需要计算
  layoutTemp.config.attr.labelType = "flex";
  layoutTemp.config.attr.padding.unit = "px";
  layoutTemp.config.attr.padding.top = "0";
  layoutTemp.config.attr.padding.bottom = "0";
  layoutTemp.config.attr.padding.left = "0";
  layoutTemp.config.attr.padding.right = "0";

  layoutTemp.config.attr.x = 10;
  layoutTemp.config.attr.y = 10;
  layoutTemp.config.attr.w = 200;
  layoutTemp.config.attr.h = 200;
  layoutTemp.config.attr.unit = "px";
  layoutTemp.config.attr.zIndex = 100;
  layoutTemp.config.attr.show = true;
  layoutTemp.config.attr.backgroundType = "color";
  layoutTemp.config.attr.backgroundColorValue = "rgba(24, 166, 54, 0.8)";
  layoutTemp.config.attr.backgroundImgValue = "";
  let blockWidthTemp = currentPageRenderTreeNodeData.value.config.attr.w;
  let blockHeightTemp = currentPageRenderTreeNodeData.value.config.attr.h;
  layoutTemp.config.attr.xPer = toDecimal((10 / blockWidthTemp) * 100);
  layoutTemp.config.attr.yPer = toDecimal((10 / blockHeightTemp) * 100);
  layoutTemp.config.attr.wPer = toDecimal((200 / blockWidthTemp) * 100);
  layoutTemp.config.attr.hPer = toDecimal((200 / blockHeightTemp) * 100);
  layoutTemp.id = "id-" + uuid();
  layoutTemp.pid = currentPageRenderTreeNodeData.value.id;
  layoutTemp.children = [];
  if (type == "flex-row") {
    layoutTemp.label = "水平布局";
  } else if (type == "flex-column") {
    layoutTemp.label = "垂直布局";
  }
  layoutTemp.ref = "layoutRef-" + uuid();
  layoutTemp.type = type;
  pageRenderTreeDataStoreObj.addNodeByPID(layoutTemp.pid, layoutTemp);
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
</style>
