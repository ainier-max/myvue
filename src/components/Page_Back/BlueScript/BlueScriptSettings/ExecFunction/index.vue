<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">蓝图执行函数</span></el-divider>
    <el-button type="success" @click="showBlueScriptFunDialog">蓝图执行函数</el-button>


    <el-dialog
        v-model="blueScriptFunDialogVisible"
        title="蓝图执行方法"
        append-to-body
        :draggable="true"
        width="60%"
        top="20vh"
        :close-on-click-modal="false"
        style="height: 500px;"
        :modal="false"
        @opened="openedHandle">
      <MyMonacoEditor v-if="blueScriptFunFlag && currentBlueScript?.config" :id="ExecFunctionEditorID" style="overflow-y: hidden;height: 300px;width: 100%" :code="currentBlueScript.config.execFunctionStr" @update="updateConfig"></MyMonacoEditor>
      <template #footer>
      <span class="dialog-footer" style="padding-bottom:200px">
        <el-button @click="closeHandle">
          关 闭
        </el-button>
      </span>
      </template>
    </el-dialog>


  </div>
</template>

<script>

import MyMonacoEditor from '../../../../../common/component/CodeEditor/MyMonacoEditor/index.vue'


export default {
  props: {
    currentBlueScript: {
      type: Object,
      default: {}
    },
  },
  data: function () {
    return {
      ExecFunctionEditorID:"ExecFunctionEditorID",
      blueScriptFunFlag:false,
      blueScriptFunDialogVisible:false,
    }
  },
  components: {
    MyMonacoEditor:MyMonacoEditor,
  },

  created() {

  },
  watch: {

  },
  methods: {
    closeHandle(){
      this.blueScriptFunDialogVisible = false;
      this.blueScriptFunFlag=false;
    },
    openedHandle(){
      this.blueScriptFunFlag=false;
      if(typeof (this.currentBlueScript.config.execFunctionStr)=="undefined"){
        console.log("执行函数为空");
        this.currentBlueScript.config.execFunctionStr='{\r\n    dataDeal:function(param) {\r\n        console.log(\"eventToString--param\",param);\r\n        return param;\r\n    }\r\n}';
        let the=this;
        this.$nextTick(()=>{
          the.blueScriptFunFlag=true;
        });
      }else{
        console.log("执行函数不为空");
        let the=this;
        this.$nextTick(()=>{
          the.blueScriptFunFlag=true;
        });
      }
    },
    showBlueScriptFunDialog(){
      this.blueScriptFunDialogVisible=true;
    },
    updateConfig(code) {
      this.currentBlueScript.config.execFunctionStr=code;
    },
  },
  mounted() {



  }
}
</script>

<style scoped>


</style>