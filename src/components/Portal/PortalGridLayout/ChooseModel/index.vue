<template>
  <div style="width: 100%;height: 100%;">
    <el-divider  content-position="left"><span style="font-size: 18px">模块树</span></el-divider>
    <el-tree ref="pageTreeRef" :data="pageTreeData" node-key="id" :default-expand-all="true"
             :expand-on-click-node="false" :props="defaultProps" :highlight-current="true" @node-click="nodeClick"
             style="margin-left:50px;height: 150px"/>
    <el-divider  content-position="left"><span style="font-size: 18px">模块选择</span></el-divider>

    <div style="height: 150px">
      <el-button v-for="(item,i) in pagesArr" style="margin-top: 10px" @click="addModel(item)">{{item.page_name}}</el-button>
    </div>

  </div>
</template>

<script>

import {commonExcuteRequest, commonSelectRequest} from "../../../../common/js/request";
import axios from "axios";
import {getListData} from "../../../../common/js/tree";



export default {
  data() {
    return {
      pageTreeData:[],
      defaultProps: {
        "children": 'children',
        "label": 'label'
      },
      pagesArr:[],

    };
  },
  components: {

  },
  methods:{
    addModel(item){
      console.log("window.cbcPortalGridLayoutInstance2",window.cbcPortalGridLayoutInstance);
      let currentItem=window.cbcPortalGridLayoutInstance.data.currentItem;
      let allItem=window.cbcPortalInstance.data.portal_config.data;
      console.log("addModel-item",item);
      console.log("addModel-currentItem",currentItem);
      console.log("addModel-allItem",allItem);
      for(let i=0;i<allItem.length;i++){
        if(allItem[i].i==currentItem.i){
          window.cbcPortalInstance.data.portal_config.data[i].page_id=item.page_id+"";
        }
      }
      window.cbcPortalGridLayoutInstance.data.addModelShowFlag=false;
      window.cbcPortalInstance.ctx.updatePortalPage();


    },

    findPageTree(){
      let param = {};
      param.sql = "page_centre_tree.find";
      commonSelectRequest(axios, param, this.findPageTreeCallBack);
    },
    findPageTreeCallBack(result){
      console.log("result,",result);
      this.pageTreeData = getListData(result.objects, []);
    },
    nodeClick(data){
      let param = {};
      param.sql = "page_centre.find";
      param.page_tree_id = data.id;
      commonSelectRequest(axios, param, this.nodeClickCallBack);
    },
    nodeClickCallBack(result){
      this.pagesArr=result.objects;
      console.log("this.pagesArrttt",this.pagesArr);
    },




  },
  created() {

  },
  mounted() {
    this.findPageTree();

  }
};
</script>
<style scoped>

</style>