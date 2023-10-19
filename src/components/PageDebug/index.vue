<template>
  <div style="overflow: auto">

    <LayoutPageBlock  v-if="showFlag==true"
                          renderType="View"
                          :allPageComponents="allPageComponents"
                          :allPageLayouts="allPageLayouts"
                           :ref="layoutPageBlockRef" :pageBlockRef="topPageBlockRef" :page_id="page_id" :topPageBlockRef="topPageBlockRef"
                          :style="TopPageBlockStyle"></LayoutPageBlock>


    <div v-for="(item,index) in dialogArr">
      <el-dialog
          :append-to-body="true"
          :lock-scroll="false"
          :title="item.title"
          v-model="item.visible"
          :close-on-click-modal="false"
          :width="item.width">
        <LayoutPageBlock  :ref="'dialog_'+item.page_block_ref" :style="{'height':item.height}"
            :pageBlockRef="item.page_block_ref" renderType="View" :page_id="page_id" :topPageBlockRef="topPageBlockRef"></LayoutPageBlock>
      </el-dialog>
    </div>


    <div v-for="(item,index) in mapPopupArr">
      <div v-show="item.visible" :ref="'mapPopup_'+item.page_block_ref">
        <LayoutPageBlock :pageBlockRef="item.page_block_ref" :page_id="page_id" renderType="View" :topPageBlockRef="topPageBlockRef"></LayoutPageBlock>
        <div :style="divPopupStyle"></div>
      </div>


    </div>
  </div>



</template>

<script>
import {getCurrentInstance} from "vue";
import LayoutPageBlock from "@/common/component/PageRender/LayoutRender/LayoutPageBlock/index.vue";
import {pageMixin} from "./PreviewJS/pageMixin.js"
import {commonSelectRequest} from "../../common/js/request";
import axios from "axios";
import {objectToString,stringToObject} from "../../common/js/objStr";

import { useIntersectionObserver } from '@vueuse/core';

export default {
  mixins: [ pageMixin ],
  props: {
    model: {
      type: String,
      default: ''
    },
    page_id_from_parent: {
      type: String,
      default: ''
    },
    page_debug_flag_from_parent: {
      type: String,
      default: "false"
    },
    edit_component_flag: {
      type: Boolean,
      default: false
    },

  },
  computed: {
    "TopPageBlockStyle"() {
      console.log("TopPageBlockStyle--topPageBlockConfig",this.topPageBlockConfig);
      let styleObj={};
      styleObj.position="absolute";
      if(typeof (this.topPageBlockConfig.attr.background)!="undefined"){
        if(this.topPageBlockConfig.attr.background.type=="img" && this.topPageBlockConfig.attr.background.value!=""){
          let imgURL=window.cbcConfig.getFileUrl+"?uuid=" + this.topPageBlockConfig.attr.background.value + "&type=photo";
          styleObj.backgroundImage='url('+imgURL+')';
          styleObj.backgroundSize='100% 100%';
        }else if(this.topPageBlockConfig.attr.background.type=="color" && this.topPageBlockConfig.attr.background.value!=""){
          styleObj.background=this.topPageBlockConfig.attr.background.value;
        }
      }

      return styleObj;

    }
  },
  data() {
    return {
      //控制当前展示页面是bug页还是预览页
      layoutPageBlockRef:"debugLayoutPageBlockRef",
      dialogArr:[],
      mapPopupArr:[],
      divPopupStyle:"",
      topPageBlockRef: '',
      topPageBlockConfig:null,
      pageLayouts:[],
      pageBlueScripts: [],
      pageComponents: [],
      pageBlocks:[],
      indexFlag:0,

      page_model:'',

      pageLayoutsFlag:0,
      pageBlueScriptsFlag:0,
      pageComponentsFlag:0,
      pageBlocksFlag:0,

      currentInstance:null,


      page_id:'',
      pageDebugFlag:'false',
      showFlag: false,

      allPageLayouts:[],
      allPageComponents:[],
      

    }
  },

  created() {
    this.currentInstance=getCurrentInstance();
    console.log("page_id_from_parent",this.page_id_from_parent);
    if(this.model!="column"){
      this.page_id=this.$route.query.page_id;
      if(typeof (this.$route.query.pageDebugFlag)=="undefined"){
        this.pageDebugFlag=true;
      }else{
        this.pageDebugFlag=this.$route.query.pageDebugFlag;
      }
    }else{
      this.page_id=this.page_id_from_parent;
      this.pageDebugFlag=this.page_debug_flag_from_parent;
    }
    console.log("this.page_id",this.page_id);
    console.log("this.pageDebugFlag",this.pageDebugFlag);

    if(this.pageDebugFlag=="false" || this.pageDebugFlag==false){
      this.findTopPageBlockRef();
    }else{
      this.topPageBlockRef=window.cbcPageInstance.data.topPageBlock.page_block_ref;
      if(typeof (window.cbcDebugPageInstance)=="undefined"){
        window.cbcDebugPageInstance={}
      }
      window.cbcDebugPageInstance[this.topPageBlockRef]= this.currentInstance;
    }

    console.log("cbc-PageDebug--created");

    //全局参数初始化
    if(typeof (window.cbcGlobalSettings)=="undefined"){
      window.cbcGlobalSettings={};
    }
    if(typeof (window.cbcGlobalSettings.params)=="undefined"){
      window.cbcGlobalSettings.params={};
    }
    if(typeof (window.cbcGlobalSettings.components)=="undefined"){
      window.cbcGlobalSettings.components=[];
    }

    window["page"+this.page_id]={};
    window["page"+this.page_id].cbcDebugPageComponentsInstance=[];

  },
  watch: {},
  components: {
    "LayoutPageBlock": LayoutPageBlock
  },
  methods: {
    //查询顶层的pageBlockRef
    findTopPageBlockRef(){
      let param = {};
      param.sql = "page_centre_tree.findTopPageBlock";
      param.page_id = this.page_id;
      commonSelectRequest(axios, param, this.findTopPageBlockRefCallBack);
    },
    findTopPageBlockRefCallBack(result){
      console.log("findTopPageBlockRef--result",result);
      if(result.state=="success"){
        this.pageBlocks=result.objects;
        this.pageBlocksFlag=1;
          for(let i=0;i<this.pageBlocks.length;i++){
            this.pageBlocks[i].page_block_config=stringToObject(this.pageBlocks[i].page_block_config_str);
            if(this.pageBlocks[i].pid==null || this.pageBlocks[i].pid=="null" ){
              this.topPageBlockRef=this.pageBlocks[i].page_block_ref;
              this.topPageBlockConfig=stringToObject(this.pageBlocks[i].page_block_config_str);
              console.log("topPageBlockRefttr",this.topPageBlockRef);
              this.page_model=this.pageBlocks[i].page_model;
              console.log("this.page_model12321",this.page_model);
            }
          }
          //this.ToEventStartRun();
      }

      if(typeof (window.cbcDebugPageInstance)=="undefined"){
        window.cbcDebugPageInstance={}
      }
      window.cbcDebugPageInstance[this.topPageBlockRef] = this.currentInstance;
      this.allPageLayouts = window.cbcDebugPageInstance[this.topPageBlockRef].data.pageLayouts;
      console.log("pageDebug/index.vue--this.allPageLayouts",this.allPageLayouts);
      this.allPageComponents=window.cbcDebugPageInstance[this.topPageBlockRef].data.pageComponents;
      console.log("pageDebug/index.vue--this.allPageComponents",this.allPageComponents);
      console.log("findTopPageBlockRefCallBack--window.cbcDebugPageInstance[this.topPageBlockRef]",window.cbcDebugPageInstance[this.topPageBlockRef]);
    },
    //查询所有的组件
    findAllPageBlockComponent() {
      let param = {};
      param.sql = "page_block_component.findIncludeCode";
      param.page_id = this.page_id;
      commonSelectRequest(axios, param, this.findAllPageBlockComponentCallBack);
    },
    findAllPageBlockComponentCallBack(result) {
      console.log("findAllPageBlockComponent--result:", result);
      for (let i = 0; i < result.objects.length; i++) {
        result.objects[i].component_config = eval("(" + result.objects[i].component_config_str + ")");
        this.pageComponents.push(result.objects[i]);
      }
      console.log("findAllPageBlockComponent--this.pageComponents",this.pageComponents);

      console.log("this.edit_component_flag111",this.edit_component_flag);

      if(this.edit_component_flag==true){
        for(let i=0;i<this.pageComponents.length;i++){
          if(typeof (this.pageComponents[i].component_config.option.edit_component_flag)!="undefined"){
            this.pageComponents[i].component_config.option.edit_component_flag=true;
          }
        }
      }


      this.pageComponentsFlag=1;



      //this.ToEventStartRun();
    },
    //查询所有的布局组件
    findAllPageBlockLayout() {
      let param = {};
      param.sql = "page_block_layout.find";
      param.page_id = this.page_id;
      commonSelectRequest(axios, param, this.findAllPageBlockLayoutCallBack);
    },
    findAllPageBlockLayoutCallBack(result) {
      for (let i = 0; i < result.objects.length; i++) {
        result.objects[i].layout_config = eval("(" + result.objects[i].layout_config_str + ")")
        this.pageLayouts.push(result.objects[i]);
      }
      this.pageLayoutsFlag=1;
      //this.ToEventStartRun();
    },
    findAllBlueScript() {
      let param = {};
      param.sql = "page_blue_script.findForConfig";
      param.page_id = this.page_id;
      commonSelectRequest(axios, param, this.findAllBlueScriptCallBack);
    },
    //蓝图获取 备份
    findAllBlueScriptCallBack(result) {
      this.pageBlueScripts = [];
      //console.log("6666findAllBlueScript--result", result.objects);
      for (let i = 0; i < result.objects.length; i++) {
        let item={};
        item.name = result.objects[i].name;
        item.blue_script_ref = result.objects[i].blue_script_ref;
        item.component_ref = result.objects[i].component_ref;
        item.type=result.objects[i].type;
        item.blue_script_id=result.objects[i].blue_script_id;

        item.config=eval("(" + result.objects[i].config_str + ")");
        item.config.startPointFlag = item.config.startPointFlag;

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

        item.config.logic_config = eval("(" + item.config.logic_config_str + ")");
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
      this.pageBlueScriptsFlag=1;
      //this.ToEventStartRun();
      console.log("666611findAllBlueScript--this.pageBlueScripts", this.pageBlueScripts);
    },



    runDebug(){
      console.log("this.pageDebugFlag",this.pageDebugFlag);
      if(this.pageDebugFlag=="false"){
        console.log("非调试页展示");
        //this.findTopPageBlockRef();
        this.findAllPageBlockLayout();
        this.findAllPageBlockComponent();
        this.findAllBlueScript();
      }else{
        console.log("调试页展示");
        //this.topPageBlockRef=window.cbcPageInstance.data.topPageBlock.page_block_ref;

        this.pageLayouts=window.cbcPageInstance.data.pageLayouts;
        this.pageBlueScripts=window.cbcPageInstance.data.pageBlueScripts;
        this.pageComponents=window.cbcPageInstance.data.pageComponents;
        this.pageBlocks=window.cbcPageInstance.data.pageBlocks;
        console.log("调试页展示this.pageBlocks111",this.pageBlocks);
        for(let i=0;i<this.pageBlocks.length;i++){
          this.pageBlocks[i].page_block_config=stringToObject(this.pageBlocks[i].page_block_config_str);
          if(this.pageBlocks[i].pid==null || this.pageBlocks[i].pid=="null" ){
            this.topPageBlockConfig=stringToObject(this.pageBlocks[i].page_block_config_str);
            this.page_model=this.pageBlocks[i].page_model;
          }
        }
        this.pageBlocksFlag=1;
        this.pageLayoutsFlag=1;
        this.pageComponentsFlag=1;
        this.pageBlueScriptsFlag=1;
      }
    },
    ToEventStartRun(){

      console.log("ToEventStartRun",this.topPageBlockRef,this.pageBlocksFlag,this.pageLayoutsFlag,this.pageComponentsFlag,this.pageBlueScriptsFlag);
      console.log("ToEventStartRun-this.pageLayouts",this.pageLayouts);
      console.log("ToEventStartRun-this.pageComponents",this.pageComponents);
      if(this.topPageBlockRef!='' && this.pageBlocksFlag==1 && this.pageLayoutsFlag==1 && this.pageComponentsFlag==1 && this.pageBlueScriptsFlag==1) {
        console.log("ToEventStartRun222");
        console.log("topPageBlockRef111555",this.topPageBlockRef);
        this.showFlag=true;
        let the=this;

        this.$nextTick(()=>{
          //console.log("this.layoutPageBlockRef12321",the.layoutPageBlockRef);
          //console.log("this.$refs12321",the.$refs);
          let topPageBlockRefObject=the.$refs[the.layoutPageBlockRef];
          //console.log("topPageBlockRefObject12321",topPageBlockRefObject);
          const { stop } =  useIntersectionObserver(topPageBlockRefObject, ([{ isIntersecting }]) => {

            console.log('cbc-检测元素可见性', isIntersecting);
            // 需求：如果目标元素进入可视区，就发送请求，并停止检测
            if (isIntersecting) {
              //debugger
              // 当目标元素进入可视区域时，才发送请求
              console.log('cbc-进入可视区，需要发送请求');
              the.eventStartRun();
              // 请求已发送，主动停止检查
              stop();
            }
          });

        });



      }else{
        this.indexFlag=this.indexFlag+1;
        if(this.indexFlag<100){
          //console.log("循环调用执行");
          window.setTimeout(this.ToEventStartRun,100);
        }
      }
    },
    eventStartRun(){
      console.log("eventStartRun--this.pageBlueScripts",this.pageBlueScripts);
      let EventStartRunBlueScriptTemp=null;
      for(let i=0;i<this.pageBlueScripts.length;i++){
        //重置所有输入点的运行状态
        if (typeof (this.pageBlueScripts[i].config.in_out_config.in) != "undefined") {
          for (let j = 0; j < this.pageBlueScripts[i].config.in_out_config.in.length; j++) {
            this.pageBlueScripts[i].config.in_out_config.in[j].ifProcessFlag = false;
          }
        }
        //重置所有输出点的运行状态
        if (typeof (this.pageBlueScripts[i].config.in_out_config.out) != "undefined") {
          for (let j = 0; j < this.pageBlueScripts[i].config.in_out_config.out.length; j++) {
            this.pageBlueScripts[i].config.in_out_config.out[j].ifProcessFlag = false;
          }
        }

        if(this.pageBlueScripts[i].blue_script_id =="EventStartRun"){
          EventStartRunBlueScriptTemp=this.pageBlueScripts[i];
        }

      }

      console.log("eventStartRun--事件开始运行bluescript：",EventStartRunBlueScriptTemp);
      if(EventStartRunBlueScriptTemp!=null){
        this.runBlueScriptProcess('', '', EventStartRunBlueScriptTemp);
      }else{
        this.runAllProcess();
      }

    },

  },

  mounted() {
    console.log("cbc-PageDebug--mounted");
    if(this.page_id!=""){
      this.runDebug();
    }
    if(this.page_id!=""){
      this.ToEventStartRun();
    }

    


  },


}
</script>

<style scoped>
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

:deep(.el-dialog__body) {
  padding-top: 0px;
  padding-right: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
  color: var(--el-text-color-regular);
  font-size: var(--el-dialog-content-font-size);
  word-break: break-all;
}



</style>
