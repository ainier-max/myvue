<template>
  <div v-if="currentBlueScript?.config?.settings?.RelevanceLayout">

    <el-divider content-position="left"><span style="font-size: 18px">关联布局</span></el-divider>
    <el-select  @change="layoutSelectChange" :teleported="false" style="width:200px" v-model="currentBlueScript.config.settings.RelevanceLayout.layout_ref" class="m-2" placeholder="Select">
      <el-option
          v-for="item in layoutSelectOptions"
          :key="item.layout_ref"
          :label="item.name"
          :value="item.layout_ref"
      />
    </el-select><br>
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
      layoutSelectOptions:[]
    }
  },
  components: {
  },

  created() {

  },
  watch: {

  },
  methods: {
    layoutSelectChange(val){
      this.currentBlueScript.config.settings.RelevanceLayout.layout_ref=val;
      for(let i=0;i<this.layoutSelectOptions.length;i++){
        if(this.layoutSelectOptions[i].layout_ref==val){
          this.currentBlueScript.config.settings.RelevanceLayout.name=this.layoutSelectOptions[i].name;
        }
      }
    },
  },
  mounted() {


    console.log("RelevanceLayout--this.currentBlueScript",this.currentBlueScript);
    this.layoutSelectOptions=[];
    //console.log("window.cbcViewDraggleResizableInstance.data.pageComponents;",window.cbcViewDraggleResizableInstance.data.pageComponents);
    let layoutTemp=window.cbcPageInstance.data.pageLayouts;
    console.log("layoutTemp111::",layoutTemp);
    for(let i=0;i<layoutTemp.length;i++){
      let obj={};
      obj.name=layoutTemp[i].layout_name;
      obj.layout_ref=layoutTemp[i].layout_ref;
      this.layoutSelectOptions.push(obj);
    }
    //console.log("this.layoutSelectOptions1112",this.layoutSelectOptions);
  }
}
</script>

<style scoped>
:deep(.el-divider__text) {
  position: absolute;
  background-color: rgb(40, 44, 52);
  padding: 0 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

</style>