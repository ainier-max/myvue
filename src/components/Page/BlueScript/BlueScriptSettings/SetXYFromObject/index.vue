<template>
  <div >
    <el-divider content-position="left"><span style="font-size: 18px">XY字段设置</span></el-divider>

    <div style="margin-top: 5px;color:rgba(255, 255, 255, 0.5);font-size: 14px">X字段：</div>
    <el-select  :teleported="false" style="width:200px" v-model="currentBlueScript.config.xField" class="m-2" placeholder="Select">
      <el-option
          v-for="item in xFieldOptions"
          :key="item.fieldname"
          :label="item.fieldname"
          :value="item.fieldname"
      />
    </el-select>
    <div style="margin-top: 5px;color:rgba(255, 255, 255, 0.5);font-size: 14px">Y字段：</div>
    <el-select  :teleported="false" style="width:200px" v-model="currentBlueScript.config.yField" class="m-2" placeholder="Select">
      <el-option
          v-for="item in yFieldOptions"
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
      xFieldOptions:[],
      yFieldOptions:[],
    }
  },

  created() {

  },
  watch: {

  },

  methods: {

  },
  mounted() {
    let intemp=this.currentBlueScript.config.in_out_config.in;
    console.log("SetXYFromObject--intemp",intemp);
    for(let i=0;i<intemp.length;i++){
      if(intemp[i].label=="object"){
        if(intemp[i].value!=null){
          Object.keys(intemp[i].value).forEach(key => {
            let obj={};
            obj.fieldname=key;
            this.xFieldOptions.push(obj);
            this.yFieldOptions.push(obj);
          })
        }

      }
    }


  }
}
</script>

<style scoped>

</style>