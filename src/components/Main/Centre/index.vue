<template>
  <div style="height: 80%;margin: 20px">
    <div class="titleClass">平台中心</div>


    <el-row style="margin:40px 50px;">
      <el-col :span="6">
        <el-divider content-position="left"><span style="font-size: 18px">页面目录树</span>
        </el-divider>

        <el-tree ref="pageTreeRef" :data="pageTreeData" node-key="id" :default-expand-all="true"
                 :expand-on-click-node="false" :props="defaultProps" :highlight-current="true" @node-click="nodeClick"
                 style="margin-left:50px"/>

      </el-col>
      <el-col :span="18">
        <el-divider content-position="left" style="margin-left:50px"><span style="font-size: 18px">页面</span>
        </el-divider>

        <div style="width: 100%">

          <ul style="padding-inline-start:10px;padding-top: 5px;padding-right: 5px;">
            <li style="cursor:pointer;padding-left:40px;padding-top:30px;display:inline-block;list-style:none;">
              <div style="background-color: #fff6f7;text-align: center;"  @click="showAddPage()">
                <div style="line-height:30px;font-size: 16px">
                  新增页面
                </div>
                <div>
                  <img style="width:200px;height:110px;display:block;" src="../../../assets/images/add.jpg"/>
                </div>
              </div>
            </li>

            <li v-for="(item,i) in pagesArr" style="cursor:pointer;padding-left:40px;padding-top:30px;display:inline-block;list-style:none;">
              <div style="background-color: #fff6f7;text-align: center;"  class="showpic" @contextmenu="onItemContextMenu($event,item)"  @click="goPage(item)">
                <div style="line-height:30px;font-size: 16px">
                  {{item.page_name}}
                </div>
                <div>
                  <img style="width:200px;height:110px;display:block;" :src="getFileUrl+'?uuid=' + item.page_img+ '&type=photo'"/>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>

    <el-dialog
        title="新增页面"
        v-model="addPageDialogVisible"
        :close-on-click-modal="false"
        ref="upholdDialogRef"
        width="30%">


      <el-form :model="pageInfoDataForm" label-width="100px">
        <el-form-item label="页面名称" prop="pageName">
          <el-input v-model="pageInfoDataForm.pageName" placeholder="页面名称"></el-input>
        </el-form-item>
        <el-form-item  label="页面宽度" prop="pageWidth">
          <el-input v-model="pageInfoDataForm.pageWidth" placeholder="页面宽度(单位px)"></el-input>
        </el-form-item>

        <el-form-item  label="页面高度" prop="pageHeight">
          <el-input v-model="pageInfoDataForm.pageHeight" placeholder="页面高度(单位px)"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addPageCancle">取 消</el-button>
        <el-button type="primary" @click="addPage">确 定</el-button>
      </template>

    </el-dialog>

    <el-dialog
        title="确认框"
        v-model="deletePageDialogVisible"
        :close-on-click-modal="false"
        width="30%">
      将要删除页面<span style="color:red;font-weight: bold">({{ currentPage.page_name }})</span>与其所属的所有数据？
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="deletePageCancle">取 消</el-button>
        <el-button type="primary" @click="deletePage">确 定</el-button>
      </span>
      </template>
    </el-dialog>


  </div>
</template>

<script>
import {commonExcuteRequest, commonSelectRequest,commonExcuteByBatchRequest} from "@/common/js/request.js";
import axios from "axios";
import {getListData} from "@/common/js/tree.js";
import {objectToString} from "@/common/js/objStr.js";
import { uuid } from "@/common/js/uuid.js";



export default {
  name: "Centre",
  props: {},
  data() {
    return {
      getFileUrl:window.cbcConfig.getFileUrl,
      pageTreeData:[],
      defaultProps: {
        "children": 'children',
        "label": 'label'
      },
      addPageDialogVisible:false,
      pagesArr:[],
      pageInfoDataForm:{
        pageName:'',
        pageWidth:'',
        pageHeight:'',
      },
      deletePageDialogVisible:false,

      currentPage:null,


    };
  },
  methods: {
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
      //console.log("data11",data.id);
      let param = {};
      param.sql = "page_centre.find";
      param.page_tree_id = data.id;
      commonSelectRequest(axios, param, this.nodeClickCallBack);
    },
    nodeClickCallBack(result){
      this.pagesArr=result.objects;
      console.log("this.pagesArrttt",this.pagesArr);
    },
    goPage(item){
      const { href } = this.$router.resolve({
        path: '/PageEdit',
        query: {
          page_id: item.page_id,
          page_type:'edit'
        }
      });
      window.open(href, '_blank');
    },
    showAddPage(){
      this.addPageDialogVisible=true;
    },
    addPageCancle(){
      this.addPageDialogVisible=false;
      this.pageInfoDataForm.pageName='';
      this.pageInfoDataForm.pageWidth='';
      this.pageInfoDataForm.pageHeight='';
    },

    addPage(){
      if(this.pageInfoDataForm.pageName=="" || this.pageInfoDataForm.pageWidth=='' || this.pageInfoDataForm.pageHeight==''){
        this.$message.error("选项未被输入");
        return;
      }

      let param = {};
      param.sql = "page_centre.insert";
      param.page_name = this.pageInfoDataForm.pageName;
      let nodeTemp=this.$refs.pageTreeRef.getCurrentNode();
      //console.log("nodeTemp112：",nodeTemp);
      param.page_tree_id =  nodeTemp.id;
      param.type =  "mainBlock";
      param.id="id-"+window.cbcuuid();
      param.page_img =  "6da8931c36284f8ea8160b9770a39577";
      param.page_block_ref='blockRef-'+window.cbcuuid();
      let configObj={
        attr:{
          index:0,
          h:this.pageInfoDataForm.pageHeight,
          w:this.pageInfoDataForm.pageWidth,
          unit:"px",
          pageModel:"adaptation",
          backgroundType:"color",
          backgroundColorValue:"rgba(0,0,0,0.8)",
          backgroundImgValue:"",
        },
        blueScriptAttr:{
          x:0,
          y:0,
          w:3000,
          h:2000,
          in:[],
          out:[]
        }
      };
      param.config_str=objectToString(configObj);

      console.log("param112:",param);
      commonExcuteByBatchRequest(window.axios, param, this.addPageCallBack);

    },
    addPageCallBack(result){
      console.log("结果方位111",result);
      if (result.state == "success") {
        this.pagesArr=[];
        this.addPageDialogVisible=false;
        this.$message.success('新增成功！');
        this.pageInfoDataForm.pageName='';
        this.pageInfoDataForm.pageWidth='';
        this.pageInfoDataForm.pageHeight='';
        let dataTemp={};
        dataTemp.id=this.$refs.pageTreeRef.getCurrentNode().id;
        this.nodeClick(dataTemp);
      }

    },
    onItemContextMenu(e, item){
      console.log("item1113",item);
      let the = this;
      e.preventDefault();
      this.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: "删除",
            onClick: () => {
              console.log("删除");
              the.currentPage=item;
              the.findPageIsRelatived();
              // the.showDeletePage();
            }
          },
        ]
      });
    },

    showDeletePage(){
      
      this.deletePageDialogVisible=true;
    },
    findPageIsRelatived(){
      console.log("findPageIsRelatived--this.currentPage",this.currentPage);
      let param = {};
      param.sql = "page_centre.findPageIsRelatived";
      param.page_id = this.currentPage.page_id;
      commonSelectRequest(axios, param, this.findPageIsRelativedCallBack);
    },

    findPageIsRelativedCallBack(result){
      if (result.objects.length>0) {
        let msgTemp="";
        msgTemp=msgTemp+"该页面被";
        for(let i=0;i<result.objects.length;i++){
          msgTemp=msgTemp+"《"+result.objects[i].page_name+"》";
        }
        msgTemp=msgTemp+"等页面使用，无法删除！";
        this.$message.error(msgTemp);
      }else{
        this.showDeletePage();
      }
    },


    deletePageCancle(){
      this.deletePageDialogVisible=false;
    },
    deletePage(){
      let param = {};
      param.sql = "page_centre.delete";
      param.page_id = this.currentPage.page_id;
      commonExcuteByBatchRequest(window.axios, param, this.deletePageCallBack);
    },
    deletePageCallBack(result){
      if (result.state == "success") {
        this.deletePageDialogVisible=false;
        let dataTemp={};
        dataTemp.id=this.$refs.pageTreeRef.getCurrentNode().id;
        this.nodeClick(dataTemp);
      }
    },



  },
  mounted() {
    this.findPageTree();

  },

}
</script>

<style scoped>


.titleClass {
  padding: 8px 16px;
  background-color: #fff6f7;
  border-radius: 4px;
  border-left: 5px solid #fe6c6f;
  margin: 10px 0;
  line-height: 40px;
}
.showpic{

}
.showpic:hover{
  transform: scale(1.15);
  cursor: pointer;
}


</style>