<template>
  <div>
    <component
      :style="componentStyle" 
      v-if="component.component_config"
      :is="component_id"
      @event="eventFun"
      :component="component"
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
      component: {},
      componentStyle:null,
    }
  },
  created() {
    
  },
  methods:{
    eventFun(eventType,obj,component){
      console.log("事件类型：",eventType);
      console.log("事件传递值：",obj);
      console.log("当前事件所属组件信息：",component);
    },
    //组件样式设置
    getStyle(component_config) {
      try {
        let attr = component_config.attr;
        let style = {
          position: "absolute",
          left: attr.x + attr.unit,
          top: attr.y + attr.unit,
          width: attr.w + attr.unit,
          height: attr.h + attr.unit,
          zIndex: attr.zIndex,
          opacity: attr.opacity
        };
        //console.log("style",style);
        this.componentStyle = style;
        this.$nextTick(()=> {
          this.showFlag=true;
        });
      }catch (e){
        console.log(e);
      }
    },
    findComponentConfig(){
      let param = {};
      param.sql = "page_component_packumd.findComponentConfig";
      param.component_id = this.component_id;
      commonSelectRequest(axios, param, this.findComponentConfigCallBack);
    },
    findComponentConfigCallBack(result){
      console.log("findComponentConfigCallBack--result",result);
      if(result.objects.length>0){
        this.component.component_config=stringToObject(result.objects[0].component_config_str);
        //组件基础样式设置
        this.getStyle(this.component.component_config);
        console.log("findComponentConfigCallBack--this.componentConfig",this.componentConfig);
      }
    }

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
