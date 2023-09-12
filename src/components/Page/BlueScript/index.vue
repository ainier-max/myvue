<template>
  <div>
    <div id="container" style="width: 1500px;height: 900px;margin-top: 5px">

    </div>

    <div v-if="menuFlag" :style="menuStyle">
      <div style="height: 5px"></div>
      <div class="menuItemClass" style="padding-left: 20px;padding-top: 5px;padding-bottom: 5px;cursor:pointer" @click="menuItemDelete">删除</div>
      <div class="menuItemClass" style="padding-left: 20px;padding-top: 5px;padding-bottom: 5px;cursor:pointer" @click="menuClose">关闭</div>
      <div style="height: 5px"></div>
    </div>
  </div>



</template>

<script>

import {Graph, Shape, Edge} from '@antv/x6'
import {
  commonExcuteRequest,
  commonSelectRequest,
  commonSelectRequestAndOtherParam,
  commonExcuteRequestAndOtherParam
} from "@/common/js/request.js";
import axios from "axios";
import {getCurrentInstance} from "vue";

import {objectToString} from "@/common/js/objStr.js";

import insertCss from 'insert-css'
import pathConfigArr from '@/buildin/pathConfigArr.js'
import {js_beautify} from "js-beautify";

export default {
  props: {},
  data() {
    return {
      graph: null,
      waitFlag: true,//表示等待全部输入完成
      debugProcessVisible: false,
      currentNode: null,
      rightCheckedNode:null,
      menuStyle:"",
      menuFlag:false,
    };
  },


  components: {},
  methods: {
    menuItemDelete(){
      if(this.rightCheckedNode!=null){
        console.log("menuItemDelete--this.rightCheckedNode",this.rightCheckedNode);
        this.deleteBlueScriptItem(this.rightCheckedNode);
        this.menuFlag=false;
      }
    },
    menuClose(){
      this.menuFlag=false;
    },
    /**
    deleteBlueScriptItemByRef(ref) {
      for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
        if (window.cbcPageInstance.data.pageBlueScripts[i].blue_script_ref == blue_script_ref) {
          this.graph.removeNode(window.cbcPageInstance.data.pageBlueScripts[i].node)
          window.cbcPageInstance.data.pageBlueScripts.splice(i, 1);
          i = i - 1;
        }
      }
    },
     */
    deleteBlueScriptItem(item) {
      console.log("deleteBlueScriptItem--item",item);
      // item 为被选中的元素体
      for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
        if (window.cbcPageInstance.data.pageBlueScripts[i].blue_script_ref == item.blue_script_ref) {
          //console.log("deleteBlueScriptItem--pageBlueScripts[i].getChildren", window.cbcPageInstance.data.pageBlueScripts[i].node.getChildren());
          //删除子节点
          let childrenTemp=window.cbcPageInstance.data.pageBlueScripts[i].node.getChildren();
          console.log("window.cbcPageInstance.data.pageBlueScripts[i]114",window.cbcPageInstance.data.pageBlueScripts);
          if(typeof (window.cbcPageInstance.data.pageBlueScripts[i])!="undefined"){
            this.graph.removeNode(window.cbcPageInstance.data.pageBlueScripts[i].node);
            window.cbcPageInstance.data.pageBlueScripts.splice(i, 1);
            i = i - 1;
          }


          console.log("deleteBlueScriptItem--childrenTemp",childrenTemp);
          if(childrenTemp!=null){
            for(let m=0;m<childrenTemp.length;m++){
              this.deleteBlueScriptItem(childrenTemp[m]);
            }
          }

        }
      }
    },


    addBlueScriptByComponent(item) {
      console.log("addBlueScriptByComponent--item", item);
      item.blue_script_ref = "blueScriptRef-" + window.cbcuuid();
      item.component_ref = item.component_ref;
      item.label = item.component_name;
      item.startPointFlag = false;
      console.log("pathConfigArr", pathConfigArr);
     
      if(item.type=="buildInComponent"){
        for (let i = 0; i < pathConfigArr.length; i++){
          console.log("pathConfigArr[i].type", pathConfigArr[i].type);
          console.log("item.type",item.component_id);
          if(pathConfigArr[i].type==item.component_id){
            let optionPath="../../../buildin/"+pathConfigArr[i].optionPath;
            import(/* @vite-ignore */optionPath)
                .then(option => {
                  console.log("addBlueScriptByComponent--settings",option);
                  item.blue_script_visualize_config_str=objectToString(option.default.blue_script_visualize_config);
                  item.blue_script_in_out_config_str=objectToString(option.default.blue_script_in_out_config);
                  item.blue_script_node_config_str = objectToString(option.default.blue_script_node_config);
                  console.log("objectToString(option.default.logic_config)",objectToString(option.default.logic_config));
                  item.blue_script_logic_config_str =js_beautify(objectToString(option.default.logic_config));
                  console.log("addBlueScriptByComponent--item",item);
                  this.addBlueScriptByAdd(item);
                });
          }
        }

      }else{
        this.addBlueScriptByAdd(item);
      }


    },


    addBlueScriptByTree(item) {
      console.log("item11113", item);
      var param = {};
      param.sql = "page_blue_script_tools.find";
      param.blue_script_id = item.blue_script_id;
      commonSelectRequestAndOtherParam(axios, param, this.addBlueScriptByTreeCallBack, item);
      //this.addBlueScript(item);
    },
    addBlueScriptByTreeCallBack(result, item) {
      if (result.objects.length > 0) {
        item.blue_script_ref = "blueScriptRef-" + window.cbcuuid();
        item.component_ref = "";
        item.label = item.label;
        if(item.blue_script_id=="EventStartRun"){
          item.startPointFlag = true;
        }else{
          item.startPointFlag = false;
        }
        item.blue_script_in_out_config_str = result.objects[0].blue_script_in_out_config_str;
        item.blue_script_visualize_config_str = result.objects[0].blue_script_visualize_config_str;
        item.blue_script_logic_config_str = result.objects[0].blue_script_logic_config_str;
        item.blue_script_node_config_str = result.objects[0].blue_script_node_config_str;
        this.addBlueScriptByAdd(item);
      }
    },

    addBlueScriptByAdd(item) {
      console.log("addBlueScriptByAdd--item", item);
      let pageBlueScriptTemp = {};
      pageBlueScriptTemp.blue_script_ref = item.blue_script_ref;
      pageBlueScriptTemp.component_ref= item.component_ref;
      pageBlueScriptTemp.label = item.label;
      pageBlueScriptTemp.name = item.label;
      pageBlueScriptTemp.type = item.type;

      if(item.type=="buildInComponent" || item.type=="frontEndComponent"){
        pageBlueScriptTemp.blue_script_id = item.component_id;
        console.log("addBlueScriptByAdd--pageBlueScriptTemp", pageBlueScriptTemp);
      }else if(item.type=="blueScriptTool"){
        pageBlueScriptTemp.blue_script_id = item.blue_script_id;
      }
      pageBlueScriptTemp.page_id = this.$route.query.page_id;
      pageBlueScriptTemp.config_str = "";
      pageBlueScriptTemp.config = {};
      pageBlueScriptTemp.config.settings= {};

      pageBlueScriptTemp.config.startPointFlag = item.startPointFlag;//默认非起点

      pageBlueScriptTemp.config.in_out_config = eval("(" + item.blue_script_in_out_config_str + ")");
      pageBlueScriptTemp.config.visualize_config = eval("(" + item.blue_script_visualize_config_str + ")");
      pageBlueScriptTemp.config.node_config = eval("(" + item.blue_script_node_config_str + ")");

      pageBlueScriptTemp.config.logic_config_str = item.blue_script_logic_config_str;
      pageBlueScriptTemp.config.logic_config = eval("(" + pageBlueScriptTemp.config.logic_config_str + ")");
      //初始化配置项
      let settingsTemp=pageBlueScriptTemp.config.visualize_config.settings;
      for(let i=0;i<settingsTemp.length;i++){
        if(settingsTemp[i]=="RelevanceLayout"){
          pageBlueScriptTemp.config.settings.RelevanceLayout={};
        }
        if(settingsTemp[i]=="RelevanceBlock"){
          pageBlueScriptTemp.config.settings.RelevanceBlock={};
        }
        if(settingsTemp[i]=="RelevanceComponents"){
          pageBlueScriptTemp.config.settings.RelevanceComponents=[];
        }
        if(settingsTemp[i]=="RelevanceBlueScriptsRefresh"){
          pageBlueScriptTemp.config.settings.RelevanceBlueScriptsRefresh=[];
        }
        if(settingsTemp[i]=="RelevancePortSetProcessFlagToFalse"){
          pageBlueScriptTemp.config.settings.RelevancePortSetProcessFlagToFalse=[];
        }
        if(settingsTemp[i]=="GetValueFromObjectSetting"){
          pageBlueScriptTemp.config.settings.GetValueFromObjectSetting='';
        }
        if(settingsTemp[i]=="GetValueFromArraySetting"){
          pageBlueScriptTemp.config.settings.GetValueFromArraySetting='';
        }
        if(settingsTemp[i]=="SetGlobalSettingsField"){
          pageBlueScriptTemp.config.settings.SetGlobalSettingsField='';
        }
        if(settingsTemp[i]=="RelevanceGlobalSettingParamField"){
          pageBlueScriptTemp.config.settings.RelevanceGlobalSettingParamField='';
        }



      }

      //创建蓝图节点端口（portID）
      //in类型(如果不存在，则创建portID)
      if (typeof (pageBlueScriptTemp.config.in_out_config.in) != "undefined") {
        for (let i = 0; i < pageBlueScriptTemp.config.in_out_config.in.length; i++) {
          if (typeof (pageBlueScriptTemp.config.in_out_config.in[i].portID) == "undefined") {
            pageBlueScriptTemp.config.in_out_config.in[i].portID = 'in_port_' + window.cbcuuid();
          }
        }
      }
      //out类型(如果不存在，则创建portID)
      if (typeof (pageBlueScriptTemp.config.in_out_config.out) != "undefined") {
        for (let i = 0; i < pageBlueScriptTemp.config.in_out_config.out.length; i++) {
          if (typeof (pageBlueScriptTemp.config.in_out_config.out[i].portID) == "undefined") {
            pageBlueScriptTemp.config.in_out_config.out[i].portID = 'out_port_' + window.cbcuuid();
          }
        }
      }

      if(item.type=="DataDeal"){
        pageBlueScriptTemp.config.execFunctionStr='{\r\n    dataDeal:function(param) {\r\n        console.log(\"dataDeal--param\",param);\r\n        return param;\r\n    }\r\n}';
      }

      pageBlueScriptTemp.logic_config = eval("(" + item.blue_script_logic_config_str + ")");
      pageBlueScriptTemp.config.logic_config_str = item.blue_script_logic_config_str;
      let nodeConfigTemp = eval("(" + item.blue_script_node_config_str + ")");



      nodeConfigTemp.id = pageBlueScriptTemp.blue_script_ref;
      //console.log("this.graph：44",this.graph);
      console.log("画布矩形",this.graph.getGraphArea());

      nodeConfigTemp.x = this.graph.getGraphArea().x + 20;
      nodeConfigTemp.y = this.graph.getGraphArea().y + 20;
      nodeConfigTemp.label = item.label;
      pageBlueScriptTemp.config.node_config=nodeConfigTemp;
      let nodeTemp = this.graph.addNode(nodeConfigTemp);
      nodeTemp.blue_script_ref = pageBlueScriptTemp.blue_script_ref;
      nodeTemp = this.addPort(nodeTemp, pageBlueScriptTemp.config);
      if(pageBlueScriptTemp.config.startPointFlag==true){
        window.cbcBlueScriptInstance.ctx.addStartPointFlag(nodeTemp, pageBlueScriptTemp.config);
      }
      pageBlueScriptTemp.node = nodeTemp;
      //pageBlueScriptTemp.zbx = nodeConfigTemp.x;
      //pageBlueScriptTemp.zby = nodeConfigTemp.y;
      //添加
      if (typeof (item.component_config) != "undefined" && typeof (item.component_config.dataset) != "undefined") {
        pageBlueScriptTemp.config.dataSet = {};
        pageBlueScriptTemp.config.dataSet.data = item.component_config.dataset.data;
        pageBlueScriptTemp.config.dataSet.fields = item.component_config.dataset.fields;
        pageBlueScriptTemp.config.dataSet.metrics = item.component_config.dataset.metrics;
        if (typeof (item.component_config.dataset.dimensions) != "undefined") {
          pageBlueScriptTemp.config.dataSet.dimensions = item.component_config.dataset.dimensions;
        }
      }
      window.cbcPageInstance.data.pageBlueScripts.push(pageBlueScriptTemp);
      console.log("addBlueScriptByAdd--window.cbcPageInstance.data.pageBlueScripts",window.cbcPageInstance.data.pageBlueScripts);
    },




    showAllEdge() {
      for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
        this.addEdge(window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config);
      }
    },
    addEdge(param) {

      //console.log("addEdge--param123", param);
      if (typeof (param.out) != "undefined") {
        for (let i = 0; i < param.out.length; i++) {
          //console.log("444456",param.out[i].connectedTargetArr);
          if (typeof (param.out[i].connectedTargetArr) != "undefined") {
            for (let j = 0; j < param.out[i].connectedTargetArr.length; j++) {
              console.log("this.graph.getNodes()1111",this.graph.getNodes());
              console.log("param.out[i].connectedTargetArr[j]1111",param.out[i].connectedTargetArr[j]);

              let flagTemp=0;
              for(let m=0;m<this.graph.getNodes().length;m++){
                if(this.graph.getNodes()[m].id==param.out[i].connectedTargetArr[j].cell){
                  flagTemp=1;
                }
              }
              //node点存在才添加edge
              if(flagTemp==1){
                this.graph.addEdge({
                  zIndex: 10,
                  source: param.out[i].connectedSource,
                  target: param.out[i].connectedTargetArr[j],
                  router: {
                    name: 'metro',
                  },
                  attrs: {
                    line: {
                      /**
                       stroke: '#1890ff',
                       strokeDasharray: 5,
                       targetMarker: 'classic',
                       style: {
                      animation: 'ant-line 30s infinite linear',
                    },
                       */
                      stroke: '#ffffff',
                      strokeWidth: 1,
                      //strokeDasharray: 5,
                      targetMarker: {
                        name: 'classic',
                        size: 7,
                      },
                    },
                  },
                })

              }


            }
          }
        }
      }

    },
    addStartPointFlag(node, config) {
      console.log("addStartPointFlag--node",node);
      node.addTools({
        name: 'button',
        args: {
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              attrs: {
                r: 12,
                stroke: '#fe854f',
                strokeWidth: 2,
                fill: 'white',
                cursor: 'pointer',
              },
            },
            {
              tagName: 'text',
              textContent: '起',
              selector: 'icon',
              attrs: {
                fill: '#fe854f',
                fontSize: 10,
                textAnchor: 'middle',
                pointerEvents: 'none',
                y: '0.3em',
              },
            },
          ],
          x: '100%',
          y: '100%',
          offset: {x: -30, y: -20},
        },
      });
      return node;
    },
    removeStartPointFlag(node) {
      node.removeTool("button");
    },

    addPort(node, config) {
      //console.log("param114", param);
      let param = config.in_out_config;
      let inParams = param.in;
      if (typeof (inParams) != "undefined") {
        for (let i = 0; i < inParams.length; i++) {
          if (inParams[i].show == true) {
            if (inParams[i].type == "event") {
              node.addPort({
                key: inParams[i].key,
                id: inParams[i].portID,
                group: 'in',
                markup: [
                  {
                    tagName: 'rect',
                    selector: 'rect',
                  },
                ],
                attrs: {
                  rect: {
                    magnet: true,
                    stroke: '#31d0c6',
                    fill: '#ffffff',
                    strokeWidth: 2,
                    width: 10,
                    height: 10,
                    x: -5,
                    y: -5,
                  },
                  text: {
                    text: inParams[i].label, // 标签文本
                    fill: 'rgba(255,255,255,0.8)',
                    fontSize: 12,    // 文字大小
                  },
                },
              })
            } else if(inParams[i].type == "function"){
              node.addPort({
                key: inParams[i].key,
                id: inParams[i].portID,
                group: 'in',
                args: { angle: -90 },
                markup: [
                  {
                    tagName: 'path',
                    selector: 'path',
                  },
                ],
                attrs: {
                  text: {
                    text: inParams[i].label, // 标签文本
                    fill: 'rgba(255,255,255,0.8)',
                    fontSize: 12,    // 文字大小
                  },
                  path: {
                    d: 'M -6 -8 L 0 8 L 6 -8 Z',
                    magnet: true,
                    fill: 'white',
                  },
                },
              })
            }else {
              //console.log("111：",inParams[i].label);
              node.addPort({
                key: inParams[i].key,
                id: inParams[i].portID,
                group: 'in',
                attrs: {
                  text: {
                    text: inParams[i].label, // 标签文本
                    fill: 'rgba(255,255,255,0.8)',
                    fontSize: 12,    // 文字大小
                  },
                },
              })
            }

          }
        }
      }

      //输出端口
      let outParams = param.out;
      if (typeof (outParams) != "undefined") {
        for (let i = 0; i < outParams.length; i++) {
          //console.log("outParams", outParams[i]);
          if (outParams[i].show == true) {
            if (outParams[i].type == "event") {
              node.addPort({
                key: outParams[i].key,
                id: outParams[i].portID,
                group: 'out',
                markup: [
                  {
                    tagName: 'rect',
                    selector: 'rect',
                  },
                ],
                attrs: {
                  rect: {
                    magnet: true,
                    stroke: '#31d0c6',
                    fill: '#ffffff',
                    strokeWidth: 2,
                    width: 10,
                    height: 10,
                    x: -5,
                    y: -5,
                  },
                  text: {
                    text: outParams[i].label, // 标签文本
                    fill: 'rgba(255,255,255,0.8)',
                    fontSize: 12,    // 文字大小
                  },
                },
              })

            } else {
              node.addPort({
                key: outParams[i].key,
                id: outParams[i].portID,
                group: 'out',
                attrs: {
                  text: {
                    text: outParams[i].label, // 标签文本
                    fill: 'rgba(255,255,255,0.8)',
                    fontSize: 12,    // 文字大小
                  },
                },
              })
            }

          }
        }
      }

      return node;
    },

    debugProcess() {
      console.log("展示测试页面");
      this.debugProcessVisible = true;
    },


    getAllBlueScript(){
      let pageBlueScriptsTemp=window.cbcPageInstance.data.pageBlueScripts;
      console.log("getAllBlueScript--pageBlueScriptsTemp",pageBlueScriptsTemp);
      for(let i=0;i<pageBlueScriptsTemp.length;i++){

        //赋值蓝图新名称
        let pageComponentsTemp=window.cbcPageInstance.data.pageComponents;
        console.log("getAllBlueScript--pageComponentsTemp",pageComponentsTemp);
        /**
        for(let j=0;j<pageComponentsTemp.length;j++){
          if(pageComponentsTemp[j].component_ref==pageBlueScriptsTemp[i].component_ref){
            pageBlueScriptsTemp[i].config.node_config.label = pageComponentsTemp[j].component_name;
            pageBlueScriptsTemp[i].name=pageComponentsTemp[j].component_name;
          }
        }
         */

        pageBlueScriptsTemp[i].config.node_config.label = pageBlueScriptsTemp[i].name;
        console.log("getAllBlueScript--蓝图对象：",pageBlueScriptsTemp[i]);
        console.log("getAllBlueScript--蓝图配置node_config：",pageBlueScriptsTemp[i].config.node_config);

        let nodeTemp = this.graph.addNode(pageBlueScriptsTemp[i].config.node_config);
        nodeTemp.blue_script_ref = pageBlueScriptsTemp[i].blue_script_ref;
        nodeTemp.component_ref = pageBlueScriptsTemp[i].component_ref;
        nodeTemp = this.addPort(nodeTemp, pageBlueScriptsTemp[i].config);
        if (pageBlueScriptsTemp[i].config.startPointFlag == true) {
          //加载完成后，显示连线
          let the = this;
          this.$nextTick(() => {
            nodeTemp = the.addStartPointFlag(nodeTemp, pageBlueScriptsTemp[i].config);
          });
        }
        pageBlueScriptsTemp[i].node = nodeTemp;
        pageBlueScriptsTemp[i].zbx = pageBlueScriptsTemp[i].config.node_config.x;
        pageBlueScriptsTemp[i].zby = pageBlueScriptsTemp[i].config.node_config.y;
      }
      console.log("getAllBlueScript--window.cbcPageInstance.data.pageBlueScripts",window.cbcPageInstance.data.pageBlueScripts);
      //加载完成后，显示连线
      let the = this;
      this.$nextTick(() => {
        the.showAllEdge();
        window.cbcBlueScriptBlockTreeInstance.data.pageBlueScripts=window.cbcPageInstance.data.pageBlueScripts;
        //window.cbcPageInstance.ctx.showDebugProcessWin(true);
        the.showAllGroup();
      });
    },

    showAllGroup(){
      for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
        if(typeof (window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode)!="undefined"){
          for(let m=0;m<window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode.length;m++){
            for(let n=0;n<window.cbcPageInstance.data.pageBlueScripts.length; n++){
              if(window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode[m]==window.cbcPageInstance.data.pageBlueScripts[n].blue_script_ref){
                  window.cbcPageInstance.data.pageBlueScripts[i].node.addChild(window.cbcPageInstance.data.pageBlueScripts[n].node)
              }
            }
          }
        }
      }
    },



  },
  mounted() {

    let blueScriptConfig = window.cbcPageInstance.data.topPageBlock.page_block_blue_script_config;
    console.log("蓝图配置信息22225：", blueScriptConfig);

    let the = this;

    console.log("container对象大小",document.getElementById("container").offsetWidth);
    let widthTemp=parseInt(document.getElementById("container").style.width);
    let heightTemp=parseInt(document.getElementById("container").style.height);
    console.log("大小：",widthTemp,heightTemp);
    this.graph = new Graph({
      container: document.getElementById('container'),
      grid: true,
      autoResize: false,
      width: 1500,
      height: 900,

      embedding: {
        enabled: true,
        findParent({node}) {
          const bbox = node.getBBox()
          return this.getNodes().filter((node) => {
            const data = node.getData();
            if (data && data.parent) {
              const targetBBox = node.getBBox()
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        },
      },

      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: 'rounded',
        connectionPoint: 'boundary',
        createEdge() {
          return new Shape.Edge({
            router: {
              name: 'metro',
            },
            zIndex: 10,
            attrs: {
              line: {
                stroke: '#ffffff',
                strokeWidth: 1,
                targetMarker: {
                  name: 'classic',
                  size: 7,
                },
              },
            },
          })
        },
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl'],
      },

      panning: {
        enabled: true,
        modifiers: 'ctrl',
      },
    });
    //console.log("this.graph",this.graph);

    //this.graph.zoomTo(blueScriptConfig.attr.zoom);

    let centerObj = {
      x: blueScriptConfig.attr.x,
      y: blueScriptConfig.attr.y,
      width: blueScriptConfig.attr.width,
      height: blueScriptConfig.attr.height,
    }
    console.log("居中画布矩形",centerObj);
    console.log("this.graph555",this.graph)

    this.getAllBlueScript();

    this.$nextTick(()=>{


      //定位对象
      let pageBlueScriptsTemp=window.cbcPageInstance.data.pageBlueScripts;
      let componentToBlueScriptPositionObjTemp=window.cbcPageInstance.data.componentToBlueScriptPositionObj;
      console.log("定位对象：",componentToBlueScriptPositionObjTemp);
      if(componentToBlueScriptPositionObjTemp!=null){
        let indexTemp=0;
        for(let i=0;i<pageBlueScriptsTemp.length;i++){
          if(pageBlueScriptsTemp[i].component_ref==componentToBlueScriptPositionObjTemp.component_ref){
            //第一次定位即可
            if(indexTemp==0){
              console.log("定位对象",pageBlueScriptsTemp[i]);
              //定位
              let xTemp=pageBlueScriptsTemp[i].config.node_config.x;
              let yTemp=pageBlueScriptsTemp[i].config.node_config.y;
              console.log("定位对象xy",xTemp, yTemp);
              this.graph.centerPoint(xTemp+100,yTemp+200);
              //点击节点高亮
              pageBlueScriptsTemp[i].node.getAttrs().body.fill = 'rgba(95, 149, 255, 0.60)'
              pageBlueScriptsTemp[i].node.setAttrs(pageBlueScriptsTemp[i].node.getAttrs().body.fill);
              //window.cbcBlueScriptSettingsInstance.ctx.setCurrentBlueScript(pageBlueScriptsTemp[i].node);
              indexTemp=indexTemp+1;
            }
          }
        }
        if(indexTemp==0){
          the.graph.zoomToRect(centerObj);
        }
        window.cbcPageInstance.data.componentToBlueScriptPositionObj=null;
      }else{
        the.graph.zoomToRect(centerObj);
      }

    });


    this.graph.on('node:mouseenter', ({node}) => {
      node.addTools({
        name: 'boundary',
        args: {
          padding: 5,
          attrs: {
            fill: '#7c68fc',
            stroke: '#9254de',
            strokeWidth: 1,
            fillOpacity: 0.2,
          },
        },
      })
    })

    this.graph.on('node:mouseleave', ({node}) => {
      node.removeTool("boundary")
    });

    this.graph.on('node:contextmenu', ({e, x, y, node, view}) => {
      console.log("node右击e",e);
      the.rightCheckedNode=node;
      if(the.menuFlag==true){
        the.menuFlag=false;
      }
      the.menuStyle="position:fixed;left:"+e.clientX +"px;top:"+e.clientY +"px;background: #FFFFF0;width: 100px;";
      the.menuFlag=true;





    });



    this.graph.on('node:click', ({e, x, y, node, view}) => {
      console.log("当前选中的node:", node);
      the.currentNode = node;
      /***/
      let nodesTemp = this.graph.getNodes();
      for (let i = 0; i < nodesTemp.length; i++) {
        if (typeof (nodesTemp[i].data) != "undefined" && nodesTemp[i].data.parent == true) {
          nodesTemp[i].getAttrs().body.fill = 'rgb(255,251,230,0.6)';
          nodesTemp[i].setAttrs(nodesTemp[i].getAttrs().body.fill);
        } else {
          nodesTemp[i].getAttrs().body.fill = 'rgba(40, 44, 52,0.9)';
          nodesTemp[i].setAttrs(nodesTemp[i].getAttrs().body.fill);
        }
      }

      //点击节点高亮
      node.getAttrs().body.fill = 'rgba(95, 149, 255, 0.60)'
      node.setAttrs(node.getAttrs().body.fill);
      window.cbcBlueScriptSettingsInstance.ctx.setCurrentBlueScript(node);
    })

    this.graph.on('edge:mouseenter', ({edge}) => {
      /***/
      edge.addTools([
        'source-arrowhead',
        'target-arrowhead',
        {
          name: 'button-remove',
          args: {
            distance: -30,
          },
        },
      ])

    })
    this.graph.on('edge:mouseleave', ({edge}) => {
      /***/
      edge.removeTools()

    })
    this.graph.on('edge:removed', ({edge, options}) => {
      //console.log("edge",edge);
      console.log("要删除连接线的起点：", edge.animation.cell.source);
      console.log("要删除连接线的终点：", edge.animation.cell.target);
      for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
        if (window.cbcPageInstance.data.pageBlueScripts[i].blue_script_ref == edge.animation.cell.source.cell) {
          console.log("要删除连接线的起点（蓝图节点）", window.cbcPageInstance.data.pageBlueScripts[i]);
          //console.log("要删除连接线的输出port", portsTemp);
          /**
           let keyTemp = "";
           for (let j = 0; j < portsTemp.length; j++) {
            if (portsTemp[j].id == edge.animation.cell.source.port) {
              keyTemp = portsTemp[j].key;
            }
          }
           console.log("要删除连接线的输出key", keyTemp);
           */
          //重置连接状态
          console.log("更新要删除连接线的起点（蓝图节点）信息");
          for (let m = 0; m < window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.out.length; m++) {
            let outTemp = window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.out[m];

            if (typeof (outTemp.connectedTargetArr) != "undefined") {
              for (let n = 0; n < outTemp.connectedTargetArr.length; n++) {
                if (outTemp.connectedTargetArr[n].cell == edge.animation.cell.target.cell && outTemp.connectedTargetArr[n].port == edge.animation.cell.target.port) {
                  outTemp.connectedTargetArr.splice(n, 1);
                  n = n - 1;
                }
              }

              if (outTemp.connectedTargetArr.length == 0) {
                outTemp.connected = false;
                outTemp.connectedSource = {};
              }
            }
          }
        }
        if (window.cbcPageInstance.data.pageBlueScripts[i].blue_script_ref == edge.animation.cell.target.cell) {
          console.log("要删除连接线的终点（蓝图节点）", window.cbcPageInstance.data.pageBlueScripts[i]);
          console.log("更新要删除连接线的终点（蓝图节点）信息");
          for (let m = 0; m < window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.in.length; m++) {
            let inTemp = window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.in[m];
            if (inTemp.portID == edge.animation.cell.target.port) {
              inTemp.connected = false;
            }
          }
        }
      }
      console.log("连线删除后的window.cbcPageInstance.data.pageBlueScripts", window.cbcPageInstance.data.pageBlueScripts);
    })

    /**
     this.graph.on('node:embedded', ({ e, x, y, node, view ,previousParent,currentParent}) => {
      console.log("当前选中的node:",node);
      console.log("111",previousParent,currentParent);
    })
     */

    this.graph.on('edge:connected', ({isNew, edge}) => {
      //console.log("isNew, edge1123213 ",isNew, edge );
      if (isNew) {
        // 对新创建的边进行插入数据库等持久化操作
        //设置是否是已连接状态
        //设置sourc的port为true
        let valueTemp=null;
        for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
          //源头port  对应 in_out_config.out
          if (window.cbcPageInstance.data.pageBlueScripts[i].node.id == edge.source.cell) {
            for (let j = 0; j < window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.out.length; j++) {
              if (window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.out[j].portID == edge.source.port) {
                window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.out[j].connected = true;
                let sourceObj = edge.source;
                let targetObj = edge.target;
                window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.out[j].connectedSource = sourceObj;
                valueTemp=window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.out[j].value;

                /**
                 if (typeof (window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.out[j].connectedTargetArr) == "undefined") {
                  window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.out[j].connectedTargetArr = [];
                }
                 */
                //供后续叠加线
                console.log("window.cbcPageInstance.data.pageBlueScripts[i]99990:", window.cbcPageInstance.data.pageBlueScripts[i]);
                window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.out[j].connectedTargetArr.push(targetObj);
              }
            }
          }

        }
        for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
          //目标port  对应 in_out_config.in
          if (window.cbcPageInstance.data.pageBlueScripts[i].node.id == edge.target.cell) {
            for (let j = 0; j < window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.in.length; j++) {
              if (window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.in[j].portID == edge.target.port) {
                window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.in[j].connected = true;
                //目标输入端赋值
                window.cbcPageInstance.data.pageBlueScripts[i].config.in_out_config.in[j].value=valueTemp;
              }
            }
          }
        }

        console.log("window.cbcPageInstance.data.pageBlueScripts22222", window.cbcPageInstance.data.pageBlueScripts);
      }
    })

    insertCss(`
      @keyframes ant-line {
        to {
            stroke-dashoffset: -1000
        }
      }
    `);

    this.graph.on('node:moved', ({e, x, y, node, view}) => {
      //console.log(x,y);
      console.log("node", node);
      for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
        if (window.cbcPageInstance.data.pageBlueScripts[i].blue_script_ref == node.blue_script_ref) {
          let position = node.position();
          window.cbcPageInstance.data.pageBlueScripts[i].zbx = position.x;
          window.cbcPageInstance.data.pageBlueScripts[i].zby = position.y;
        }
      }
    });


    let ctrlPressed = false;
    const embedPadding = 20;

    //按住ctrl时，node可移出
    this.graph.on('node:embedding', (e) => {
      ctrlPressed = e.e.metaKey || e.e.ctrlKey
    });

    this.graph.on('node:embedded', (e) => {
      console.log("currentParent2",e.currentParent);
      ctrlPressed = false;
    });

    this.graph.on('node:change:parent', ({ node }) => {
      //console.log("node:change:parent--node",node);
      if(node.parent!=null){
        for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
          if(window.cbcPageInstance.data.pageBlueScripts[i].blue_script_ref == node.parent.blue_script_ref){
            //console.log("父节点node",window.cbcPageInstance.data.pageBlueScripts[i]);
            if(typeof (window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode)=="undefined"){
              window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode=[];
              window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode.push(node.blue_script_ref);
            }else{
              let flag=0;
              for(let m=0;m<window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode.length;m++){
                if(window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode[m]==node.blue_script_ref){
                  flag=1;
                }
              }
              if(flag==0){
                window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode.push(node.blue_script_ref);
              }
            }
          }
        }
      }else{
        for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
          if(typeof (window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode)!="undefined"){
            for(let m=0;m<window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode.length;m++){
              if(window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode[m]==node.blue_script_ref){
                window.cbcPageInstance.data.pageBlueScripts[i].config.childrenNode.splice(m,1);
                m=m-1;
              }
            }
          }
        }
      }

    })

    this.graph.on('node:change:size', ({node, options}) => {

      //console.log("node:change:size",node.getSize());

      for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
        if(node.blue_script_ref==window.cbcPageInstance.data.pageBlueScripts[i].blue_script_ref){
          console.log("node:change:size22",window.cbcPageInstance.data.pageBlueScripts[i]);
          window.cbcPageInstance.data.pageBlueScripts[i].config.node_config.width=node.getSize().width;
          window.cbcPageInstance.data.pageBlueScripts[i].config.node_config.height=node.getSize().height;
        }
      }

      if (options.skipParentHandler) {
        return
      }

      const children = node.getChildren();
      if (children && children.length) {
        node.prop('originSize', node.getSize())
      }
    })

    this.graph.on('node:change:position', ({node, options}) => {

      //console.log("node:change:position1",node);

      for (let i = 0; i < window.cbcPageInstance.data.pageBlueScripts.length; i++) {
        if (window.cbcPageInstance.data.pageBlueScripts[i].blue_script_ref == node.blue_script_ref) {
          let position = node.position();
          window.cbcPageInstance.data.pageBlueScripts[i].config.node_config.x= position.x;
          window.cbcPageInstance.data.pageBlueScripts[i].config.node_config.y = position.y;
        }
      }



      if (options.skipParentHandler || ctrlPressed) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originPosition', node.getPosition())
      }

      const parent = node.getParent()
      if (parent && parent.isNode()) {
        let originSize = parent.prop('originSize')
        if (originSize == null) {
          originSize = parent.getSize()
          parent.prop('originSize', originSize)
        }

        let originPosition = parent.prop('originPosition')
        if (originPosition == null) {
          originPosition = parent.getPosition()
          parent.prop('originPosition', originPosition)
        }

        let x = originPosition.x
        let y = originPosition.y
        let cornerX = originPosition.x + originSize.width
        let cornerY = originPosition.y + originSize.height
        let hasChange = false

        const children = parent.getChildren()
        if (children) {
          children.forEach((child) => {
            const bbox = child.getBBox().inflate(embedPadding)
            const corner = bbox.getCorner()

            if (bbox.x < x) {
              x = bbox.x
              hasChange = true
            }

            if (bbox.y < y) {
              y = bbox.y
              hasChange = true
            }

            if (corner.x > cornerX) {
              cornerX = corner.x
              hasChange = true
            }

            if (corner.y > cornerY) {
              cornerY = corner.y
              hasChange = true
            }
          })
        }
        if (hasChange) {
          parent.prop(
              {
                position: {x, y},
                size: {width: cornerX - x, height: cornerY - y},
              },
              {skipParentHandler: true},
          )
        }
      }
    })
    window.cbcBlueScriptInstance = getCurrentInstance();






  },
  created() {

  },
}
</script>

<style scoped>
:deep(.x6-graph) {
  position: absolute;
  outline: none;
  touch-action: none;
}

.menuItemClass{

}

.menuItemClass:hover{
  background: #C0D9D9;
}

</style>