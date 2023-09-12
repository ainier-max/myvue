<template>
  <div style="height: 100%;overflow:hidden;margin: 0px;background: #181b1e">
    <div v-drag
         style="overflow: hidden;position:fixed;left:50px;top:20px;width: 1800px;background: #ffffff;z-index: 1000;border-style:inset;"
         v-if="debugProcessFlag">
      <div align="right" id="operateMenuID" style="cursor:move;padding: 10px 10px 10px 10px;border-bottom: 1px solid gray;">
        <!--
        <el-button v-if="designTab=='second' && debugProcessFlag==true" id="moveDivID"
                   size="small">按住拖动
        </el-button>
        -->
        <el-button v-if="designTab=='second' && debugProcessFlag==true"
                   type="danger" size="small"
                   @click="runProcess">运行
        </el-button>
        <el-button v-if="designTab=='second' && debugProcessFlag==true"
                   type="danger" size="small"
                   @click="resetProcess">重置调试状态
        </el-button>
        <el-button v-if="designTab=='second' && debugProcessFlag==true"
                    type="danger" size="small"
                   @click="stopDebugProcess">关闭调试界面
        </el-button>
      </div>

      <div style="overflow: auto;position: relative;height:850px;overflow: hidden">
        <PageDebug ref="pageDebugRef" page_debug_flag_from_parent="true" :page_id_from_parent="page_id"
                   :editComponentFlag="false" style="z-index: 900;"></PageDebug>
      </div>

    </div>


    <el-row style="height: 100%">
      <el-col :span="4" style="height: 100%;border-right: 1px solid #5e6061;background: rgb(40, 44, 52); ">
        <div style="height: 100%">
          <div v-if="componentTab=='first' && designTab=='first'">
            <div style="width: 100%;height: 30px;background: #000000;color:rgba(255,255,255,0.6);padding-top: 8px" align="center">
              布局组件
            </div>
            <div class="componentItemClass" @click="setFlexLayout('flex-column')">水平布局</div>
            <div class="componentItemClass" @click="setFlexLayout('flex-row')">垂直布局</div>
          </div>

          <div v-if="componentTab=='second' && designTab=='second'" style="height: 100%">
            <div style="width: 100%;height: 30px;background: #000000;color:rgba(255,255,255,0.6);padding-top: 8px" align="center">
              蓝图工具
            </div>
            <BlueScriptToolTree @addBlueScriptByTree="addBlueScriptByTree" style="height: 100%;overflow-y: auto;"></BlueScriptToolTree>
          </div>
        </div>
        <!--
        <div>
          <el-tabs v-model="componentTab" class="demo-tabs">
            <el-tab-pane label="布局组件" name="first" v-if="designTab=='first'" style="margin-left: 10px;">
              <div class="componentItemClass" @click="setFlexLayout('flex-column')">水平布局</div>
              <div class="componentItemClass" @click="setFlexLayout('flex-row')">垂直布局</div>
              <div class="componentItemClass" @click="setOtherLayout('static')">静态布局</div>
            </el-tab-pane>

            <el-tab-pane label="蓝图工具" name="second" v-if="designTab=='second'">
              <BlueScriptToolTree @addBlueScriptByTree="addBlueScriptByTree"></BlueScriptToolTree>
            </el-tab-pane>

          </el-tabs>
        </div>
        -->



      </el-col>

      <el-col :span="20" style="height: 100%;border-right: 1px solid #5e6061;position: relative">
        <div style="width: 100%;height: 100%;overflow-y:hidden">
          <div class="box left" id="leftBox">
            <div class="resize-bar"></div>
            <div class="resize-line"></div>
            <div class="resize-box" id="resize-box">

              <div style="width:100%;height: 75vh;overflow: hidden;" class="cbc-design-tabs">
                <el-tabs v-model="designTab"  @tab-click="designTabClick" style="height: 100%">
                  <el-tab-pane label="界面设计" name="first" style="margin-left: 10px;height: 75vh;">
                    <ViewSketchRuler v-if="designTab=='first'"></ViewSketchRuler>
                  </el-tab-pane>
                  <el-tab-pane label="蓝图设计" name="second" style="margin-left: 10px;height: 75vh">
                    <BlueScript ref="blueScriptRef" v-if="designTab=='second'"></BlueScript>
                  </el-tab-pane>
                </el-tabs>
              </div>


              <div
                  style="margin:0px;padding:0px;width:100%;height:24.8vh;background-color: #282c34;z-index: 999999;border: 1px solid whitesmoke">
                <BlockTree v-if="designTab=='first'"></BlockTree>
                <BlueScriptBlockTree v-if="designTab=='second'"></BlueScriptBlockTree>
              </div>

              <!---->

              <el-button v-if="designTab=='second' && debugProcessFlag==false"
                         style="position: absolute;right: 130px;top:8px;" type="success" size="small"
                         @click="showDebugProcessWin(true)">调试界面
              </el-button>


              <el-button v-if="currentPageBlock.page_block_ref!=null" style="position: absolute;right: 70px;top:8px;"
                         type="primary" size="small"
                         @click="savePageBack">保存
              </el-button>

              <el-button v-if="currentPageBlock.page_block_ref!=null" style="position: absolute;right: 10px;top:8px;"
                         type="primary" size="small"
                         @click="toPreview">预览
              </el-button>
            </div>
          </div>
          <div class="box right" id="rightDiv" style="background: #282c34;overflow-y:auto;">

            <PageSettings v-if="designTab=='first' && SettingsTab=='PageSettings'"
                          :currentPageBlock="currentPageBlock"></PageSettings>
            <PageBlockSettings v-if="designTab=='first' && SettingsTab=='PageBlockSettings'"
                               :currentPageBlock="currentPageBlock"></PageBlockSettings>
            <PageBlockLayoutSetting v-if="designTab=='first' && SettingsTab=='PageBlockLayoutSetting'"
                                    :currentPageBlockLayout="currentPageBlockLayout"></PageBlockLayoutSetting>
            <PageBlockComponentSetting v-if="designTab=='first' && SettingsTab=='PageBlockComponentSetting'"
                                       :currentPageBlockComponent="currentPageBlockComponent"></PageBlockComponentSetting>

            <!--蓝图设计（右边设置页面）-->
            <el-tabs v-if="designTab=='second'" v-model="blueScriptSettingsTab" class="demo-tabs" style="height: 100%;">
              <el-tab-pane label="节点配置" name="first" style="margin-left: 10px;height: 100%">
                <BlueScriptSettins></BlueScriptSettins>
              </el-tab-pane>
            </el-tabs>

          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import {getCurrentInstance} from "vue";
import {commonExcuteRequest, commonSelectRequest, commonExcuteRequestAndOtherParam} from "../../common/js/request.js";
import axios from "axios";
import {getListData} from "../../common/js/tree.js";
import {objectToString, stringToObject} from "../../common/js/objStr.js";
import {uuid} from "../../common/js/uuid.js";
import {toDecimal} from "../../common/js/decimal.js";

import ViewSketchRuler from "./ViewComponent/ViewSketchRuler/index.vue";


import {js_beautify} from "js-beautify";

import BlueScript from "./BlueScript/index.vue";

import BlueScriptToolTree from "./BlueScript/BlueScriptToolTree/index.vue";
import BlueScriptSettins from "./BlueScript/BlueScriptSettings/index.vue";


import PageDebug from "../PageDebug/index.vue";


import BlockTree from "./ViewComponent/BlockTree/index.vue"
import BlueScriptBlockTree from "./BlueScript/BlueScriptBlockTree/index.vue";

import PageSettings from "./ViewComponent/Settings/PageSettings/index.vue";
import PageBlockSettings from "./ViewComponent/Settings/PageBlockSettings/index.vue";
import PageBlockLayoutSetting from "./ViewComponent/Settings/PageBlockLayoutSetting/index.vue";
import PageBlockComponentSetting from "./ViewComponent/Settings/PageBlockComponentSetting/index.vue";



export default {
  name: "Page",
  props: {},
  directives: {
    drag(el, bindings) {
      document.getElementById("operateMenuID").onmousedown = function (e) {
        let disx = e.pageX - el.offsetLeft
        let disy = e.pageY - el.offsetTop
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null
        }
      }
    }
  },
  data() {
    return {

      debugProcessFlag: false,
      defaultProps: {
        "children": 'children',
        "label": 'label'
      },
      componentTab: 'first',
      designTab: 'first',
      SettingsTab: 'PageSettings',
      blueScriptSettingsTab: 'first',

      currentPageBlock: {
        label: '未选择',
      },
      currentPageBlockLayout: null,
      currentPageBlockComponent: null,
      topPageBlock: null,

      pageLayouts: [],
      findAllPageBlockLayoutFlag:false,
      pageComponents: [],
      pageBlueScripts:[],
      pageBlocks:[],

      page_id:'',

      componentToBlueScriptPositionObj:null,

    };
  },
  components: {
    ViewSketchRuler: ViewSketchRuler,
    BlueScript: BlueScript,
    BlueScriptToolTree: BlueScriptToolTree,
    BlueScriptSettins: BlueScriptSettins,
    PageDebug: PageDebug,
    BlockTree: BlockTree,
    BlueScriptBlockTree: BlueScriptBlockTree,
    PageSettings: PageSettings,
    PageBlockSettings: PageBlockSettings,
    PageBlockLayoutSetting: PageBlockLayoutSetting,
    PageBlockComponentSetting: PageBlockComponentSetting
  },
  methods: {
    findAllBlueScript() {
      let param = {};
      param.sql = "page_blue_script.findForConfig";
      param.page_id = this.$route.query.page_id;
      commonSelectRequest(axios, param, this.findAllBlueScriptCallBack);
    },
    sleep(numberMillis) {
      var now = new Date();
      var exitTime = now.getTime() + numberMillis;
      while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
          return;
      }
    },
    //蓝图获取备份
    findAllBlueScriptCallBack(result) {
      console.log("findAllBlueScript--result",result);
      this.pageBlueScripts = [];
      //console.log("6666findAllBlueScript--result", result.objects);
      for (let i = 0; i < result.objects.length; i++) {
        //let item=result.objects[i];
        let item={};
        item.name = result.objects[i].name;
        item.blue_script_ref = result.objects[i].blue_script_ref;
        item.component_ref = result.objects[i].component_ref;
        item.type=result.objects[i].type;
        item.blue_script_id=result.objects[i].blue_script_id;

        item.config=eval("(" + result.objects[i].config_str + ")");



        //console.log("临时configTemp：", configTemp);
        //蓝图节点配置信息
        /**对蓝图节点配置重新配置
         let nodeConfig = eval("(" + result.objects[i].blue_script_node_config_str + ")");
         nodeConfig.id = result.objects[i].blue_script_ref;
         nodeConfig.x = result.objects[i].zbx;
         nodeConfig.y = result.objects[i].zby;
         nodeConfig.label = result.objects[i].name;
         item.config.node_config = nodeConfig;
         */
        //console.log("11111",item.config.logic_config_str);
        item.config.logic_config = eval("(" + item.config.logic_config_str + ")");
        //console.log("2222",item.config.logic_config);
        //如果返回的logicunFun还是字符串，则继续转换
        if(item.config.logic_config && typeof (item.config.logic_config.logicFun)=="string"){
          item.config.logic_config.logicFun=eval("(" + item.config.logic_config.logicFun + ")");
        }

        item.config.startPointFlag = item.config.startPointFlag;


        item.page_id = this.$route.query.page_id;
        //添加
        if (typeof (item.dataSet) != "undefined") {
          item.config.dataSet = {};
          item.config.dataSet.data = item.dataSet.data;
          item.config.dataSet.fields = item.dataSet.fields;
          item.config.dataSet.metrics = item.dataSet.metrics;
          if (typeof (item.dataSet.dimensions) != "undefined") {
            item.config.dataSet.dimensions = item.dataSet.dimensions;
          }
        }
        this.pageBlueScripts.push(item);

      }
      console.log("findAllBlueScript--this.pageBlueScripts", this.pageBlueScripts);
    },

    deletePageLayoutItem(item) {
      console.log("deletePageLayoutItem--item",item);
      //先删除前端组件，页面块
      let layoutComponentsTemp=item.layout_config.blocks_components;
      for(let i=0;i<layoutComponentsTemp.length;i++){
        console.log("deletePageLayoutItem--ref",layoutComponentsTemp[i].ref);
        if(typeof (layoutComponentsTemp[i].ref)!="undefined"){
          //删除组件
          for(let j=0;j<this.pageComponents.length;j++){
            if(this.pageComponents[j].component_ref==layoutComponentsTemp[i].ref){
              this.pageComponents.splice(j, 1);
              j = j - 1;
            }
          }
          //删除布局组件
          for(let j=0;j<this.pageLayouts.length;j++){
            if(this.pageLayouts[j].layout_ref==layoutComponentsTemp[i].ref){
              this.pageLayouts.splice(j, 1);
              j = j - 1;
            }
          }
          //删除蓝图
          for(let j=0;j<this.pageBlueScripts.length;j++){
            if(this.pageBlueScripts[j].component_ref==layoutComponentsTemp[i].ref){
              this.pageBlueScripts.splice(j, 1);
              j = j - 1;
            }
          }

        }
      }
      console.log("deletePageLayoutItem--this.pageComponents",this.pageComponents);

      //再删除布局组件
      for (let i = 0; i < this.pageLayouts.length; i++) {
        if (this.pageLayouts[i].layout_ref == item.layout_ref) {
          this.pageLayouts.splice(i, 1);
          i = i - 1;
        }
      }
      window.cbcViewDraggleResizableInstance.data.showFlagTemp=false;
      for(let i=0;i<window.cbcViewDraggleResizableInstance.data.currentPageBlockLayouts.length;i++){
        if(window.cbcViewDraggleResizableInstance.data.currentPageBlockLayouts[i].layout_ref == item.layout_ref){
          window.cbcViewDraggleResizableInstance.data.currentPageBlockLayouts.splice(i, 1);
          i = i - 1;
        }
      }
      //重新刷新布局区域
      this.$nextTick(()=>{
        window.cbcViewDraggleResizableInstance.data.showFlagTemp=true;
      });


      //删除列表布局组件
      for (let i = 0; i < window.cbcBlockTreeInstance.data.pageBlockLayouts.length; i++) {
        if (window.cbcBlockTreeInstance.data.pageBlockLayouts[i].layout_ref == item.layout_ref) {
          window.cbcBlockTreeInstance.data.pageBlockLayouts.splice(i, 1);
          i = i - 1;
        }
      }
      //列表取消选中
      window.cbcBlockTreeInstance.ctx.cancelChoosedByPageLayout();
      //console.log("this.pageLayouts2:",this.pageLayouts);

    },



    deletePageComponentItem(item) {
      console.log("deletePageComponentItem--item",item);
      //删除编辑区的组件
      for (let i = 0; i < this.pageComponents.length; i++) {
        if (this.pageComponents[i].component_ref == item.component_ref) {
          this.pageComponents.splice(i, 1);
          i = i - 1;
        }
      }

      //删除组件列表中的组件
      for(let i=0;i<window.cbcBlockTreeInstance.data.pageBlockComponents.length;i++){
        if(window.cbcBlockTreeInstance.data.pageBlockComponents[i].component_ref==item.component_ref){
          window.cbcBlockTreeInstance.data.pageBlockComponents.splice(i, 1);
          i = i - 1;
        }
      }
      //更新layout中的blocks_components值
      for(let i=0;i<this.pageLayouts.length;i++){
        if(this.pageLayouts[i].layout_ref==item.layout_ref){
          console.log("deletePageComponentItem--this.pageLayouts[i]",this.pageLayouts[i]);
          for(let j=0;j<this.pageLayouts[i].layout_config.blocks_components.length;j++){
            if(this.pageLayouts[i].layout_config.blocks_components[j].type=="component" && this.pageLayouts[i].layout_config.blocks_components[j].ref==item.component_ref){
              let obj={};
              obj.span=this.pageLayouts[i].layout_config.blocks_components[j].span;
              obj.margin={top: 0, bottom: 0, left: 0, right: 0};
              obj.padding={top: 0, bottom: 0, left: 0, right: 0};
              this.pageLayouts[i].layout_config.blocks_components[j]=obj;
            }
          }
        }
      }
      console.log("this.pageComponents11:",this.pageComponents);
    },

    findAllPageBlockLayout() {
      let param = {};
      param.sql = "page_block_layout.find";
      param.page_id = this.$route.query.page_id;
      commonSelectRequest(axios, param, this.findAllPageBlockLayoutCallBack);
    },


    findAllPageBlockLayoutCallBack(result) {
      console.log("findAllPageBlockLayoutCallBack--result.objects",result.objects);


      for (let i = 0; i < result.objects.length; i++) {

        result.objects[i].layout_config = eval("(" + result.objects[i].layout_config_str + ")");

        //如果没有background则添加默认值（后续可以删除）
        if(typeof (result.objects[i].layout_config.attr.background)=="undefined"){
          result.objects[i].layout_config.attr.background={};
          result.objects[i].layout_config.attr.background.type="img";
          result.objects[i].layout_config.attr.background.value="";
        }
        //如果没有padding或margin或background则附加默认值(后续可以删除)
        for(let j=0;j<result.objects[i].layout_config.blocks_components.length;j++){
          if(typeof (result.objects[i].layout_config.blocks_components[j].padding)=="undefined"){
            result.objects[i].layout_config.blocks_components[j].padding={};
            result.objects[i].layout_config.blocks_components[j].padding.top=0;
            result.objects[i].layout_config.blocks_components[j].padding.right=0;
            result.objects[i].layout_config.blocks_components[j].padding.bottom=0;
            result.objects[i].layout_config.blocks_components[j].padding.left=0;
          }
          if(typeof (result.objects[i].layout_config.blocks_components[j].margin)=="undefined"){
            result.objects[i].layout_config.blocks_components[j].margin={};
            result.objects[i].layout_config.blocks_components[j].margin.top=0;
            result.objects[i].layout_config.blocks_components[j].margin.right=0;
            result.objects[i].layout_config.blocks_components[j].margin.bottom=0;
            result.objects[i].layout_config.blocks_components[j].margin.left=0;
          }
          if(typeof (result.objects[i].layout_config.blocks_components[j].background)=="undefined"){
            result.objects[i].layout_config.blocks_components[j].background={};
            result.objects[i].layout_config.blocks_components[j].background.type="img";
            result.objects[i].layout_config.blocks_components[j].background.value="";
          }

        }
        this.pageLayouts.push(result.objects[i]);
      }
      console.log("findAllPageBlockLayout--this.pageLayouts",this.pageLayouts);




      /**
      //删除layout_components
      for(let i=0;i<this.pageLayouts.length;i++){
        delete this.pageLayouts[i].layout_config.layout_components;
        for(let j=0;j<this.pageLayouts[i].layout_config.blocks_components.length;j++){
          if(this.pageLayouts[i].layout_config.blocks_components[j].type=="component"){
            delete this.pageLayouts[i].layout_config.blocks_components[j].component_ref;
          }
          if(this.pageLayouts[i].layout_config.blocks_components[j].type=="block"){
            delete this.pageLayouts[i].layout_config.blocks_components[j].page_block_ref;
          }
        }
      }
       */
      //重新赋值
      /**
      for(let i=0;i<this.pageLayouts.length;i++){
        this.pageLayouts[i].layout_config.blocks_components=this.pageLayouts[i].layout_config.layout_components;
        for(let j=0;j<this.pageLayouts[i].layout_config.blocks_components.length;j++){
          if(this.pageLayouts[i].layout_config.blocks_components[j].type=="component"){
            this.pageLayouts[i].layout_config.blocks_components[j].ref=this.pageLayouts[i].layout_config.blocks_components[j].component_ref;
          }
          if(this.pageLayouts[i].layout_config.blocks_components[j].type=="block"){
            this.pageLayouts[i].layout_config.blocks_components[j].ref=this.pageLayouts[i].layout_config.blocks_components[j].page_block_ref;
          }
        }
      }*/

      //替换component成frontEndComponent
      /**
      for(let i=0;i<this.pageLayouts.length;i++){
        let blocks_components =this.pageLayouts[i].layout_config.blocks_components;
        for(let j=0;j<blocks_components.length;j++){
          if(blocks_components[j].type=="component"){
            blocks_components[j].type="frontEndComponent";
          }
        }
      }
       */

      this.findAllPageBlockLayoutFlag=true;


    },
    findAllPageBlockComponent() {
      let param = {};
      param.sql = "page_block_component.findIncludeCode";
      param.page_id = this.$route.query.page_id;
      commonSelectRequest(axios, param, this.findAllPageBlockComponentCallBack);
    },
    findAllPageBlockComponentCallBack(result) {
      console.log("findAllPageBlockComponentCallBack--result:", result);
      for (let i = 0; i < result.objects.length; i++) {
        if(result.objects[i].component_config_str!=""){
          result.objects[i].component_config = eval("(" + result.objects[i].component_config_str + ")");
          this.pageComponents.push(result.objects[i]);
        }
      }
      console.log("findAllPageBlockComponent--this.pageComponents", this.pageComponents);
    },

    setOtherLayout(){
      this.$message.info("该布局组件暂未开发！");
    },

    setFlexLayout(type) {
      if (typeof (window.cbcViewDraggleResizableInstance) == "undefined") {
        this.$message.error("未进入编辑块！");
        return;
      }

      let pageLayoutTemp = {}
      pageLayoutTemp.layout_config = {};
      pageLayoutTemp.layout_config.attr = {};
      pageLayoutTemp.layout_config.attr.x = 10;
      pageLayoutTemp.layout_config.attr.y = 10;
      pageLayoutTemp.layout_config.attr.w = 200;
      pageLayoutTemp.layout_config.attr.h = 200;
      pageLayoutTemp.layout_config.attr.zIndex = 100;
      pageLayoutTemp.layout_config.attr.background = {};
      pageLayoutTemp.layout_config.attr.background.type="img";
      pageLayoutTemp.layout_config.attr.background.value="";


      let pageWidthTemp = window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.width;
      let pageHeightTemp = window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.height;
      pageLayoutTemp.layout_config.attr.xPer = toDecimal((10 / pageWidthTemp) * 100);
      pageLayoutTemp.layout_config.attr.yPer = toDecimal((10 / pageHeightTemp) * 100);
      pageLayoutTemp.layout_config.attr.wPer = toDecimal((200 / pageWidthTemp) * 100);
      pageLayoutTemp.layout_config.attr.hPer = toDecimal((200 / pageHeightTemp) * 100);

      pageLayoutTemp.layout_config.blocks_components = [];
      let obj1 = {};
      obj1.span = 50;

      obj1.padding={};
      obj1.padding.unit="px";
      obj1.padding.top=0;
      obj1.padding.bottom=0;
      obj1.padding.left=0;
      obj1.padding.right=0;


      obj1.margin={};
      obj1.margin.unit="px";
      obj1.margin.top=0;
      obj1.margin.bottom=0;
      obj1.margin.left=0;
      obj1.margin.right=0;

      obj1.background={};
      obj1.background.type="img";
      obj1.background.value="";


      pageLayoutTemp.layout_config.blocks_components.push(obj1);

      let obj2 = {};
      obj2.span = 50;
      obj2.padding={};
      obj2.padding.top=0;
      obj2.padding.bottom=0;
      obj2.padding.left=0;
      obj2.padding.right=0;

      obj2.margin={};
      obj2.margin.top=0;
      obj2.margin.bottom=0;
      obj2.margin.left=0;
      obj2.margin.right=0;

      obj2.background={};
      obj2.background.type="img";
      obj2.background.value="";

      pageLayoutTemp.layout_config.blocks_components.push(obj2);
      pageLayoutTemp.layout_ref = "layoutRef-" + uuid();

      pageLayoutTemp.layout_type = type;
      if (type == 'flex-column') {
        pageLayoutTemp.layout_name = "水平布局";
        pageLayoutTemp.layout_config.type = "row";
      }else{
        pageLayoutTemp.layout_name = "垂直布局";
        pageLayoutTemp.layout_config.type = "column";
      }

      pageLayoutTemp.page_id = this.$route.query.page_id;
      pageLayoutTemp.page_block_ref = this.currentPageBlock.page_block_ref;
      this.pageLayouts.push(pageLayoutTemp);
      console.log("setLayout--this.pageLayouts", this.pageLayouts);
      window.cbcViewDraggleResizableInstance.data.currentPageBlockLayouts.push(pageLayoutTemp);
      console.log("window.cbcViewDraggleResizableInstance.data.currentPageBlockLayouts",window.cbcViewDraggleResizableInstance.data.currentPageBlockLayouts);
      window.cbcViewDraggleResizableInstance.data.showFlag = true;
      //添加至布局组件列表中
      window.cbcBlockTreeInstance.ctx.addPageBlockLayout(pageLayoutTemp);

    },


    showDebugProcessWin(closeFlag) {
      this.debugProcessFlag = true;
      if (closeFlag == true) {
        //关闭节点配置页面
        window.cbcBlueScriptSettingsInstance.data.currentBlueScript = null;
        //取消节点高亮选择
        let nodesTemp = window.cbcBlueScriptInstance.data.graph.getNodes();
        for (let i = 0; i < nodesTemp.length; i++) {
          nodesTemp[i].getAttrs().body.fill = 'rgba(40, 44, 52,0.9)';
          nodesTemp[i].setAttrs(nodesTemp[i].getAttrs().body.fill);
        }
      } else {

      }
    },
    runProcess() {
      //console.log("this.refs",this.$refs);
      this.$refs.pageDebugRef.runAllProcess();
    },
    resetProcess() {
      const edges = window.cbcBlueScriptInstance.data.graph.getEdges();
      //console.log("ttttt1edges", edges);
      for (let i = 0; i < edges.length; i++) {
        edges[i].attr('line', {
          stroke: '#ffffff',
          strokeWidth: 1,
          strokeDasharray: 0,
          targetMarker: {
            name: 'classic',
            size: 7,
          }
        });
      }
    },
    stopDebugProcess() {
      this.debugProcessFlag = false;
      this.resetProcess();
    },





    //数据模型
    blueScriptTabClick() {

    },
    //界面设计与蓝图设计
    designTabClick(tab, event) {
      window.cbcViewDraggleResizableInstance = null;
      if (tab.props.name == "first") {
        this.componentTab = "first";
      }
      if (tab.props.name == "second") {
        this.componentTab = "second";
      }
    },

    addBlueScriptByTree(item) {
      //console.log("addBlueScriptByTree",item);
      this.$refs.blueScriptRef.addBlueScriptByTree(item);
    },


    //跳转至预览页
    toPreview() {

      const {href} = this.$router.resolve({
        path: '/Preview',
        query: {
          page_id: this.$route.query.page_id,
          pageDebugFlag:false
        }
      });
      window.open(href, '_blank');

      /**
       let href="http://10.11.0.87:4000/Preview/index.html?page_id="+this.$route.query.page_id;
       window.open(href, '_blank');
       */
    },
    /**
     * 保存蓝图配置信息
     */
    savePageBlueScriptConfig() {
      //if (typeof (window.cbcBlueScriptInstance) == "undefined") {
      //  return;
      //}

      let centerInfo = {};
      centerInfo.attr = {};
      centerInfo.attr.x = window.cbcBlueScriptInstance.data.graph.getGraphArea().x;
      centerInfo.attr.y = window.cbcBlueScriptInstance.data.graph.getGraphArea().y;
      centerInfo.attr.width = window.cbcBlueScriptInstance.data.graph.getGraphArea().width;
      centerInfo.attr.height = window.cbcBlueScriptInstance.data.graph.getGraphArea().height;

      console.log("保存画布矩形",centerInfo);
      window.cbcBlueScriptInstance.data.graph.zoomToRect(centerInfo.attr);

      let page_block_blue_script_config_str = objectToString(centerInfo);
      let param = {};
      param.sql = "page_block_tree.updatePageBlueScriptConfig";
      param.page_block_blue_script_config_str = page_block_blue_script_config_str;
      param.page_block_ref = this.topPageBlock.page_block_ref;
      console.log("param33331", param);
      commonExcuteRequest(axios, param, this.savePageBlueScriptConfigCallBack);
    },
    savePageBlueScriptConfigCallBack(result) {


    },

    savePageBack() {


      if (this.designTab == "first") {
        this.saveAllPageComponent();
      } else if (this.designTab == "second") {
        this.savePageBlueScriptConfig();
        this.saveAllPageBlueScript();
      }
    },
    saveAllPageBlueScript() {
      let param = {};
      param.sql = "page_back.saveAllPageBlueScript";
      param.page_id = this.$route.query.page_id;
      //console.log("保存的蓝图所有对象（未转字符串）TT：", window.cbcPageInstance.data.pageBlueScripts);
      //数组深度拷贝：.concat()
      //let pageBlueScriptsTemp = lodash.cloneDeep(window.cbcPageInstance.data.pageBlueScripts);
      //let pageBlueScriptsTemp = Object.assign({}, window.cbcPageInstance.data.pageBlueScripts);
      let pageBlueScriptsTemp = window.cbcPageInstance.data.pageBlueScripts;
      console.log("saveAllPageBlueScript--window.cbcPageInstance.data.pageBlueScripts",window.cbcPageInstance.data.pageBlueScripts);
      let pageBlueScripts = [];
      for (let i = 0; i < pageBlueScriptsTemp.length; i++) {
        let inTemp=pageBlueScriptsTemp[i].config.in_out_config.in;
        if(typeof (inTemp)!="undefined"){
          for(let m=0;m<inTemp.length;m++){
            if(inTemp[m].value!=null && inTemp[m].value.noSaveFlag==true){
              inTemp[m].value=inTemp[m].value.noSaveDescribe;
            }
          }
        }
        //去掉输出端noSaveFlag为true的数据
        let outTemp=pageBlueScriptsTemp[i].config.in_out_config.out;
        if(typeof (outTemp)!="undefined"){
          for(let m=0;m<outTemp.length;m++){
            //console.log("outTemp111",outTemp);
            if(outTemp[m].value!=null && outTemp[m].value.noSaveFlag==true){
              outTemp[m].value=outTemp[m].value.noSaveDescribe;
            }
          }
        }

        let item = {};
        item.blue_script_ref = pageBlueScriptsTemp[i].blue_script_ref;
        if(typeof (pageBlueScriptsTemp[i].component_ref)=="undefined" || pageBlueScriptsTemp[i].component_ref==null){
          pageBlueScriptsTemp[i].component_ref="";
        }
        item.component_ref = pageBlueScriptsTemp[i].component_ref;
        item.zbx = pageBlueScriptsTemp[i].zbx;
        item.zby = pageBlueScriptsTemp[i].zby;

        item.type = pageBlueScriptsTemp[i].type;

        /**重置type(后续可删除)*/
        if(item.type==null || item.type==""){
          if(item.component_ref==""){
            item.type="blueScriptTool";
          }
          if(item.component_ref.indexOf("componentRef")==0 || item.component_ref.indexOf("frontEndComponentRef")==0){
            item.type="frontEndComponent";
          }
          if(item.component_ref.indexOf("buildIncomponentRef")==0){
            item.type="buildIncomponent";
          }
        }


        item.blue_script_id = pageBlueScriptsTemp[i].blue_script_id;
        item.name = pageBlueScriptsTemp[i].name;
        item.config_str = objectToString(pageBlueScriptsTemp[i].config);

        //item.blue_script_node_config_str= objectToString(pageBlueScriptsTemp[i].nodeConfig);
        //console.log("item2222",item);
        item.page_id = this.$route.query.page_id;
        pageBlueScripts.push(item);
      }
      param.pageBlueScripts = pageBlueScripts;
      console.log("saveAllPageBlueScript-param",param);
      commonExcuteRequest(axios, param, this.saveAllPageBlueScriptCallBack);
    },
    saveAllPageBlueScriptCallBack(result) {
      console.log("result:", result);
      if (result.state = "success") {
        //this.$message.success('保存成功！');
        //继续保存组件信息
        this.saveAllPageComponent();
      }
    },

    saveAllPageComponent() {

      console.log("saveAllPageComponent--this.pageComponents",this.pageComponents);

      let param = {};
      param.sql = "page_back.saveAllPageComponent";
      param.page_id = this.$route.query.page_id;

      let pageComponentsTemp = this.pageComponents;
      let pageComponents = [];
      for (let i = 0; i < pageComponentsTemp.length; i++) {
        let item = {};
        item.component_ref = pageComponentsTemp[i].component_ref;
        item.component_name = pageComponentsTemp[i].component_name;
        if(typeof (pageComponentsTemp[i].component_config)=="undefined" || pageComponentsTemp[i].component_config==null){
          item.component_config_str = objectToString({attr:{}});
        }else{
          item.component_config_str = objectToString(pageComponentsTemp[i].component_config);
        }


        item.component_id = pageComponentsTemp[i].component_id;
        item.page_block_ref = pageComponentsTemp[i].page_block_ref;
        item.layout_ref = pageComponentsTemp[i].layout_ref;
        item.page_id = this.$route.query.page_id;
        item.type= pageComponentsTemp[i].type;
        pageComponents.push(item);
      }
      param.pageComponents = pageComponents;
      let pageLayoutsTemp = this.pageLayouts;
      let pageLayouts = [];
      for (let i = 0; i < pageLayoutsTemp.length; i++) {
        let item = {};
        item.layout_ref = pageLayoutsTemp[i].layout_ref;
        item.layout_name = pageLayoutsTemp[i].layout_name;
        item.layout_config_str = objectToString(pageLayoutsTemp[i].layout_config);
        item.layout_type = pageLayoutsTemp[i].layout_type;
        item.page_block_ref = pageLayoutsTemp[i].page_block_ref;
        item.page_id = pageLayoutsTemp[i].page_id;
        pageLayouts.push(item);
      }
      param.pageLayouts = pageLayouts;
      console.log("saveAllPageComponent--param", param);

      commonExcuteRequest(axios, param, this.saveAllPageComponentCallBack);
    },
    saveAllPageComponentCallBack(result) {
      console.log("result:", result);
      if (result.state == "success") {
        this.$message.success('保存成功！');
      } else {
        this.$message.error('保存失败！');
      }
    },

    findAllPageBlock(){
      let param = {};
      param.sql = "page_centre_tree.findTopPageBlock";
      param.page_id = this.$route.query.page_id;
      commonSelectRequest(axios, param, this.findAllPageBlockCallBack);
    },
    findAllPageBlockCallBack(result){
      this.pageBlocks=result.objects;
    }

  },
  mounted() {
    this.page_id= this.$route.query.page_id;

    window.cbcPageInstance = getCurrentInstance();
    this.findAllPageBlock();
    this.findAllPageBlockLayout();
    this.findAllPageBlockComponent();
    this.findAllBlueScript();
    this.$nextTick(()=>{
      let elTabsItemArr=document.getElementsByClassName("el-tabs__item")
      //console.log("elTabsItemArr11",elTabsItemArr);
      for(let i=0;i<elTabsItemArr.length;i++){
        elTabsItemArr[i].style.color="rgba(255,255,255,0.6)";
      }
    });



  },

}
</script>

<style scoped>


.componentActiveCss {
  background: rgba(0, 0, 255, 0.3);
}

.blueScriptActiveCss {
  background: rgba(0, 0, 255, 0.3);
}

.el-tree {
  color: rgba(255, 255, 255, 0.65);
  --el-tree-node-hover-bg-color: rgba(0, 0, 255, 0.2);
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(0, 0, 255, 0.2) !important;
}

:deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
  padding-left: 20px;
}



.cbc-design-tabs .el-tabs__item{
  color: rgba(255, 255, 255, 0.6) !important;
}

/*

.cbc-design-tabs :deep(.el-tabs__item){
    color: rgba(255, 255, 255, 0.6);
}

.design-tabs{
  :deep(.el-tabs__item) {
    color: rgba(255, 0, 255, 0.6);
  }
}

.design-tabs  :deep(.el-tabs__item) {
  color: rgba(255, 0, 255, 0.6);
}
// 修改输入框长度案例
.newDalio {
	/deep/ .el-form-item {
		width: 200px !important;
		.el-form-item__content {
			width: calc(100% - 14px); // 根据自己需求修改
		}
	}
}


:deep(.el-tabs__item) {
  color: rgba(255, 255, 255, 0.6);
}
:deep(.el-tabs__header) {
  padding: 0;
  position: relative;
  margin: 0 0 0px;
}
 */



::-webkit-scrollbar { /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
  border-radius: 5px;
  background: #a8a9ab;
}

::-webkit-scrollbar-track { /*滚动条里面轨道*/
  border-radius: 5px;
  background: #f0f2f5;
}


.left {
  position: relative;
  height: 100vh;
  overflow: auto;
  float: left;
}

.right {
  position: relative;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}

.resize-box {
  position: absolute;
  top: 0;
  right: 7px;
  bottom: 0;
  left: 0;
  overflow: hidden;
}

.resize-bar {
  width: 65vw;
  height: inherit;
  resize: horizontal;
  cursor: ew-resize;
  opacity: 0;
  overflow: scroll;
}

/* 拖拽线 */
.resize-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  border-right: 1px solid #eee;
  border-left: 2px solid #bbb;
  pointer-events: none;
}

.resize-bar:hover ~ .resize-line,
.resize-bar:active ~ .resize-line {
  border-left: 1px dashed skyblue;
}

.resize-bar::-webkit-scrollbar {
  width: 50vw;
  height: inherit;
}

/* Firefox只有下面一小块区域可以拉伸 */
@supports (-moz-user-select: none) {
  .resize-bar:hover ~ .resize-line,
  .resize-bar:active ~ .resize-line {
    border-left: 1px solid #bbb;
  }

  .resize-bar:hover ~ .resize-line::after,
  .resize-bar:active ~ .resize-line::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: 0;
    right: -8px;
    /*background: url(./resize.svg);*/
    background-size: 100% 100%;
  }
}

.componentItemClass {
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: white;
  font-size: 20px;
  cursor: pointer
}

.componentItemClass:hover {
  background-color: rgba(0, 0, 255, 0.2);
}

.componentItemClass:active {
  background-color: rgba(0, 0, 255, 0.2);
}

.devConfigDiv {
  z-index: 9999;
  background-color: #fff;
  border-style: inset;
  width: 80%;
  height: 80%;
  margin: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

:deep(.el-divider__text) {
  position: absolute;
  background-color: rgb(40, 44, 52);
  padding: 0 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}




</style>