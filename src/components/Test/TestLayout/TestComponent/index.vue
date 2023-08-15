<template>
  <div style="width: 100%;height: 100%;">
    <component v-if="showFlag && type=='component'" style="width: 100%;height: 100%;" :is="component_id"  @event="eventFun"
               :component="component">
    </component>
    <div v-if="showFlag && type=='no'" style="width: 100%;height: 100%;background-image: linear-gradient(180deg,#274351,#1a2646);align:center;" >
      <el-row style="width: 100%;height: 100%;">
        <el-col :span="24" style="height:100%;display:flex;justify-content: center; align-items:center;margin-top: -10px">
          <img src="../images/add-screen.svg"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
//解决echart的警告:Added non-passive event listener to a scroll-blocking ‘mousewheel’ event
//但是codeMirror可能会报错：Unable to preventDefault inside passive event listener invocation.
import 'default-passive-events'
import * as Vue from 'vue'
import {loadModule} from 'vue3-sfc-loader'


export default {
  props: {},
  data() {
    return {
      showFlag: true,
      type: "type",
      componentStyle: null,
      //component_id为空时，警告：Invalid vnode type when creating vnode: .
      component_id: 'component_id',
      component: null,
    }
  },
  //供动态注册组件使用,不可删除
  components: {},

  created() {


  },
  methods: {
    eventFun(eventType, obj, component) {
      console.log("事件类型：", eventType);
      console.log("事件传递值：", obj);
      console.log("当前事件所属组件信息：", component);
    },

    //清除组件
    clearComponent() {
      this.$options.components[this.component_id] = null;
    },

    //设置组件代码
    setComponentInfo(componentInfo) {
      if (componentInfo == null) {
        this.type = "no";
      } else {
        this.type = "component";
        this.component = componentInfo;
        this.component_id = componentInfo.component_id;
        let componentTemp = this.$options.components[this.component_id];
        //console.log("componentTemp",componentTemp);
        if (typeof (componentTemp) == "undefined" || this.$options.components[this.component_id] == null) {
          this.showFlag = false;
          this.registerComponent(componentInfo.component_code);
        }
      }
    },
    //注册组件
    registerComponent(component_code) {
      var option = {
        moduleCache: {vue: Vue, echarts: window['echarts']},
        getFile(url) {
          return Promise.resolve(component_code);
        },
        addStyle(textContent) {
          //console.log("textContent",textContent);
          const style = Object.assign(document.createElement('style'), {textContent});
          const ref = document.head.getElementsByTagName('style')[0] || null;
          document.head.insertBefore(style, ref);
        },
      };
      let component = loadModule("./Main.vue", option);
      //局部动态注册组件
      this.$options.components[this.component_id] = Vue.defineAsyncComponent(() => component);
      //console.log("this.$options:",this.$options);
      //全局动态注册组件
      //window.cbcApp.component(this.componentInfo.component_id, Vue.defineAsyncComponent(() => component));
      console.log("注册组件", this.component_id);
      let the = this;
      this.$nextTick(() => {
        the.showFlag = true;
      });

    }
  },
  mounted() {

  }
}

</script>