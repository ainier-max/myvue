<template>
  <div style="width: 100%;height: 100%;position: relative" :id="idStr">
    <div v-for="(pageLayout, index) in pageLayouts"
         :style="{'background':pageLayout.layout_config.attr.backgroundColor,'position':'absolute',
         'left':pageLayout.layout_config.attr.xPer+'%','top':pageLayout.layout_config.attr.yPer+'%',
         'width':pageLayout.layout_config.attr.wPer+'%','height':pageLayout.layout_config.attr.hPer+'%','zIndex':pageLayout.layout_config.attr.zIndex}" >

        <div v-if="pageLayout.layout_type=='flex-column' || pageLayout.layout_type=='flex-row'"
             :style="{'height':'100%','display':'flex','flex-direction':pageLayout.layout_config.type}">

          <div v-for="(layout_component, index) in pageLayout.layout_config.blocks_components"
               :style="{'flex-basis':layout_component.span+'%',
             'padding':layout_component.padding.top+'px '+layout_component.padding.right+'px '+layout_component.padding.bottom+'px '+layout_component.padding.left+'px',
             'margin':layout_component.margin.top+'px '+layout_component.margin.right+'px '+layout_component.margin.bottom+'px '+layout_component.margin.left+'px'}">
            <!--展示前端组件-->
            <span v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='frontEndComponent'" v-for="(componentInfo, index) in pageComponents">
              <LayoutComponent :ref="componentInfo.component_ref"
                               v-if="layout_component.type=='frontEndComponent' && layout_component.ref==componentInfo.component_ref"
                               :componentInfo="componentInfo">
              </LayoutComponent>
            </span>
            <!--展示内置组件-->
            <span v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='buildInComponent'">
              <LayoutBuildInComponent :ref="layout_component.ref" :layoutComponentInfo="layout_component"></LayoutBuildInComponent>
            </span>

            <!--展示布局类组件（场景未出现）-->
            <span v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='layout'">

            </span>

            <!--展示页面块-->
            <span v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='block'">
                <LayoutPageBlock :pageBlockRef="layout_component.ref"
                                 :allPageComponents="allPageComponents"
                                 :allPageLayouts="allPageLayouts"></LayoutPageBlock>
            </span>


            <!--展示无组件的状态-->
            <span v-if="typeof (layout_component.type)=='undefined' ">
              <div v-if="typeof (pageLayout.layout_config.attr.backgroundImageURL)=='undefined' || pageLayout.layout_config.attr.backgroundImageURL==''"
                   style="width: 100%;height: 100%;background-image: linear-gradient(180deg,#274351,#1a2646);align:center;"></div>

              <div v-if="typeof (pageLayout.layout_config.attr.backgroundImageURL)!='undefined' && pageLayout.layout_config.attr.backgroundImageURL!=''"
                   :style="{'width': '100%','height': '100%','backgroundImage':'url('+pageLayout.layout_config.attr.backgroundImageURL+')','backgroundSize':'100% 100%'}"></div>
            </span>

          <!--
            <span v-if="typeof (layout_component.type)=='undefined' ">
              <LayoutComponent  :ref="null"
                                :componentInfo="null" style="border: 1px solid yellowgreen">
              </LayoutComponent>
            </span>
            -->

          </div>


      </div>

    </div>

  </div>
</template>

<script>

import LayoutComponent from "../LayoutComponent/index.vue";
import elementResizeDetectorMaker from "element-resize-detector";
import LayoutBuildInComponent from "../LayoutBuildInComponent/index.vue";


import {commonSelectRequest} from "../../../../js/request";
import axios from "axios";

export default {
  name:"LayoutPageBlock",
  props: {

    pageBlockRef: {
      type: String,
      default: ''
    },
    allPageComponents:{
      type: Array,
      default: []
    },
    allPageLayouts:{
      type: Array,
      default: []
    },

  },
  data() {
    return {
      pageLayouts:[],
      pageComponents:[],
      idStr:'',
    }
  },
  components: {
    "LayoutComponent": LayoutComponent,
    "LayoutBuildInComponent":LayoutBuildInComponent
  },

  created() {
    console.log("LayoutPageBlock--created");
    this.getPageBlockComponentByRef();
    this.idStr="id"+window.cbcuuid();
  },
  methods: {
    getPageBlockComponentByRef() {
      console.log("getPageBlockComponentByRef--this.allPageComponents",this.allPageComponents);
      for(let i=0;i<this.allPageComponents.length;i++){
        if(this.allPageComponents[i].page_block_ref==this.pageBlockRef){
          this.pageComponents.push(this.allPageComponents[i]);
        }
      }
      console.log("getPageBlockComponentByRef--this.pageBlockRef",this.pageBlockRef);
      console.log("getPageBlockComponentByRef--this.pageComponents",this.pageComponents);
      this.getPageBlockLayoutByRef();
    },
    getPageBlockLayoutByRef(){
      for(let i=0;i<this.allPageLayouts.length;i++){
        if(this.allPageLayouts[i].page_block_ref==this.pageBlockRef){
          this.pageLayouts.push(this.allPageLayouts[i]);
        }
      }
    },
    //单个组件刷新
    refreshLayout(layout) {
      //console.log("refreshLayout--layout", layout);
      for (let i = 0; i < layout.layout_config.blocks_components.length; i++) {
        for (let j = 0; j < this.pageComponents.length; j++) {
          if (layout.layout_config.blocks_components[i].ref == this.pageComponents[j].component_ref) {
            //组件show属性为true才刷新
            if(this.pageComponents[j].component_config.attr.show==true){
              let the = this;
              the.$nextTick(() => {
                //console.log("the.$refs[this.pageComponents[j].ref]", the.$refs[this.pageComponents[j].component_ref]);
                if(typeof (the.$refs[this.pageComponents[j].component_ref])!="undefined"){
                  the.$refs[this.pageComponents[j].component_ref][0].refreshFun(this.pageComponents[j]);
                }else{
                  console.log("the.$refsbbb",the.$refs);
                  console.log("this.pageComponents[j].component_refbbb",this.pageComponents[j].component_ref);
                }
              })
            }
          }
        }
      }
    },
  },

  mounted() {
    const the = this;
    const erd = elementResizeDetectorMaker();
    if(document.getElementById(this.idStr)!=null){
      erd.listenTo(document.getElementById(this.idStr), element => {
        the.$nextTick(() => {
          for(let i=0;i<this.pageLayouts.length;i++){
            the.refreshLayout(this.pageLayouts[i]);
          }
        });
      });
    }


  }
}

</script>