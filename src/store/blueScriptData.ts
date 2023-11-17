
import { defineStore, storeToRefs } from "pinia";
export const blueScriptDataStore = defineStore("blueScriptDataID", {
    state: () => ({
        blueScriptData: [],
    }),
    getters: {
  
    },
    actions: {
        setBlueScriptData(data) {
            this.blueScriptData = data;
        },
        //添加蓝图节点
        add(obj) {
            console.log("blueScriptData.ts--this.blueScriptData", this.blueScriptData);
            obj.blue_script_ref="blueScriptRef-" + window.cbcuuid();
            obj.blue_script_node_config.id = obj.blue_script_ref;
            obj.blue_script_node_config.x = window.antVGraph.getGraphArea().x + 20;
            obj.blue_script_node_config.y = window.antVGraph.getGraphArea().y + 20;
            obj.blue_script_node_config.label = obj.blue_script_name;
            //编辑区添加蓝图节点
            let nodeTemp = window.antVGraph.addNode(obj.blue_script_node_config);
            nodeTemp.blue_script_ref = obj.blue_script_ref;
            //添加蓝图节点的端口
            nodeTemp = this.addPort(nodeTemp, obj.blue_script_in_out_config);
            this.blueScriptData.push(obj);
        },



        addPort(node, blue_script_in_out_config) {
            let param = blue_script_in_out_config;
            let inParams = param.in;
            if (typeof (inParams) != "undefined") {
              for (let i = 0; i < inParams.length; i++) {
                if (inParams[i].show == true) {
                  if (inParams[i].type == "event") {
                    node.addPort({
                      key: inParams[i].key,
                      id: inParams[i].portID,
                      group: 'in',
                      markup: [
                        {
                          tagName: 'rect',
                          selector: 'rect',
                        },
                      ],
                      attrs: {
                        rect: {
                          magnet: true,
                          stroke: '#31d0c6',
                          fill: '#ffffff',
                          strokeWidth: 2,
                          width: 10,
                          height: 10,
                          x: -5,
                          y: -5,
                        },
                        text: {
                          text: inParams[i].label, // 标签文本
                          fill: 'rgba(255,255,255,0.8)',
                          fontSize: 12,    // 文字大小
                        },
                      },
                    })
                  } else if(inParams[i].type == "function"){
                    node.addPort({
                      key: inParams[i].key,
                      id: inParams[i].portID,
                      group: 'in',
                      args: { angle: -90 },
                      markup: [
                        {
                          tagName: 'path',
                          selector: 'path',
                        },
                      ],
                      attrs: {
                        text: {
                          text: inParams[i].label, // 标签文本
                          fill: 'rgba(255,255,255,0.8)',
                          fontSize: 12,    // 文字大小
                        },
                        path: {
                          d: 'M -6 -8 L 0 8 L 6 -8 Z',
                          magnet: true,
                          fill: 'white',
                        },
                      },
                    })
                  }else {
                    //console.log("111：",inParams[i].label);
                    node.addPort({
                      key: inParams[i].key,
                      id: inParams[i].portID,
                      group: 'in',
                      attrs: {
                        text: {
                          text: inParams[i].label, // 标签文本
                          fill: 'rgba(255,255,255,0.8)',
                          fontSize: 12,    // 文字大小
                        },
                      },
                    })
                  }
      
                }
              }
            }
      
            //输出端口
            let outParams = param.out;
            if (typeof (outParams) != "undefined") {
              for (let i = 0; i < outParams.length; i++) {
                //console.log("outParams", outParams[i]);
                if (outParams[i].show == true) {
                  if (outParams[i].type == "event") {
                    node.addPort({
                      key: outParams[i].key,
                      id: outParams[i].portID,
                      group: 'out',
                      markup: [
                        {
                          tagName: 'rect',
                          selector: 'rect',
                        },
                      ],
                      attrs: {
                        rect: {
                          magnet: true,
                          stroke: '#31d0c6',
                          fill: '#ffffff',
                          strokeWidth: 2,
                          width: 10,
                          height: 10,
                          x: -5,
                          y: -5,
                        },
                        text: {
                          text: outParams[i].label, // 标签文本
                          fill: 'rgba(255,255,255,0.8)',
                          fontSize: 12,    // 文字大小
                        },
                      },
                    })
      
                  } else {
                    node.addPort({
                      key: outParams[i].key,
                      id: outParams[i].portID,
                      group: 'out',
                      attrs: {
                        text: {
                          text: outParams[i].label, // 标签文本
                          fill: 'rgba(255,255,255,0.8)',
                          fontSize: 12,    // 文字大小
                        },
                      },
                    })
                  }
      
                }
              }
            }
            return node;
          }
    }
});