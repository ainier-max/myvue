<template>
  <div v-if="currentBlueScript?.config?.settings?.RelevanceBlock">

    <el-divider content-position="left"><span style="font-size: 18px">加载区块</span></el-divider>
    <el-select  @change="blockSelectChange" :teleported="false" style="width:200px" v-model="currentBlueScript.config.settings.RelevanceBlock.page_block_ref" class="m-2" placeholder="Select">
      <el-option
          v-for="item in blockSelectOptions"
          :key="item.page_block_ref"
          :label="item.name"
          :value="item.page_block_ref"
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
      blockSelectOptions:[]
    }
  },
  components: {
  },

  created() {

  },
  watch: {

  },
  methods: {
    blockSelectChange(val){
      this.currentBlueScript.config.settings.RelevanceBlock.page_block_ref=val;
      for(let i=0;i<this.blockSelectOptions.length;i++){
        if(this.blockSelectOptions[i].page_block_ref==val){
          this.currentBlueScript.config.settings.RelevanceBlock.name=this.blockSelectOptions[i].name;
        }
      }
    },
  },
  mounted() {
    console.log("RelevanceBlock--this.currentBlueScript",this.currentBlueScript);
    this.blockSelectOptions=[];
    //console.log("window.cbcViewDraggleResizableInstance.data.pageComponents;",window.cbcViewDraggleResizableInstance.data.pageComponents);
    let blocksTemp=window.cbcBlueScriptBlockTreeInstance.data.pageBlockData;
    console.log("blocksTemp",blocksTemp);
    for(let i=0;i<blocksTemp.length;i++){
      let obj={};
      obj.name=blocksTemp[i].name;
      obj.page_block_ref=blocksTemp[i].page_block_ref;
      this.blockSelectOptions.push(obj);
    }
    //console.log("this.blockSelectOptions1112",this.blockSelectOptions);
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