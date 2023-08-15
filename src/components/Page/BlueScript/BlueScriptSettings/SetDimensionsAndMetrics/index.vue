<template>
  <div >
    <el-divider content-position="left"><span style="font-size: 18px">字段设置</span></el-divider>
    <div style="padding-top:5px;color:rgba(255, 255, 255, 0.5);">
      结果字段：
    </div>
    <div style="padding-top: 10px">
      <el-tag
          style="margin-left: 10px"
          v-for="field in currentBlueScript.config.dataSet.fields">
        {{ field }}
      </el-tag>
    </div>

    <div style="padding-top:5px;color:rgba(255, 255, 255, 0.5);">
      维度字段设置：
    </div>
    <div style="padding-top: 10px">
      <el-tag
          style="margin-left: 10px"
          v-for="dimension in currentBlueScript.config.dataSet.dimensions"
          :key="dimension"
          class="mx-1"
          closable
          :disable-transitions="false"
          @close="handleDimensionTagClose(dimension)"
          type="success">
        {{ dimension }}
      </el-tag>
      <el-input
          v-if="dimensionInputVisible"
          ref="dimensionInputRef"
          v-model="dimensionInputValue"
          class="ml-1 w-20"
          size="small"
          style="margin-left:10px;width: 60px"
          @keyup.enter="handleDimensionInputConfirm"
      />
      <el-button v-else class="button-new-tag ml-1" size="small" style="margin-left:10px;"
                 @click="showDimensionInput">
        + New Tag
      </el-button>
    </div>
    <div style="padding-top:5px;color:rgba(255, 255, 255, 0.5);">
      指标字段设置：
    </div>
    <div style="padding-top: 10px">
      <el-tag
          style="margin-left: 10px"
          v-for="metric in currentBlueScript.config.dataSet.metrics"
          :key="metric"
          class="mx-1"
          closable
          :disable-transitions="false"
          @close="handleMetricsTagClose(metric)"
          type="success">
        {{ metric }}
      </el-tag>
      <el-input
          v-if="metricsInputVisible"
          ref="metricsInputRef"
          v-model="metricsInputValue"
          class="ml-1 w-20"
          size="small"
          style="margin-left:10px;width: 60px"
          @keyup.enter="handleMetricsInputConfirm"
      />
      <el-button v-else class="button-new-tag ml-1" size="small" style="margin-left:10px;" @click="showMetricsInput">
        + New Tag
      </el-button>
    </div>
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
      dimensionInputVisible: false,
      dimensionInputValue: '',

      metricsInputVisible: false,
      metricsInputValue: '',


    }
  },

  created() {

  },
  watch: {},


  methods: {
    updateSetField(){
      let fieldObj={};
      fieldObj.dimensions=this.currentBlueScript.config.dataSet.dimensions;
      fieldObj.metrics=this.currentBlueScript.config.dataSet.metrics;
      this.$emit("updateSetField",fieldObj);
    },
    handleDimensionInputConfirm() {
      //console.log("handleDimensionInputConfirm8888");
      if (this.dimensionInputValue) {
        this.currentBlueScript.config.dataSet.dimensions.push(this.dimensionInputValue);
      }
      this.dimensionInputVisible = false;
      this.dimensionInputValue = '';

      this.updateSetField();
    },
    showDimensionInput() {
      let the = this;
      this.dimensionInputVisible = true
      this.$nextTick(() => {
        the.$refs.dimensionInputRef.input.focus();
      })
    },
    handleDimensionTagClose(tab) {
      //console.log("handleDimensionTagClose8888");
      for (let i = 0; i < this.currentBlueScript.config.dataSet.dimensions.length; i++) {
        if (this.currentBlueScript.config.dataSet.dimensions[i] == tab) {
          this.currentBlueScript.config.dataSet.dimensions.splice(i, 1);
          i = i - 1;
        }
      }
      this.updateSetField();
    },
    handleMetricsInputConfirm() {
      if (this.metricsInputValue) {
        this.currentBlueScript.config.dataSet.metrics.push(this.metricsInputValue);
      }
      this.metricsInputVisible = false;
      this.metricsInputValue = '';
      this.updateSetField();
    },
    showMetricsInput() {
      let the = this;
      this.metricsInputVisible = true
      this.$nextTick(() => {
        the.$refs.metricsInputRef.input.focus();
      })
    },
    handleMetricsTagClose(tab) {
      for (let i = 0; i < this.currentBlueScript.config.dataSet.metrics.length; i++) {
        if (this.currentBlueScript.config.dataSet.metrics[i] == tab) {
          this.currentBlueScript.config.dataSet.metrics.splice(i, 1);
          i = i - 1;
        }
      }
      this.updateSetField();
    },
  },
  mounted() {


  }
}
</script>

<style scoped>

</style>