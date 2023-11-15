<template>
  <div style="width: 100%;height: 100%;overflow-y:hidden">
    <div class="box left"  id="leftBox">
      <div class="resize-bar"></div>
      <div class="resize-line"></div>
      <div class="resize-box" id="resize-box">
        <el-radio-group v-model="changeType" label="size control"
                        style="position:absolute;right: 20px;top:10px;z-index: 1" @change="changeTypeFun">
          <el-radio-button label="vue">组件代码</el-radio-button>
          <el-radio-button label="config">开发者配置</el-radio-button>
          <el-radio-button label="visualize">可视化配置</el-radio-button>
        </el-radio-group>

        <!--代码-->
        <MyMonacoEditor v-if="codeShowFlag==true && changeType=='vue' && this.componentInfo!=null" :id="vueCodeID" :code="this.componentInfo.component_code" @update="updateConfig"></MyMonacoEditor>

        <!--开发者配置-->
        <MyMonacoEditor v-if="codeShowFlag==true && changeType=='config' && this.componentInfo!=null" :id="configCodeID" :code="component_config_str" @update="updateConfig"></MyMonacoEditor>

        <!--可视化配置-->
        <div v-if="changeType=='visualize' && this.componentInfo!=null" style="width: 100%;height: 100%;padding: 30px;background: #282c34;">
          <el-tabs v-model="activeName" class="demo-tabs" @tab-change="tabsHandleClick" style="width: 100%;height: 100%;">
            <el-tab-pane label="可视化属性" name="first" style="width: 100%;height: 100%;">
              <MyMonacoEditor ref="visualizeCodeRef" v-if="codeShowFlag==true" :id="visualizeCodeID" :code="component_visualize_str" @update="updateConfig" style="width: 100%;height: 100%;"></MyMonacoEditor>
            </el-tab-pane>
            <el-tab-pane label="可视化页面" name="second">
              <DynamicsSetting :visualizeOptions="visualizeOptions" style="padding: 10px" @updateConfigParam="updateConfigParam"></DynamicsSetting>
            </el-tab-pane>
          </el-tabs>
        </div>

      </div>
    </div>
    <div class="box right" id="rightDiv" style="background: #282c34;overflow-y:hidden">
      <el-button @click="saveComponentInfo" style="position:absolute;left: 20px;top:11px;z-index: 1"
                 type="primary">保存
      </el-button>
      <el-button @click="returnFun" style="position:absolute;left: 80px;top:11px;z-index: 1"
                 >返回
      </el-button>
      <iframe id="receiver" width="100%" height="100%" :src="iframeUrl" frameborder="no"></iframe>
    </div>
  </div>
</template>

<script>
import MyMonacoEditor from '@/common/component/CodeEditor/MyMonacoEditor/index.vue'

import DynamicsSetting from '../DynamicsSetting/index.vue'
import axios from 'axios'

import {commonSelectRequest, commonSelectRequestAndOtherParam, commonExcuteRequest} from "@/common/js/request.js"

import {objectToString, stringToObject} from "@/common/js/objStr.js";
import {js_beautify} from "js-beautify";

import elementResizeDetectorMaker from "element-resize-detector";

export default {
  name: 'ComponentUpload',
  props: {},
  components: {
    MyMonacoEditor,
    DynamicsSetting
  },
  data() {
    return {
      changeType: 'vue',
      component_config_str: '',//开发者配置
      component_visualize_str:'',//可视化配置字符串
      visualizeOptions:{},//可视化配置对象
      activeName:'first',
      componentInfo: null,
      iframeUrl: window.cbcConfig.deployUrl + "ComponentRegisterIframe",
      timer: null,
      vueCodeID:"vueCodeID",
      configCodeID:"configCodeID",
      visualizeCodeID:"visualizeCodeID",
      codeShowFlag:true,
    }
  },

  methods: {

    //保存组件
    saveComponentInfo() {
      var param = {};
      param.sql = "page_component_frontend.updateComponentConfigAndCode";
      param.component_id = this.componentInfo.component_id;
      param.component_config_str = objectToString(this.componentInfo.config);
      param.component_code = this.componentInfo.component_code;
      param.component_visualize_str = this.component_visualize_str;
      commonExcuteRequest(axios, param, this.saveCallBack);
    },
    saveCallBack(result) {
      if (result.state == "success") {
        this.$message.success('保存成功！');
      }
    },

    findComponentInfo() {
      var param = {};
      param.sql = "page_component_frontend.find";
      param.component_id = this.$route.query.component_id;
      commonSelectRequest(axios, param, this.findComponentInfoCallBack);
    },
    findComponentInfoCallBack(result) {
      this.componentInfo={};
      this.component_config_str = js_beautify(result.objects[0].component_config_str);
      this.componentInfo.component_id = result.objects[0].component_id;
      this.componentInfo.component_code = result.objects[0].component_code;
      this.component_visualize_str=result.objects[0].component_visualize_str;
      this.componentInfo.config = stringToObject(result.objects[0].component_config_str);
      this.setVisualizeOptions(this.component_visualize_str);
      //更新效果图
      this.sendMeaage();
    },
    setVisualizeOptions(component_visualize_str){
      this.visualizeOptionsTemp=eval("(" + component_visualize_str + ")").visualizeOptions;
      for(let i=0;i<this.visualizeOptionsTemp.length;i++){
        const strTemp="this.componentInfo.config."+this.visualizeOptionsTemp[i].name;
        if(this.visualizeOptionsTemp[i].type=="string"){
          this.visualizeOptionsTemp[i].value=eval("(" + strTemp + ")")+"";
        }else{
          this.visualizeOptionsTemp[i].value=eval("(" + strTemp + ")");
        }

      }
      this.visualizeOptions=this.visualizeOptionsTemp;
    },


    updateConfigParam(item){
      let strTemp="";
      if(item.type=="color" || item.type=="string" || item.type=="photo"){
        strTemp="this.componentInfo.config."+item.name+"='"+item.value+"'";
      }else{
        strTemp="this.componentInfo.config."+item.name+"="+item.value;
      }
      console.log("strTemp",strTemp);
      eval( strTemp );
      //更新效果图
      this.sendMeaage();
    },

    changeTypeFun(val) {
      console.log("this.componentInfo11", this.componentInfo);
      if(val == "config") {
        this.component_config_str = js_beautify(objectToString(this.componentInfo.config));
      }
      if(val=="visualize"){
        this.setVisualizeOptions(this.component_visualize_str);
      }
    },
    tabsHandleClick(tabName){
      if(tabName=="first"){
        this.codeShowFlag=false;
        let the=this;
        this.$nextTick(()=>{
          the.codeShowFlag=true;
        });
      }
      if(tabName=="second"){
        this.setVisualizeOptions(this.component_visualize_str);
      }
    },

    //子组件MyCodeMirror传回来的值
    updateConfig(code) {
      if(this.changeType=="vue"){
        this.componentInfo.component_code = code;
        this.sendMeaage();
      }else if(this.changeType=="config"){
        this.component_config_str = code;
        this.componentInfo.config = eval("(" + code + ")");
        this.sendMeaage();
      }else if(this.changeType=="visualize"){
        this.component_visualize_str=code;
      }

    },
    returnFun(){
      this.$router.push('/Main/Uphold')
    },

    sendMeaage() {
      var the = this;
      let frame = document.getElementById("receiver");
      //重新加载iframe页面
      frame.src = 'about:blank';
      frame.onload = function () {
        frame.src = the.iframeUrl;
        frame.onload = function () {return false;}
      }

      let receiverWindow = frame.contentWindow;
      if (this.timer != null) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
      this.timer = window.setInterval(function () {
        if (typeof (receiverWindow.cbcIframeFunction) != "undefined") {
          receiverWindow.cbcIframeFunction(the.componentInfo);
          window.clearInterval(the.timer);
        }
      }, 100);
    },
  },
  mounted() {
    this.findComponentInfo();

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
  width: 40vw;
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

