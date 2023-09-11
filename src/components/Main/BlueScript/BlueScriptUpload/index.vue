<template>
  <div style="width: 100%;height: 100%;overflow-y:hidden">
    <div class="box left"  id="leftBox">
      <div class="resize-bar"></div>
      <div class="resize-line"></div>
      <div class="resize-box" id="resize-box">
        <el-radio-group v-model="changeType" label="size control"
                        style="position:absolute;right: 20px;top:10px;z-index: 1" @change="changeTypeFun">
          <el-radio-button label="blueScriptNodeConfig">蓝图节点配置</el-radio-button>
          <el-radio-button label="blueScriptInOutConfig">蓝图输入输出配置</el-radio-button>
          <el-radio-button label="blueScriptVisualizeConfig">蓝图配置项</el-radio-button>
        </el-radio-group>
        <MyMonacoEditor v-if="codeShowFlag==true && changeType=='blueScriptNodeConfig' && currentBlueScript!=null" :id="nodeCodeID" :code="currentBlueScript.blue_script_node_config_str" @update="updateConfig"></MyMonacoEditor>
        <MyMonacoEditor v-if="codeShowFlag==true && changeType=='blueScriptInOutConfig' && currentBlueScript!=null" :id="inoutCodeID"  :code="currentBlueScript.blue_script_in_out_config_str" @update="updateConfig"></MyMonacoEditor>
        <MyMonacoEditor v-if="codeShowFlag==true && changeType=='blueScriptVisualizeConfig' && currentBlueScript!=null"  :id="visualizeCodeID"  :code="currentBlueScript.blue_script_visualize_config_str" @update="updateConfig"></MyMonacoEditor>
      </div>
    </div>
    <div class="box right" id="rightDiv" style="background: #282c34;overflow-y:hidden">
      <el-button @click="saveBlueScriptInfo" style="position:absolute;left: 20px;top:11px;z-index: 1"
                 type="primary">保存
      </el-button>
      <el-button @click="returnFun" style="position:absolute;left: 80px;top:11px;z-index: 1">返回
      </el-button>

      <div id="container" style="width: 100%;height: 100%;margin-top: 5px"></div>

    </div>
  </div>
</template>

<script>
import MyMonacoEditor from '../../../../common/component/CodeEditor/MyMonacoEditor/index.vue'
import {commonExcuteRequest, commonSelectRequest} from "../../../../common/js/request.js";
import axios from "axios";
import {js_beautify} from "js-beautify";
import {Graph, Shape, Edge} from '@antv/x6'
import elementResizeDetectorMaker from "element-resize-detector";
export default {
  name: 'BlueScriptUpload',
  props: {},
  components: {
    MyMonacoEditor
  },
  data() {
    return {
      changeType:'blueScriptNodeConfig',
      currentBlueScript: null,
      graph: null,
      currentNode:null,
      nodeCodeID:"nodeCodeID",
      inoutCodeID:"inoutCodeID",
      visualizeCodeID:"visualizeCodeID",
      logicCodeID:"logicCodeID",
      codeShowFlag:false,

    }
  },
  created() {

  },

  methods: {


    updateConfig(code){
      if(this.changeType=="blueScriptNodeConfig"){
        this.currentBlueScript.blue_script_node_config_str=code;
      }else if(this.changeType=="blueScriptInOutConfig"){
        this.currentBlueScript.blue_script_in_out_config_str=code;
      }else if(this.changeType=="blueScriptVisualizeConfig"){
        this.currentBlueScript.blue_script_visualize_config_str=code;
      }
      this.deleteNode();
      this.addNode();
    },
    saveBlueScriptInfo(){
      let type=this.GetQueryString("type");
      if(type=="component"){
        //表单验证后执行
        let param = {};
        param.sql = "page_component.updateBlueScriptConfig";
        param.blue_script_node_config_str=this.currentBlueScript.blue_script_node_config_str;
        param.blue_script_in_out_config_str=this.currentBlueScript.blue_script_in_out_config_str;
        param.blue_script_visualize_config_str=this.currentBlueScript.blue_script_visualize_config_str;
        param.component_id=this.GetQueryString("blue_script_type");
        commonExcuteRequest(window.axios, param, this.saveBlueScriptInfoCallBack);
      }else if(type=="bluescript"){
        //表单验证后执行
        let param = {};
        param.sql = "page_blue_script_tools.updateBlueScriptConfig";
        param.blue_script_node_config_str=this.currentBlueScript.blue_script_node_config_str;
        param.blue_script_in_out_config_str=this.currentBlueScript.blue_script_in_out_config_str;
        param.blue_script_visualize_config_str=this.currentBlueScript.blue_script_visualize_config_str;


        param.blue_script_type=this.GetQueryString("blue_script_type");
        commonExcuteRequest(window.axios, param, this.saveBlueScriptInfoCallBack);
      }



    },
    saveBlueScriptInfoCallBack(result){
      if (result.state == "success") {
        this.$message.success('修改成功！');
      }
    },
    returnFun(){

    },
    changeTypeFun(){

    },
    findBlueScriptInfoByComponentType(){
      let param = {};
      param.sql = "page_component.find";
      param.component_id = this.GetQueryString("blue_script_type");
      commonSelectRequest(axios, param, this.findBlueScriptInfoByComponentTypeCallBack);
    },
    findBlueScriptInfoByComponentTypeCallBack(result){
      if(result.objects.length>0){
        this.currentBlueScript=result.objects[0];
        //美化js代码
        this.currentBlueScript.blue_script_node_config_str=js_beautify(this.currentBlueScript.blue_script_node_config_str);
        this.currentBlueScript.blue_script_in_out_config_str=js_beautify(this.currentBlueScript.blue_script_in_out_config_str);
        this.currentBlueScript.blue_script_visualize_config_str=js_beautify(this.currentBlueScript.blue_script_visualize_config_str);
        console.log("当前currentBlueScript",this.currentBlueScript);
        this.initGragh();
      }
    },
    findBlueScriptInfoByBlueScriptType(){
      let param = {};
      param.sql = "page_blue_script_tools.find";
      param.blue_script_type = this.GetQueryString("blue_script_type");
      commonSelectRequest(axios, param, this.findBlueScriptInfoByTypeCallBack);
    },
    findBlueScriptInfoByTypeCallBack(result){
      if(result.objects.length>0){
        this.currentBlueScript=result.objects[0];
        //美化js代码
        this.currentBlueScript.blue_script_node_config_str=js_beautify(this.currentBlueScript.blue_script_node_config_str);
        this.currentBlueScript.blue_script_in_out_config_str=js_beautify(this.currentBlueScript.blue_script_in_out_config_str);
        this.currentBlueScript.blue_script_visualize_config_str=js_beautify(this.currentBlueScript.blue_script_visualize_config_str);
        console.log("当前currentBlueScript",this.currentBlueScript);
        this.initGragh();
      }
    },

    GetQueryString(name){
      console.log("window.location1",window.location);
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      let search=window.location.href.split("?")[1];
      var r = search.match(reg);
      if(r!=null)return  unescape(r[2]); return null;
    },
    initGragh(){
      this.graph = new Graph({
        container: document.getElementById('container'),
        grid: true,
        autoResize:true,
        width: 1500,
        height: 900,
      });
      this.addNode();
    },

    deleteNode(){
      this.graph.removeNode(this.currentNode);
      this.currentNode=null;
    },

    addNode(){
      if(this.currentBlueScript.blue_script_node_config_str==""){
        return;
      }
      let nodeConfig = eval("(" + this.currentBlueScript.blue_script_node_config_str + ")");
      nodeConfig.id = "blueScriptRef-" + window.cbcuuid();
      console.log("this.graph：11",this.graph);
      nodeConfig.x = this.graph.getGraphArea().x+100;
      nodeConfig.y = this.graph.getGraphArea().y+100;
      //console.log("this.currentBlueScript885",this.currentBlueScript);
      if(typeof (this.currentBlueScript.blue_script_name)=="undefined"){
        nodeConfig.label = this.currentBlueScript.component_name;
      }else{
        nodeConfig.label = this.currentBlueScript.blue_script_name;
      }
      this.currentNode = this.graph.addNode(nodeConfig);
      this.currentNode.ref = nodeConfig.id;
      let obj={};
      obj.config={};
      if(this.currentBlueScript.blue_script_in_out_config_str==""){
        return;
      }
      obj.config.param=eval("(" + this.currentBlueScript.blue_script_in_out_config_str + ")");
      this.currentNode = this.addPort(this.currentNode, obj.config);
    },
    addPort(node, config) {
      //console.log("param114", param);
      let param = config.param;
      let inParams = param.in;
      if (typeof (inParams) != "undefined") {
        for (let i = 0; i < inParams.length; i++) {
          if(inParams[i].show==true){
            if (inParams[i].type == "event" ) {
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
            }else if(inParams[i].type == "function"){
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
          if(outParams[i].show==true) {
            if (outParams[i].type == "event" || outParams[i].type == "function") {
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


  },
  mounted() {
    let type=this.GetQueryString("type");
    console.log("type1232",type);
    if(type=="component"){
      this.findBlueScriptInfoByComponentType();
    }else if(type=="bluescript"){
      this.findBlueScriptInfoByBlueScriptType();
    }

    const erd = elementResizeDetectorMaker();
    let the=this;
    erd.listenTo(document.getElementById("resize-box"), element => {
      the.$nextTick(() => {
        console.log("窗口变化4");
        the.codeShowFlag=false;
        the.$nextTick(() => {
          the.codeShowFlag=true;
        });
      });
    });


  }
}
</script>


<style>
.el-tabs__item {
  padding: 0 20px;
  height: var(--el-tabs-header-height);
  box-sizing: border-box;
  line-height: var(--el-tabs-header-height);
  display: inline-block;
  list-style: none;
  font-size: var(--el-font-size-base);
  font-weight: 500;
  color: #ffffff;
  position: relative;
}
.el-tabs__content {
  overflow: hidden;
  position: relative;
  height: 100%;
}


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
  overflow-x: hidden;
}

.resize-bar {
  width: 60vw;
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
  border-right: 3px solid #eee;
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

</style>

