import { defineStore, storeToRefs } from "pinia";

import { currentDealDataStore } from "@/store/currentDealData.ts";
const currentDealDataStoreObj = currentDealDataStore();
const { currentPageRenderTreeNodeData, currentTopPageBlockData } = storeToRefs(
  currentDealDataStoreObj
);

import {
  addPort
} from "@/components/PageEdit/BlueScriptDesign/AntV/AntV.js";

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
      this.blueScriptData.forEach(element => {
        if (element.blue_script_ref == node.blue_script_ref) {
          this.currentBlueScript = element;
          console.log("当前蓝图this.currentBlueScript", this.currentBlueScript);
          if (this.currentBlueScript.type!="blueScriptTool") {
            currentDealDataStoreObj.setCurrentPageRenderTreeNodeDataByRef(this.currentBlueScript.related_ref);
          }
        }
      });
    },
    setBlueScriptData(data) {
      data.forEach((element) => {
        element.config = eval("(" + element.config_str + ")");
      });
      this.blueScriptData = data;
      console.log("所有蓝图数据：", this.blueScriptData);
    },
    //删除蓝图节点
    delete(node) {
      console.log("delete--node", node);
      window.antVGraph.removeNode(node);
      // this.blueScriptData = _.remove(this.blueScriptData, function(n) {
      //   return n.blue_script_ref=node.blue_script_ref
      // });
      for (let i = 0; i < this.blueScriptData.length; i++) {
        if ((this.blueScriptData[i].blue_script_ref = node.blue_script_ref)) {
          this.blueScriptData.splice(i, 1);
          i = i - 1;
        }
      }
    },
    //添加蓝图节点
    add(obj) {
      let item = {};

      if (obj.type == "blueScriptTool") {
        item.blue_script_name = obj.blue_script_name;
        item.blue_script_id = obj.blue_script_id;
        item.type = obj.type;
        item.related_ref = obj.related_ref;
      } else if (obj.type == "frontEndComponent") {
        item.blue_script_name = obj.component_name;
        item.blue_script_id = obj.component_id;
        item.type = obj.type;
        item.related_ref = obj.related_ref;
      }

      item.blue_script_ref = "blueScriptRef-" + window.cbcuuid();
      item.config = {};
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
      //编辑区添加蓝图节点
      let nodeTemp = window.antVGraph.addNode(
        item.config.blue_script_node_config
      );
      nodeTemp.blue_script_ref = item.blue_script_ref;
      //添加蓝图节点的端口
      nodeTemp = addPort(nodeTemp, item.config.blue_script_in_out_config);
      item.graphNode = nodeTemp;
      //console.log("初始化后的画布上的元素", this.blueScriptData);
    },
  },
});
