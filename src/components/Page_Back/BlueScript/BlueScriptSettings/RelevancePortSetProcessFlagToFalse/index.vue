<template>
  <div v-if="currentBlueScript?.config">

    <el-divider content-position="left"><span style="font-size: 18px">添加关联节点</span></el-divider>

    <div style="margin-top: 5px;color:rgba(255, 255, 255, 0.5);font-size: 14px">关联端口：</div>
    <el-select @change="portScriptSelectChange" :teleported="false" style="width:200px" v-model="portSelectedValue" class="m-2" placeholder="Select">
      <el-option
          v-for="item in portSelectOptions"
          :key="item.portID"
          :label="item.portName"
          :value="item.portID"
      />
    </el-select>


    <div style="margin-top: 5px;color:rgba(255, 255, 255, 0.5);font-size: 14px">被关联蓝图图层：</div>
    <el-select @change="blueScriptSelectChange" :teleported="false" style="width:200px" v-model="blueScriptSelectedValue" class="m-2" placeholder="Select">
      <el-option
          v-for="item in blueScriptSelectOptions"
          :key="item.blue_script_ref"
          :label="item.name"
          :value="item.blue_script_ref"
      />
    </el-select>
    <div style="margin-top: 5px;color:rgba(255, 255, 255, 0.5);font-size: 14px">被关联端口：</div>
    <el-select @change="portedSelectChange" :teleported="false" style="width:200px" v-model="portedSelectedValue" class="m-2" placeholder="Select">
      <el-option
          v-for="item in portedSelectOptions"
          :key="item.portedID"
          :label="item.portedName"
          :value="item.portedID"
      />
    </el-select>
    <br>
    <el-button type="primary" size="small" style="margin-top: 15px" @click="addRelevancePort">添加关联节点</el-button>

    <el-divider content-position="left"><span style="font-size: 18px">已关联节点</span></el-divider>

    <el-table
        v-if="currentBlueScript?.config"
        :data="currentBlueScript.config.settings.RelevancePortSetProcessFlagToFalse"
        border
        stripe
        style="width: 100%;margin-top: 5px">
      <el-table-column prop="portName" label="portName" width="100" />
      <el-table-column prop="relevancedName" label="relevancedName" />
      <el-table-column prop="portedName" label="portedName" />
      <el-table-column fixed="right" label="操作" width="120">
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
      blueScriptSelectOptions:[],
      blueScriptSelectedValue:'',

      portSelectOptions:[],
      portSelectedValue:'',

      portedSelectOptions:[],
      portedSelectedValue:'',

      relevancePortSetProcessFlagToFalseDataArrTable:[]
    }
  },
  components: {
  },

  created() {

  },
  watch: {

  },
  methods: {
    portScriptSelectChange(){

    },

    deleteClick(scope){
      //console.log("scope.row",scope.row);
      for(let i=0;i<this.currentBlueScript.config.settings.RelevancePortSetProcessFlagToFalse.length;i++){
        if(this.currentBlueScript.config.settings.RelevancePortSetProcessFlagToFalse[i].port==scope.row.port){
          this.currentBlueScript.config.settings.RelevancePortSetProcessFlagToFalse.splice(i,1);
          break;
        }
      }

    },
    addRelevancePort(){
      if(this.blueScriptSelectedValue=="" || this.portSelectedValue=="" || this.portedSelectedValue=="" ){
        this.$message.error("关联端口,被关联蓝图图层或被关联端口未被选择！");
        return;
      }
      //console.log("蓝图ref:",this.blueScriptSelectedValue);
      //console.log("蓝图port",this.portSelectedValue);
      for(let i=0;i<window.cbcPageInstance.data.pageBlueScripts.length;i++){
        if(window.cbcPageInstance.data.pageBlueScripts[i].blue_script_ref==this.blueScriptSelectedValue){
          let obj={};
          obj.relevancedRef=this.blueScriptSelectedValue;
          obj.relevancedName=window.cbcPageInstance.data.pageBlueScripts[i].name;
          obj.pordedID=this.portedSelectedValue;
          for(let j=0;j<this.portedSelectOptions.length;j++){
            if(this.portedSelectOptions[j].portedID==this.portedSelectedValue){
              obj.portedName=this.portedSelectOptions[j].portedName;
            }
          }
          obj.pordID=this.portSelectedValue;
          for(let j=0;j<this.portSelectOptions.length;j++){
            if(this.portSelectOptions[j].portID==this.portSelectedValue){
              obj.portName=this.portSelectOptions[j].portName;
            }
          }
          this.currentBlueScript.config.settings.RelevancePortSetProcessFlagToFalse.push(obj);
          console.log("关联蓝图信息this.currentBlueScript11：",this.currentBlueScript);
        }
      }
    },
    portedSelectChange(val){
      console.log("val22",val);
    },
    blueScriptSelectChange(val){
      this.portedSelectOptions=[];
      this.portedSelectedValue="";
      for(let i=0;i<window.cbcPageInstance.data.pageBlueScripts.length;i++){
        let pageBlueScriptTemp=window.cbcPageInstance.data.pageBlueScripts[i];
        if(pageBlueScriptTemp.blue_script_ref==val){
          for(let j=0;j<pageBlueScriptTemp.config.in_out_config.in.length;j++){
            let inTemp=pageBlueScriptTemp.config.in_out_config.in[j];
            let obj={};
            obj.portedName=inTemp.label;
            obj.portedID=inTemp.portID;
            this.portedSelectOptions.push(obj);
          }
        }
      }
      console.log("this.portedSelectOptions111",this.portedSelectOptions);
    }


  },
  mounted() {
    console.log("RelevancePort--this.currentBlueScript",this.currentBlueScript);

    if(typeof (this.currentBlueScript.config.settings.RelevancePortSetProcessFlagToFalse)=="undefined"){
      this.currentBlueScript.config.settings.RelevancePortSetProcessFlagToFalse=[];
    }


    for(let i=0;i<this.currentBlueScript.config.in_out_config.out.length;i++){
      let outTemp=this.currentBlueScript.config.in_out_config.out[i];
      //console.log("outTemp11",outTemp);
      let obj={};
      obj.portName=outTemp.label;
      obj.portID=outTemp.portID;
      this.portSelectOptions.push(obj);
    }

    for(let i=0;i<window.cbcPageInstance.data.pageBlueScripts.length;i++){
      let pageBlueScriptTemp=window.cbcPageInstance.data.pageBlueScripts[i];
      if(pageBlueScriptTemp.type=="ExcuteSQL" || pageBlueScriptTemp.type=="SelectSQL" ){
        this.blueScriptSelectOptions.push(pageBlueScriptTemp);
      }
    }

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