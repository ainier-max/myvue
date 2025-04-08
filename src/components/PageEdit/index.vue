<template>
  <PageDebug v-if="debugProcessFlag"></PageDebug>

  <div class="mainClass" style="display: flex; flex-direction: row">
    <div style="flex-basis: 17%">
      <div class="titleClass" align="center">页面渲染树</div>

      <div style="height: 60%">
        <el-tree
          ref="pageRenderTreeRef"
          :data="pageRenderTreeData"
          node-key="id"
          :default-expand-all="true"
          :expand-on-click-node="false"
          :props="defaultProps"
          :highlight-current="true"
          :current-node-key="currentPageRenderTreeNodeData?.id"
          @node-click="nodeClick"
          :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span v-if="data.type == 'mainBlock' || data.type == 'flex-column' || data.type == 'flex-row'">
                <Folder style="width: 1em; height: 1em" />
                {{ node.label }}
              </span>
              <span v-else>
                {{ node.label }}
              </span>
              <span>
                <Plus
                  v-if="
                    data.type != 'mainBlock' &&
                    data.type != 'flex-column' &&
                    data.type != 'flex-row' &&
                    designType == 'blueScriptDesign' &&
                    currentPageRenderTreeNodeData &&
                    currentPageRenderTreeNodeData.id == data.id &&
                    !isUsed()
                  "
                  style="width: 1em; height: 1em; color: red; margin-left: 8px"
                  @click.stop="() => addBlueSciptNode(data)"
                ></Plus>

                <Delete
                  v-if="
                    data.type != 'mainBlock' &&
                    designType == 'layoutDesign' &&
                    currentPageRenderTreeNodeData &&
                    currentPageRenderTreeNodeData.id == data.id
                  "
                  style="width: 1em; height: 1em; color: red; margin-left: 8px"
                  @click.stop="() => treeRemove(data)"
                ></Delete>
              </span>
            </span>
          </template>
        </el-tree>
      </div>

      <div align="center">
        <el-button
          v-if="designType == 'layoutDesign'"
          @click="showDidlog('AddPageBlock')"
          style="margin-top: 15px; margin-bottom: 15px"
          type="primary"
          >添加页面块</el-button
        >
        <el-button
          v-if="designType == 'blueScriptDesign'"
          @click="showDidlog('AddBlueScriptTool')"
          style="margin-top: 15px; margin-bottom: 15px"
          type="primary"
          >添加蓝图节点</el-button
        >
      </div>
    </div>
    <div style="flex-basis: 65%">
      <div style="width: 100%; height: 30px; background: #fc74fd; padding-top: 8px">
        <el-row>
          <el-col :span="12">
            <div>
              <span
                class="designButton"
                :style="designType == 'layoutDesign' ? { color: 'rgba(255, 255, 255, 1)' } : { color: 'gray' }"
                @click="toDesign('layoutDesign')"
                >界面设计</span
              >
              <span
                class="designButton"
                :style="designType == 'blueScriptDesign' ? { color: 'rgba(255, 255, 255, 1)' } : { color: 'gray' }"
                @click="toDesign('blueScriptDesign')"
                >蓝图设计</span
              >
            </div>
          </el-col>
          <el-col :span="12">
            <div align="right" style="margin-right: 20px">
              <el-button type="success" size="small" v-if="designType == 'blueScriptDesign'" @click="showDebugProcessWin(true)">调试界面</el-button>
              <el-button type="success" size="small" @click="toSave">保存</el-button>
              <el-button type="success" size="small" @click="toBrowse">浏览</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <div style="width: calc(100% - 2px); height: 100%; position: relative">
        <LayoutDesign v-if="currentPageRenderTreeNodeData && designType == 'layoutDesign'"></LayoutDesign>

        <BlueScriptDesign v-if="designType == 'blueScriptDesign'"></BlueScriptDesign>
      </div>
    </div>

    <div style="flex-basis: 18%; overflow: auto">
      <!--基础配置-->
      <BaseSetting v-if="showBaseSettingFun" @refreshLayoutDesign="refreshLayoutDesign"></BaseSetting>
      <!--内容配置-->
      <ContentSetting v-if="designType == 'layoutDesign'"></ContentSetting>
      <!--开发者配置-->
      <DevSetting v-if="designType == 'layoutDesign'"></DevSetting>
      <!--蓝图配置-->
      <BlueScriptSettings
        v-if="designType == 'blueScriptDesign' && (currentPageRenderTreeNodeData?.type != 'mainBlock' || currentBlueScript?.type == 'blueScriptTool')"
      ></BlueScriptSettings>
      <!--页面块蓝图配置-->
      <BlueScriptSettingForMainBlock
        v-if="designType == 'blueScriptDesign' && currentPageRenderTreeNodeData?.type == 'mainBlock'"
      ></BlueScriptSettingForMainBlock>

      <div style="height: 50px"></div>
    </div>
  </div>

  <el-dialog :title="dialogTitle" v-model="dialogFlag" :close-on-click-modal="false" :width="dialogWidth">
    <AddPageBlock v-if="dialogType == 'AddPageBlock'"></AddPageBlock>
    <AddBlueScriptTool v-if="dialogType == 'AddBlueScriptTool'" @getChooseBlueScriptTool="getChooseBlueScriptTool"></AddBlueScriptTool>
  </el-dialog>
</template>

<script setup lang="ts">
  //import 'default-passive-events';
  import * as Vue from "vue";
  import { loadDependentOn } from "@/common/js/loadDependentOn.js";

  import { provide, ref, nextTick, onMounted, watchEffect, computed, inject } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { objectToString, stringToObject } from "@/common/js/objStr.js";
  import { ElMessage } from "element-plus";
  import { highLightNode } from "@/components/PageEdit/PageDesign/BlueScriptDesign/AntV/AntV.js";

  import AddBlueScriptTool from "@/components/PageEdit/DialogContent/AddBlueScriptTool/index.vue";
  import AddPageBlock from "@/components/PageEdit/DialogContent/AddPageBlock/index.vue";

  import BaseSetting from "@/components/PageEdit/PageDesign/Settings/LayoutSetting/BaseSetting/index.vue";
  import ContentSetting from "@/components/PageEdit/PageDesign/Settings/LayoutSetting/ContentSetting/index.vue";
  import DevSetting from "@/components/PageEdit/PageDesign/Settings/LayoutSetting/DevSetting/index.vue";

  import LayoutDesign from "@/components/PageEdit/PageDesign/LayoutDesign/index.vue";

  import BlueScriptSettings from "@/components/PageEdit/PageDesign/Settings/BlueScriptSetting/index.vue";
  import BlueScriptSettingForMainBlock from "@/components/PageEdit/PageDesign/Settings/BlueScriptSettingForMainBlock/index.vue";

  import BlueScriptDesign from "@/components/PageEdit/PageDesign/BlueScriptDesign/index.vue";
  import PageDebug from "@/components/PageEdit/PageDesign/PageDebug/index.vue";

  import {
    commonExcuteRequest,
    commonSelectRequest,
    commonSelectRequestAndOtherParam,
    commonExcuteByBatchRequest,
    commonBatchSelectRequest,
    commonExcuteRequestAndOtherParam
  } from "@/common/js/request.js";
  import { getListData, deleteNode, findParent } from "@/common/js/tree.js";

  import { storeToRefs } from "pinia";
  import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
  const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
  const { pageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

  import { currentDealDataStore } from "@/store/currentDealData.ts";
  const currentDealDataStoreObj = currentDealDataStore();
  const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(currentDealDataStoreObj);

  import { blueScriptDataStore } from "@/store/blueScriptData.ts";
  const blueScriptDataStoreObj = blueScriptDataStore();
  const { blueScriptData, currentBlueScript } = storeToRefs(blueScriptDataStoreObj);

  import { processDataStore } from "@/store/processData.ts";
  const processDataStoreObj = processDataStore();
  const { allComponentInstance } = storeToRefs(processDataStoreObj);

  const defaultProps = { children: "children", label: "label" };

  const route = useRoute();
  const page_id = route.query.page_id;
  //const page_debug_flag = route.query.page_debug_flag;
  const pageRenderTreeRef = ref(null);

  const designType = ref("layoutDesign");
  const debugProcessFlag = ref(false);
  provide("debugProcessFlag", debugProcessFlag);
  //console.log("page_id", page_id);
  //console.log("page_debug_flag", page_debug_flag);
  const showBaseSettingFun = computed(() => {
    //console.log("showBaseSettingFun--");
    if (designType.value == "layoutDesign") {
      if (currentPageRenderTreeNodeData.value && currentPageRenderTreeNodeData.value.type != "childBlock") {
        return true;
      } else if (
        currentPageRenderTreeNodeData.value &&
        currentPageRenderTreeNodeData.value.type == "childBlock" &&
        !currentPageRenderTreeNodeData.value.pid
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });

  const isUsed = () => {
    //console.log("isUsed--blueScriptData",blueScriptData);
    //console.log("isUsed--currentPageRenderTreeNodeData",currentPageRenderTreeNodeData);
    let flagTemp = false;
    blueScriptData.value.forEach((element) => {
      if (element.related_ref == currentPageRenderTreeNodeData.value.ref) {
        flagTemp = true;
      }
    });
    return flagTemp;
  };

  const toSave = () => {
    if (designType.value == "layoutDesign") {
      saveBlueScript();
      savePageRenderTree();
    }
    if (designType.value == "blueScriptDesign") {
      saveBlueScript();
      savePageRenderTree();
    }
  };
  const saveBlueScript = () => {
    console.log("saveBlueScript--pageRenderTreeData", pageRenderTreeData);
    console.log("saveBlueScript--blueScriptData", blueScriptData);
    if (window.antVGraph) {
      pageRenderTreeData.value[0].config.blueScriptAttr.x = window.antVGraph.getGraphArea().x;
      pageRenderTreeData.value[0].config.blueScriptAttr.y = window.antVGraph.getGraphArea().y;
      pageRenderTreeData.value[0].config.blueScriptAttr.h = window.antVGraph.getGraphArea().height;
      pageRenderTreeData.value[0].config.blueScriptAttr.w = window.antVGraph.getGraphArea().width;
    }

    let main_block_config_str = objectToString(pageRenderTreeData.value[0].config);

    let param = {};
    param.sql = "page_blue_script.saveAllPageBlueScript";
    param.page_id = page_id;
    param.main_block_config_str = main_block_config_str;

    let newBlueScriptData = [];
    blueScriptData.value.forEach((element) => {
      //只保存非关联页面的蓝图数据
      if (!element.isRelativePage) {
        element.page_id = page_id;
        element.config_str = objectToString(element.config);
        //创建新对象（去除不必要的对象属性，如：graphNode,debugParamObj）
        let objTemp = window._.cloneDeep(element);
        if (objTemp.graphNode) {
          delete objTemp.graphNode;
        }
        if (objTemp.debugParamObj) {
          delete objTemp.debugParamObj;
        }
        newBlueScriptData.push(objTemp);
      }
    });
    param.blueScriptData = newBlueScriptData;
    console.log("saveBlueScript--param", param);
    if (param.blueScriptData.length > 0) {
      commonExcuteByBatchRequest(window.axios, param, saveBlueScriptCallBack);
    }
  };

  const saveBlueScriptCallBack = (result) => {
    if ((result.state = "success")) {
      ElMessage.success("蓝图保存成功！");
    }
  };

  const router = useRouter();
  const toBrowse = () => {
    const { href } = router.resolve({
      path: "/PageBrowse",
      query: {
        page_id: page_id,
        page_type: "browse"
      }
    });
    window.open(href, "_blank");
  };

  // const setNodeKey = () => {
  //   //console.log("currentPageRenderTreeNodeData11",currentPageRenderTreeNodeData);
  //   if (currentPageRenderTreeNodeData.value) {
  //     return currentPageRenderTreeNodeData.value.id;
  //   } else {
  //     return "";
  //   }
  // };

  //添加蓝图节点
  const addBlueSciptNode = (nodeData) => {
    console.log("addBlueSciptNode--nodeData", nodeData);
    if (nodeData.type == "frontEndComponent") {
      findFrontEndComponent(nodeData);
    } else if (nodeData.type == "pageOut") {
      console.log("addBlueSciptNode--pageRenderTreeData", pageRenderTreeData);
      pageRenderTreeData.value.forEach((element) => {
        if (element.ref == nodeData.ref) {
          blueScriptDataStoreObj.addNodeByPageOut(element);
        }
      });
    } else if (nodeData.type == "packComponent") {
      findPackComponent(nodeData);
    } else {
      ElMessage.error("暂时不支持该类型！");
      return;
    }
  };

  const findPackComponent = (nodeData) => {
    let param = {};
    param.sql = "page_component_pack.findAll";
    param.component_id = nodeData.related_value;
    commonSelectRequestAndOtherParam(window.axios, param, findPackComponentCallBack, nodeData);
  };

  const findPackComponentCallBack = (result, nodeData) => {
    if (result.objects.length > 0) {
      console.log("findPackComponentCallBack--result", result);
      let obj = result.objects[0];
      obj.related_ref = nodeData.ref;
      obj.nodeData = nodeData;
      blueScriptDataStoreObj.add(obj);
    }
  };

  const findFrontEndComponent = (nodeData) => {
    let param = {};
    param.sql = "page_component_frontend.find";
    param.component_id = nodeData.related_value;
    commonSelectRequestAndOtherParam(window.axios, param, findFrontEndComponentCallBack, nodeData);
  };
  const findFrontEndComponentCallBack = (result, nodeData) => {
    if (result.objects.length > 0) {
      console.log("findFrontEndComponentCallBack--result", result);
      console.log("findFrontEndComponentCallBack--nodeData", nodeData);
      let obj = result.objects[0];
      obj.related_ref = nodeData.ref;
      obj.nodeData = nodeData;
      //obj.component_name=
      blueScriptDataStoreObj.add(obj);
    }
  };

  //删除树节点
  const treeRemove = (nodeData) => {
    //删除节点
    pageRenderTreeDataStoreObj.deleteNodeByData(nodeData);
    //删除蓝图节点
    blueScriptDataStoreObj.deleteBlueScriptByRelatedRef(nodeData.ref);
    //如果删除的节点为当前选中的节点，则设置为当前节点的父节点
    if (nodeData.id == pageRenderTreeRef.value.getCurrentKey()) {
      currentDealDataStoreObj.setCurrentPageRenderTreeNodeDataByID(nodeData.pid);
    }
    //组件个数发生变化，重新渲染
    currentDealDataStoreObj.refreshCurrentTopPageLayoutData();
  };

  //布局设计页面刷新
  const refreshLayoutDesign = () => {
    console.log("布局设计页面刷新!");
    designType.value = "";
    nextTick(() => {
      designType.value = "layoutDesign";
      //designType.value = "blueScriptDesign";
    });
  };

  //顶层节点页面块发生变化时刷新设计编辑区
  watchEffect(() => {
    //console.log("watchEffect--currentDealDataStoreObj.$state.currentTopPageBlockData",currentDealDataStoreObj.$state.currentTopPageBlockData);
    if (currentDealDataStoreObj.$state.currentTopPageBlockData) {
      refreshLayoutDesign();
    }
  });
  //树节点点击事件
  const nodeClick = (data) => {
    //界面设计才设置当前页面树
    if (designType.value == "layoutDesign") {
      //设置当前树节点的值，并这是当前所处的顶层页面块Block
      currentDealDataStoreObj.setCurrentPageRenderTreeNodeData(data);
    } else if (designType.value == "blueScriptDesign") {
      //仅设置当前树节点的值
      currentPageRenderTreeNodeData.value = data;
      if (currentPageRenderTreeNodeData.value.type == "mainBlock") {
        currentBlueScript.value = null;
      }
      console.log("currentPageRenderTreeNodeData2132", currentPageRenderTreeNodeData);
      //被使用才定位
      if (isUsed()) {
        //定位
        //let blueScriptRefTemp = "";
        blueScriptData.value.forEach((element) => {
          if (element.related_ref == data.ref) {
            currentBlueScript.value = element;
          }
        });
        //console.log("currentBlueScript",currentBlueScript);
        window.antVGraph.getNodes().forEach((node) => {
          if (node.blue_script_ref == currentBlueScript.value.blue_script_ref) {
            //console.log("开始定位");
            window.antVGraph.centerCell(node, { padding: { top: 0 } });
            //节点高亮
            highLightNode(node);
          }
        });
      }
    }
  };

  //查询页面渲染树
  const findAllPageRenderTreeByPageID = () => {
    let param = {};
    param.batchSql = [
      {
        sql: "page_render_tree.findAllPageRenderTreeByPageID",
        page_id: page_id,
        resultKey: "AllPageRenderTree"
      },
      {
        sql: "page_render_tree.findRalativePageRenderTreeByPageID",
        page_id: page_id,
        resultKey: "RalativePageRenderTree"
      },
      {
        sql: "page_blue_script.find",
        page_id: page_id,
        resultKey: "AllBlueScript"
      },
      {
        sql: "page_blue_script.findRalativeBlueScriptByPageID",
        page_id: page_id,
        resultKey: "RalativeBlueScript"
      }
    ];
    commonBatchSelectRequest(axios, param, findAllPageRenderTreeByPageIDCallBack);
  };
  const findAllPageRenderTreeByPageIDCallBack = (result) => {
    //页面渲染树
    for (let i = 0; i < result["AllPageRenderTree"].length; i++) {
      result["AllPageRenderTree"][i].config = stringToObject(result["AllPageRenderTree"][i].config_str);
      //result.objects[i].config = eval("(" + result.objects[i].config_str + ")");
    }
    pageRenderTreeDataStoreObj.setPageRenderTreeData(
      getListData(result["AllPageRenderTree"], ["ref", "type", "config", "page_id", "config_str", "related_value", "component_code"])
    );
    //关联页面渲染树
    for (let i = 0; i < result["RalativePageRenderTree"].length; i++) {
      result["RalativePageRenderTree"][i].config = stringToObject(result["RalativePageRenderTree"][i].config_str);
    }
    console.log("result[]111111111", result["RalativePageRenderTree"]);
    pageRenderTreeDataStoreObj.setRelativePageRenderTreeData(
      getListData(result["RalativePageRenderTree"], ["ref", "type", "config", "page_id", "config_str", "related_value", "component_code"])
    );

    //找出type为mainBlock的数据
    let nodeTemp = pageRenderTreeDataStoreObj.getNodeForMainBlock();
    nextTick(() => {
      pageRenderTreeRef.value.setCurrentKey(nodeTemp.id);
      nodeClick(nodeTemp);
    });

    //蓝图数据
    blueScriptDataStoreObj.setBlueScriptData(result["AllBlueScript"]);
    //页面渲染树与蓝图节点的名称首次同步
    blueScriptData.value.forEach((element) => {
      result["AllPageRenderTree"].forEach((item) => {
        if (element.related_ref == item.ref) {
          //console.log("item1232", item);
          element.blue_script_name = item.name;
          element.config.blue_script_node_config.label = item.name;
        }
      });
    });

    result["RalativeBlueScript"].forEach((element) => {
      element.isRelativePage = true;
      blueScriptData.value.push(element);
    });

    let startTime = new Date().getTime();
    console.log("渲染树过滤开始时间", startTime);
    nextTick(() => {
      //过滤不显示
      pageRenderTreeRef.value.filter("无效参数");
      let endTime = new Date().getTime();
      console.log("渲染树过滤结束时间", endTime);
      console.log("渲染树过滤花费时间", endTime - startTime + "ms");
    });
  };
  //不显示关联的
  const filterNode = (value, data, node) => {
    //console.log("filterNode-value",value);
    //console.log("filterNode--data12",data);
    if (data.isRelativePage && data.isRelativePage == true) {
      return false;
    } else {
      return true;
    }
  };

  //保存页面渲染树
  const savePageRenderTree = () => {
    let arrayTemp = pageRenderTreeDataStoreObj.getPageRenderTreeDataForArray();
    console.log("savePageRenderTree--arrayTemp", arrayTemp);
    let pageNameTemp = "";
    let topPageBlockRefTemp = "";
    let newArrayTemp = [];
    for (let i = 0; i < arrayTemp.length; i++) {
      //只保存非关联页面的数据
      if (!arrayTemp[i].isRelativePage) {
        if (arrayTemp[i].length > 0) {
          //外部页面块不保存
        } else {
          let { id, pid, ref, type, related_value } = { ...arrayTemp[i] };
          let config_str = objectToString(arrayTemp[i].config);
          let name = arrayTemp[i].label;
          newArrayTemp.push({
            id,
            pid,
            name,
            ref,
            type,
            related_value,
            page_id,
            config_str
          });
          if (arrayTemp[i].type == "mainBlock" && !arrayTemp[i].pid) {
            pageNameTemp = name;
            topPageBlockRefTemp = ref;
          }
        }
      }
    }
    let param = {};
    param.sql = "page_render_tree.savePageRenderTree";
    param.page_id = page_id;
    param.page_name = pageNameTemp;
    param.topPageBlockRef = topPageBlockRefTemp;
    param.pageRenderTreeData = newArrayTemp;
    console.log("传参param", param);
    commonExcuteByBatchRequest(window.axios, param, savePageRenderTreeCallBack);
  };
  const savePageRenderTreeCallBack = (result) => {
    if (result.state == "success") {
      ElMessage.success("页面渲染树保存成功！");
    }
  };

  const dialogTitle = ref("");
  const dialogType = ref("");
  const dialogFlag = ref(false);
  const dialogWidth = ref("30%");
  //注入
  provide("dialogFlag", dialogFlag);

  //添加页面块弹窗
  const showDidlog = (type) => {
    if (type == "AddPageBlock") {
      dialogWidth.value = "30%";
      dialogTitle.value = "添加页面块";
      dialogFlag.value = true;
      dialogType.value = type;
    }
    if (type == "AddBlueScriptTool") {
      dialogWidth.value = "30%";
      dialogTitle.value = "添加蓝图（双击选择）";
      dialogFlag.value = true;
      dialogType.value = type;
    }
  };

  const toDesign = (type) => {
    if (type == "layoutDesign" && !currentPageRenderTreeNodeData.value) {
      currentPageRenderTreeNodeData.value = pageRenderTreeData.value[0];
    }
    designType.value = type;
  };

  const getChooseBlueScriptTool = (obj) => {
    console.log("getChooseBlueScriptTool--obj", obj);
    blueScriptDataStoreObj.add(obj);
    dialogFlag.value = false;
  };

  const showDebugProcessWin = (closeFlag) => {
    //置空实例
    allComponentInstance.value = [];
    debugProcessFlag.value = true;
    if (closeFlag == true) {
      //关闭节点配置页面
      //currentBlueScript.value=null;
      //取消节点高亮选择
      // window.antVGraph.getNodes().forEach(element => {
      //   element.getAttrs().body.fill = 'rgba(40, 44, 52,0.9)';
      //   element.setAttrs(element.getAttrs().body.fill);
      // });
    }
  };

  //加载依赖
  const dependentOnObj = ref({});
  provide("provideDependentOnObj", dependentOnObj);
  const execLoadDependentFlag = ref(false);
  const loadDependentOnFun = () => {
    //首次执行需要加载依赖
    if (execLoadDependentFlag.value == false) {
      dependentOnObj.value = {
        vue: Vue,
        echarts: null,
        FFCesium: null
      };
      //加载依赖
      loadDependentOn.importModule(dependentOnObj.value);
      execLoadDependentFlag.value = true;
    }

    let isLoadEndFlag = loadDependentOn.isLoadEnd(dependentOnObj.value);
    //判断依赖是否都加载完成，加载完成才可继续执行
    if (!isLoadEndFlag) {
      window.setTimeout(loadDependentOnFun, 100);
      return;
    }
    //开始执行
    findAllPageRenderTreeByPageID();
  };

  // 生命周期钩子
  onMounted(() => {
    loadDependentOnFun();
  });
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

  .mainClass {
    height: 100%;
    overflow: hidden;
    margin: 0px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .designButton {
    font-weight: bold;
    padding-left: 8px;
    cursor: pointer;
  }
</style>
