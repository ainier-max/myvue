<template>
  <div style="overflow: hidden"
       v-if="currentPageLayout!=null && (currentPageLayout.layout_type=='flex-column' || currentPageLayout.layout_type=='flex-row')"
       :style="{'height':'100%','width':'100%','display':'flex','flex-direction':currentPageLayout.layout_config.type}">

    <div v-for="(layout_component, index) in currentPageLayout.layout_config.blocks_components"
         :style="pageBlocksComponentsStyle(layout_component)">

      <template v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='frontEndComponent'">
        <!--LayoutRender/index.vue渲染前端类组件-->
              <template v-for="(componentInfo, index) in allPageComponents">
                <LayoutFrontEndComponent :ref="componentInfo.component_ref"
                                 v-if="layout_component.type=='frontEndComponent' && layout_component.ref==componentInfo.component_ref"
                                 :componentInfo="componentInfo"
                                 :style="{'backgroundSize':'100% 100%'}">
              </LayoutFrontEndComponent>
              </template>
          </template>


      <template v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='buildInComponent'">
        <!--LayoutRender/index.vue渲染内置类组件-->
            <template v-for="(componentInfo, index) in allPageComponents">
              <LayoutBuildInComponent
                  v-if="layout_component.type=='buildInComponent' && layout_component.ref==componentInfo.component_ref"
                  :renderType="renderType"
                  :componentInfo="componentInfo" :ref="layout_component.ref"
                  :layoutComponentInfo="layout_component"></LayoutBuildInComponent>
            </template>
          </template>
      <template v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='layout'">
        <!--LayoutRender/index.vue渲染布局类组件-->
              <LayoutRender :pageLayoutRef="layout_component.ref"
                           :allPageComponents="allPageComponents"
                           :topPageBlockRef="topPageBlockRef"
                           :allPageLayouts="allPageLayouts" :pageDebugFlag="pageDebugFlag" :renderType="renderType">
              </LayoutRender>
        </template>

      <template v-if="typeof (layout_component.type)!='undefined' && layout_component.type=='block'">
         <!--LayoutRender/index.vue渲染页面块-->
              <LayoutPageBlock
                  v-if="renderType=='Edit' && pageDebugFlag=='true'"
                  :renderType="renderType"
                  :pageBlockRef="layout_component.ref"
                               :allPageComponents="allPageComponents"
                               :allPageLayouts="allPageLayouts"
                               :style="{'background':currentPageLayout.layout_config.attr.backgroundColor,'backgroundImage':'url('+currentPageLayout.layout_config.attr.backgroundImageURL+')','backgroundSize':'100% 100%'}">
              </LayoutPageBlock>

              <LayoutPageBlock v-if="renderType=='View' && topPageBlockRef!=''" :topPageBlockRef="topPageBlockRef" :page_id="page_id" :pageBlockRef="layout_component.ref"
                               :style="{'backgroundImage':'url('+currentPageLayout.layout_config.attr.backgroundImageURL+')','backgroundSize':'100% 100%'}">
              </LayoutPageBlock>

      </template>




    </div>
  </div>
</template>

<script>

import LayoutFrontEndComponent from "./LayoutFrontEndComponent/index.vue";
import LayoutPageBlock from "./LayoutPageBlock/index.vue";
import LayoutBuildInComponent from "./LayoutBuildInComponent/index.vue";
import * as Vue from "vue";
export default {
  name: "LayoutRender",
  props: {
    renderType: {
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

    pageLayoutRef: {
      type: String,
      default: ''
    },
    pageDebugFlag:{
      type: String,
      default: ''
    },
    topPageBlockRef:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentPageLayout: null,
      page_id:null
    }
  },
  components: {
    "LayoutFrontEndComponent": LayoutFrontEndComponent,
    "LayoutPageBlock": LayoutPageBlock,
    "LayoutBuildInComponent": LayoutBuildInComponent
  },
  computed: {
    "pageBlocksComponentsStyle"() {
      let the =this;
      return function (layout_component) {
        let styleObj = {};
        styleObj.flexBasis = layout_component.span + '%';
        //console.log("111111111111111111111111111",the.$route.query.pageDebugFlag);
        if(the.$route.query.pageDebugFlag=="false"){
          //console.log("1111111111111111111111111112",the.$route.query.pageDebugFlag);
        }else{
          styleObj.border = '1px solid gray';
        }
        let paddingUnitTemp = layout_component.padding.unit;
        let marginUnitTemp = layout_component.padding.unit;
        styleObj.padding = layout_component.padding.top + paddingUnitTemp + ' ' + layout_component.padding.right + paddingUnitTemp + ' ' + layout_component.padding.bottom + paddingUnitTemp + ' ' + layout_component.padding.left + paddingUnitTemp;
        styleObj.margin = layout_component.margin.top + marginUnitTemp + ' ' + layout_component.margin.right + marginUnitTemp + ' ' + layout_component.margin.bottom + marginUnitTemp + ' ' + layout_component.margin.left + marginUnitTemp;

        if (layout_component.background.type == "img" && layout_component.background.value != "") {
          let imgURL = window.cbcConfig.getFileUrl + "?uuid=" + layout_component.background.value + "&type=photo";
          styleObj.backgroundImage = 'url(' + imgURL + ')';
          styleObj.backgroundSize = '100% 100%';
        } else if (layout_component.background.type == "color" && layout_component.background.value != "") {
          styleObj.background = layout_component.background.value;
        }

        return styleObj;
      }
    },
  },

  created() {

    //this.allPageLayouts=window.cbcDebugPageInstance[this.topPageBlockRef].data.pageLayouts;
    //this.allPageComponents=window.cbcDebugPageInstance[this.topPageBlockRef].data.pageComponents;

    console.log("LayoutRender--created--this.allPageLayouts", this.allPageLayouts);
    console.log("LayoutRender--created--this.allPageComponents", this.allPageComponents);
    console.log("LayoutRender--created--this.pageLayoutRef", this.pageLayoutRef);
    if (this.renderType=="View") {
      this.page_id=this.$route.query.page_id;
    }
    
    for (let i = 0; i < this.allPageLayouts.length; i++) {
      if (this.allPageLayouts[i].layout_ref == this.pageLayoutRef) {
        this.currentPageLayout = this.allPageLayouts[i];
      }
    }
    console.log("LayoutRender--created--this.currentPageLayout", this.currentPageLayout);

  
  },
  methods: {},
  mounted() {
    console.log("LayoutRender--mounted--this.renderType", this.renderType);

    //局部动态注册组件
    // let pathUrl="./LayoutPageBlock/index.vue";
    // this.$options.components["LayoutPageBlock"] = Vue.defineAsyncComponent({
    //   loader: () => import(/* @vite-ignore */pathUrl)
    // })

  }
}

</script>