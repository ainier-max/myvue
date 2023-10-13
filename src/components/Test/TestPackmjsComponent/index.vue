<template>
  <div>
    <component
      style="width: 500px; height: 500px;"
      v-if="componentConfig!=null"
      :is="component_id"
      @event="eventFun"
      :componentConfig="componentConfig"
    >
    </component>
  </div>
</template>

<script>
import {commonSelectRequest} from "@/common/js/request";
import axios from "axios";
import {stringToObject} from "@/common/js/objStr";
export default {
  name: 'TestPackUmdComponent2',
  props: {
  },
  //供动态注册组件使用,不可删除
  components: {

  },
  data() {
    return {
      showFlag:false,
      component_id:"EchartMap",
      component_name:"Echart地图",
      componentConfig: null,
    }
  },
  created() {
    
  },
  methods:{
    findComponentConfig(){
      let param = {};
      param.sql = "page_component_packumd.findComponentConfig";
      param.component_id = this.component_id;
      commonSelectRequest(axios, param, this.findComponentConfigCallBack);
    },
    findComponentConfigCallBack(result){
      console.log("findComponentConfigCallBack--result",result);
      if(result.objects.length>0){
        this.componentConfig=stringToObject(result.objects[0].component_config_str);
        console.log("findComponentConfigCallBack--this.componentConfig",this.componentConfig);
      }
    },
    eventFun(funName,param){
      
    },
    
  },
  mounted() {
    console.log("TestPackmjsComponent--mounted");
    let the=this;
    import("http://127.0.0.1:8087/cbc/GetPageComponentPackmjs.cbc?component_id=EchartMap").then((module) => {
      console.log("module11133",module);
      the.$options.components[the.component_id]=module.default;
      the.findComponentConfig();
    }).catch((error) => {
        // 捕获错误
        console.log("打包组件加载异常",error);
    });
  }
}
</script>
