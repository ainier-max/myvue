import { createApp } from "vue";
import App from "./App.vue";

window.cbcApp = createApp(App);

//ElementPlus（全注册1）
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import * as CBCElementPlus from "element-plus";

window.CBCElementPlus = CBCElementPlus;

//router
import router from "./router/index";

// 全局错误处理
window.cbcApp.config.errorHandler = (err) => {
  console.error("main.js全局错误处理:", err);
  // 这里可以添加你的错误上报逻辑，例如发送到后端服务器
};

import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import contextmenu from "@imengyu/vue3-context-menu";
import VueGridLayout from "vue-grid-layout";

import microApp from "@micro-zoe/micro-app";
microApp.start();

import { createPinia } from "pinia";
const pinia = createPinia();

window.cbcApp
  .use(ElementPlus)
  .use(router)
  .use(pinia)
  .use(contextmenu)
  .use(VueGridLayout)
  .mount("#app");

//ElementPlusIcons(按需注册)
//import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {
  Upload,
  Download,
  Delete,
  Edit,
  EditPen,
  CirclePlus,
  CircleClose,
  Compass,
  Folder,
  Plus,
  CreditCard,
  Search,
  ArrowDown,
  Minus,
  InfoFilled,
  WarningFilled,
} from "@element-plus/icons-vue";

window.cbcApp.component("Minus", Minus);
window.cbcApp.component("Download", Download);
window.cbcApp.component("Upload", Upload);
window.cbcApp.component("Delete", Delete);
window.cbcApp.component("Edit", Edit);
window.cbcApp.component("EditPen", EditPen);
window.cbcApp.component("CirclePlus", CirclePlus);
window.cbcApp.component("CircleClose", CircleClose);
window.cbcApp.component("Compass", Compass);
window.cbcApp.component("Folder", Folder);
window.cbcApp.component("Plus", Plus);
window.cbcApp.component("CreditCard", CreditCard);
window.cbcApp.component("Search", Search);
window.cbcApp.component("ArrowDown", ArrowDown);
window.cbcApp.component("InfoFilled", InfoFilled);
window.cbcApp.component("WarningFilled", WarningFilled);

// import LayoutPageBlock from '@/common/component/PageRender/LayoutRenderView/LayoutPageBlock/index.vue'
// window.cbcApp.component("LayoutPageBlock", LayoutPageBlock)

import draggable from "vuedraggable";
window.cbcApp.component("draggable", draggable);

//console.log("组件列表",window.cbcApp._context.components);
const contextComponentArr = Object.keys(window.cbcApp._context.components);
//console.log("已注册组件：",contextComponentArr.length);

//全局依赖(可供打包组件使用)
import * as vue from "vue";
window.vue = vue;
import axios from "axios";
window.axios = axios;
import qs from "qs";
window.qs = qs;
import lodash from "lodash";
window._ = lodash;
import { loadModule } from "vue3-sfc-loader";
window.loadModule = loadModule;
import { uuid } from "@/common/js/uuid.js";
window.cbcuuid = uuid;

//抓取错误异常
//window.cbcApp.config.errorHandler = (err, vm, info) => {
//    console.log("错误异常",err);
//}

//抓取警告信息
//window.cbcApp.config.warnHandler = (err, vm, info) => {
//    console.log("警告信息",err);
//}
import { Shape, Graph, Path } from "@antv/x6";
Shape.Rect.define({
  shape: "static-in-rect",
  ports: {
    groups: {
      in: {
        position: "left",
        label: {
          position: "right",
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: "#31d0c6",
            strokeWidth: 2,
            fill: "#fff",
          },
        },
      },
      out: {
        position: "right",
        label: {
          position: "left",
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: "#31d0c6",
            strokeWidth: 2,
            fill: "#fff",
          },
        },
      },
    },
  },
});

Shape.Rect.define({
  shape: "dynamics-in-rect",
  ports: {
    groups: {
      in: {
        position: "erPortPosition",
        label: {
          position: "right",
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: "#31d0c6",
            strokeWidth: 2,
            fill: "#fff",
          },
        },
      },
      out: {
        position: "right",
        label: {
          position: "left",
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: "#31d0c6",
            strokeWidth: 2,
            fill: "#fff",
          },
        },
      },
    },
  },
});

Graph.registerConnector(
  "algo-connector",
  (s, e) => {
    const offset = 4;
    const deltaY = Math.abs(e.y - s.y);
    const control = Math.floor((deltaY / 3) * 2);

    const v1 = { x: s.x, y: s.y + offset + control };
    const v2 = { x: e.x, y: e.y - offset - control };

    return Path.normalize(
      `M ${s.x} ${s.y}
       L ${s.x} ${s.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
       L ${e.x} ${e.y}
      `
    );
  },
  true
);

Graph.registerPortLayout("erPortPosition", (portsPositionArgs, elemBBox) => {
  //console.log("portsPositionArgs111",portsPositionArgs);
  //console.log("elemBBox111",elemBBox);
  return portsPositionArgs.map((_, index) => {
    let portPositionObj = {};
    if (portsPositionArgs.length == 1) {
      portPositionObj = {
        position: {
          x: 0,
          y: elemBBox.height / 2,
        },
      };
    } else {
      let yPosition = 0;
      if (index == 0) {
        yPosition = 30;
      } else {
        yPosition =
          index * ((elemBBox.height - 30) / portsPositionArgs.length) + 30;
      }
      //let yPosition=(index) * ((elemBBox.height-20) / (portsPositionArgs.length)) + 30;
      //let yPosition=(index) * ((elemBBox.height-20) / (portsPositionArgs.length+1))+30;
      //console.log("yPosition",yPosition);
      portPositionObj = {
        position: {
          x: 0,
          y: yPosition,
        },
      };
    }
    //console.log("portPositionObj111:",portPositionObj);
    return portPositionObj;
  });
});
