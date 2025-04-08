<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">对象取值设置</span></el-divider>
    <div style="margin-top: 5px;color:rgba(255, 255, 255, 0.5);font-size: 14px">返回值：</div>

    <el-select  v-model="currentBlueScript.config.settings.GetValueFromObjectSetting" class="m-2" style="width: 150px;padding-top: 10px" placeholder="Select">
      <el-option
          v-for="item in returnValues"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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

    }
  },
  components: {},

  created() {

  },
  //监听currentBlueScript 待完成
  //建议：compute
  computed: {
    "returnValues"() {
      let returnValuesTemp=[];
      let inTemp = this.currentBlueScript.config.in_out_config.in[0];
      //console.log("inTemp1",inTemp);
      if (inTemp.value != null) {
        let keysTemp = Object.keys(inTemp.value);
        for (let i = 0; i < keysTemp.length; i++) {
          let obj = {};
          obj.value = keysTemp[i];
          obj.label = keysTemp[i];
          returnValuesTemp.push(obj);
        }
      }
      return returnValuesTemp;
    }
  },
  watch: {


  },
  methods: {

  },
  mounted() {
    console.log("GetValueFromObjectSetting--this.currentBlueScript",this.currentBlueScript);




  }
}
</script>

<style scoped>


</style>