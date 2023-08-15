<template>
  <div v-if="currentBlueScript?.config">

    <el-divider content-position="left"><span style="font-size: 18px">蓝图关联刷新</span></el-divider>

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
    <el-select @change="layerSelectChange" :teleported="false" style="width:200px" v-model="blueScriptSelectedValue" class="m-2" placeholder="Select">
      <el-option
          v-for="item in bluescriptSelectOptions"
          :key="item.blue_script_ref"
          :label="item.name"
          :value="item.blue_script_ref"
      />
    </el-select><br>
    <el-button type="primary" size="small" style="margin-top: 15px" @click="addRelevanceBlueScript">添加关联蓝图</el-button>
    <el-divider content-position="left"><span style="font-size: 18px">已设置蓝图</span></el-divider>

    <el-table
        v-if="currentBlueScript?.config"
        :data="currentBlueScript.config.settings.RelevanceBlueScriptsRefresh"
        :row-style="changeRowBgColor"
        style="width: 100%;margin-top: 5px">
      <el-table-column prop="portName" label="portName" width="100" />
      <el-table-column prop="name" label="name" width="120"/>
      <el-table-column prop="blue_script_ref" label="blue_script_ref"/>
      <el-table-column fixed="right" label="操作" width="60">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="deleteClick(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <span>{{computedTemp}}</span>

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
      blueScriptSelectedValue:'',
      bluescriptSelectOptions:[],
      portSelectOptions:[],
      portSelectedValue:'',
    }
  },
  components: {
  },

  created() {

  },
  watch: {

  },
  //有被使用到，才会执行
  computed: {
    //执行计算
    "computedTemp"() {
      let pageBlueScriptsTemp=window.cbcPageInstance.data.pageBlueScripts;
      let RelevanceBlueScriptsRefreshTemp=this.currentBlueScript.config.settings.RelevanceBlueScriptsRefresh;
      for(let j=0;j<RelevanceBlueScriptsRefreshTemp.length;j++) {
        let flagTemp=0;
        for(let i=0;i<pageBlueScriptsTemp.length;i++) {
          if(RelevanceBlueScriptsRefreshTemp[j].blue_script_ref==pageBlueScriptsTemp[i].blue_script_ref){
            flagTemp=1;
          }
        }
        if(flagTemp==1){
          RelevanceBlueScriptsRefreshTemp[j].existFlag=true;
        }else{
          RelevanceBlueScriptsRefreshTemp[j].existFlag=false;
        }
      }
      return "";
    }
  },
  methods: {
    changeRowBgColor({ row, rowIndex }){
      //console.log("row, rowIndex11",row, rowIndex);
      let styleJson={};
      if(row.existFlag==false){
        styleJson = { "color": "red","fontSize" :"18px","fontWidth" :"bold"};
      }else{
        styleJson={};
      }


      return styleJson;
    },
    portScriptSelectChange(){

    },
    deleteClick(scope){
      //console.log("scope.row",scope.row);
      for(let i=0;i<this.currentBlueScript.config.settings.RelevanceBlueScriptsRefresh.length;i++){
        if(this.currentBlueScript.config.settings.RelevanceBlueScriptsRefresh[i].portName==scope.row.portName &&
            this.currentBlueScript.config.settings.RelevanceBlueScriptsRefresh[i].blue_script_ref==scope.row.blue_script_ref){
          this.currentBlueScript.config.settings.RelevanceBlueScriptsRefresh.splice(i,1);
          break;
        }
      }
    },
    layerSelectChange(val){
      console.log("val22",val);
    },
    addRelevanceBlueScript(){
      if(this.blueScriptSelectedValue=="" || this.portSelectedValue==""){
        this.$message.error("关联端口,被关联蓝图图层未被选择！");
        return;
      }

      let obj={};
      obj.blue_script_ref=this.blueScriptSelectedValue;
      obj.portName=this.portSelectedValue;
      for(let i=0;i<this.bluescriptSelectOptions.length;i++){
        if(this.blueScriptSelectedValue==this.bluescriptSelectOptions[i].blue_script_ref){
          obj.name=this.bluescriptSelectOptions[i].name;
        }
      }
      this.currentBlueScript.config.settings.RelevanceBlueScriptsRefresh.push(obj);

    }


  },
  mounted() {
    //console.log("RelevanceComponent--this.currentBlueScript",this.currentBlueScript);

    for(let i=0;i<this.currentBlueScript.config.in_out_config.out.length;i++){
      let outTemp=this.currentBlueScript.config.in_out_config.out[i];
      //console.log("outTemp11",outTemp);
      let obj={};
      obj.portName=outTemp.label;
      obj.portID=outTemp.portID;
      this.portSelectOptions.push(obj);
    }

    this.bluescriptSelectOptions=[];
    //console.log("window.cbcViewDraggleResizableInstance.data.pageComponents;",window.cbcViewDraggleResizableInstance.data.pageComponents);
    let pageBlueScriptsTemp=window.cbcPageInstance.data.pageBlueScripts;
    console.log("pageBlueScriptsTemp",pageBlueScriptsTemp);
    for(let i=0;i<pageBlueScriptsTemp.length;i++){
      let obj={};
      obj.name=pageBlueScriptsTemp[i].name;
      obj.blue_script_ref=pageBlueScriptsTemp[i].blue_script_ref;
      this.bluescriptSelectOptions.push(obj);
    }
    //console.log("this.bluescriptSelectOptions1112",this.bluescriptSelectOptions);



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