<template>
  <div style="background: #0B0F18;">
    <el-row>
      <el-col :span="12" style="height: 30vh;">
        <TestComponent ref="testComponentRef1"  style="border: 1px solid yellow">
        </TestComponent>
      </el-col>
      <el-col :span="12" style="height: 30vh;">
        <TestComponent ref="testComponentRef2" style="border: 1px solid yellow">
        </TestComponent>
      </el-col>
    </el-row>

    <div style="height: 50px"></div>

    <el-row style="height: 30vh;">

      <el-col :xs="14" :sm="6" :md="4" :lg="16" :xl="12">
        <TestComponent ref="testComponentRef3"  style="border: 1px solid yellow">
        </TestComponent>
      </el-col>

      <el-col :xs="10" :sm="18" :md="20" :lg="8" :xl="12" style="height: 30vh;">
        <TestComponent ref="testComponentRef4" style="border: 1px solid yellow">
        </TestComponent>
      </el-col>
    </el-row>

  </div>
</template>

<script>

import {commonSelectRequest} from "../../common/js/request";
import axios from "axios";
import TestComponent from "./TestComponent/index.vue";
import {stringToObject} from "../../common/js/objStr";

export default {
  props: {},
  data() {
    return {
      componentInfo:null,
    }
  },

  created() {

  },
  watch: {},
  components: {
    TestComponent:TestComponent
  },
  methods: {
    findComponent(){
      let param={};
      param.sql="page_component.find";
      param.component_id="echart-one-bar";
      commonSelectRequest(axios, param, this.findComponentCallBack);
    },
    findComponentCallBack(result){
      this.componentInfo=result.objects[0];
      console.log("this.componentInfo,",this.componentInfo);
      this.componentInfo.component_config = stringToObject(this.componentInfo.component_config_str);
      console.log("this.$refs,",this.$refs);
      this.$refs.testComponentRef1.clearComponent();
      this.$refs.testComponentRef1.setComponentInfo(null);

      this.$refs.testComponentRef3.clearComponent();
      this.$refs.testComponentRef3.setComponentInfo(null);

      this.$refs.testComponentRef2.clearComponent();
      this.$refs.testComponentRef2.setComponentInfo(this.componentInfo);

      this.$refs.testComponentRef4.clearComponent();
      this.$refs.testComponentRef4.setComponentInfo(this.componentInfo);

      this.addListener();
    },
    addListener(){
      let the=this;

      window.addEventListener('resize',()=>{
        the.$refs.testComponentRef1.clearComponent();
        the.$refs.testComponentRef1.setComponentInfo(null);
        the.$refs.testComponentRef2.clearComponent();
        the.$refs.testComponentRef2.setComponentInfo(the.componentInfo);


        the.$refs.testComponentRef3.clearComponent();
        the.$refs.testComponentRef3.setComponentInfo(null);
        the.$refs.testComponentRef4.clearComponent();
        the.$refs.testComponentRef4.setComponentInfo(the.componentInfo);
      });

    }

  },
  mounted() {

    let the=this;
    this.$nextTick(()=>{
      the.findComponent();
    });





  }
}
</script>

<style scoped>

</style>
