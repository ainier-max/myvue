import { defineStore, storeToRefs } from "pinia";

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);
import {
  addPort,
  addStartPointFlag,
} from "@/components/PageEdit/PageDesign/BlueScriptDesign/AntV/AntV.js";
import { objectToString, stringToObject } from "@/common/js/objStr.js";

export const blueScriptDataStore = defineStore("blueScriptDataID", {
  state: () => ({
    blueScriptData: [],
    currentBlueScriptNode: null,
    currentBlueScript: null,
  }),
  getters: {},
  actions: {
    setCurrentBlueScriptNode(node) {
      this.currentBlueScriptNode = node;
      this.blueScriptData.forEach((element) => {
        if (element.blue_script_ref == node.blue_script_ref) {
          this.currentBlueScript = element;
          console.log("当前蓝图this.currentBlueScript", this.currentBlueScript);
          if (this.currentBlueScript.type != "blueScriptTool") {
            currentDealDataStoreObj.setCurrentPageRenderTreeNodeDataByRef(
              this.currentBlueScript.related_ref
            );
          } else {
            currentPageRenderTreeNodeData.value = null;
          }
        }
      });
    },

    
    setBlueScriptData(data) {
      data.forEach((element) => {
        //element.config = eval("(" + element.config_str + ")");
        element.config = stringToObject(element.config_str);
      });
      this.blueScriptData = data;
      console.log("所有蓝图数据：", this.blueScriptData);
    },
    //页面方式添加节点
    addNodeByPageOut(obj) {
      console.log("addNodeByPageOut--obj", obj);
      let item = {};
      item.blue_script_name = obj.label;
      item.blue_script_id = "pageOut";
      item.blue_script_ref = "blueScriptRef-" + window.cbcuuid();
      item.type = obj.type;
      item.related_ref = obj.ref;

      item.config = {};
      item.config.blue_script_visualize_config = {};
      item.config.blue_script_visualize_config.settings = ["InitPageOutParam","ShowInParam", "ShowOutParam"];
      item.config.blue_script_in_out_config = {};
      item.config.blue_script_in_out_config.in = obj.config.blueScriptAttr.in;
      item.config.blue_script_in_out_config.out = obj.config.blueScriptAttr.out;
      item.config.blue_script_logic_config = {};
      item.config.blue_script_logic_config.logicFun = function (paramObj) {
        console.log("logicFunForPageOut--paramObj", paramObj);
        paramObj.type = "runNextProcessFunByPageOut";
        console.log(paramObj.callBackFun.toString());
        paramObj.callBackFun(paramObj);
      };
      item.config.blue_script_node_config = {
        id: item.blue_script_ref,
        label: obj.label,
        shape: "dynamics-in-rect",
        x: window.antVGraph.getGraphArea().x + 20,
        y:window.antVGraph.getGraphArea().y + 20,
        width: 180,
        height: 180,
        attrs: {
          body: {
            fill: "rgb(40, 44, 52,0.9)",
            stroke: "#d9d9d9",
            strokeWidth: 1,
          },
          label: {
            fill: "#ffffff", // 文字颜色
            fontSize: 14, // 文字大小
            refX: 0.5,
            refY: 8,
            textAnchor: "middle",
            textVerticalAnchor: "top",
          },
        },
      };
      //添加蓝图节点
      this.addAntVGraphNode(item);
      this.blueScriptData.push(item);
      console.log("addNodeByPageOut--blueScriptData",this.blueScriptData);
    },
   
    deleteBlueScriptByRelatedRef(relatedRef) {
      console.log("deleteBlueScriptByRelatedRef--relatedRef",relatedRef);
      for (let i = 0; i < this.blueScriptData.length; i++) {
        if (this.blueScriptData[i].related_ref == relatedRef) {
          this.blueScriptData.splice(i, 1);
          i = i - 1;
        }
      }
      console.log("deleteBlueScriptByRelatedRef--this.blueScriptData",this.blueScriptData);
    },

    //删除蓝图节点
    delete(node) {
      console.log("delete--node", node);
      window.antVGraph.removeNode(node);
      console.log("delete--this.blueScriptData", this.blueScriptData);

      // this.blueScriptData = _.remove(this.blueScriptData, function(n) {
      //   return n.blue_script_ref=node.blue_script_ref
      // });
      for (let i = 0; i < this.blueScriptData.length; i++) {
        if (this.blueScriptData[i].blue_script_ref == node.blue_script_ref) {
          this.blueScriptData.splice(i, 1);
          i = i - 1;
        }
      }
      console.log("delete--this.blueScriptData", this.blueScriptData);
    },
    copy(obj) {
      let item = _.cloneDeep(obj);
      item.blue_script_ref = "blueScriptRef-" + window.cbcuuid();
      item.config.blue_script_node_config.x = item.config.blue_script_node_config.x + 20;
      item.config.blue_script_node_config.y = item.config.blue_script_node_config.y + 20;
      item.config.blue_script_node_config.id = item.blue_script_ref;
      item.config.blue_script_node_config.attrs.body.fill = "rgba(95,158,160,0.9)";

      item.config.blue_script_in_out_config.in.forEach(inItem => {
        inItem.connected = false;
        inItem.ifProcessFlag = false;
      });
      item.config.blue_script_in_out_config.out.forEach(outItem => {
        outItem.connected = false;
        outItem.ifProcessFlag = false;
        outItem.connectedTargetArr = [];
        outItem.connectedSource = null;
      });

      item.config.copyFlag = true;
      console.log("copy--item",item);
      this.createPort(item);
      this.addAntVGraphNode(item);
      this.blueScriptData.push(item);
      console.log("copy--this.blueScriptData", this.blueScriptData);
      
    },

    //添加蓝图节点
    add(obj) {
      console.log("blueScriptData-add(obj)", obj);
      let item = {};
      item.config = {};
      item.config.copyFlag = false;
      if (obj.type == "blueScriptTool") {
        item.blue_script_name = obj.blue_script_name;
        item.blue_script_id = obj.blue_script_id;
        item.type = obj.type;
        item.related_ref = obj.related_ref;
      } else if (obj.type == "frontEndComponent") {
        item.blue_script_name = obj.nodeData.label;
        item.blue_script_id = obj.component_id;
        item.type = obj.type;
        item.related_ref = obj.related_ref;
        if (obj.nodeData.config.dataset) {
          item.config.dataset = obj.nodeData.config.dataset;
        }
      }else if (obj.type == "packComponent") {
        item.blue_script_name = obj.nodeData.label;
        item.blue_script_id = obj.component_id;
        item.type = obj.type;
        item.related_ref = obj.related_ref;
        if (obj.nodeData.config.dataset) {
          item.config.dataset = obj.nodeData.config.dataset;
        }
      }

      item.blue_script_ref = "blueScriptRef-" + window.cbcuuid();

      item.config.blue_script_in_out_config = eval(
        "(" + obj.blue_script_in_out_config_str + ")"
      );
      this.createPort(item);

      item.config.blue_script_logic_config = eval(
        "(" + obj.blue_script_logic_config_str + ")"
      );
      item.config.blue_script_visualize_config = eval(
        "(" + obj.blue_script_visualize_config_str + ")"
      );
      //配置
      item.config.settings = {};
      item.config.blue_script_visualize_config.settings.forEach((element) => {
        if (element == "GetValueFromObjectSetting") {
          item.config.settings.GetValueFromObjectSetting = "";
        }
      });

      item.config.blue_script_node_config = eval(
        "(" + obj.blue_script_node_config_str + ")"
      );
      item.config.blue_script_node_config.id = item.blue_script_ref;
      item.config.blue_script_node_config.x =
        window.antVGraph.getGraphArea().x + 20;
      item.config.blue_script_node_config.y =
        window.antVGraph.getGraphArea().y + 20;
      item.config.blue_script_node_config.label = item.blue_script_name;
      this.addAntVGraphNode(item);
      this.blueScriptData.push(item);
      console.log(
        "blueScriptData.ts--this.blueScriptData",
        this.blueScriptData
      );
    },
    //创建蓝图节点端口（portID）
    createPort(item) {
      //in类型(如果不存在，则创建portID)
      if (typeof item.config.blue_script_in_out_config.in != "undefined") {
        item.config.blue_script_in_out_config.in.forEach((element) => {
          if (typeof element.portID == "undefined") {
            element.portID = "in_port_" + window.cbcuuid();
          }
        });
      }
      if (typeof item.config.blue_script_in_out_config.out != "undefined") {
        item.config.blue_script_in_out_config.out.forEach((element) => {
          if (typeof element.portID == "undefined") {
            element.portID = "out_port_" + window.cbcuuid();
          }
        });
      }
    },

    //编辑区添加蓝图节点与端口
    addAntVGraphNode(item) {
      console.log("addAntVGraphNode--item", item);
      //添加蓝图节点
      let nodeTemp = window.antVGraph.addNode(
        item.config.blue_script_node_config
      );
      nodeTemp.copyFlag = item.config.copyFlag;
      nodeTemp.blue_script_ref = item.blue_script_ref;
      //添加蓝图节点端口
      addPort(nodeTemp, item.config.blue_script_in_out_config);
      //添加启动点
      if (item.config.startPointFlag) {
        addStartPointFlag(nodeTemp);
      }
      item.graphNode = nodeTemp;
      //console.log("初始化后的画布上的元素", this.blueScriptData);
    },
  },
});
