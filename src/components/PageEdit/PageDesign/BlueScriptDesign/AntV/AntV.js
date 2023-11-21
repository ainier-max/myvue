//添加连线
export function addEdge(blue_script_in_out_config) {
  console.log("添加连线--blue_script_in_out_config", blue_script_in_out_config);
  
  if (typeof blue_script_in_out_config.out != "undefined") {
    blue_script_in_out_config.out.forEach(element => {
      //console.log("element3333",element);
      element.connectedTargetArr.forEach(item => {
        //console.log("item3333",item);
        let flagTemp = 0;
        //console.log("window.antVGraph.getNodes()3333",window.antVGraph.getNodes());
        window.antVGraph.getNodes().forEach(node => {
          //console.log("node3333",node);
          if (node.id == item.cell) {
            flagTemp = 1;
          }
        });
        //console.log("flagTemp3333",flagTemp);
        if (flagTemp == 1) {
          
          window.antVGraph.addEdge({
            zIndex: 10,
            source: element.connectedSource,
            target: item,
            router: {
              name: "metro",
            },
            attrs: {
              line: {
                /**
                 stroke: '#1890ff',
                 strokeDasharray: 5,
                 targetMarker: 'classic',
                 style: {
                animation: 'ant-line 30s infinite linear',
              },
                 */
                stroke: "#ff00ff",
                strokeWidth: 1,
                //strokeDasharray: 5,
                targetMarker: {
                  name: "classic",
                  size: 7,
                },
              },
            },
          });

        }
      });
    });
  }


  
  
}

//添加node节点上的端口
export function addPort(node, blue_script_in_out_config) {
  let inParams = blue_script_in_out_config.in;
  if (typeof inParams != "undefined") {
    for (let i = 0; i < inParams.length; i++) {
      if (inParams[i].show == true) {
        if (inParams[i].type == "event") {
          node.addPort({
            key: inParams[i].key,
            id: inParams[i].portID,
            group: "in",
            markup: [
              {
                tagName: "rect",
                selector: "rect",
              },
            ],
            attrs: {
              rect: {
                magnet: true,
                stroke: "#31d0c6",
                fill: "#ffffff",
                strokeWidth: 2,
                width: 10,
                height: 10,
                x: -5,
                y: -5,
              },
              text: {
                text: inParams[i].label, // 标签文本
                fill: "rgba(255,255,255,0.8)",
                fontSize: 12, // 文字大小
              },
            },
          });
        } else if (inParams[i].type == "function") {
          node.addPort({
            key: inParams[i].key,
            id: inParams[i].portID,
            group: "in",
            args: { angle: -90 },
            markup: [
              {
                tagName: "path",
                selector: "path",
              },
            ],
            attrs: {
              text: {
                text: inParams[i].label, // 标签文本
                fill: "rgba(255,255,255,0.8)",
                fontSize: 12, // 文字大小
              },
              path: {
                d: "M -6 -8 L 0 8 L 6 -8 Z",
                magnet: true,
                fill: "white",
              },
            },
          });
        } else {
          //console.log("111：",inParams[i].label);
          node.addPort({
            key: inParams[i].key,
            id: inParams[i].portID,
            group: "in",
            attrs: {
              text: {
                text: inParams[i].label, // 标签文本
                fill: "rgba(255,255,255,0.8)",
                fontSize: 12, // 文字大小
              },
            },
          });
        }
      }
    }
  }

  //输出端口
  let outParams = blue_script_in_out_config.out;
  if (typeof outParams != "undefined") {
    for (let i = 0; i < outParams.length; i++) {
      //console.log("outParams", outParams[i]);
      if (outParams[i].show == true) {
        if (outParams[i].type == "event") {
          node.addPort({
            key: outParams[i].key,
            id: outParams[i].portID,
            group: "out",
            markup: [
              {
                tagName: "rect",
                selector: "rect",
              },
            ],
            attrs: {
              rect: {
                magnet: true,
                stroke: "#31d0c6",
                fill: "#ffffff",
                strokeWidth: 2,
                width: 10,
                height: 10,
                x: -5,
                y: -5,
              },
              text: {
                text: outParams[i].label, // 标签文本
                fill: "rgba(255,255,255,0.8)",
                fontSize: 12, // 文字大小
              },
            },
          });
        } else {
          node.addPort({
            key: outParams[i].key,
            id: outParams[i].portID,
            group: "out",
            attrs: {
              text: {
                text: outParams[i].label, // 标签文本
                fill: "rgba(255,255,255,0.8)",
                fontSize: 12, // 文字大小
              },
            },
          });
        }
      }
    }
  }
  return node;
}
