<template>
  <div style="width: 100%;height: 100%;">
    <grid-layout
        :layout.sync="column_config.data"
        :col-num="colNum"
        :row-height="rowHeight"
        :is-draggable="stateFlag"
        :is-resizable="stateFlag"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="devOption.option.margin"
        :use-css-transforms="true">
      <grid-item :style="gridItemStyle" v-for="item in column_config.data"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i"
                 @contextmenu="onContextMenu($event,item)">
        <!---->
          <PageDebug v-if="item.page_id!=''" page_debug_flag_from_parent="false" :edit_component_flag="column_edit_flag" :page_id_from_parent="item.page_id"
                     model="column"></PageDebug>
      </grid-item>
    </grid-layout>

    <el-dialog
        :append-to-body="true"
        :lock-scroll="false"
        title="新增栏目"
        v-model="addModelShowFlag"
        :close-on-click-modal="false"
        :width="600">
      <ChooseModel :ref_string="ref_string"></ChooseModel>
    </el-dialog>
  </div>
</template>

<script>

import { GridLayout, GridItem } from 'vue-grid-layout'
import PageDebug from "../../../components/PageDebug/index.vue"
//右键菜单样式
import './index.css'
import ChooseModel from "./ChooseModel/index.vue"
import {getCurrentInstance} from "vue";
import option from "../index.js"


export default {
  props: {
    column_edit_flag: {
      type: Boolean,
      default: false
    },
    column_config:{
      type: Object,
      default: {}
    },
    ref_string:{
      type: String,
      default: ''
    },
    component: {
      type: Object,
      default: null
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
      devOption:null
    };
  },
  components: {
    GridLayout,
    GridItem,
    PageDebug,
    ChooseModel
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
        zIndex: 999999,
        x: e.x,
        y: e.y,
        items: [
          {
            label: "选择栏目",
            onClick: () => {
              console.log("选择栏目");
              the.showAddModel(item);
            }
          },
          {
            label: "删除栏目",
            onClick: () => {
              console.log("删除栏目");
              the.deleteColumnModel(item);
            }
          },
          {
            label: "删除布局",
            onClick: () => {
              console.log("删除");
              the.deleteColumnLayout(item);
            }
          },
        ]
      });
    },
    deleteColumnModel(item){
      let columnData=window.cbcColumnInstance[this.ref_string].data.column_config.data;
      console.log("item12",item);
      for(let j=0;j<columnData.length;j++){
        if(columnData[j].i==item.i){
          window.cbcColumnInstance[this.ref_string].data.column_config.data[j].page_id="";
        }
      }
    },
    deleteColumnLayout(item){
      let columnData=window.cbcColumnInstance[this.ref_string].data.column_config.data;
      console.log("item12",item);
      for(let j=0;j<columnData.length;j++){
        if(columnData[j].i==item.i){
          window.cbcColumnInstance[this.ref_string].data.column_config.data.splice(j,1);
          j=j-1;
        }
      }
    },
    showAddModel(item){
      this.currentItem=item;
      this.addModelShowFlag=true;
    },
    updateState(flag){
      this.stateFlag=flag;
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
      this.column_config.data.push( item );
      console.log("门户配置444",this.column_config);
      //到此完结
    },
    getPositionForNewItem(newItem){
      //1、确定边界
      let gridMap = [], maxX = this.colNum, maxY = 0
      //2、找到Y的最大值

      let allY = this.column_config.data.map(item=>(item.y + item.h))
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
        this.column_config.data.forEach(({ x, y, w, h })=>{
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
    window.cbcColumnGridLayoutInstance={};
    window.cbcColumnGridLayoutInstance[this.ref_string] = getCurrentInstance();

    this.stateFlag=this.column_edit_flag;
    console.log("this.stateFlag::",this.stateFlag);
    if(this.column_edit_flag==true){
      this.gridItemStyle="cursor:move;border: solid black 1px;background-color: #CCCCCC;";
    }
    console.log("开发者配置123",this.component);

    this.devOption = this.component.config;

    console.log("开发者配置12",this.devOption);

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