<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">配置信息</span></el-divider>
    <el-button type="success" @click="showBlueScriptOptionDialog">配置信息</el-button>


    <el-dialog
        v-model="blueScriptOptionDialogVisible"
        title="蓝图配置信息"
        append-to-body
        :draggable="true"
        width="60%"
        top="20vh"
        :close-on-click-modal="false"
        style="height: 500px;"
        :modal="false"
        @opened="openedHandle">
      <MyMonacoEditor v-if="blueScriptOptionFlag && currentBlueScript?.config" :id="SetOptionEditorID" style="overflow-y: hidden;height: 300px;width: 100%" :code="currentBlueScript.config.optionStr" @update="updateConfig"></MyMonacoEditor>
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
      SetOptionEditorID:"SetOptionEditorID",
      blueScriptOptionFlag:false,
      blueScriptOptionDialogVisible:false,
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
      this.blueScriptOptionDialogVisible = false;
      this.blueScriptOptionFlag=false;
    },
    openedHandle(){
      this.blueScriptOptionFlag=false;
      if(typeof (this.currentBlueScript.config.optionStr)=="undefined"){

        this.currentBlueScript.config.optionStr='{\r\n    option: {\r\n   \r\n    }\r\n}';
        let the=this;
        this.$nextTick(()=>{
          the.blueScriptOptionFlag=true;
        });
      }else{
        let the=this;
        this.$nextTick(()=>{
          the.blueScriptOptionFlag=true;
        });
      }
    },
    showBlueScriptOptionDialog(){
      this.blueScriptOptionDialogVisible=true;
    },
    updateConfig(code) {
      this.currentBlueScript.config.optionStr=code;
    },
  },
  mounted() {



  }
}
</script>

<style scoped>


</style>