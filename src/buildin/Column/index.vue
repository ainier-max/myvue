<template>
  <div :style="styleStr">
    <ColumnGridLayout ref="ColumnGridLayoutRef" v-if="showFlag"
                      :ref_string="ref_string" :column_edit_flag="column_edit_flag" :column_config="column_config"
                      :component="component"></ColumnGridLayout>

    <div v-drag id="debugMoveDivID" style="cursor:pointer;overflow: auto;position:absolute;right:10px;top:10px;height: 100px;width: 200px;background: rgb(193, 210, 240);z-index: 1000;border: 1px solid beige"
         v-if="showSave==true">
      <el-button type="info"  size="small" style="margin-top: 10px;margin-left: 10px" @click="add()">新增布局</el-button><br>
      <el-button type="success" size="small" style="margin-top: 10px;margin-left: 10px" @click="save()">保存</el-button><br>
      <el-checkbox style="padding-left: 20px" @change="handleChange" v-model="innerMoveFlag" label="只移动模块内部" />
    </div>

    <div v-if="showSave==true" style="height: 100px"></div>

  </div>
</template>

<script>

import {commonExcuteRequest, commonSelectRequest} from "../../common/js/request";
import axios from "axios";
import {objectToString, stringToObject} from "../../common/js/objStr.js";
import ColumnGridLayout from "./ColumnGridLayout/index.vue"
import {getCurrentInstance} from "vue";
import option from "./index.js"

export default {
  directives: {
    drag(el, bindings) {
      document.getElementById("debugMoveDivID").onmousedown = function (e) {
        let disx = e.pageX - el.offsetLeft
        let disy = e.pageY - el.offsetTop
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null
        }
      }
    }
  },
  props: {
    layoutComponentInfo: {
      type: Object,
      default: null
    },
    component: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      innerMoveFlag:false,
      showFlag:true,
      showSave:false,
      column_edit_flag:false,
      column_config:{
        data:[],
      },
      ref_string:"",
      devOption:null,
      styleStr:"width: 100%;height: 100%;"

    };
  },
  components: {
    ColumnGridLayout
  },
  methods:{
    startEdit(){
      console.log("布局配置：",this.layout);
      this.showSave=true;
      this.column_edit_flag=true;
      this.innerMoveFlag=false;
      this.updateColumnPage();
    },


    handleChange(value){
      console.log("handleChange--value",value);
      if(value==true){
        this.$refs["ColumnGridLayoutRef"].updateState(false);
      }else{
        this.$refs["ColumnGridLayoutRef"].updateState(true);
      }

    },

    add(){
      console.log("this.column_config123",this.column_config);
      this.$refs["ColumnGridLayoutRef"].addNewItem();
    },

    save(){
      this.showSave=false;
      this.column_edit_flag=false;
      console.log("门户配置",this.column_config);
      this.updateColumnPage();
      this.updatePageColumnUser();
    },
    updatePageColumnUser(){
      let param = {};
      param.sql = "page_column_user.update";
      param.column_id = this.layoutComponentInfo.ref;
      param.userid = window.localStorage.getItem('loginUserid');
      param.column_config_str = objectToString(this.column_config);
      commonExcuteRequest(axios, param, this.updatePageColumnUserCallBack);
    },
    updatePageColumnUserCallBack(result){
      if (result.state = "success") {
        this.$message.success('保存成功！');
      }
    },

    findPageColumnUser(){
      let param = {};
      param.sql = "page_column_user.find";
      param.column_id = this.layoutComponentInfo.ref;
      param.userid = window.localStorage.getItem('loginUserid');
      console.log("当前登陆用户userid:",param.userid);
      commonSelectRequest(axios, param, this.findPageColumnUserCallBack);
    },
    findPageColumnUserCallBack(result){
      console.log("result123",result);
      if(result.objects.length>0){
        this.column_config=stringToObject(result.objects[0].column_config_str);
      }
      console.log("门户配置",this.column_config);
      this.updateColumnPage();
    },
    updateColumnPage(){
      this.showFlag=false;
      let the=this;
      this.$nextTick(()=>{
        the.showFlag=true;
      });
    },
  },
  created() {
    this.ref_string=this.layoutComponentInfo.ref;
    //console.log("this.layoutComponentInfo.ref212",this.layoutComponentInfo);
    window.cbcColumnInstance={};
    window.cbcColumnInstance[this.ref_string] = getCurrentInstance();
    console.log("内置组件this.component",this.component);
    if(this.component==null){
      this.devOption=option.devOption;
    }else{
      this.devOption=this.component.component_config;
    }
    this.styleStr=this.styleStr+"overflow: "+this.devOption.option.overflow;
  },
  mounted() {
    this.findPageColumnUser();
  }
};
</script>
<style scoped>

</style>