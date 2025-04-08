<template>
  <div>
    <el-divider content-position="left"><span style="font-size: 18px">关联全局配置参数</span></el-divider>

    <div style="margin-top: 5px;color:rgba(255, 255, 255, 0.5);font-size: 14px">全局配置参数：</div>
    <el-select :teleported="false" style="width:200px"
               v-model="currentBlueScript.config.settings.RelevanceGlobalSettingParamField" class="m-2"
               placeholder="Select">
      <el-option
          v-for="item in RelevanceGlobalSettingParamOptions"
          :key="item.fieldname"
          :label="item.fieldname"
          :value="item.fieldname"
      />
    </el-select>

  </div>
</template>
<script>

export default {
  props: {
    currentBlueScript: {
      type: Object,
      default: {}
    },
  },
  data: function () {
    return {
      RelevanceGlobalSettingParamOptions: []
    }
  },

  created() {

  },
  watch: {},

  methods: {},
  mounted() {
    this.RelevanceGlobalSettingParamOptions=[];
    if(typeof (window.cbcGlobalSettings)!="undefined" && typeof (window.cbcGlobalSettings.params)!="undefined"){
      Object.keys(window.cbcGlobalSettings.params).forEach(key => {
        let obj = {};
        obj.fieldname = key;
        this.RelevanceGlobalSettingParamOptions.push(obj);
      })
    }else {
      console.error("请先进入调试界面，并获取全局参数！");
    }

  }
}
</script>

<style scoped>

</style>