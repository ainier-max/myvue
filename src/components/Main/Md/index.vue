<template>
  <div style="height: 80%;margin: 20px">
    <div class="titleClass">平台手册</div>


    <div style="margin:40px 50px;display: flex;flex-direction: row;height: 100%;">
      <div style="padding-top:66px;height: 100%;flex-basis:20%;">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="介绍" name="1">
            <div>

              <div @click="toPath('介绍/低代码开发平台.md')" style="padding-left:20px;font-weight: bold;font-size: 14px;cursor: pointer">低代码开发平台</div>
              <div @click="toPath('介绍/组件丰富方式.md')" style="padding-left:20px;font-weight: bold;font-size: 14px;cursor: pointer">组件丰富方式</div>

            </div>
          </el-collapse-item>
          <el-collapse-item title="页面组件" name="2">
            <div>
              <div @click="toPath('页面组件/组件依赖较多.md')" style="padding-left:20px;font-weight: bold;font-size: 14px;cursor: pointer">组件依赖较多</div>
              <div @click="toPath('页面组件/组件交互.md')" style="padding-left:20px;font-weight: bold;font-size: 14px;cursor: pointer">组件交互</div>
              <div @click="toPath('页面组件/组件可视化配置参数介绍.md')" style="padding-left:20px;font-weight: bold;font-size: 14px;cursor: pointer">组件可视化配置参数介绍</div>
              
            </div>
          </el-collapse-item>
          <el-collapse-item title="蓝图工具" name="3">
            <div>
              <span style="padding-left:20px;font-weight: bold;font-size: 14px;cursor: pointer">低代码开发平台</span>
            </div>
          </el-collapse-item>

          <el-collapse-item title="异常集锦" name="4">
            <div>
              <div @click="toPath('异常集锦/蓝图配置.md')" style="padding-left:20px;font-weight: bold;font-size: 14px;cursor: pointer">蓝图配置</div>

            </div>
          </el-collapse-item>


        </el-collapse>


      </div>
      <div style="height: 100%;flex-basis:80%;padding-left: 8%;overflow-y: scroll;">
        <v-md-preview :text="text"></v-md-preview>
      </div>
    </div>

  </div>

</template>

<script>
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';

import axios  from "axios";

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
export default {
  props: {

  },
  data() {
    return {
      text:"",
      activeNames:"1",

    }
  },
  components:{
    VMdPreview:VMdPreview
  },
  created(){

  },
  mounted() {
    this.toPath('介绍/低代码开发平台.md');
  },
  methods: {
    toPath(path){
      let filePath="../mdFile/"+path;
      this.text=this.readFile(filePath);
      //console.log("this.text1",this.text);
    },
    handleChange(val){
      console.log("val11",val);
    },
    //文件数据读取
    readFile(filePath) {
      // 创建一个新的xhr对象
      let xhr = null;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
      } else {
        // eslint-disable-next-line
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
      }
      const okStatus = document.location.protocol === 'file' ? 0 : 200;
      xhr.open('GET', filePath, false);
      xhr.overrideMimeType('text/html;charset=utf-8');
      xhr.send(null);
      return xhr.status === okStatus ? xhr.responseText : null;
    },
  }
}
</script>

<style scoped>
.titleClass {
  padding: 8px 16px;
  background-color: #fff6f7;
  border-radius: 4px;
  border-left: 5px solid #fe6c6f;
  margin: 10px 0;
  line-height: 40px;
}

:deep(.el-collapse-item__header) {
  color: #000000;
  font-size: 18px;
  font-weight: bold;
}

</style>

