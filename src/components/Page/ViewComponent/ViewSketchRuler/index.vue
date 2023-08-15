<template>
  <div class="wrapper">
    <SketchRule
        :thick="thick"
        :scale="scale"
        :width="1920"
        :height="1080"
        :start-x="startX"
        :start-y="startY"
        :hor-line-arr="lines.h"
        :ver-line-arr="lines.v"
        :corner-active="true"
        @handleLine="handleLine"
        @onCornerClick="handleCornerClick">
    </SketchRule>
    <div id="screens" ref="screensRef" @wheel="handleWheel" @scroll="handleScroll" v-if="showFlag">
      <div ref="containerRef" class="screen-container">
        <div id="canvasID" :style="canvasStyle">
          <ViewDraggableResizable :scale="scale"></ViewDraggableResizable>
        </div>
      </div>

    </div>

  </div>
</template>
<script>
import {SketchRule} from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

import ViewDraggableResizable from '../ViewDraggableResizable/index.vue'
import {getCurrentInstance} from "vue";

export default {
  props: {},
  components: {SketchRule, ViewDraggableResizable},
  data() {
    return {
      scale: 0.5, //658813476562495, //1,
      startX: 0,
      startY: 0,
      lines: {
        h: [100, 200],
        v: [100, 200]
      },
      thick: 20,
      isShowRuler: false, // 显示标尺
      isShowReferLine: false, // 显示参考线
      showFlag:false,

      canvasStyle:null,
      rectWidth:0,
      rectHeight:0,
      //currentPageBlock:null,
    }
  },

  mounted() {
    // console.log(SketchRule, "666666");
    // 滚动居中
    window.cbcViewSketchRulerInstance = getCurrentInstance();

  },
  methods: {
    showViewDraggableResizable(param){
      //this.currentPageBlock=param;
      console.log("showViewDraggableResizable--param",param);
      if(param.page_block_config.attr.unit=="px"){
        this.rectWidth=param.page_block_config.attr.width;
        this.rectHeight=param.page_block_config.attr.height;
      }else{
        this.rectWidth=param.page_block_config.attr.width*1920;
        this.rectHeight=param.page_block_config.attr.height*1080;
      }
      console.log("编辑块宽度：",this.rectWidth);
      console.log("编辑块高度：",this.rectHeight);

      this.canvasStyle= {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: this.rectWidth+'px',
        height: this.rectHeight+'px',
        transformOrigin: '0 0',
        transform: `scale(${this.scale})`
      }

           if(param.page_block_config.attr.background.type=="img" && param.page_block_config.attr.background.value!=""){
             let imgURL=window.cbcConfig.getFileUrl+"?uuid=" + param.page_block_config.attr.background.value + "&type=photo";
             this.canvasStyle.backgroundImage='url('+imgURL+')';
             this.canvasStyle.backgroundSize='100% 100%';
           }else if(param.page_block_config.attr.background.type=="color" && param.page_block_config.attr.background.value!=""){
             this.canvasStyle.background=param.page_block_config.attr.background.value;
           }

      /**
      console.log("背景颜色",param.page_block_config.attr.backgroundColor);
      if(param.page_block_config.attr.backgroundColor!=null && param.page_block_config.attr.backgroundColor!=""){
        console.log("背景颜色1",param.page_block_config.attr.backgroundColor);
        this.canvasStyle.background=param.page_block_config.attr.backgroundColor;
      }
       */

      let the=this;
      the.$nextTick(()=>{
        the.showFlag=true;
        the.$nextTick(()=>{
          the.handleScroll();
        });
      });
    },

    handleLine(lines) {
      this.lines = lines
    },
    handleCornerClick() {
      console.log("handleCornerClick");
    },
    handleScroll() {
      const screensRect = document.querySelector('#screens').getBoundingClientRect();
      const canvasRect = document.querySelector('#canvasID').getBoundingClientRect()

      // 标尺开始的刻度
      //console.log("1--screensRect.left",screensRect.left);
      //console.log("2--this.thick",this.thick);
      //console.log("3--canvasRect.left",canvasRect.left);

      const startX = (screensRect.left + this.thick - canvasRect.left) / this.scale;
      const startY = (screensRect.top + this.thick - canvasRect.top) / this.scale;
      this.startX = startX
      this.startY = startY
      console.log("startX",startX);
      console.log("startY",startY);

    },
    // 控制缩放值
    handleWheel(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const nextScale = parseFloat(
            Math.max(0.2, this.scale - e.deltaY / 500).toFixed(2)
        )
        this.scale = nextScale
      }
      this.canvasStyle.transform=`scale(${this.scale})`;
      console.log("this.canvasStyletttt",this.canvasStyle);
      console.log("this.scaletttt",this.scale);
      this.$nextTick(() => {
        this.handleScroll()
      })
    }
  }
}
</script>
<style lang="scss" scoped>

.wrapper {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 1920px;
  height: 1080px;
  background-color: #26292d;
  border: 1px solid #dadadc;
}

#screens {
  position: absolute;
  width: 100%;
  height: 100%;
}
.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}

.line .del[data-v-074b3d94] {
  padding: 3px 5px;
  cursor: pointer;
  visibility: hidden;
  color: white;
}

.line .value[data-v-074b3d94] {
  pointer-events: none;
  transform: scale(.83);
  color: white;
}

</style>
