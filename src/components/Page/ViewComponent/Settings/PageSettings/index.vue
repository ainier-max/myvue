<template>
  <div style="width: 100%;height: 100%;">
    <div style="width: 100%;height: 30px;background: #000000;color:rgba(255,255,255,0.6);padding-top: 8px" align="center">
      页面配置
    </div>

    <div v-if="currentPageBlock?.page_block_config">
      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        页面名称：
      </div>
      <el-input v-model="currentPageBlock.label"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="页面名称"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        页面高度：
      </div>
      <el-input v-model="currentPageBlock.page_block_config.attr.height"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="页面高度"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        页面宽度：
      </div>
      <el-input v-model="currentPageBlock.page_block_config.attr.width"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="页面高度"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        单位：
      </div>
      <el-input v-model="currentPageBlock.page_block_config.attr.unit"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="单位"/>


      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        背景：
      </div>
      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 12px">
        颜色
        <el-switch
            v-model="currentPageBlock.page_block_config.attr.background.type"
            class="mb-2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-value="img"
            inactive-value="color"
        />
        图片
        <div></div>

        <div>
          <!--otherParam 会跟着子组件调用父组件的事件参数-->
          <ChooseImg v-if="currentPageBlock.page_block_config.attr.background.type=='img'" otherParam=""
                     :imgUUID="currentPageBlock.page_block_config.attr.background.value"
                     @getNewImgUrl="getNewImgUrlByTopPageBlock"></ChooseImg>
          <el-color-picker v-if="currentPageBlock.page_block_config.attr.background.type=='color'"  v-model="currentPageBlock.page_block_config.attr.background.value" show-alpha />
        </div>
      </div>

      <!--
      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        背景颜色
      </div>
      <div style="padding-top:5px;margin-left: 15px;padding-right: 15px">
        <el-color-picker  v-model="currentPageBlock.page_block_config.attr.backgroundColor" show-alpha />
      </div>
      -->

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        页面封面：
      </div>
      <div style="padding-left: 15px;margin-top: 10px;">
        <ChooseImg v-if="currentPageBlock.page_block_config.attr.background.type=='img'" otherParam=""
                   :imgUUID="currentPageBlock.page_img" @getNewImgUrl="getNewImgUrlByPageImg"></ChooseImg>
      </div>


      <div align="center" style="margin-top: 15px">
        <el-button @click="updatePageSettings" type="primary">页面更新</el-button>
      </div>

    </div>

  </div>

</template>

<script>

import {commonExcuteRequest} from "../../../../../common/js/request";
import {objectToString} from "../../../../../common/js/objStr.js";
import ChooseImg from "../../../../../common/component/ChooseImg/index.vue";

export default {
  props: {
    currentPageBlock: {
      type: Object,
      default: null
    },
  },
  data: function () {
    return {
      typeOptions:[
        {
          label:'高度伸展',
          value:'spread'
        },
        {
          label:'高度适配',
          value:'suit'
        }
      ]

    }
  },

  created() {

  },
  components: {
    ChooseImg:ChooseImg
  },
  methods: {
    getNewImgUrlByTopPageBlock(imgUUID,otherParam){
      console.log("getNewImgUrlByTopPageBlock--imgUUID,otherParam",imgUUID,otherParam);
      this.currentPageBlock.page_block_config.attr.background.value=imgUUID;
    },
    getNewImgUrlByPageImg(imgUUID,otherParam){
      console.log("getNewImgUrlByPageImg--imgUUID,otherParam",imgUUID,otherParam);
      this.currentPageBlock.page_img=imgUUID;
    },
    updatePageSettings(){
      console.log("PageSetting--this.currentPageBlock",this.currentPageBlock);
      let param = {};
      param.sql = "page_centre.updatePageConfig";
      param.page_block_config_str = objectToString(this.currentPageBlock.page_block_config);
      param.name=this.currentPageBlock.label;
      param.page_block_ref=this.currentPageBlock.page_block_ref;
      param.page_img=this.currentPageBlock.page_img;
      param.page_id=this.currentPageBlock.page_id;
      commonExcuteRequest(window.axios, param, this.updatePageSettingsCallBack);
    },
    updatePageSettingsCallBack(result){
      console.log("result111",result);
      if (result.state == "success") {
        this.$message.success('页面更新成功！');
        window.cbcPageInstance.data.designTab="no";
        this.$nextTick(()=>{
          window.cbcPageInstance.data.designTab="first";
        });

      }
    }
  },
  mounted() {


  }
}
</script>

<style scoped>
:deep(.el-input__wrapper) {
  display: inline-flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 1px 11px;
  background-color: #222629;
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  transition: var(--el-transition-box-shadow);
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #222629;
  box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
}
</style>