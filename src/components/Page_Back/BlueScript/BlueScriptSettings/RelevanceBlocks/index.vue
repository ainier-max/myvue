<template>
  <div v-if="currentBlueScript?.config">

    <el-divider content-position="left"><span style="font-size: 18px">选择区块</span></el-divider>
    <el-select @change="blockSelectChange" :teleported="false" style="width:200px" v-model="blockSelectedValue" class="m-2" placeholder="Select">
      <el-option
          v-for="item in blockSelectOptions"
          :key="item.page_block_ref"
          :label="item.name"
          :value="item.page_block_ref"
      />
    </el-select><br>
    <el-button type="primary" size="small" style="margin-top: 15px" @click="addRelevanceComponent">添加关联区块</el-button>
    <el-divider content-position="left"><span style="font-size: 18px">已设置区块</span></el-divider>

    <el-table
        v-if="currentBlueScript?.config"
        :data="currentBlueScript.config.settings.RelevanceBlocks"
        border
        stripe
        style="width: 100%;margin-top: 5px">
      <el-table-column prop="name" label="name" width="120"/>
      <el-table-column prop="page_block_ref" label="page_block_ref"/>
      <el-table-column fixed="right" label="操作" width="60">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="deleteClick(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


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
      blockSelectedValue:'',
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
    deleteClick(scope){
      //console.log("scope.row",scope.row);
      for(let i=0;i<this.currentBlueScript.config.settings.RelevanceBlocks.length;i++){
        if(this.currentBlueScript.config.settings.RelevanceBlocks[i].page_block_ref==scope.row.page_block_ref){
          this.currentBlueScript.config.settings.RelevanceBlocks.splice(i,1);
          break;
        }
      }
    },
    blockSelectChange(val){
      console.log("val22",val);
    },
    addRelevanceComponent(){

      if(this.blockSelectedValue=="" || this.blockSelectedValue=="" ){
        this.$message.error("区块未被选择！");
        return;
      }

      let obj={};
      obj.page_block_ref=this.blockSelectedValue;
      for(let i=0;i<this.blockSelectOptions.length;i++){
        if(this.blockSelectedValue==this.blockSelectOptions[i].page_block_ref){
          obj.name=this.blockSelectOptions[i].name;
        }
      }
      this.currentBlueScript.config.settings.RelevanceBlocks.push(obj);
    }

  },
  mounted() {
    console.log("RelevanceBlocks--this.currentBlueScript",this.currentBlueScript);
    if(typeof (this.currentBlueScript.config.settings.RelevanceBlocks)=="undefined"){
      this.currentBlueScript.config.settings.RelevanceBlocks=[];
    }
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