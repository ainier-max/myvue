<template>
  <div :style="pageStyle" :id="idStr">
    <div style="color: red" v-if="testFlag">无内容......</div>
    <div v-for="(pageLayout, index) in pageLayouts" :style="pageLayoutStyle(pageLayout)" >
      <div  v-if="pageLayout.layout_type=='flex-column' || pageLayout.layout_type=='flex-row'"
            :style="{'height':'100%','display':'flex','flex-direction':pageLayout.layout_config.type}">
        <div v-for="(layout_component, index) in pageLayout.layout_config.blocks_components"
             :style="pageBlocksComponentsStyle(layout_component)">

            <span v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='frontEndComponent'" v-for="(componentInfo, index) in pageComponents">

              <LayoutComponent :ref="componentInfo.component_ref"
                               :topPageBlockRef="topPageBlockRef"
                               v-if="layout_component.type=='frontEndComponent' && layout_component.ref==componentInfo.component_ref"
                               :componentInfo="componentInfo"
                               :style="{'backgroundImage':'url('+pageLayout.layout_config.attr.backgroundImageURL+')','backgroundSize':'100% 100%'}">
              </LayoutComponent>

            </span>

          <!--展示内置组件
          <span v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='buildInComponent'">
            <LayoutBuildInComponent v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='buildInComponent'"
                                    :ref="layout_component.ref" :layoutComponentInfo="layout_component" :page_id="page_id"></LayoutBuildInComponent>
          </span>
          -->

          <!--展示布局类组件-->
          <span v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='layout'">
              <LayoutRenderView :pageLayoutRef="layout_component.ref"
                            :allPageComponents="allPageComponents"
                            :allPageLayouts="allPageLayouts" :pageDebugFlag="'false'" :topPageBlockRef="topPageBlockRef">
              </LayoutRenderView>
        </span>




          <!--展示内置类组件-->
          <span v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='buildInComponent'">
            <template v-for="(componentInfo, index) in pageComponents">
              <LayoutBuildInComponent v-if="layout_component.type=='buildInComponent' && layout_component.ref==componentInfo.component_ref"
                                      :componentInfo="componentInfo" :ref="layout_component.ref" :layoutComponentInfo="layout_component" :page_id="page_id"></LayoutBuildInComponent>
            </template>
          </span>

          <span v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='block'">
                  <LayoutPageBlockView v-if="topPageBlockRef!=''" :topPageBlockRef="topPageBlockRef" :page_id="page_id" :pageBlockRef="layout_component.ref"
                                        :style="{'backgroundImage':'url('+pageLayout.layout_config.attr.backgroundImageURL+')','backgroundSize':'100% 100%'}">
                  </LayoutPageBlockView>
            </span>

          <!--展示无组件的状态-->
          <span v-if="typeof (layout_component.type)=='undefined'">
              <!--
              <div v-if="typeof (pageLayout.layout_config.attr.backgroundImageURL)=='undefined' || pageLayout.layout_config.attr.backgroundImageURL==''"
                   style="width: 100%;height: 100%;background-image: linear-gradient(180deg,#274351,#1a2646);align:center;"></div>


              <div v-if="typeof (pageLayout.layout_config.attr.backgroundImageURL)!='undefined' && pageLayout.layout_config.attr.backgroundImageURL!=''"
                   :style="{'width': '100%','height': '100%','backgroundImage':'url('+pageLayout.layout_config.attr.backgroundImageURL+')','backgroundSize':'100% 100%'}"></div>
              -->
            </span>

        </div>
      </div>
    </div>


  </div>
</template>

<script>

import LayoutComponent from "../LayoutComponent/index.vue";
import elementResizeDetectorMaker from "element-resize-detector";
import {getCurrentInstance} from "vue";
import LayoutBuildInComponent from "../LayoutBuildInComponent/index.vue";

import LayoutRenderView from "../index.vue";

export default {
  name:"LayoutPageBlockView",
  props: {
    page_id: {
      type: String,
      default: ''
    },
    pageBlockRef: {
      type: String,
      default: ''
    },
    topPageBlockRef: {
      type: String,
      default: ''
    },

  },
  data() {
    return {
      pageBlock:null,
      pageLayouts:[],
      styleStr:'',
      pageComponents:[],
      idStr:'',
      oldAttr:{
        width:'',
        height:''
      },
      suitHeight:'30px',
      testFlag:false,
      showFlag:true,
      topPageBlockInstance:null,

      allPageComponents:null,
      allPageLayouts:null,


    }
  },
  components: {
    "LayoutComponent": LayoutComponent,
    "LayoutBuildInComponent":LayoutBuildInComponent,
    "LayoutRenderView":LayoutRenderView
  },
  computed: {
    pageStyle(){
      let styleTemp={};
      styleTemp.width="100%";
      console.log("window.cbcDebugPageInstance[this.topPageBlockRef]11112",window.cbcDebugPageInstance[this.topPageBlockRef]);
      if(this.topPageBlockInstance==null || this.pageBlock==null){
        styleTemp.height="100%";
      }else{
        console.log("pageStyle--page_model",this.topPageBlockInstance.data.page_model);
        if(this.topPageBlockInstance.data.page_model=="suit"){
          let element=document.getElementById(this.idStr);
          this.suitHeight=this.pageBlock.page_block_config.attr.height*element.clientWidth/this.pageBlock.page_block_config.attr.width+"px";
          styleTemp.height=this.suitHeight;
        }else{
          styleTemp.height="100%";
        }
      }
      styleTemp.position='relative';
      console.log("pageStyle--styleTemp",styleTemp);
      return styleTemp;
    },
    pageLayoutStyle() {
      return function (pageLayout) {
        let styleTemp={};
        if(pageLayout.layout_config.attr.background.type=="img" && pageLayout.layout_config.attr.background.value!=""){
          let imgURL=window.cbcConfig.getFileUrl+"?uuid=" + pageLayout.layout_config.attr.background.value + "&type=photo";
          styleTemp.backgroundImage='url('+imgURL+')';
          styleTemp.backgroundSize='100% 100%';
        }else if(pageLayout.layout_config.attr.background.type=="color" && pageLayout.layout_config.attr.background.value!=""){
          styleTemp.background=pageLayout.layout_config.attr.background.value;
        }
        styleTemp.position="absolute";
        styleTemp.left=pageLayout.layout_config.attr.xPer+'%';
        styleTemp.top=pageLayout.layout_config.attr.yPer+'%';
        styleTemp.width=pageLayout.layout_config.attr.wPer+'%';
        styleTemp.height=pageLayout.layout_config.attr.hPer+'%';
        styleTemp.zIndex=pageLayout.layout_config.attr.zIndex;
        return styleTemp;
      }
    },
    pageBlocksComponentsStyle(){
      return function (layout_component) {
        let styleTemp={};
        styleTemp.overflow="hidden";
        styleTemp.flexBasis=layout_component.span+'%';
        let paddingUnitTemp=layout_component.padding.unit;
        let marginUnitTemp=layout_component.padding.unit;
        styleTemp.padding=layout_component.padding.top+paddingUnitTemp+' '+layout_component.padding.right+paddingUnitTemp+' '+layout_component.padding.bottom+paddingUnitTemp+' '+layout_component.padding.left+paddingUnitTemp;
        styleTemp.margin=layout_component.margin.top+marginUnitTemp+' '+layout_component.margin.right+marginUnitTemp+' '+layout_component.margin.bottom+marginUnitTemp+' '+layout_component.margin.left+marginUnitTemp;

        if(layout_component.background.type=="img" && layout_component.background.value!=""){
          let imgURL=window.cbcConfig.getFileUrl+"?uuid=" + layout_component.background.value + "&type=photo";
          styleTemp.backgroundImage='url('+imgURL+')';
          styleTemp.backgroundSize='100% 100%';
        }else if(layout_component.background.type=="color" && layout_component.background.value!=""){
          styleTemp.background=layout_component.background.value;
        }

        return styleTemp;
      }

    }
  },

  created() {

    console.log("cbc-DebugLayoutPageBlock--created:",this.pageBlockRef);

    console.log("topPageBlockRefrrt",this.topPageBlockRef);
    this.idStr="id"+window.cbcuuid();
    console.log("window.cbcDebugPageInstancerrt",window.cbcDebugPageInstance);
    if(typeof (window.cbcDebugPageInstance)!="undefined" && typeof (window.cbcDebugPageInstance[this.topPageBlockRef])!="undefined"){
      this.topPageBlockInstance=window.cbcDebugPageInstance[this.topPageBlockRef];
      console.log("cbcthis.topPageBlockInstancerrt",this.topPageBlockInstance);
      this.allPageLayouts=window.cbcDebugPageInstance[this.topPageBlockRef].data.pageLayouts;
      this.allPageComponents=window.cbcDebugPageInstance[this.topPageBlockRef].data.pageComponents;
      this.getPageBlockComponentByRef();
    }else{

    }

  },
  methods: {


    //执行组件方法
    excuteComponentFun(paramObj){
      //this.$refs[paramObj.blueScript.component_ref][0].$refs[paramObj.component_ref][paramObj.label]();
      if(typeof (this.$refs[paramObj.blueScript.component_ref])!="undefined"){
        this.$refs[paramObj.blueScript.component_ref][0].excuteComponentFun(paramObj.label);
      }
    },
    getPageBlockComponentByRef() {
      //console.log("this.$parent.pageLayouts",this.$parent.pageLayouts);

      let pageComponentsTemp=this.topPageBlockInstance.data.pageComponents;
      for(let i=0;i<pageComponentsTemp.length;i++){
        if(pageComponentsTemp[i].page_block_ref==this.pageBlockRef){
          this.pageComponents.push(pageComponentsTemp[i]);
        }
      }
      console.log("getPageBlockComponentByRef--this.pageComponents",this.pageComponents);
      this.getPageBlockLayoutByRef();
    },
    getPageBlockLayoutByRef(){
      for(let i=0;i<this.topPageBlockInstance.data.pageLayouts.length;i++){
        let pageLayoutsTemp=this.topPageBlockInstance.data.pageLayouts[i];
        if(pageLayoutsTemp.page_block_ref==this.pageBlockRef){
          if(typeof (pageLayoutsTemp.layout_config.childFlag)!="undefined" && pageLayoutsTemp.layout_config.childFlag==true){

          }else{
            let styleStrTemp="";
            styleStrTemp+="position:absolute;"
            styleStrTemp+="left:"+pageLayoutsTemp.layout_config.attr.xPer+"%;";
            styleStrTemp+="top:"+pageLayoutsTemp.layout_config.attr.yPer+"%;";
            styleStrTemp+="width:"+pageLayoutsTemp.layout_config.attr.wPer+"%;";
            styleStrTemp+="height:"+pageLayoutsTemp.layout_config.attr.hPer+"%;";
            pageLayoutsTemp.styleStr=styleStrTemp;
            this.pageLayouts.push(pageLayoutsTemp);
          }
        }
      }
      console.log("getPageBlockLayoutByRef--this.pageLayouts",this.pageLayouts);
    },


    //单个布局组件刷新
    refreshLayout(layout) {
      console.log("refreshLayout--layout", layout);
      for (let i = 0; i < layout.layout_config.blocks_components.length; i++) {
        for (let j = 0; j < this.pageComponents.length; j++) {

          if (layout.layout_config.blocks_components[i].type=='frontEndComponent' && layout.layout_config.blocks_components[i].ref == this.pageComponents[j].component_ref) {
            if(this.pageComponents[j].component_config.attr.show==true){
              let the = this;
              the.$nextTick(() => {
                //console.log("the.$refs[this.pageComponents[j].ref]", the.$refs[this.pageComponents[j].component_ref]);
                the.$refs[this.pageComponents[j].component_ref][0].refreshFun(this.pageComponents[j]);
              })
            }

          }
        }
      }
    },

    refreshPageComponent(pageComponent){

      console.log("refreshPageComponent--pageComponent",pageComponent);
      let the=this;
      the.$nextTick(()=>{
        for(let i=0;i<window.cbcAllDebugLayoutPageBlockInstanceArr.length;i++){
          if(typeof (window.cbcAllDebugLayoutPageBlockInstanceArr[i].refs)!="undefined" &&
              typeof (window.cbcAllDebugLayoutPageBlockInstanceArr[i].refs[pageComponent.component_ref])!="undefined" &&
              typeof (window.cbcAllDebugLayoutPageBlockInstanceArr[i].refs[pageComponent.component_ref][0])!="undefined"){
            window.cbcAllDebugLayoutPageBlockInstanceArr[i].refs[pageComponent.component_ref][0].refreshFun(pageComponent);
          }
        }
      });
    },

  },
  mounted() {
    console.log("this.topPageBlockInstancerrt1",this.topPageBlockInstance);
    if(typeof (this.topPageBlockInstance)=="undefined" || this.topPageBlockInstance==null){
      this.testFlag=true;
      return;
    }
    console.log("cbc-DebugLayoutPageBlock--mounted");
    console.log("DebugLayoutPageBlock--this.$parent",this.$parent);


    let pageBlocksTemp=this.topPageBlockInstance.data.pageBlocks;
    console.log("pageBlocksTemp111rt",pageBlocksTemp);
    console.log("this.pageBlockRef111rt",this.pageBlockRef);

    for(let i=0;i<pageBlocksTemp.length;i++){
      if(pageBlocksTemp[i].page_block_ref==this.pageBlockRef){
        this.pageBlock=pageBlocksTemp[i];
      }
    }
    if(this.pageBlock==null){
      this.testFlag=true;
      return;
    }
    console.log("this.pageBlock1111",this.pageBlock);

    //if(this.$route.query.pageDebugFlag=="false"){

    //}else {
    //暂时关闭
    /***/
    const the = this;
    const erd = elementResizeDetectorMaker();

    erd.listenTo(document.getElementById(this.idStr), element => {
      console.log("this.idStr",this.idStr);
      the.$nextTick(() => {
        if(this.topPageBlockInstance.data.page_model=="suit"){
          let element=document.getElementById(this.idStr);
          the.suitHeight=the.pageBlock.page_block_config.attr.height*element.clientWidth/the.pageBlock.page_block_config.attr.width+"px";
        }else{
          the.suitHeight="100%";
        }
        console.log("the.suitHeight",the.suitHeight);
        console.log("窗口变化",element.clientWidth,element.clientHeight);
        if(this.oldAttr.width!="" && this.oldAttr.height!=""){
          let widthFlag=element.clientWidth-this.oldAttr.width;
          let heightFlag=element.clientHeight-this.oldAttr.height;
          if(widthFlag>5 || widthFlag<-5 || heightFlag>5 || heightFlag<-5){
            for(let i=0;i<this.pageLayouts.length;i++){
              the.refreshLayout(this.pageLayouts[i]);
            }
          }
          this.oldAttr.width=element.clientWidth;
          this.oldAttr.height=element.clientHeight;
        }else{
          for(let i=0;i<this.pageLayouts.length;i++){
            the.refreshLayout(this.pageLayouts[i]);
          }
          this.oldAttr.width=element.clientWidth;
          this.oldAttr.height=element.clientHeight;
        }

      });
    });


    //}


    if(typeof (window.cbcAllDebugLayoutPageBlockInstanceArr)=="undefined"){
      window.cbcAllDebugLayoutPageBlockInstanceArr=[];
      window.cbcAllDebugLayoutPageBlockInstanceArr.push(getCurrentInstance());
    }else{
      window.cbcAllDebugLayoutPageBlockInstanceArr.push(getCurrentInstance());
    }
    console.log("window.cbcAllDebugLayoutPageBlockInstanceArr",window.cbcAllDebugLayoutPageBlockInstanceArr);
  }
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


</style>
