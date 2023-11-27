import { defineStore, storeToRefs } from "pinia";

import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { blueScriptData, currentBlueScript } = storeToRefs(
  blueScriptDataStoreObj
);

import { pageRenderTreeDataStore } from "@/store/pageRenderTreeData.ts";
const pageRenderTreeDataStoreObj = pageRenderTreeDataStore();
const { pageRenderTreeData } = storeToRefs(pageRenderTreeDataStoreObj);

import * as treeFun from "@/common/js/tree.js";
import { nextTick } from "vue";



export const processDataStore = defineStore("processDataID", {
  state: () => ({
    debugProcessFlag: null,
  }),
  getters: {},
  actions: {
    eventProcess(eventType, obj, component) {
      blueScriptData.value.forEach(element => {
        if (element.related_ref==component.ref && element.config.blue_script_in_out_config.out) {
          //输出参数设置值
          element.config.blue_script_in_out_config.out.forEach(outItem => {
            if (outItem.label == eventType) {
              //赋值
              outItem.value = obj;
              //如果有连接线，则执行下一个蓝图节点
              outItem.connectedTargetArr.forEach(connectedTargetItem => {
                let param = {};
                param.blue_script_ref = connectedTargetItem.cell;
                param.fromPort = outItem.connectedSource.port;
                param.toPort = connectedTargetItem.port;
                param.value = obj;
                this.setNodeInValueAndRunProcessFun(param);
              });
            }
          });
        }
      });
    },
    

    runAllProcess(flag) {
      this.debugProcessFlag = flag;
      console.log(
        "runAllProcess--pageRenderTreeData",
        pageRenderTreeData.value
      );
      console.log("runAllProcess--blueScriptData", blueScriptData.value);
      console.log("寻找所有流程的起点");
      let startBlueScripts = [];
      blueScriptData.value.forEach((element) => {
        if (
          element.config.startPointFlag == true &&
          element.blue_script_id != "EventStartRun"
        ) {
          startBlueScripts.push(element);
        }
      });
      console.log("执行流程的所有起点：", startBlueScripts);
      console.log("重置流程输入参数运行状态为false：", blueScriptData.value);
      console.log(
        "执行流程关键逻辑：只有节点的输入参数的执行状态ifProcess都为true,才会继续走流程！"
      );
      console.log("流程主逻辑--开始执行");
      startBlueScripts.forEach((element) => {
        //起点的输入参数都设置ifProcessFlag为true
        console.log("forEach--element", element);
        element.config.blue_script_in_out_config.in.forEach((item) => {
          item.ifProcessFlag = true;
        });
        //节点开始执行
        this.runBlueScriptProcess("", "", element);
      });
    },
    //单个node执行
    runBlueScriptProcess(fromPort, toPort, blueScript) {
      console.log(blueScript.blue_script_name + ",该蓝图fromPort", fromPort);
      console.log(blueScript.blue_script_name + ",该蓝图toPort", toPort);
      console.log(
        blueScript.blue_script_name + ",该蓝图blueScript：",
        blueScript
      );
      let inTemp = blueScript.config.blue_script_in_out_config?.in || [];
      console.log(blueScript.blue_script_name + ",该蓝图输入信息：", inTemp);

      //输入端口未onlySet方式，则不走蓝图逻辑
      inTemp.forEach((element) => {
        if (element.portID == toPort) {
          if (element.onlySet && inTemp[i].onlySet == true) {
            console.log(
              blueScript.name +
                "该蓝图接口(" +
                element.label +
                ")不执行蓝图逻辑"
            );
            return;
          }
        }
      });

      if (fromPort == "" || inTemp.length == 1) {
        //如果蓝图无输入端口,不需要等待输入
        //如果输入个数为1个参数时，不需要等待输入
        blueScript.waitFlag = false;
      } else if (
        blueScript.config.settings &&
        blueScript.config.settings.RelevancePortSetProcessFlagToFalse
      ) {
        //如果设置了关联蓝图节点
        blueScript.waitFlag = true;
      } else {
        blueScript.waitFlag = true;
      }
      console.log(
        blueScript.blue_script_name + ",该蓝图节点的等待标识：",
        blueScript.waitFlag
      );

      let paramObj = {};
      paramObj.runPort = toPort;
      paramObj.blueScript = blueScript;
      paramObj.pageRenderTreeData = pageRenderTreeData;
      paramObj.blueScriptData = blueScriptData;
      paramObj.callBackFun = this.callBackFun;

      console.log("当前蓝图eval（执行方法与逻辑）转换blueScript", blueScript);
      if (blueScript.config.execFunctionStr) {
        blueScript.execFunction = eval(
          "(" + blueScript.config.execFunctionStr + ")"
        );
      }

      console.log(
        "runBlueScriptProcess--this.debugProcessFlag",
        this.debugProcessFlag
      );
      if (fromPort != "" || toPort != "") {
        if (this.debugProcessFlag) {
          this.changeEdgeStyle(fromPort, toPort);
        }
      }

      if (blueScript.waitFlag == true) {
        let processArrFlag = [];
        inTemp.forEach((element) => {
          //事件类型不考虑,连接状态为true,执行状态为true,表示该蓝图端口已被执行
          if (element.type != "event" && element.type != "function") {
            if (element.connected == true) {
              if (element.ifProcessFlag == true) {
                processArrFlag.push(true);
              } else {
                processArrFlag.push(false);
              }
            } else {
              processArrFlag.push(true);
            }
          }
        });

        let toStartFlag = true; //开始执行标识
        processArrFlag.forEach((element) => {
          if (element == false) {
            toStartFlag = false;
          }
        });

        if (toStartFlag == true) {
          for (let i = 0; i < inTemp.length; i++) {
            if (toPort == inTemp[i].portID && inTemp[i].type == "function") {
              paramObj.functionReturnValue = this.excuteFunction(
                inTemp[i],
                blueScript
              );
            }
          }
          paramObj.blueScript.debugParamObj = paramObj;
          paramObj.debugFlag = false;
          //执行蓝图逻辑
          console.log(blueScript.blue_script_name + ",开始执行蓝图逻辑");
          blueScript.config.blue_script_logic_config.logicFun(paramObj);
        } else {
          //未全完成输入
          console.log(
            blueScript.blue_script_name + ",等待其他参数输入:",
            blueScript
          );
        }
      } else if (blueScript.waitFlag == false) {
        for (let i = 0; i < inTemp.length; i++) {
          if (toPort == inTemp[i].portID && inTemp[i].type == "function") {
            paramObj.functionReturnValue = this.excuteFunction(
              inTemp[i],
              blueScript
            );
          }
        }
        paramObj.blueScript.debugParamObj = paramObj;
        paramObj.debugFlag = false;
        //执行蓝图逻辑
        console.log(blueScript.blue_script_name + ",开始执行蓝图逻辑");
        blueScript.config.blue_script_logic_config.logicFun(paramObj);
      }
    },
    //回调
    callBackFun(paramObj) {
      console.log("callBackFun--paramObj", paramObj);
      if (paramObj.debugFlag == true) {
        currentBlueScript.value = paramObj.blueScript;
        return;
      }
      if (paramObj.type == "runNextProcessFun") {
        this.runNextProcessFun(paramObj);
      } else if (paramObj.type == "refreshComponentFun") {
        this.refreshComponentFun(paramObj);
      }
    },
    //刷新页面渲染树的组件数据
    refreshComponentFun(paramObj) {
      console.log(
        paramObj.blueScript.blue_script_name +
          ":refreshComponentFun--paramObj:",
        paramObj
      );
      if (
        paramObj.blueScript.related_ref &&
        paramObj.blueScript.type == "frontEndComponent"
      ) {
        let pageRenderTreeObj = treeFun.findNodeByRef(
          pageRenderTreeData.value,
          paramObj.blueScript.related_ref
        );
        console.log("pageRenderTreeObj", pageRenderTreeObj);
        if (pageRenderTreeObj.config.dataset) {
          pageRenderTreeObj.config.dataset = paramObj.blueScript.config.dataset;
        }
        //刷新
        pageRenderTreeObj.config.attr.show = false;
        nextTick(() => {
          pageRenderTreeObj.config.attr.show = true;
        });
        console.log("pageRenderTreeObj232", pageRenderTreeObj);
      }
    },

    //执行下一个蓝图节点
    runNextProcessFun(paramObj) {
      console.log(
        paramObj.blueScript.blue_script_name + ":runNextProcessFun--paramObj:",
        paramObj
      );
      paramObj.blueScript.config.blue_script_in_out_config.out.forEach(
        (element) => {
          //输出端口赋值
          element.value = paramObj.value;
          //输出端的执行状态
          element.ifProcessFlag = true;
          if (element.connectedTargetArr) {
            element.connectedTargetArr.forEach((item) => {
              let param = {};
              param.blue_script_ref = item.cell;
              param.fromPort = element.connectedSource.port;
              param.toPort = item.port;
              param.value = paramObj.value;
              this.setNodeInValueAndRunProcessFun(param);
            });
          }
        }
      );
      //关联蓝图节点刷新
      if (paramObj.blueScript.config?.settings?.RelevanceBlueScriptsRefresh) {
        paramObj.blueScript.config.settings.RelevanceBlueScriptsRefresh.forEach(
          (element) => {
            blueScriptData.value.forEach((item) => {
              if (element.blue_script_ref == item.blue_script_ref) {
                this.runBlueScriptProcess("", "", item);
              }
            });
          }
        );
      }
    },
    setNodeInValueAndRunProcessFun(param) {
      console.log("setNodeInValueAndRunProcessFun--param:", param);
      blueScriptData.value.forEach((element) => {
        if (element.blue_script_ref == param.blue_script_ref) {
          element.config.blue_script_in_out_config.in.forEach((item) => {
            console.log("setNodeInValueAndRunProcessFun--item", item);
            if (item.portID == param.toPort) {
              console.log("111", item);
              item.value = param.value;
              item.ifProcessFlag = true;
              console.log("222", element);
              if (element.config.dataset) {
                if (
                  param.value &&
                  typeof param.value.length == "undefined"
                ) {
                  //值不是数组并设置dataSet数据
                  element.config.dataset.data = [param.value];
                } else {
                  //值是数组并设置dataSet数据
                  element.config.dataset.data = param.value;
                }
                console.log(
                  "1111123pageRenderTreeObj.config.dataset.data",
                  element.config.dataset.data
                );
                //设置dataSet字段
                if (element.config.dataset.data.length > 0) {
                  let objTemp = element.config.dataset.data[0];
                  element.config.dataset.fields = [];
                  for (let key in objTemp) {
                    element.config.dataset.fields.push(key);
                  }
                }
              }


              console.log("setNodeInValueAndRunProcessFun--element1", element);
              this.runBlueScriptProcess(param.fromPort, param.toPort, element);
            }
          });
        }
      });
    },
    //改变线的样式
    changeEdgeStyle(fromPort, toPort) {
      window.antVGraph.getEdges().forEach((element) => {
        if (element.source.port == fromPort && element.target.port == toPort) {
          element.attr("line", {
            stroke: "#1890ff",
            strokeDasharray: 5,
            style: {
              animation: "ant-line 30s infinite linear",
            },
          });
        }
      });
    },
  },
});
