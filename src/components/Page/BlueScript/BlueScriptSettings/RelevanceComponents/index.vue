<template>
  <div v-if="currentBlueScript?.config">

    <el-divider content-position="left"><span style="font-size: 18px">选择组件</span></el-divider>
    <el-select @change="layerSelectChange" :teleported="false" style="width:200px" v-model="layerSelectedValue" class="m-2" placeholder="Select">
      <el-option
          v-for="item in layerSelectOptions"
          :key="item.component_ref"
          :label="item.component_name"
          :value="item.component_ref"
      />
    </el-select><br>
    <el-button type="primary" size="small" style="margin-top: 15px" @click="addRelevanceComponent">添加关联组件</el-button>
    <el-divider content-position="left"><span style="font-size: 18px">已设置图层</span></el-divider>

    <el-table
        v-if="currentBlueScript?.config"
        :data="currentBlueScript.config.settings.RelevanceComponents"
        border
        stripe
        style="width: 100%;margin-top: 5px">
      <el-table-column prop="component_name" label="component_name" width="120"/>
      <el-table-column prop="component_ref" label="component_ref"/>
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
      layerSelectedValue:'',
      layerSelectOptions:[]
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
      for(let i=0;i<this.currentBlueScript.config.settings.RelevanceComponents.length;i++){
        if(this.currentBlueScript.config.settings.RelevanceComponents[i].component_ref==scope.row.component_ref){
          this.currentBlueScript.config.settings.RelevanceComponents.splice(i,1);
          break;
        }
      }
    },
    layerSelectChange(val){
      console.log("val22",val);
    },
    addRelevanceComponent(){
      if(this.layerSelectedValue=="" || this.layerSelectedValue=="" ){
        this.$message.error("蓝图图层或蓝图节点未被选择！");
        return;
      }

      let obj={};
      obj.component_ref=this.layerSelectedValue;
      for(let i=0;i<this.layerSelectOptions.length;i++){
        if(this.layerSelectedValue==this.layerSelectOptions[i].component_ref){
          obj.component_name=this.layerSelectOptions[i].component_name;
        }
      }
      this.currentBlueScript.config.settings.RelevanceComponents.push(obj);

    }


  },
  mounted() {
    //console.log("RelevanceComponent--this.currentBlueScript",this.currentBlueScript);
    this.layerSelectOptions=[];
    //console.log("window.cbcViewDraggleResizableInstance.data.pageComponents;",window.cbcViewDraggleResizableInstance.data.pageComponents);
    let pageComponentsTemp=window.cbcPageInstance.data.pageComponents;
    for(let i=0;i<pageComponentsTemp.length;i++){
      let obj={};
      obj.component_name=pageComponentsTemp[i].component_name;
      obj.component_ref=pageComponentsTemp[i].component_ref;
      this.layerSelectOptions.push(obj);
    }
    //console.log("this.layerSelectOptions1112",this.layerSelectOptions);



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