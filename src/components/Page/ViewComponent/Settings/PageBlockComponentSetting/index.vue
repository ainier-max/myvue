<template>
  <div style="width: 100%;height: 100%;">
    <div style="width: 100%;height: 30px;background: #000000;color:rgba(255,255,255,0.6);padding-top: 8px" align="center">
      组件配置
    </div>

    <div v-if="currentPageBlockComponent.component_ref!=''">
      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">组件ref：
      </div>
      <el-input v-model="currentPageBlockComponent.component_ref" disabled
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="未选中组件"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">组件id：
      </div>
      <el-input v-model="currentPageBlockComponent.component_id" disabled
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="未选中组件"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">组件名称：
      </div>
      <el-input v-model="currentPageBlockComponent.component_name"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="未选中组件"/>

      <el-divider content-position="left"><span style="font-size: 18px">开发者配置</span></el-divider>
      <el-button type="success" @click="showDevConfigDialog" style="margin-left: 15px">开发者配置</el-button>

      <el-divider v-if="visualizeOptions!=null" content-position="left"><span style="font-size: 18px">可视化配置</span></el-divider>
      <DynamicsSetting v-if="visualizeOptions!=null" :visualizeOptions="visualizeOptions" style="padding: 10px;overflow:hidden"
                       @updateConfigParam="updateVisualizeOptions"></DynamicsSetting>
    </div>
    <div v-if="currentPageBlockComponent.ref==''" align="center">
      <span style="color: red;font-size: 18px">未选中图层</span>
    </div>



    <el-dialog
        v-model="showDevConfigDialogFlag"
        title="开发者配置"
        append-to-body
        :draggable="true"
        width="50%"
        top="10vh"
        style="height: 700px;"
        @opened="openedHandle">
      <MyMonacoEditor v-if="showDevConfigFlag" :id="pageComponentConfigCodeID" :code="currentComponentConfigStr"
                      @update="updateConfig" style="height:520px;"></MyMonacoEditor>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="closeHandle">
          关 闭
        </el-button>
      </span>
      </template>
    </el-dialog>

  </div>

</template>

<script>
import DynamicsSetting from '../../../../Main/Component/DynamicsSetting/index.vue';
import {objectToString, stringToObject} from "../../../../../common/js/objStr";
import {js_beautify} from "js-beautify";
import MyMonacoEditor from "../../../../../common/component/CodeEditor/MyMonacoEditor/index.vue"


export default {
  props: {
    currentPageBlockComponent: {
      type: Object,
      default: null
    },
  },
  data: function () {
    return {
      showDevConfigFlag: false,
      showDevConfigDialogFlag: false,
      pageComponentConfigCodeID: "pageComponentConfigCodeID",
      currentComponentConfigStr: '',
      visualizeOptions: null,

    }
  },

  created() {

  },
  components: {
    DynamicsSetting:DynamicsSetting,
    MyMonacoEditor:MyMonacoEditor,
  },
  methods: {
    showDevConfigDialog() {
      this.showDevConfigDialogFlag = true;
    },
    closeHandle() {
      this.showDevConfigDialogFlag = false;
      this.showDevConfigFlag = false;
    },
    openedHandle() {
      this.showDevConfigFlag = false;
      this.setCurrentComponentConfigStr();
      let the = this;
      this.$nextTick(() => {
        the.showDevConfigFlag = true;
      });
    },
    //开发者配置
    updateConfig(code) {
      //console.log("code:",code);
      this.currentPageBlockComponent.component_config = stringToObject(code);
      //刷新组件
      window.cbcViewDraggleResizableInstance.ctx.refreshComponent(this.currentPageBlockComponent);
      this.setCurrentComponentVisualizeOptions();
    },
    //可视化配置
    updateVisualizeOptions(itemConfig) {
      console.log("itemConfig:",itemConfig);
      let strTemp = "";
      if (itemConfig.type == "color" || itemConfig.type == "word" || itemConfig.type == "photo") {
        strTemp = "this.currentPageBlockComponent.component_config." + itemConfig.name + "='" + itemConfig.value + "'";
      } else {
        strTemp = "this.currentPageBlockComponent.component_config." + itemConfig.name + "=" + itemConfig.value;
      }
      //console.log("strTemp",strTemp);
      eval(strTemp);
      //刷新组件
      window.cbcViewDraggleResizableInstance.ctx.refreshComponent(this.currentPageBlockComponent);
    },

    setCurrentComponentVisualizeOptions() {
      console.log("更新'开发者配置'页面");
      let component_visualize_obj=eval("(" + this.currentPageBlockComponent.component_visualize_str + ")");
      if(component_visualize_obj!=null){
        let visualizeOptionsTemp = eval("(" + this.currentPageBlockComponent.component_visualize_str + ")").visualizeOptions;
        for (let j = 0; j < visualizeOptionsTemp.length; j++) {
          const strTemp = "this.currentPageBlockComponent.component_config." + visualizeOptionsTemp[j].name;
          if (visualizeOptionsTemp[j].type == "word") {
            visualizeOptionsTemp[j].value = eval("(" + strTemp + ")") + "";
          } else {
            visualizeOptionsTemp[j].value = eval("(" + strTemp + ")");
          }
        }
        this.visualizeOptions = visualizeOptionsTemp;
      }
    },

    setCurrentComponentConfigStr() {
      //console.log("更新'可视化配置'页面");
      this.currentComponentConfigStr = js_beautify(objectToString(this.currentPageBlockComponent.component_config));
    },



  },
  mounted() {
    console.log("页面块组件this.currentPageBlockComponent：",this.currentPageBlockComponent);
    this.setCurrentComponentVisualizeOptions();
  }
}
</script>

<style scoped>
:deep(.el-input__wrapper) {
  background-color: #222629;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #222629;
  box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
}
</style>