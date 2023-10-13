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
  name: 'TestPackUmdComponent',
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
    //document.writeln('<script src="'+url1+'"><\/script>');
  }
}
</script>
