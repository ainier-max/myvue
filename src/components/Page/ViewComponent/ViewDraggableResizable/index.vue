<template>
  <!--v-if="currentPageBlockLayouts.length>0"-->
  <div style="height: 100%; width: 100%;  border: 1px solid white; position: relative;" v-if="showFlagTemp">
    <vue-draggable-resizable v-for="(pageLayout, index) in currentPageBlockLayouts" :x="pageLayout.layout_config.attr.x"
                             :key="index"
                             :y="pageLayout.layout_config.attr.y"
                             :w="pageLayout.layout_config.attr.w" :h="pageLayout.layout_config.attr.h"
                             @dragging="onDrag" @resizing="onResize" @resizestop="onResizstop" @dragstop="onDragstop"
                             @activated="onActivated(pageLayout)" @deactivated="onDeactivated(pageLayout)"
                             :parent="true"
                             :preventDeactivation="true" :active="pageLayout.isActived" :ref="'drag-'+pageLayout.layout_ref"
                             :scale="scale" :style="pageLayoutStyle(pageLayout)" @contextmenu="onContextMenu($event,pageLayout.layout_ref)">

      <!--透明蒙版-->
      <div class="mb"></div>

      <!--:active="component.isActived"  引发二次激活,暂时去掉，后续如果有问题再考虑-->
      <LayoutRender v-if="LayoutRenderFlag==true" :pageLayoutRef="pageLayout.layout_ref"
                   :allPageComponents="allPageComponents"
                   :allPageLayouts="allPageLayouts" :pageDebugFlag="pageDebugFlag">
      </LayoutRender>

    </vue-draggable-resizable>

  </div>
</template>

<script>

import LayoutRender from "../../../../common/component/PageRender/LayoutRender/index.vue";
//vue2引入组件
//import VueDraggableResizable from 'vue-draggable-resizable'
//vue3引入组件 注意和vue2中的路径不同
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable.vue'
// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

import ViewComponent from '../index.vue'
import {getCurrentInstance} from 'vue'

import {objectToString, stringToObject} from "../../../../common/js/objStr.js";

import {toDecimal} from "../../../../common/js/decimal.js";

import {js_beautify, css_beautify, html_beautify} from 'js-beautify'
//右键菜单样式
import './index.css'
import {commonSelectRequest} from "../../../../common/js/request";
import axios from "axios";


export default {
  props:{
    scale: {
      type: Number,
      default() {
        return 0.0;
      }
    },
  },
  data: function () {
    return {
      showFlagTemp:true,
      //当前页面块的布局组件
      currentPageBlockLayouts: [],
      //当前操作的布局组件
      currentPageLayout: null,
      timer: null,//防抖
      emitContext: null,
      allPageLayouts:[],
      allPageComponents:[],
      LayoutRenderFlag:false,
      pageDebugFlag:null,
    }
  },
  computed:{
    "pageLayoutStyle"(){
      return function(pageLayout) {
        console.log("vueDraggableResizableStyle--pageLayout",pageLayout);
        let styleObj={};
        styleObj.cursor="move";
        styleObj.zIndex=pageLayout.layout_config.attr.zIndex;
        if(pageLayout.layout_config.attr.background.type=="img" && pageLayout.layout_config.attr.background.value!=""){
          let imgURL=window.cbcConfig.getFileUrl+"?uuid=" + pageLayout.layout_config.attr.background.value + "&type=photo";
          styleObj.backgroundImage='url('+imgURL+')';
          styleObj.backgroundSize='100% 100%';
        }else if(pageLayout.layout_config.attr.background.type=="color" && pageLayout.layout_config.attr.background.value!=""){
          styleObj.background=pageLayout.layout_config.attr.background.value;
        }
        return styleObj;
      }
    }
  },
  components: {
    "vue-draggable-resizable": VueDraggableResizable,
    "ViewComponent": ViewComponent,
    "LayoutRender":LayoutRender
  },
  created(){
    this.pageDebugFlag=this.$route.query.pageDebugFlag;
    this.allPageComponents=window.cbcPageInstance.data.pageComponents;
    this.allPageLayouts=window.cbcPageInstance.data.pageLayouts;
    this.LayoutRenderFlag=true;
    console.log("ViewDraggableResizable--created",this.allPageComponents);
  },
  methods: {
    deleteCurrentPageBlockLayout(pageBlockLayout){
      console.log("deleteCurrentPageBlockLayout--pageBlockLayout",pageBlockLayout);
      for(let i=0;i<this.currentPageBlockLayouts.length;i++){
        if(this.currentPageBlockLayouts[i].layout_ref==pageBlockLayout.layout_ref){
          //console.log("deleteCurrentPageBlockLayout11");
          this.currentPageBlockLayouts.splice(i, 1);
          i = i - 1;
        }
      }
      console.log("deleteCurrentPageBlockLayout--this.currentPageBlockLayouts",this.currentPageBlockLayouts);
    },
    setActivatedByRef(layout_ref) {
      for (let i = 0; i < window.cbcPageInstance.data.pageLayouts.length; i++) {
        if (layout_ref == window.cbcPageInstance.data.pageLayouts[i].layout_ref) {
          window.cbcPageInstance.data.pageLayouts[i].isActived = true;
          this.currentPageLayout = window.cbcPageInstance.data.pageLayouts[i];
        } else {
          window.cbcPageInstance.data.pageLayouts[i].isActived = false;
        }
      }
    },

    onActivated(pageLayout) {
      console.log("onActivated");
      this.currentPageLayout = pageLayout;

      for (let i = 0; i < window.cbcPageInstance.data.pageLayouts.length; i++) {
        if (pageLayout.layout_ref == window.cbcPageInstance.data.pageLayouts[i].layout_ref) {
          window.cbcPageInstance.data.pageLayouts[i].isActived = true;
          window.cbcBlockTreeInstance.ctx.setChoosedLayoutByRef(pageLayout.layout_ref);
        } else {
          window.cbcPageInstance.data.pageLayouts[i].isActived = false;
        }
      }
      window.cbcPageInstance.data.currentPageBlockLayout = this.currentPageLayout;
      this.$nextTick(() => {
        window.cbcPageInstance.data.SettingsTab = "PageBlockLayoutSetting";
      });
    },


    onDeactivated(component) {

    },
    onResizstop: function (x, y, width, height) {
      //结束缩放后更新可视化配置页面
      //console.log("组件结束缩放");
      //window.cbcPageInstance.ctx.setCurrentComponentConfigStr();
      //window.cbcPageInstance.ctx.setCurrentComponentVisualizeOptions();
    },
    onDragstop: function (x, y) {
      //结束移动后更新可视化配置页面
      //console.log("组件结束移动");
      //window.cbcPageInstance.ctx.setCurrentComponentVisualizeOptions();
      //window.cbcPageInstance.ctx.setCurrentComponentConfigStr();
    },
    onResize: function (x, y, width, height) {

      var the = this;
      // 有定时器,则清除
      if (the.timer) {
        clearInterval(the.timer)
      }
      // 开启定时器
      the.timer = setTimeout(function () {
        // 调用函数fn
        //console.log("width", width);
        the.currentPageLayout.layout_config.attr.x = x;
        the.currentPageLayout.layout_config.attr.y = y;
        the.currentPageLayout.layout_config.attr.w = width;
        the.currentPageLayout.layout_config.attr.h = height;

        let pageWidthTemp = window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.width;
        let pageHeightTemp = window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.height;
        the.currentPageLayout.layout_config.attr.xPer = toDecimal((x / pageWidthTemp) * 100);
        the.currentPageLayout.layout_config.attr.yPer = toDecimal((y / pageHeightTemp) * 100);
        the.currentPageLayout.layout_config.attr.wPer = toDecimal((width / pageWidthTemp) * 100);
        the.currentPageLayout.layout_config.attr.hPer = toDecimal((height / pageHeightTemp) * 100);

        window.cbcPageInstance.data.currentPageBlockLayout = the.currentPageLayout;

        the.refreshLayout(the.currentPageLayout);
      }, 1)


    },
    onDrag: function (x, y) {
      this.currentPageLayout.layout_config.attr.x = x;
      this.currentPageLayout.layout_config.attr.y = y;

      let pageWidthTemp = window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.width;
      let pageHeightTemp = window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.height;
      console.log("onDrag-y",y);
      this.currentPageLayout.layout_config.attr.xPer = toDecimal((x / pageWidthTemp) * 100);
      this.currentPageLayout.layout_config.attr.yPer = toDecimal((y / pageHeightTemp) * 100);
      console.log("onDrag-yPer",this.currentPageLayout.layout_config.attr.yPer);

      window.cbcPageInstance.data.currentPageBlockLayout = this.currentPageLayout;

    },
    //所有组件刷新
    refreshAllComponent() {
      console.log("this.pageComponents852", this.pageComponents);

      for (let i = 0; i < this.pageComponents.length; i++) {
        let the = this;
        the.$nextTick(() => {
          if (typeof (the.$refs[the.pageComponents[i].ref][0]) != "undefined") {
            the.$refs[the.pageComponents[i].ref][0].refreshFun(the.pageComponents[i]);
          }

        })
      }
    },

    //单个布局组件刷新
    refreshLayout(layout) {
      console.log("refreshLayout--layout", layout);
      this.LayoutRenderFlag=false;
      let the = this;
      the.$nextTick(() => {
        the.LayoutRenderFlag=true;
      })
      /**
      for (let i = 0; i < layout.layout_config.blocks_components.length; i++) {
        for (let j = 0; j < window.cbcPageInstance.data.pageComponents.length; j++) {
          if (layout.layout_config.blocks_components[i].ref == window.cbcPageInstance.data.pageComponents[j].component_ref) {
            let the = this;
            the.$nextTick(() => {
              //console.log("the.$refs[this.pageComponents[j].ref]", the.$refs[this.pageComponents[j].component_ref]);
              the.$refs[window.cbcPageInstance.data.pageComponents[j].component_ref][0].refreshFun(window.cbcPageInstance.data.pageComponents[j]);
            })
          }
        }
      }
       */
    },
    //单个组件刷新
    refreshComponent(component) {
      console.log("refreshComponent--component",component);
      for (let i = 0; i < window.cbcPageInstance.data.pageLayouts.length; i++) {
        if (component.layout_ref == window.cbcPageInstance.data.pageLayouts[i].layout_ref){
          for(let j=0;j<window.cbcPageInstance.data.pageLayouts[i].layout_config.blocks_components.length;j++) {
            if(component.component_ref==window.cbcPageInstance.data.pageLayouts[i].layout_config.blocks_components[j].ref){
              let oldType=window.cbcPageInstance.data.pageLayouts[i].layout_config.blocks_components[j].type;
              window.cbcPageInstance.data.pageLayouts[i].layout_config.blocks_components[j].type="no";
              let the = this;
              the.$nextTick(() => {
                window.cbcPageInstance.data.pageLayouts[i].layout_config.blocks_components[j].type=oldType;
              })
            }
          }
        }
      }
      /**
       *
       *
      console.log("refreshComponent--component",component);
      let the = this;
      //console.log("the.$refs[component.ref]12321312",the.$refs[component.ref]);
      console.log("refreshComponent--the.$refs",the.$refs);
      the.$nextTick(() => {
        the.$refs[component.component_ref][0].refreshFun(component);
      })
       */

    },

    onContextMenu(e, layoutRef) {
      console.log("e, ref",e, layoutRef);
      //prevent the browser's default menu
      for (let i = 0; i < window.cbcPageInstance.data.pageLayouts.length; i++) {
        if (layoutRef == window.cbcPageInstance.data.pageLayouts[i].layout_ref) {
          window.cbcPageInstance.data.pageLayouts[i].isActived = true;
        } else {
          window.cbcPageInstance.data.pageLayouts[i].isActived = false;
        }
      }


      let the = this;
      e.preventDefault();
      //shou our menu
      this.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: "取消选中",
            onClick: () => {
              the.cancelLayout(layoutRef);
            }
          },
          {
            label: "删除",
            onClick: () => {
              the.deleteLayout(layoutRef);
            }
          },

        ]
      });
    },
    //删除组件
    deleteLayout(layoutRef) {
      for (let i = 0; i < window.cbcPageInstance.data.pageLayouts.length; i++) {
        if (window.cbcPageInstance.data.pageLayouts[i].layout_ref == layoutRef) {
          console.log("window.cbcPageInstance.data.pageLayouts[i]",window.cbcPageInstance.data.pageLayouts[i]);
          window.cbcBlockTreeInstance.ctx.forOtherPageLayoutsTreeNodeRemove(window.cbcPageInstance.data.pageLayouts[i].layout_ref);
          //window.cbcPageInstance.ctx.deletePageLayoutItem(window.cbcPageInstance.data.pageLayouts[i]);
        }
      }
    },



    //取消选中组件
    cancelLayout(layoutRef) {
      console.log("取消布局组件ref", layoutRef);
      for (let i = 0; i < window.cbcPageInstance.data.pageLayouts.length; i++) {
        if (window.cbcPageInstance.data.pageLayouts[i].layout_ref == layoutRef) {
          window.cbcPageInstance.data.pageLayouts[i].isActived = false;
          window.cbcBlockTreeInstance.ctx.cancelChoosedByPageLayout();
        }
      }

    },

    setViewComponents(pageComponents) {
      this.pageComponents = pageComponents;
      for (let i = 0; i < this.pageComponents.length; i++) {
        this.pageComponents[i].component_config = eval("(" + this.pageComponents[i].component_config_str + ")")
        this.pageComponents[i].ref = this.pageComponents[i].ref;
        this.pageComponents[i].isActived = false;
      }
      console.log("所有组件信息：", this.pageComponents);
    },

  },
  mounted() {
    console.log("window.cbcViewDraggleResizableInstance初始化......");
    //this.findPageComponents();
    window.cbcViewDraggleResizableInstance = getCurrentInstance();
    //console.log("window.cbcViewDraggleResizableInstance::1",window.cbcViewDraggleResizableInstance);

    //console.log("window.viewDraggleResizableInstance",window.cbcViewDraggleResizableInstance);
  }
}
</script>

<style scoped>

:deep(.vdr) {
  touch-action: none;
}

.active {
  border: 1px dashed #ebe8e8;
}
.mb{background-color: #000;width:100%;height:100%;opacity: 0;z-index:999;left:0;top:0;position:fixed;}

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