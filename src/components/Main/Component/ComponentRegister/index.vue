<template>
  <component
    :style="componentStyle"
    :is="component_id"
    v-if="showFlag"
    @event="eventFun"
    :component="component"
  >
  </component>
</template>

<script>
//解决echart的警告:Added non-passive event listener to a scroll-blocking ‘mousewheel’ event
//但是codeMirror可能会报错：Unable to preventDefault inside passive event listener invocation.
import "default-passive-events";
import * as Vue from "vue";

export default {
  name: "ComponentRegister",
  props: {},
  data() {
    return {
      showFlag: true,
      componentStyle: null,
      //component_id为空时，警告：Invalid vnode type when creating vnode: .
      component_id: "component_id",
      component: null,
    };
  },
  //供动态注册组件使用,不可删除
  components: {},

  created() {},
  methods: {
    eventFun(eventType, obj, component) {
      console.log("事件类型：", eventType);
      console.log("事件传递值：", obj);
      console.log("当前事件所属组件信息：", component);
    },
    //组件样式设置
    getStyle(config) {
      //console.log("this.componentConfig", this.componentConfig);
      try {
        let attr = config.attr;
        let style = {
          position: "absolute",
          left: attr.x + attr.unit,
          top: attr.y + attr.unit,
          width: attr.w + attr.unit,
          height: attr.h + attr.unit,
          zIndex: attr.zIndex,
          opacity: attr.opacity,
        };
        //console.log("style",style);
        this.componentStyle = style;
        this.$nextTick(() => {
          this.showFlag = true;
        });
      } catch (e) {
        console.log(e);
      }
    },
    //清除组件
    clearComponent() {
      this.$options.components[this.component_id] = null;
    },

    //设置组件代码
    setComponentInfo(componentInfo) {
      this.component = componentInfo;
      this.component_id = componentInfo.component_id;
      //如果组件的属性show为false,则不进行展示
      if (typeof componentInfo.config.attr == "undefined") {
        console.log("配置内容无attr属性！");
        return;
      } else if (componentInfo.config.attr.show == false) {
        console.log(componentInfo.component_id + "组件被隐藏");
        return;
      }

      let componentTemp = this.$options.components[this.component_id];
      //console.log("componentTemp",componentTemp);
      if (
        typeof componentTemp == "undefined" ||
        this.$options.components[this.component_id] == null
      ) {
        this.registerComponent(componentInfo.component_code);
      }
      this.showFlag = false;
      //组件基础样式设置
      this.getStyle(componentInfo.config);
    },
    //注册组件
    registerComponent(component_code) {
      var option = {
        moduleCache: { vue: Vue, echarts: window["echarts"] },
        getFile(url) {
          return Promise.resolve(component_code);
        },
        addStyle(textContent) {
          //console.log("textContent",textContent);
          const style = Object.assign(document.createElement("style"), {
            textContent,
          });
          const ref = document.head.getElementsByTagName("style")[0] || null;
          document.head.insertBefore(style, ref);
        },
      };
      let component = window.loadModule("./Main.vue", option);
      //局部动态注册组件
      this.$options.components[this.component_id] = Vue.defineAsyncComponent(
        () => component
      );
      //console.log("this.$options:",this.$options);
      //全局动态注册组件
      //window.cbcApp.component(this.componentInfo.component_id, Vue.defineAsyncComponent(() => component));
      console.log("注册组件", this.component_id);
    },
  },
  mounted() {},
};
</script>
