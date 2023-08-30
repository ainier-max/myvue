<template>
  <div v-if="option" :id="option.devOption.option.id" style="width:100%;height:100%">
  </div>
</template>

<script>
import option from "./index.js";
export default {
  props: {
    layoutComponentInfo: {
      type: Object,
      default: null,
    },
    component: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      option,
      devOption:null,
      map:null
    };
  },
  components: {},
  methods: {
    loadMap() {
      console.log("地图配置：", option);
      let mapConfig = this.devOption.option;
      let crsTemp = null;
      if (mapConfig.crs) {
        if (mapConfig.crs.bounds) {
          crsTemp = new L.Proj.CRS(mapConfig.crs.epsg, mapConfig.crs.proj, {
            resolutions: mapConfig.crs.resolutions,
            origin: mapConfig.crs.origin,
            bounds: L.bounds(mapConfig.crs.bounds[0], mapConfig.crs.bounds[1]),
          });
        } else {
          crsTemp = new L.Proj.CRS(mapConfig.crs.epsg, mapConfig.crs.proj, {
            resolutions: mapConfig.crs.resolutions,
            origin: mapConfig.crs.origin,
          });
        }
      } else {
        console.log("没有配置投影CRS");
      }
      console.log("crsTemp123",crsTemp);

      var mapOption = {};
      mapOption.closePopupOnClick = mapConfig.closePopupOnClick;
      mapOption.maxZoom = mapConfig.maxZoom;
      mapOption.minZoom = mapConfig.minZoom;
      mapOption.zoomControl = mapConfig.zoomControl;
      mapOption.attributionControl = false; //右下角标题
      if (typeof mapConfig.zoomSnap != "undefined") {
        mapOption.zoomSnap = mapConfig.zoomSnap; //缩放级别
        mapOption.zoomDelta = mapConfig.zoomSnap; //缩放级别
      }
      if (crsTemp != null) {
        mapOption.crs = crsTemp;
      }
      //地图初始化
      this.map = L.map(mapConfig.id, mapOption);
      //地图坐标系
      this.map.coordinateType = mapConfig.coordinateType;
      //地图距离单位
      this.map.coordinateUnit = mapConfig.coordinateUnit;
      //动态图标移动时候居中
      this.map.movingMarker_flag = false;
      //为地图对象添加mapType赋值
      this.map.mapType = "leaflet";
      var tileLayerOption = {};
      /**
       * 百度坐标系需要加上tms参数,高德,PGIS则不需要
       */
      //console.log("tms:",typeof (mapConfig.tms));
      if (mapConfig.tms) {
        tileLayerOption.tms = mapConfig.tms;
      }
      //加载矢量图层
      if (mapConfig.mapUrl) {
        let tileLayer = new L.TileLayer(mapConfig.mapUrl, tileLayerOption);
        tileLayer.type = "mapLayer";
        tileLayer.addTo(this.map);
      }
      //加载标注图层
      if (mapConfig.titleUrl) {
        let titleLayer = new L.TileLayer(mapConfig.titleUrl, tileLayerOption);
        titleLayer.type = "mapLayer";
        titleLayer.addTo(this.map);
      }
      //地图加载完成
      console.log("地图加载完成");
      this.map.setView(mapConfig.centerPoint, mapConfig.level);
      this.component.map = this.map;
    },
    addWMS() {
      
    }
  },
  created() {
    console.log("component1232",this.component);
    if(this.component==null){
      this.devOption=option.devOption;
    } else {
      this.devOption=option.devOption;
      //this.devOption=this.component.component_config;
    }
    console.log("this.devOption123", this.devOption);
  },
  mounted() {
    this.loadMap();
  },
};
</script>
<style scoped></style>
