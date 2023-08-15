<template>
  <div style="width: 100%;height: 100%;">

    <component :is="component.component_id"  @event="eventFun"  :component="component" v-if="showFlag">

    </component>

  </div>

</template>

<script>
//解决echart的警告:Added non-passive event listener to a scroll-blocking ‘mousewheel’ event
//但是codeMirror可能会报错：Unable to preventDefault inside passive event listener invocation.
//import 'default-passive-events'

import * as Vue from 'vue'
export default {
  props: {
    component: {
      type: Object,
      default: null
    },
  },
  data: function () {
    return {
      showFlag: false,
    }
  },

  created() {
    console.log("this.showFlag",this.showFlag);
    console.log("组件create",this.component.component_id);
    //如果组件的属性show为false,则不进行展示
    if(typeof (this.component.component_config.attr)=="undefined"){
      console.log("配置内容无attr属性！")
      return;
    }else if(this.component.component_config.attr.show==false){
      this.showFlag=false;
      return;
    }else if(this.component.component_config.attr.show==true){
      let componentTemp = this.$options.components[this.component.component_id];
      //console.log("this.component111",this.component);
      //如果未注册，则注册组件
      if (typeof (componentTemp) == "undefined" || this.$options.components[this.component.component_id] == null) {
        this.registerComponent(this.component);
      }
      let the=this;
      this.$nextTick(()=>{
        the.showFlag=true;
      });
    }





  },
  components: {},
  methods: {
    //该方法并不会执行，只有预览状态下才可以执行。
    eventFun(eventType,obj,component){
      console.log("事件类型：",eventType);
      console.log("事件传递值：",obj);
      console.log("当前事件所属组件信息：",component);
    },

    //重新设置PageComponents的数据
    resetPageComponents(component){
      console.log("window.cbcViewDraggleResizableInstance.data.pageComponents441",window.cbcViewDraggleResizableInstance.data.pageComponents);
      for (let i = 0; i < window.cbcViewDraggleResizableInstance.data.pageComponents.length; i++) {
        if (window.cbcViewDraggleResizableInstance.data.pageComponents[i].ref == component.ref) {
          window.cbcViewDraggleResizableInstance.data.pageComponents[i] = component;
        }
      }
      let the=this;
      the.$nextTick(() => {
        the.showFlag = true;
      });
    },

    refreshFun(component) {
      console.log("更新的组件信息：",component);
      let the = this;
      the.showFlag = false;
      //如果组件的属性show为false,则不进行展示
      if(typeof (component.component_config.attr)=="undefined"){
        console.log("配置内容无attr属性！")
        return;
      }else if(component.component_config.attr.show==false){
        console.log(component.component_id+"组件被隐藏")
        return;
      }
      this.resetPageComponents(component);
    },

    registerComponent(component) {
      var option = {
        moduleCache: {vue: Vue, echarts: window['echarts']},
        getFile(url) {
          return Promise.resolve(component.component_code);
        },
        addStyle(textContent) {
          const style = Object.assign(document.createElement('style'), { textContent });
          const ref = document.head.getElementsByTagName('style')[0] || null;
          document.head.insertBefore(style, ref);
        },
      };
      let registerComponentObj = window.loadModule("./Main.vue", option);
      //局部动态注册组件
      this.$options.components[component.component_id] = Vue.defineAsyncComponent(() => registerComponentObj);
      console.log("注册组件", component.component_id);

      //如果组件的属性show为false,则不进行展示
      if(typeof (component.component_config.attr)=="undefined"){
        console.log("配置内容无attr属性！")
        return;
      }else if(component.component_config.attr.show==false){
        console.log(component.component_id+"组件被隐藏")
        this.showFlag=false;
        return;
      }
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>