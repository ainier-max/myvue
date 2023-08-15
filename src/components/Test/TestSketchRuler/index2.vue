<template>
  <div style="width: 500px;height:500px">


    <div class="wrapper" id="wrapper">
      <SketchRule
          :lang="lang"
          :thick="thick"
          :scale="scale"
          :width="width"
          :height="height"
          :startX="startX"
          :startY="startY"
          :horLineArr="lines.h"
          :verLineArr="lines.v"
          :cornerActive="true"
          @handleLine="handleLine"
          @onCornerClick="handleCornerClick"
      >
      </SketchRule>
      <div
          ref='screensRef'
          id="screens"
          @wheel="handleWheel"
          @scroll="handleScroll"
      >
        <div ref="containerRef" class="screen-container">
          <div id="canvas" :style="canvasStyle"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {SketchRule} from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

const rectWidth = 1920;
const rectHeight = 1080;
export default {
  data() {
    return {
      scale: 0.6, //658813476562495, //1,
      startX: 0,
      startY: 0,
      lines: {
        h: [100, 200],
        v: [100, 200]
      },
      thick: 20,
      width: 0,
      height: 0,
      lang: "zh-CN", // 中英文
      isShowRuler: true, // 显示标尺
      isShowReferLine: true // 显示参考线
    }
  },
  components: {
    SketchRule
  },
  computed: {
    canvasStyle() {
      return {
        width: rectWidth + 'px',
        height: rectHeight + 'px',
        transform: `scale(${this.scale})`
      }
    }
  },
  methods: {
    handleLine(lines) {
      this.lines = lines;
    },
    handleCornerClick() {
      return;
    },
    handleScroll() {
      const screensRect = document
          .querySelector("#screens")
          .getBoundingClientRect();
      const canvasRect = document
          .querySelector("#canvas")
          .getBoundingClientRect();
      console.log("screensRect.left",screensRect.left);
      console.log("screensRect.top",screensRect.top);
      console.log("canvasRect.left",canvasRect.left);
      console.log("canvasRect.top",canvasRect.top);
      // 标尺开始的刻度
      const startX = (screensRect.left + this.thick - canvasRect.left) / this.scale;
      const startY = (screensRect.top + this.thick - canvasRect.top) / this.scale;
      this.startX = startX >> 0;
      this.startY = startY >> 0;
      console.log("this.startX",this.startX);
      console.log("this.startY",this.startY);
    },
    // 控制缩放值
    handleWheel(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const nextScale = parseFloat(
            Math.max(0.2, this.scale - e.deltaY / 500).toFixed(2)
        );
        this.scale = nextScale;
      }
      this.$nextTick(() => {
        this.handleScroll();
      });
    },
    initSize() {
      const wrapperRect = document
          .querySelector("#wrapper")
          .getBoundingClientRect();
      const borderWidth = 1;
      this.width = wrapperRect.width - this.thick - borderWidth;
      this.height = wrapperRect.height - this.thick - borderWidth;
      this.handleScroll();
    }
  },
  mounted() {
    // 滚动居中
    console.log("this.$refs.containerRef.getBoundingClientRect()：", this.$refs.containerRef.getBoundingClientRect());
    //this.$refs.screensRef.scrollLeft = this.$refs.containerRef.getBoundingClientRect().width / 2 - 2500; // 300 = #screens.width / 2
    this.$refs.screensRef.scrollLeft=500;
    console.log("this.$refs.screensRef.scrollLeft", this.$refs.screensRef.scrollLeft);

    this.$nextTick(() => {
      this.initSize();
    });
  }
};
</script>
<style>
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  overflow: hidden;
}

body * {
  box-sizing: border-box;
  user-select: none;
}

.wrapper {
  background-color: #f5f5f5;
  position: absolute;
  top: 100px;
  left: 100px;
  width: 960px;
  height: 720px;
  border: 1px solid #DADADC;
}

#screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}

#canvas {
  position: absolute;
  top: 50px;
  left: -250px;
  margin-left: -80px;
  width: 160px;
  height: 200px;
  background: lightblue;
  transform-origin: 50% 0;
}
</style>