<template>
  <div style="width: 100%;height: 100%;">
    <div class="componentItemClass" @click="setFlexLayout('flex-column')">水平布局</div>
    <div class="componentItemClass" @click="setFlexLayout('flex-row')">垂直布局</div>
  </div>

</template>

<script>


import {toDecimal} from "../../../../../../common/js/decimal";
import {uuid} from "../../../../../../common/js/uuid";

export default {
  props: {

  },
  data: function () {
    return {



    }
  },

  created() {

  },
  components: {},
  methods: {
    setFlexLayout(type){
      console.log("setFlexLayout--type",type);
      console.log("setFlexLayout--window.cbcPageInstance.data.currentPageBlock.page_block_config.attr",window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.width);
      

      let pageLayoutTemp = {}
      pageLayoutTemp.layout_config = {};
      pageLayoutTemp.layout_config.type="innerLayout";
      pageLayoutTemp.layout_config.attr = {};
      pageLayoutTemp.layout_config.attr.x = "布局中布局不需要坐标值x";
      pageLayoutTemp.layout_config.attr.y = "布局中布局不需要坐标值y";

      pageLayoutTemp.layout_config.attr.w = "布局中布局不需要宽度值w";
      pageLayoutTemp.layout_config.attr.h = "布局中布局不需要高度值h";
      pageLayoutTemp.layout_config.attr.zIndex = 100;
      pageLayoutTemp.layout_config.attr.background = {};
      pageLayoutTemp.layout_config.attr.background.type="img";
      pageLayoutTemp.layout_config.attr.background.value="";

      //let pageWidthTemp = window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.width;
      //let pageHeightTemp = window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.height;
      //pageLayoutTemp.layout_config.attr.xPer = toDecimal((10 / pageWidthTemp) * 100);
      //pageLayoutTemp.layout_config.attr.yPer = toDecimal((10 / pageHeightTemp) * 100);
      //pageLayoutTemp.layout_config.attr.wPer = toDecimal((200 / pageWidthTemp) * 100);
      //pageLayoutTemp.layout_config.attr.hPer = toDecimal((200 / pageHeightTemp) * 100);
      //pageLayoutTemp.layout_config.attr.wPer = 50.0;
      //pageLayoutTemp.layout_config.attr.hPer = 50.0;

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
      let layoutUUID="layoutRef-" + uuid();
      pageLayoutTemp.layout_ref =layoutUUID;

      pageLayoutTemp.layout_type = type;
      if (type == 'flex-column') {
        pageLayoutTemp.layout_name = "水平布局";
        pageLayoutTemp.layout_config.type = "row";
      }else{
        pageLayoutTemp.layout_name = "垂直布局";
        pageLayoutTemp.layout_config.type = "column";
      }

      pageLayoutTemp.page_id = this.$route.query.page_id;
      pageLayoutTemp.page_block_ref = window.cbcPageInstance.data.currentPageBlock.page_block_ref;
      pageLayoutTemp.layout_config.childFlag=true;

      window.cbcPageInstance.data.pageLayouts.push(pageLayoutTemp);
      this.$emit('getPageLayout',type,layoutUUID);

      //添加至布局组件列表中
      window.cbcBlockTreeInstance.ctx.addPageBlockLayout(pageLayoutTemp);


    }



  },
  mounted() {

  }
}
</script>

<style scoped>
.componentItemClass {
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: black;
  font-size: 20px;
  cursor: pointer
}

.componentItemClass:hover {
  background-color: rgba(0, 0, 255, 0.2);
}

.componentItemClass:active {
  background-color: rgba(0, 0, 255, 0.2);
}
</style>