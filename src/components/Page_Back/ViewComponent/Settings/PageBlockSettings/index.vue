<template>
  <div style="width: 100%;height: 100%;">
    <div style="width: 100%;height: 30px;background: #000000;color:rgba(255,255,255,0.6);padding-top: 8px" align="center">
      页面块配置
    </div>

    <div v-if="currentPageBlock?.page_block_config">
      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        页面块Ref：
      </div>
      <el-input v-model="currentPageBlock.page_block_ref"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" disabled placeholder="页面块Ref"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        页面块名称：
      </div>
      <el-input v-model="currentPageBlock.label"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="页面块名称"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        页面块高度：
      </div>
      <el-input v-model="currentPageBlock.page_block_config.attr.height"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="页面块高度"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        页面块宽度：
      </div>
      <el-input v-model="currentPageBlock.page_block_config.attr.width"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="页面块宽度"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        单位：
      </div>
      <el-input v-model="currentPageBlock.page_block_config.attr.unit"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="单位"/>

      <div align="center" style="margin-top: 15px">
        <el-button @click="updatePageBlockSettings" type="primary">页面块更新</el-button>
      </div>
    </div>

  </div>

</template>

<script>


import {commonExcuteRequest} from "../../../../../common/js/request";
import axios from "axios";

export default {
  props: {
    currentPageBlock: {
      type: Object,
      default: null
    },
  },
  data: function () {
    return {

    }
  },

  created() {

  },
  components: {},
  methods: {
    updatePageBlockSettings(){
      let param = {};
      param.sql = "page_block_tree.updatePageBlockConfig";
      param.id = this.currentPageBlock.id;
      param.page_block_config_str = JSON.stringify(this.currentPageBlock.page_block_config);
      param.name = this.currentPageBlock.label;
      console.log("param33331", param);
      commonExcuteRequest(axios, param, this.updatePageBlockSettingsCallBack);
    },
    updatePageBlockSettingsCallBack(result){
      console.log("result11",result);
      if(result.state=="success"){
        window.cbcBlockTreeInstance.ctx.pageBlockTreeNodeClick(this.currentPageBlock,null);
      }
    }
  },
  mounted() {
    console.log("页面块this.currentPageBlock：",this.currentPageBlock);
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