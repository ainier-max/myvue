<template>

  <div style="width: 100%;background: #cbcbcb">
    <grid-layout
        :layout.sync="portal_config.data"
        :col-num="colNum"
        :row-height="rowHeight"
        :is-draggable="stateFlag"
        :is-resizable="stateFlag"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true">
      <grid-item :style="gridItemStyle" v-for="item in portal_config.data"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i"
                 @contextmenu="onContextMenu($event,item)">
        <div style="overflow-y: hidden">
          <!--
                      <micro-app v-if="item.i=='odgrfbrxyh1681115875297'" :name="'app'+item.i" url='http://10.11.0.87:7105/' baseroute='/my-page/app'></micro-app>
           -->


          <micro-app v-if="item.i=='odgrfbrxyh1681115875297'" :name="'app'+item.i" url='http://10.11.0.87:7105/' baseroute='/my-page/app'></micro-app>



        </div>
      </grid-item>
    </grid-layout>


  </div>
</template>

<script>

import { GridLayout, GridItem } from 'vue-grid-layout'
//右键菜单样式
import './index.css'



export default {
  props: {
    portal_edit_flag: {
      type: Boolean,
      default: false
    },
    portal_config:{
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      gridItemStyle:'',
      colNum: 100,
      rowHeight: 10,
      stateFlag:false,
      addModelShowFlag:false,
      currentItem:null,
    };
  },
  components: {
    GridLayout,
    GridItem
  },
  methods:{
    onContextMenu(e,item){
      if(this.stateFlag==false){
        return;
      }
      console.log("onContextMenu--$event,item",e,item);
      let the = this;
      e.preventDefault();
      //shou our menu
      this.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: "选择模块",
            onClick: () => {
              console.log("添加模块");
            }
          },
          {
            label: "删除模块",
            onClick: () => {
              console.log("删除模块");
              the.deletePortalModel(item);
            }
          },
          {
            label: "删除布局",
            onClick: () => {
              console.log("删除");
              the.deletePortalLayout(item);
            }
          },
        ]
      });
    },

    deletePortalModel(item){
      let portalData=window.cbcPortal2Instance.data.portal_config.data;
      console.log("item12",item);
      console.log("portalData12",portalData);
      for(let j=0;j<portalData.length;j++){
        if(portalData[j].i==item.i){
          window.cbcPortal2Instance.data.portal_config.data[j].page_id="";
        }
      }
    },
    deletePortalLayout(item){
      let portalData=window.cbcPortal2Instance.data.portal_config.data;
      console.log("item12",item);
      console.log("portalData12",portalData);
      for(let j=0;j<portalData.length;j++){
        if(portalData[j].i==item.i){
          window.cbcPortal2Instance.data.portal_config.data.splice(j,1);
          j=j-1;
        }
      }
    },

    addNewItem(){
      let item={};
      item.w=100;
      item.h=5;
      item.i = window.cbcuuid();//i的值可以根据自己实际情况设置
      const { x, y } = this.getPositionForNewItem( item )
      item.x = x
      item.y = y
      //插入到画布
      this.portal_config.data.push( item );
      console.log("门户配置444",this.portal_config);
      //到此完结
    },
    getPositionForNewItem(newItem){
      //1、确定边界
      let gridMap = [], maxX = this.colNum, maxY = 0
      //2、找到Y的最大值

      let allY = this.portal_config.data.map(item=>(item.y + item.h))
      maxY = allY.length?Math.max.apply(null, allY) : 0

      //maxY=60;

      let isFind = false, findx = 0, findy = 0
      if( maxY ){
        //3、生成整个画布的方格地图
        let i, j;
        for(i = 0; i < maxX; i++){
          gridMap[i] = []
          for(j = 0; j < maxY; j++){
            gridMap[i][j] = 0
          }
        }
        //4、标注已被占用的方格
        let a, b, axw, byh;
        this.portal_config.data.forEach(({ x, y, w, h })=>{
          axw = x + w; byh = y + h;
          for(a = x; a < axw; a++){
            for(b = y; b < byh; b++){
              gridMap[a][b] = w
            }
          }
        })
        //5、根据以上标注的位置信息寻位，w表示已被占用，0表示未被占用
        let x, y, cx, cy, xw, yh;
        for(y = 0; y < maxY; y++){
          yh = y + newItem.h
          for(x = 0; x < maxX; x++){
            if(gridMap[x] && gridMap[x][y]){
              x = Math.min(maxX - 1, x + gridMap[x][y])
            }
            xw = x + newItem.w
            if(!gridMap[x][y] && xw < maxX && yh < maxY){
              //在画布内未被占用，则从这个位置开始寻位，看是否能找到足够的位置放新卡片
              let isMatch = true
              for(cy = y; cy < yh; c++){
                for(cx = x; cx < xw; r++){
                  if(gridMap[cx][cy]){
                    x = cx + gridMap[cx][cy]//跳过组件的x，提升性能的关键一步
                    isMatch = false//进来说明已被占用，跳过x，y位置，找下一个方格
                    break
                  }
                }
                //被占用则退出当前寻位循环
                if( !isMatch ){
                  break
                }
              }
              //寻位结束：寻位的所有方格都没被占用的，则找到位置
              if( isMatch ){
                isFind = true
                findx = x
                findy = y
                break
              }
            }
          }
          //找到则退出整个循环
          if( isFind ){
            break
          }
        }
        //遍历完没有找到合适位置，则直接放在最后一行的开始位置x=0，y = maxY+1
        if( !isFind ){
          findx = 0
          findy = maxY + 1
        }
      }
      gridMap = []
      //allY =  []
      return { x: findx, y: findy }
    }



  },
  created() {
    this.stateFlag=this.portal_edit_flag;
    console.log("this.stateFlag::",this.stateFlag);
    if(this.portal_edit_flag==true){
      this.gridItemStyle="cursor:move;border: solid black 1px;background-color: #CCCCCC;";
    }

  },
  mounted() {


  }
};
</script>
<style scoped>
:deep(.vue-grid-item>.vue-resizable-handle) {
  z-index: 9999;
}
</style>