
import { Graph, Shape, Edge } from "@antv/x6";
import insertCss from "insert-css";

export function highLightNode(node){
  //全部不高亮
  window.antVGraph.getNodes().forEach((element) => {
    if (element.data && element.data.parent == true) {
      element.getAttrs().body.fill = "rgb(255,251,230,0.8)";
      element.setAttrs(element.getAttrs().body.fill);
    } else {
      element.getAttrs().body.fill = "rgba(40, 44, 52,0.9)";
      element.setAttrs(element.getAttrs().body.fill);
    }
  });
  //选中节点高亮
  node.getAttrs().body.fill = "rgba(95, 149, 255, 0.80)";
  node.setAttrs(node.getAttrs().body.fill);
}
export function initGraph(divID) {
  const containerDom = document.getElementById(divID);
  let containerDomStyle = window.getComputedStyle(containerDom);
  let widthTemp = parseFloat(containerDomStyle.width);
  let heightTemp = parseFloat(containerDomStyle.height);

  let antVGraphTemp = new Graph({
    container: document.getElementById("container"),
    grid: true,
    autoResize: false,
    width: widthTemp,
    height: heightTemp,
    embedding: {
      enabled: true,
      findParent({ node }) {
        const bbox = node.getBBox();
        return this.getNodes().filter((node) => {
          const data = node.getData();
          if (data && data.parent) {
            const targetBBox = node.getBBox();
            return bbox.isIntersectWithRect(targetBBox);
          }
          return false;
        });
      },
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      connector: "rounded",
      connectionPoint: "boundary",
      createEdge() {
        return new Shape.Edge({
          router: {
            name: "metro",
          },
          zIndex: 10,
          attrs: {
            line: {
              stroke: "#ff00ff",
              strokeWidth: 1,
              targetMarker: {
                name: "classic",
                size: 7,
              },
            },
          },
        });
      },
    },
    mousewheel: {
      enabled: true,
      modifiers: ["ctrl"],
    },
    panning: {
      enabled: true,
      modifiers: "ctrl",
    },
  });

  insertCss(`
      @keyframes ant-line {
        to {
            stroke-dashoffset: -1000
        }
      }
    `);

  return antVGraphTemp;
}
export function removeStartPointFlag(node) {
  node.removeTool("button");
}
export function addStartPointFlag(node) {
  console.log("addStartPointFlag--node", node);
  node.addTools({
    name: "button",
    args: {
      markup: [
        {
          tagName: "circle",
          selector: "button",
          attrs: {
            r: 12,
            stroke: "#fe854f",
            strokeWidth: 2,
            fill: "white",
            cursor: "pointer",
          },
        },
        {
          tagName: "text",
          textContent: "起",
          selector: "icon",
          attrs: {
            fill: "#fe854f",
            fontSize: 10,
            textAnchor: "middle",
            pointerEvents: "none",
            y: "0.3em",
          },
        },
      ],
      x: "100%",
      y: "100%",
      offset: { x: -30, y: -20 },
    },
  });
  return node;
}



//添加连线
export function addEdge(blue_script_in_out_config) {
  //console.log("添加连线--blue_script_in_out_config", blue_script_in_out_config);

  if (typeof blue_script_in_out_config.out != "undefined") {
    blue_script_in_out_config.out.forEach((element) => {
      //console.log("element3333",element);
      element.connectedTargetArr.forEach((item) => {
        //console.log("添加连线--item",item);
        let flagTemp = 0;
        //console.log("添加连线--window.antVGraph.getNodes()",window.antVGraph.getNodes());
        window.antVGraph.getNodes().forEach((node) => {
          //console.log("添加连线--node",node);
          if (node.id == item.cell) {
            flagTemp = 1;
          }
        });
        //console.log("添加连线--flagTemp",flagTemp);
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
  //console.log("addPort--blue_script_in_out_config",blue_script_in_out_config);
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
        } else if (inParams[i].type == "method") {
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
                fill: "gray",
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
