<template>
  <div style="width: 100%;height: 100%;">
    <el-row style="width: 100%;height: 100%">
      <el-col :span="6" style="width: 100%;height: 100%;border-right: 1px solid whitesmoke;background: #282c34;overflow: auto">
        <el-tree ref="blockTreeRef" :data="pageBlockTreeData" node-key="id" :default-expand-all="false"
                 :expand-on-click-node="false" :props="defaultProps" :highlight-current="true"
                 :current-node-key="currentNodeKey"
                 :default-expanded-keys="showExpandedArray"
                 @node-click="pageBlockTreeNodeClick"
                 style="background: #282c34;">
          <template #default="{ node, data }">

          <span class="custom-tree-node">
            <span v-if="data.pid==null">
              <Folder style="width: 1em; height: 1em; "/>
              {{ node.label }}
            </span>
            <span v-if="data.pid!=null">
              {{ node.label }}
            </span>
            <span>
              <Plus  style="width: 1em; height: 1em;color: blueviolet;margin-left: 8px"
                    @click.stop="() => treeAppend(data)"></Plus>
              <!--
              <Edit v-if="data.pid!=null" style="width: 1em; height: 1em;color: blueviolet;margin-left: 8px"
                    @click="() => treeEdit(data)"></Edit>
                    -->
              <Delete v-if="data.pid!=null" style="width: 1em; height: 1em;color: red;margin-left: 8px"
                      @click="() => treeRemove(data)"></Delete>
            </span>
          </span>
          </template>
        </el-tree>
      </el-col>

      <el-col :span="9" style="border-right: 1px solid whitesmoke">
        <el-tree ref="layoutTreeRef" :data="pageLayoutsTreeData" node-key="id" :default-expand-all="false"
                 :expand-on-click-node="false" :props="defaultProps" :highlight-current="true"
                 :current-node-key="currentLayoutKey"
                 @node-click="pageLayoutsTreeNodeClick"
                 style="background: #282c34;">
          <template #default="{ node, data }">

          <span class="custom-tree-node">
            <span>
              {{ node.label }}
            </span>
            <span>
              <Delete style="width: 1em; height: 1em;color: red;margin-left: 8px"
                      @click.stop="() => showDeleteLayoutDialog(data)"></Delete>
            </span>
          </span>
          </template>
        </el-tree>
        <!--
        <div style="width: 100%">
          <ul style="padding-inline-start:10px;padding-top: 5px;padding-right: 5px">
            <li v-for="(item,i) in pageBlockLayouts"
                style="cursor:pointer;display:inline-block;list-style:none;">
              <div style="text-align: center;" class="showpic" @click="setChoosedLayout(item)" @contextmenu="onLayoutItemContextMenu($event,item)">
                <div>
                  <CreditCard :ref="'setPageBlockLayoutColor-'+item.layout_ref"
                              style="width: 2em; height: 2em;color: rgba(255,255,255,0.6);margin-left: 8px"
                              ></CreditCard>
                </div>
                <div style="color:rgba(255,255,255,0.6);line-height:20px;font-size: 12px">
                  {{ item.layout_name }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        -->


      </el-col>

      <el-col :span="9">

        <div style="width: 100%">
          <ul style="padding-inline-start:10px;padding-top: 5px;padding-right: 5px">
            <li v-for="(item,i) in pageBlockComponents"
                style="cursor:pointer;display:inline-block;list-style:none;">
              <div style="text-align: center;" class="showpic" @click="setChoosedComponent(item)" @contextmenu="onComponentItemContextMenu($event,item)">
                <div>
                  <CreditCard :ref="'setPageBlockComponentColor-'+item.component_ref"
                              style="width: 2em; height: 2em;color: rgba(255,255,255,0.6);margin-left: 8px"
                              ></CreditCard>
                </div>
                <div style="color:rgba(255,255,255,0.6);line-height:30px;font-size: 12px">
                  {{ item.component_name }}
                </div>
              </div>
            </li>

            <li v-for="(item,i) in pageBlocks"
                style="cursor:pointer;display:inline-block;list-style:none;">
              <div style="text-align: center;" class="showpic" @click="setChoosedBlock(item)" @contextmenu="onComponentItemContextMenu($event,item)">
                <div>
                  <CreditCard :ref="'setPageBlockColor-'+item.page_block_ref"
                              style="width: 2em; height: 2em;color: rgba(255,255,255,0.6);margin-left: 8px"
                  ></CreditCard>
                </div>
                <div style="color:rgba(255,255,255,0.6);line-height:30px;font-size: 12px">
                  {{ item.name }}
                </div>
              </div>
            </li>

          </ul>
        </div>
      </el-col>

    </el-row>


    <el-dialog
        :title="treeDialogTitle"
        v-model="treeDialogVisible"
        :close-on-click-modal="false"
        ref="upholdDialogRef"
        width="30%"
        :show-close="false"
        :before-close="treeDialogHandleClose">

      <el-form :model="pageBlockTreeForm" label-width="60px" ref="pageBlockTreeFormRef">

        <el-form-item prop="name" label="名称">
          <el-input v-model="pageBlockTreeForm.name"/>
        </el-form-item>

        <el-form-item prop="unit" label="单位">
          <el-select :teleported="false" v-model="pageBlockTreeForm.unit">
            <el-option v-for="(option, index) in unitOptions" :label="option.label" :value="option.value"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="height" label="高度">
          <el-input v-model="pageBlockTreeForm.height"/>
        </el-form-item>

        <el-form-item prop="height" label="宽度">
          <el-input v-model="pageBlockTreeForm.width"/>
        </el-form-item>

      </el-form>


      <template #footer>
        <el-button @click="treeHandleCancle">取 消</el-button>
        <el-button v-if="treeEditFlag==0" type="primary" @click="addTreeDicData">确 定</el-button>
        <el-button v-if="treeEditFlag==1" type="primary" @click="editTreeDicData">确 定</el-button>
      </template>

    </el-dialog>


    <el-dialog
        title="确认框"
        v-model="deleteTreeNodeDialogVisible"
        :close-on-click-modal="false"
        width="30%">
      将要删除页面块<span style="color:red;font-weight: bold">({{ treeOpData.label }})</span>与其所属的所有页面组件？
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteTreeNodeCancle">取 消</el-button>
        <el-button type="primary" @click="deleteTreeNode">确 定</el-button>
      </span>
      </template>
    </el-dialog>

    <el-dialog
        title="确认框"
        v-model="deleteLayoutNodeDialogVisible"
        :close-on-click-modal="false"
        width="30%">
      将要删除布局<span style="color:red;font-weight: bold">({{ layoutTreeOpData.label }})</span>与其所属的所有布局组件？
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="pageLayoutsTreeNodeRemoveCancle">取 消</el-button>
        <el-button type="primary" @click="pageLayoutsTreeNodeRemove">确 定</el-button>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>


import {commonExcuteRequest, commonSelectRequest} from "../../../../common/js/request";
import axios from "axios";
import {getListData} from "../../../../common/js/tree";
import {getCurrentInstance} from "vue";



export default {
  props: {},
  data() {
    return {
      currentNodeKey:null,
      currentLayoutKey:null,
      currentLayoutNode:null,
      defaultProps: {
        "children": 'children',
        "label": 'label'
      },

      pageBlockTreeData: [],
      pageBlockLayouts: [],
      pageLayoutsTreeData:[],
      pageBlockComponents:[],
      pageBlocks:[],
      pageBlocksArr:[],//数据库返回来的数据组

      treeCurrentKey: "",
      pageBlockTreeForm: {},
      treeDialogVisible: false,
      treeDialogTitle: "",
      treeEditFlag: 0,
      treeOpData: {},

      deleteTreeNodeDialogVisible:false,
      deleteLayoutNodeDialogVisible:false,

      indexFlag:0,


      unitOptions: [{
        "label": "px",
        "value": "px"
      }, {
        "label": "per",
        "value": "per"
      }],
      showExpandedArray:[],

    }
  },

  created() {

  },
  watch: {},
  components: {},
  methods: {

    pageLayoutsTreeNodeRemoveCancle(){
      this.deleteLayoutNodeDialogVisible=false;
    },
    showDeleteLayoutDialog(data){
      this.layoutTreeOpData=data;
      console.log("pageLayoutsTreeNodeRemoveCancle--this.layoutTreeOpData111",this.layoutTreeOpData);
      this.deleteLayoutNodeDialogVisible=true;
    },
    forOtherPageLayoutsTreeNodeRemove(layoutRef){
      //设置当前树节点
      this.layoutTreeOpData={};
      this.layoutTreeOpData.id=layoutRef;
      this.pageLayoutsTreeNodeRemove();
    },
    pageLayoutsTreeNodeRemove(){
      console.log("pageLayoutsTreeNodeRemoveCancle--this.layoutTreeOpData",this.layoutTreeOpData);
      console.log("pageLayoutsTreeNodeRemove--this.pageBlockLayouts",this.pageBlockLayouts);
      for(let i=0;i<this.pageBlockLayouts.length;i++){
        if(this.pageBlockLayouts[i].layout_ref==this.layoutTreeOpData.id){
          window.cbcPageInstance.ctx.deletePageLayoutItem(this.pageBlockLayouts[i]);
          this.$refs.layoutTreeRef.remove(this.layoutTreeOpData);
          this.pageBlockLayouts.splice(i, 1);
          i = i - 1;
          this.deleteLayoutNodeDialogVisible=false;
        }
      }
    },
    pageLayoutsTreeNodeClick(data, node) {
      console.log("pageLayoutsTreeNodeClick--data", data);
      for(let i=0;i<this.pageBlockLayouts.length;i++){
        if(this.pageBlockLayouts[i].layout_ref==data.id){
          this.setChoosedLayout(this.pageBlockLayouts[i]);
        }
      }
    },
    onLayoutItemContextMenu(e, item) {
      let the = this;
      e.preventDefault();
      this.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: "删除布局组件",
            onClick: () => {
              console.log("删除布局组件：", item);
              window.cbcPageInstance.ctx.deletePageLayoutItem(item);
            }
          },
        ]
      });
    },

    onComponentItemContextMenu(e, item) {
      let the = this;
      e.preventDefault();
      this.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: "蓝图定位",
            onClick: () => {
              this.toBlueScriptPosition(item);
            }
          },
          {
            label: "删除",
            onClick: () => {
              if(typeof (item.component_ref)=="undefined"){
                this.deletePageBlockItem(item);
              }else{
                window.cbcPageInstance.ctx.deletePageComponentItem(item);
              }

            }
          },

        ]
      });
    },

    toBlueScriptPosition(item){
      console.log("定位蓝图位置",item);
      window.cbcPageInstance.data.designTab="second";
      window.cbcPageInstance.data.componentTab="second";
      window.cbcPageInstance.data.componentToBlueScriptPositionObj=item;
    },

    deletePageBlockItem(item){
      console.log("deletePageBlockItem--item",item);
      let pageLayoutsTemp=window.cbcPageInstance.data.pageLayouts;
      //更新layout中的blocks_components值
      for(let i=0;i<pageLayoutsTemp.length;i++){
        if(pageLayoutsTemp[i].layout_ref==item.layout_ref){
          console.log("deletePageBlockItem--pageLayoutsTemp[i]",pageLayoutsTemp[i]);
          for(let j=0;j<pageLayoutsTemp[i].layout_config.blocks_components.length;j++){
            if(pageLayoutsTemp[i].layout_config.blocks_components[j].type=="block" && pageLayoutsTemp[i].layout_config.blocks_components[j].ref==item.page_block_ref){
              let obj={};
              obj.span=pageLayoutsTemp[i].layout_config.blocks_components[j].span;
              obj.margin={top: 0, bottom: 0, left: 0, right: 0};
              obj.padding={top: 0, bottom: 0, left: 0, right: 0};
              pageLayoutsTemp[i].layout_config.blocks_components[j]=obj;
            }
          }
        }
      }

      for(let i=0;i<this.pageBlocks.length;i++){
        if(this.pageBlocks[i].page_block_ref==item.page_block_ref){
          this.pageBlocks.splice(i, 1);
          i = i - 1;
        }
      }
    },


    addTreeDicData() {
      console.log("this.treeOpData",this.treeOpData);
      console.log("pageBlockTreeForm",this.pageBlockTreeForm);

      let param = {};
      param.sql = "page_block_tree.insertPageBlock";
      param.name=this.pageBlockTreeForm.name;
      param.pid=this.treeOpData.id;
      param.page_id=this.$route.query.page_id;
      let obj={};
      obj.attr={};
      console.log("addTreeDicData--window.cbcPageInstance.data.topPageBlock",window.cbcPageInstance.data.topPageBlock);
      if(this.pageBlockTreeForm.unit=="px"){
        obj.attr.height=parseInt(this.pageBlockTreeForm.height);
        obj.attr.width=parseInt(this.pageBlockTreeForm.width);
        obj.attr.unit=this.pageBlockTreeForm.unit;
      }else{
        obj.attr.height=parseInt(this.pageBlockTreeForm.height)*window.cbcPageInstance.data.topPageBlock.page_block_config.attr.height/100;
        obj.attr.width=parseInt(this.pageBlockTreeForm.width)*window.cbcPageInstance.data.topPageBlock.page_block_config.attr.width/100;
        obj.attr.unit="px";
      }


      param.page_block_config_str=JSON.stringify(obj);
      //param.page_block_blue_script_config_str='{"attr":{"x":0,"y":0,"width":2000,"height":1200}}';
      param.page_block_blue_script_config_str='';
      param.page_block_ref='blockRef-'+window.cbcuuid();
      console.log("param",param);
      commonExcuteRequest(window.axios, param, this.addTreeDicDataCallBack);
    },
    addTreeDicDataCallBack(result) {
      this.pageBlockLayouts=[];
      if (result.state == "success") {
        this.$message.success('新增成功！');
        this.pageBlockTreeForm={};
        this.treeDialogVisible = false;
        this.findPageBlockTree();
        //this.pageBlockTreeNodeClick(window.cbcPageInstance.data.topPageBlock,null);

      }
    },
    editTreeDicData() {

    },
    treeHandleCancle() {
      this.treeDialogVisible = false;
    },
    treeAppend(data) {
      //this.treeCurrentKey = "";
      this.pageBlockTreeForm = {unit:'px'};
      this.treeDialogVisible = true;
      this.treeDialogTitle = "新增页面块";
      this.treeEditFlag = 0;
      this.treeOpData = data;
    },
    treeEdit(data) {
      console.log("data-edit",data);
      return;
      //this.treeCurrentKey = "";
      this.treeNodeName = data.label;
      this.treeDialogVisible = true;
      this.treeDialogTitle = "修改树节点";
      this.treeEditFlag = 1;
      this.treeOpData = data;

    },
    treeRemove(data) {
      //this.treeCurrentKey = "";
      this.deleteTreeNodeDialogVisible = true;
      this.treeOpData = data;
    },
    deleteTreeNodeCancle() {
      this.deleteTreeNodeDialogVisible = false;
    },
    deleteTreeNode() {
      console.log("this.treeOpData：",this.treeOpData);
      //表单验证后执行
      var param = {};
      param.page_block_ref = this.treeOpData.page_block_ref;
      param.sql = "page_block_tree.delete";
      commonExcuteRequest(window.axios, param, this.deleteTreeNodeCallBack);
    },
    deleteTreeNodeCallBack(result){
      if (result.state == "success") {
        this.$message.success('删除成功！');
        this.deleteTreeNodeDialogVisible = false;
        //console.log("deleteTreeNode--window.cbcPageInstance.data.pageLayouts",window.cbcPageInstance.data.pageLayouts);
        //console.log("deleteTreeNode--this.treeOpData.page_block_ref",this.treeOpData.page_block_ref);
        for(let i=0;i<window.cbcPageInstance.data.pageComponents.length;i++){
          if(window.cbcPageInstance.data.pageComponents[i].page_block_ref==this.treeOpData.page_block_ref){
            window.cbcPageInstance.data.pageComponents.splice(i,1);
            i=i-1;
          }
        }

        for(let i=0;i<window.cbcPageInstance.data.pageLayouts.length;i++){
          if(window.cbcPageInstance.data.pageLayouts[i].page_block_ref==this.treeOpData.page_block_ref){
            window.cbcPageInstance.data.pageLayouts.splice(i,1);
            i=i-1;
          }
        }
        this.pageBlockLayouts=[];
        this.findPageBlockTree();
        //this.pageBlockTreeNodeClick(window.cbcPageInstance.data.topPageBlock,null);
      }
    },
    treeDialogHandleClose() {

    },

    setChoosedLayoutByRef(layout_ref){
      //颜色控制
      for(let i=0;i<this.pageBlockLayouts.length;i++){
        if(this.pageBlockLayouts[i].layout_ref==layout_ref){
          this.setChoosedLayout(this.pageBlockLayouts[i]);
        }
      }

    },

    cancelChoosedByPageLayout(){
      //取消颜色控制
      /**
      for (let key in this.$refs) {
        if (key.indexOf("setPageBlockLayoutColor-") >= 0) {
          if(this.$refs[key]!=null && this.$refs[key].length>0){
            this.$refs[key][0].$el.style.color = "rgba(255,255,255,0.6)";
          }
        }
      }
       */
      //列表不显示组件
      this.pageBlockComponents=[];
    },


    setChoosedLayout(item) {
      console.log("setChoosedLayout--item",item);

      //取消之前有颜色背景
      /**
      for (let key in this.$refs) {
        if (key.indexOf("setPageBlockComponentColor-") >= 0) {
          if (this.$refs[key] != null && this.$refs[key].length > 0) {
            this.$refs[key][0].$el.style.color = "rgba(255,255,255,0.6)";
          }
        }
        if (key.indexOf("setPageBlockColor-") >= 0) {
          if (this.$refs[key] != null && this.$refs[key].length > 0) {
            this.$refs[key][0].$el.style.color = "rgba(255,255,255,0.6)";
          }
        }
      }*/

      this.pageBlockComponents=[];
      this.pageBlocks=[];
      for(let i=0;i<item.layout_config.blocks_components.length;i++){
        if(item.layout_config.blocks_components[i].type=="frontEndComponent" || item.layout_config.blocks_components[i].type=="buildInComponent" ){

          for(let j=0;j<window.cbcPageInstance.data.pageComponents.length;j++){
            if(window.cbcPageInstance.data.pageComponents[j].component_ref==item.layout_config.blocks_components[i].ref){
              this.pageBlockComponents.push(window.cbcPageInstance.data.pageComponents[j]);
            }
          }
        }

        if(item.layout_config.blocks_components[i].type=="block"){

          for(let j=0;j<this.pageBlocksArr.length;j++){
            if(this.pageBlocksArr[j].page_block_ref==item.layout_config.blocks_components[i].ref){
              this.pageBlocksArr[j].layout_ref=item.layout_ref;
              this.pageBlocks.push(this.pageBlocksArr[j]);
            }
          }
        }

      }
      console.log("setChoosedLayout--this.pageBlocks", this.pageBlocks);
      console.log("setChoosedLayout--this.pageBlockComponents",this.pageBlockComponents);




      window.cbcViewDraggleResizableInstance.ctx.setActivatedByRef(item.layout_ref);
      window.cbcPageInstance.data.currentPageBlockLayout=item;

      this.$nextTick(()=>{
        window.cbcPageInstance.data.SettingsTab="PageBlockLayoutSetting";
      });


      //颜色控制
      /**
      for (let key in this.$refs) {
        if (key.indexOf("setPageBlockLayoutColor-") >= 0) {
          if (key == "setPageBlockLayoutColor-" + item.layout_ref) {
            this.$refs[key][0].$el.style.color = "blueviolet";
            window.cbcViewDraggleResizableInstance.ctx.setActivatedByRef(item.layout_ref);
            window.cbcPageInstance.data.currentPageBlockLayout=item;

            this.$nextTick(()=>{
              window.cbcPageInstance.data.SettingsTab="PageBlockLayoutSetting";
            });


          } else {
            if(this.$refs[key]!=null && this.$refs[key].length>0){
              this.$refs[key][0].$el.style.color = "rgba(255,255,255,0.6)";
            }

          }
        }
      }*/
    },
    setChoosedBlock(item){
      for (let key in this.$refs) {
        if (key.indexOf("setPageBlockColor-") >= 0) {
          if (key == "setPageBlockColor-" + item.page_block_ref) {
            this.$refs[key][0].$el.style.color = "blueviolet";
            window.cbcPageInstance.data.currentPageBlock=item;
            this.$nextTick(()=>{
              window.cbcPageInstance.data.SettingsTab="PageBlockSettings";
            });
          } else {
            if(this.$refs[key]!=null && this.$refs[key].length>0){
              this.$refs[key][0].$el.style.color = "rgba(255,255,255,0.6)";
            }
          }
        }
      }

    },

    setChoosedComponent(item) {

      for (let key in this.$refs) {
        if (key.indexOf("setPageBlockComponentColor-") >= 0) {
          if (key == "setPageBlockComponentColor-" + item.component_ref) {
            this.$refs[key][0].$el.style.color = "blueviolet";

            window.cbcPageInstance.data.currentPageBlockComponent=item;
            this.$nextTick(()=>{
              window.cbcPageInstance.data.SettingsTab="PageBlockComponentSetting";
            });

          } else {
            if(this.$refs[key]!=null && this.$refs[key].length>0){
              this.$refs[key][0].$el.style.color = "rgba(255,255,255,0.6)";
            }
          }
        }
      }


    },
    pageBlockTreeNodeClick(data, node) {
      console.log("pageBlockTreeNodeClick--data",data);
      //置空
      this.pageBlockLayouts=[];
      if(data.pid==null || data.pid==''){
        window.cbcPageInstance.data.SettingsTab="PageSettings";
      }else{
        window.cbcPageInstance.data.SettingsTab="PageBlockSettings";
      }


      window.cbcViewSketchRulerInstance.data.showFlag=false;
      window.cbcViewSketchRulerInstance.ctx.showViewDraggableResizable(data);
      window.cbcPageInstance.data.currentPageBlock=data;

      //window.cbcPageInstance.data.designTab="first";
      window.cbcViewDraggleResizableInstance=null
      this.setPageBlockLayout(data.page_block_ref);
      this.pageBlockComponents=[];
      this.pageBlocks=[];


    },

    addPageBlockLayout(pageBlockLayout){
      this.pageBlockLayouts.push(pageBlockLayout);
      this.refreshLayourTree();
    },
    refreshLayourTree(){
      //拼接布局树结构
      let layoutsDataTemp=[];
      for(let i=0;i<this.pageBlockLayouts.length;i++){
        let layoutObj={};
        layoutObj.id=this.pageBlockLayouts[i].layout_ref;
        layoutObj.label=this.pageBlockLayouts[i].layout_name;
        layoutObj.name=this.pageBlockLayouts[i].layout_name;
        layoutObj.page_block_ref=this.pageBlockLayouts[i].page_block_ref;
        layoutObj.pid=this.getLayoutPid(this.pageBlockLayouts,layoutObj.id);
        layoutsDataTemp.push(layoutObj);
      }
      console.log("refreshLayourTree-layoutsDataTemp",layoutsDataTemp);
      this.pageLayoutsTreeData=getListData(layoutsDataTemp, ['page_block_ref']);
      console.log("refreshLayourTree--this.pageLayoutsTreeData",this.pageLayoutsTreeData);
    },

    setPageBlockLayout(pageBlockRef){
      this.indexFlag=this.indexFlag+1;
      console.log("setPageBlockLayout--pageBlockRef",pageBlockRef);
      if(typeof (window.cbcViewDraggleResizableInstance)=="undefined" || window.cbcViewDraggleResizableInstance==null || window.cbcPageInstance.data.findAllPageBlockLayoutFlag==false){
        //console.log(window.cbcViewDraggleResizableInstance);
        console.log("21",window.cbcPageInstance.data.findAllPageBlockLayoutFlag);
        if(this.indexFlag<100){
          setTimeout(this.setPageBlockLayout, 100, pageBlockRef);
        }
      }else{
        console.log("setPageBlockLayout--pageBlockRef",pageBlockRef);
        window.cbcViewDraggleResizableInstance.data.currentPageBlockLayouts=[];
        console.log("window.cbcPageInstance.data.pageLayouts222",window.cbcPageInstance.data.pageLayouts);

        for(let i=0;i<window.cbcPageInstance.data.pageLayouts.length;i++){
          let pageLayoutsTemp=window.cbcPageInstance.data.pageLayouts[i];
          //console.log("setPageBlockLayout--pageLayoutsTemp",pageLayoutsTemp);

          if(pageLayoutsTemp.page_block_ref==pageBlockRef){
            console.log("pageLayoutsTemp1111",pageLayoutsTemp);
            if(typeof (pageLayoutsTemp.layout_config.childFlag)!="undefined" && pageLayoutsTemp.layout_config.childFlag==true){
              this.pageBlockLayouts.push(pageLayoutsTemp);
            }else{
              this.pageBlockLayouts.push(pageLayoutsTemp);
              pageLayoutsTemp.isActived=false;
              window.cbcViewDraggleResizableInstance.data.currentPageBlockLayouts.push(pageLayoutsTemp);
            }
          }
        }
        console.log("setPageBlockLayout--currentPageBlockLayouts",window.cbcViewDraggleResizableInstance.data.currentPageBlockLayouts);
        //刷新树结构数据
        this.refreshLayourTree();
      }
    },
    getLayoutPid(pageLayouts,layoutRef){
      let returnPid=null;
      for(let i=0;i<pageLayouts.length;i++){
        let blocks_componentsTemp=pageLayouts[i].layout_config.blocks_components;
        for(let j=0;j<blocks_componentsTemp.length;j++){
          if(blocks_componentsTemp[j].ref==layoutRef){
            returnPid=pageLayouts[i].layout_ref;
          }
        }
      }
      return returnPid;
    },

    findPageBlockTree() {
      let param = {};
      param.sql = "page_block_tree.find";
      param.page_id = this.$route.query.page_id;
      commonSelectRequest(axios, param, this.findPageBlockTreeCallBack);
    },
    findPageBlockTreeCallBack(result) {
      console.log("findPageBlockTree--result",result);
      for(var i=0;i<result.objects.length;i++){
        if(result.objects[i].page_block_config_str!=null && result.objects[i].page_block_config_str!=""){
          result.objects[i].page_block_config=eval("(" + result.objects[i].page_block_config_str + ")");
          //为页面块添加background参数
          if(typeof (result.objects[i].page_block_config.attr.background)=="undefined"){
            result.objects[i].page_block_config.attr.background={};
            result.objects[i].page_block_config.attr.background.type="img";
            result.objects[i].page_block_config.attr.background.value="";
          }
        }else{
          result.objects[i].page_block_config={};
        }



        if(result.objects[i].page_block_blue_script_config_str!=null && result.objects[i].page_block_blue_script_config_str!=""){
          result.objects[i].page_block_blue_script_config=eval("(" + result.objects[i].page_block_blue_script_config_str + ")")
        }else{
          result.objects[i].page_block_blue_script_config={};
        }

        if(result.objects[i].pid==null || result.objects[i].pid==''){
          this.currentNodeKey=result.objects[i].id;
          this.showExpandedArray.push(result.objects[i].id);
          result.objects[i].label=result.objects[i].name;
          //window.cbcPageInstance.data.SettingsTab="PageSettings";
          //window.cbcViewSketchRulerInstance.data.showFlag=false;
          //window.cbcViewSketchRulerInstance.ctx.showViewDraggableResizable(result.objects[i]);
          //window.cbcPageInstance.data.currentPageBlock=result.objects[i];
          window.cbcPageInstance.data.topPageBlock=result.objects[i];
          //this.setPageBlockLayout(result.objects[i].page_block_ref);
          console.log("findTopPageBlock",result.objects[i]);
          this.pageBlockTreeNodeClick(result.objects[i],null);
          //加载布局树
          //this.pageLayoutsTreeData=window.cbcPageInstance.data.pageLayoutsTreeData;
          //console.log("this.pageLayoutsTreeData11",this.pageLayoutsTreeData);

        }

      }
      this.pageBlocksArr=result.objects;
      console.log("findPageBlockTreeCallBack--this.pageBlocksArr", this.pageBlocksArr);
      this.pageBlockTreeData = getListData(result.objects, ["page_block_ref","page_id", "page_img", "page_block_config_str", "page_block_config","page_block_blue_script_config_str","page_block_blue_script_config"]);
      console.log("findPageBlockTreeCallBack--this.pageBlockTreeData", this.pageBlockTreeData);
    }

  },
  mounted() {
    this.findPageBlockTree();
    window.cbcBlockTreeInstance = getCurrentInstance();




  }
}
</script>

<style scoped>
.showpic {

}

.showpic:hover {
  transform: scale(1.15);
  cursor: pointer;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
</style>
