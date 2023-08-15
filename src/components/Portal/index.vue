<template>
  <div style="width: 100%;height: 100%;background: #cbcbcb">

    <div style="position: fixed;left: 50%;top:2%;z-index: 9999">
      <el-button type="success" v-if="showSave==false"
                 @click="personalizationSet()">个性化设置</el-button>
      <el-button type="success" v-if="showSave==true"
                 @click="save()">保存</el-button>
      <el-checkbox v-if="showSave==true" style="padding-left: 20px" @change="handleChange" v-model="innerMoveFlag" label="只移动模块内部" />
    </div>

    <div style="height: 10%;"></div>

    <PortalGridLayout ref="PortalGridLayoutRef" v-if="showFlag" :portal_edit_flag="portal_edit_flag" :portal_config="portal_config"></PortalGridLayout>


    <el-button type="info" v-if="showSave==true" @click="add()" style="position: fixed;left: 49%;top:90%;">新增布局</el-button>


    <div v-if="showSave==true" style="height: 200px"></div>

  </div>
</template>

<script>

import {commonExcuteRequest, commonSelectRequest} from "../../common/js/request";
import axios from "axios";
import {objectToString, stringToObject} from "../../common/js/objStr.js";
import PortalGridLayout from "./PortalGridLayout/index.vue"
import {getCurrentInstance} from "vue";


export default {
  data() {
    return {
      innerMoveFlag:false,
      showFlag:true,
      showSave:false,
      portal_edit_flag:false,


      portal_config:{
        data:[],
      }

    };
  },
  components: {
    PortalGridLayout
  },
  methods:{
    handleChange(value){
      console.log("handleChange--value",value);
      if(value==true){
        this.$refs["PortalGridLayoutRef"].updateState(false);
      }else{
        this.$refs["PortalGridLayoutRef"].updateState(true);
      }

    },

    //进入编辑状态
    personalizationSet(){
      console.log("布局配置：",this.layout);
      this.showSave=true;
      this.portal_edit_flag=true;
      this.innerMoveFlag=false;
      this.updatePortalPage();
    },
    add(){
      console.log("this.portal_config123",this.portal_config);
      console.log("this.$refs[\"PortalGridLayoutRef\"]",this.$refs["PortalGridLayoutRef"]);
      this.$refs["PortalGridLayoutRef"].addNewItem();
    },

    save(){
      this.showSave=false;
      this.portal_edit_flag=false;
      console.log("门户配置",this.portal_config);
      this.updatePortalPage();
      this.updatePagePortalUser();
    },
    updatePagePortalUser(){
      let param = {};
      param.sql = "page_portal_user.update";
      param.portal_id = this.$route.query.portal_id;
      param.userid = window.localStorage.getItem('loginUserid');
      param.portal_config_str = objectToString(this.portal_config);
      commonExcuteRequest(axios, param, this.updatePagePortalUserCallBack);
    },
    updatePagePortalUserCallBack(result){
      if (result.state = "success") {
        this.$message.success('保存成功！');
      }
    },

    findPagePortalUser(){
      let param = {};
      param.sql = "page_portal_user.find";
      param.portal_id = this.$route.query.portal_id;
      param.userid = window.localStorage.getItem('loginUserid');
      console.log("当前登陆用户userid:",param.userid);
      commonSelectRequest(axios, param, this.findPagePortalUserCallBack);
    },
    findPagePortalUserCallBack(result){
      console.log("result123",result);
      if(result.objects.length>0){
        this.portal_config=stringToObject(result.objects[0].portal_config_str);
      }
      console.log("门户配置",this.portal_config);
      this.updatePortalPage();
    },
    updatePortalPage(){
      this.showFlag=false;
      let the=this;
      this.$nextTick(()=>{
        the.showFlag=true;
      });
    },




  },
  created() {
    window.cbcPortalInstance = getCurrentInstance();
  },
  mounted() {
    console.log("window.localStorage",window.localStorage);
    this.findPagePortalUser();
  }
};
</script>
<style scoped>

</style>