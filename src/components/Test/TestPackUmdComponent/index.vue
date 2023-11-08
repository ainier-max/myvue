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
  name: 'TestPackComponent',
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
    console.log("window111",window);
    let url="http://"+myip+":8087/"+"cbc/GetPageComponentPackumdjs.cbc?component_id="+this.component_id;
    let loadPromise=this.loadScript(url);
    let the=this;
    loadPromise.then(() => {
      console.log("window[the.component_id]",window);
      //方式1(局部注册组件)
      the.$options.components[the.component_id]=window[the.component_id];
      console.log("the.$options.components[the.component_id]",the.$options.components[the.component_id]);
      //方式2(全局注册组件)
      //window[this.component_id].install(window.vueApp);
      console.log("顺序",1);
      the.$nextTick(()=>{
        console.log("顺序",3);
        the.findComponentConfig();
      });
    });
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
    },

    loadScript (url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Load script from ${url} failed`))
        script.src = url
        const head =
            document.head || document.getElementsByTagName('head')[0]
        ;(document.body || head).appendChild(script)
      })
    }
  },
  mounted() {
    console.log("顺序",2);
  }
}
</script>
