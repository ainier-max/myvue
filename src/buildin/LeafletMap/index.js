let option = {
  devOption: {
    attr: {},
    option: {
      //矢量瓦片服务地址
      mapUrl:
        "http://t0.tianditu.gov.cn/vec_c/wmts?tk=9024bb5d2e154746bb513878231cc0cf&service=WMTS&request=GetTile&version=1.0.0&layer=vec&style=default&tilematrixSet=c&format=tiles&height=256&width=256&minZoom=1&maxZoom=18&tilematrix={z}&tilerow={y}&tilecol={x}",
      //注记瓦片服务地址
      titleUrl:
        "http://t0.tianditu.gov.cn/cva_c/wmts?tk=9024bb5d2e154746bb513878231cc0cf&service=WMTS&request=GetTile&version=1.0.0&layer=cva&style=default&tilematrixSet=c&format=tiles&height=256&width=256&minZoom=1&maxZoom=18&tilematrix={z}&tilerow={y}&tilecol={x}",
      //中心点,
      centerPoint: [22.961619342010807, 115.60120819091798],
      //最大级别
      maxZoom: 18,
      //最小级别
      minZoom: 1,
      //坐标系类型
      coordinateType: "WGS84", //取值范围[WGS84,GCJ02,BD09]
      //坐标系单位
      coordinateUnit: "DEGREE",
      //点击地图是否关闭气泡框
      closePopupOnClick: false,
      //缩放级别
      //zoomSnap:0.01,//该设置会导致地图瓦片的缝隙，可通过设置背景颜色，让缝隙不明显
      //级别
      level: 9,
      //缩放控件
      zoomControl: false,
      crs: {
        epsg: "EPSG:4326",
        proj: "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
        resolutions: [
          1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
          0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
          0.001373291015625, 6.866455078125e-4, 3.4332275390625e-4,
          1.71661376953125e-4, 8.58306884765625e-5, 4.29153442382813e-5,
          2.14576721191406e-5, 1.07288360595703e-5, 5.36441802978516e-6,
          2.68220901489258e-6,
        ],
        origin: [-180, 90],
      },
    },
  },
  logic_config: {
    logicFun: function (paramObj) {
      console.log("内置组件--地图：", paramObj);
      
    },
  },
  blue_script_node_config: {
    shape: "static-in-rect",
    width: 150,
    height: 160,
    attrs: {
      body: {
        fill: "rgba(40, 44, 52,0.9)",
        stroke: "#d9d9d9",
        strokeWidth: 1,
      },
      label: {
        fill: "rgba(255,255,255,0.8)", // 文字颜色
        fontSize: 14, // 文字大小
        refX: 0.5,
        refY: 8,
        textAnchor: "middle",
        textVerticalAnchor: "top",
      },
    },
  },
  blue_script_in_out_config: {
    out: [{
      key: 'loadMapEnd',
      label: 'loadMapEnd',
      value: "",
      type: 'event',
      show: true,
      connected: false,
      connectedTargetArr: []
    }],
  },
  blue_script_visualize_config: {
    settings: ["StartPointFlag", "ShowOutParam"],
  },
};

export default option;
