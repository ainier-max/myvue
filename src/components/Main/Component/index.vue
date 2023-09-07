<!--照片字段后续如果使用不到，可进行删除-->
<template>
  <div style="height: 80%;margin: 20px">
    <div class="titleClass">前端组件</div>

    <el-row style="margin:40px 50px;">
      <el-col :span="14">
        <el-divider content-position="left"><span style="font-size: 18px">组件信息</span>
        </el-divider>
        <div style="color:red;padding-bottom: 10px">
          <el-button @click="showAddComponentInfoWin" type="success">新增
          </el-button>
          <!--
          <span style="padding-left: 10px">注：点击</span>
          <el-icon size="20" color="cornflowerblue">
            <Upload/>
          </el-icon>
          <span>可将组件放置右边的组件树中</span>
          -->
        </div>
        <el-table
            :data="componentData"
            style="width: 100%;height: 50%">
          <el-table-column
              prop="component_name"
              label="组件名称"
              width="250">
          </el-table-column>

          <el-table-column
              prop="component_type"
              label="组件类型">
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="200">
            <template #default="scope">

              <el-icon size="20" color="cornflowerblue" style="cursor:pointer;">
                <Upload @click="componentDeploy(scope.row)"/>
              </el-icon>

              <el-icon size="20" color="cornflowerblue" style="cursor:pointer;padding-left: 10px">
                <Edit @click="toEditCode(scope.row)"/>
              </el-icon>

              <el-icon size="20" color="cornflowerblue" style="cursor:pointer;padding-left: 10px">
                <Compass @click="showEditComponentInfoWin(scope.row)"/>
              </el-icon>

              <el-icon size="20" color="cornflowerblue" style="cursor:pointer;padding-left: 10px">
                <EditPen @click="toEditBlueScriptCode(scope.row)"/>
              </el-icon>

              <el-icon size="20" color="red" style="cursor:pointer;padding-left: 10px">
                <Delete @click="showDeleteComponentInfoWin(scope.row)"/>
              </el-icon>


            </template>
          </el-table-column>
        </el-table>

      </el-col>
      <el-col :span="10">
        <el-divider content-position="left" style="margin-left:50px"><span style="font-size: 18px">组件树</span>
        </el-divider>
        <!--:default-expanded-keys="[1]"-->
        <el-tree ref="componentInfoTreeRef" :data="componentInfoTreeData" node-key="id" :default-expand-all="false"
                 :expand-on-click-node="false" :props="defaultProps" :highlight-current="true" :default-expanded-keys="[1]"
                 style="margin-left:50px;height:450px;overflow-y:auto;">

          <template #default="{ node, data }">

          <span class="custom-tree-node">
            <span v-if="data.component_type==null">
              <Folder style="width: 1em; height: 1em; "/>
              {{ node.label }}
            </span>
            <span v-if="data.component_type!=null">
              {{ node.label }}
            </span>
            <span>
              <Plus v-if="(data.component_type==null || data.component_type=='')"
                    style="width: 1em; height: 1em;color: blueviolet;margin-left: 8px"
                    @click="() => treeAppend(data)"></Plus>

              <Edit v-if="(data.component_type==null || data.component_type=='') && data.id!=1"
                    style="width: 1em; height: 1em;color: blueviolet;margin-left: 8px"
                    @click="() => treeEdit(data)"></Edit>

              <Delete v-if="data.id!=1" style="width: 1em; height: 1em;color: red;margin-left: 8px"
                      @click="() => treeRemove(data)"></Delete>

            </span>
          </span>
          </template>

        </el-tree>
      </el-col>
    </el-row>




    <el-dialog
        :title="ComponentInfoDialogTitle"
        v-model="ComponentInfoDialogVisible"
        :close-on-click-modal="false"
        ref="ComponentInfoDialogRef"
        width="30%">
      <el-form :model="ComponentInfoDataForm" :rules="ComponentInfoRules" ref="ComponentInfoDataFormRef"
               label-width="100px">
        <el-form-item label="组件名称" prop="component_name">
          <el-input v-model="ComponentInfoDataForm.component_name" placeholder="组件名称"></el-input>
        </el-form-item>
        <el-form-item  label="组件类型" prop="component_type">
          <el-input v-model="ComponentInfoDataForm.component_type" placeholder="组件类型"></el-input>
        </el-form-item>
        <el-form-item label="组件照片" prop="component_photo">
          <div class="filediv" ref="fileRef" >
            <input type="file" @change="choosePhoto" accept="image/*">
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button v-if="upholdFlag=='add'" type="primary" @click="addComponentInfo">添 加</el-button>
        <el-button v-if="upholdFlag=='edit'" type="primary" @click="editComponentInfo">修 改</el-button>
      </span>
      </template>

    </el-dialog>


    <el-dialog
        title="确认框"
        v-model="deleteComponentInfoDialogVisible"
        :close-on-click-modal="false"
        width="30%">
      将要删除<span style="color:red;font-weight: bold">({{ currentComponentInfo.component_name }})</span>
      <br>该操作也会把组件树中的对应组件删除，数据不可恢复，请小心操作。
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteComponentInfoCancle">取 消</el-button>
        <el-button type="primary" @click="deleteComponentInfo">确 定</el-button>
      </span>
      </template>
    </el-dialog>


    <el-dialog
        :title="treeDialogTitle"
        v-model="treeDialogVisible"
        :close-on-click-modal="false"
        ref="upholdDialogRef"
        width="30%"
        :before-close="treeDialogHandleClose">
      <el-input v-model="treeNodeName" placeholder="树节点标签"></el-input>
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
      将要删除<span style="color:red;font-weight: bold">({{ treeOpData.label }})</span>与其所属的所有选项？
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteTreeNodeCancle">取 消</el-button>
        <el-button type="primary" @click="deleteTreeNode">确 定</el-button>
      </span>
      </template>
    </el-dialog>


  </div>
</template>

<script>
import {commonSelectRequest, commonSelectRequestAndOtherParam, commonExcuteRequest} from "../../../common/js/request.js"
import {getListData} from "../../../common/js/tree.js"
import axios from "axios";

export default {
  data() {
    return {
      componentData: [],
      ComponentInfoDialogTitle: '新增组件',
      ComponentInfoDialogVisible: false,
      ComponentInfoDataForm: {component_name: '', component_type:'',component_type: '',component_photo:'',component_user:''},
      ComponentInfoRules: {
        component_name: [
          {required: true, message: '组件名称不能为空', trigger: 'blur'}
        ],
        component_type: [
          {required: true, message: '组件ID不能为空', trigger: 'blur'}
        ],
      },
      upholdFlag: 'add',
      currentComponentInfo: {
        component_name: '',
        component_type: ''
      },
      deleteComponentInfoDialogVisible: false,

      componentInfoTreeData: [],
      defaultProps: {
        "children": 'children',
        "label": 'label'
      },
      defaultComponent:null,


      treeNodeName: '',
      treeDialogVisible: false,
      treeDialogTitle: '',
      treeEditFlag: 0,
      treeOpData: {},
      deleteTreeNodeDialogVisible: false,
      deleteIDS: [],
      treeCurrentKey: '',


    };
  },
  watch: {},
  mounted: function () {
    this.ComponentInfoDataForm.component_user= window.localStorage.getItem('loginUserid');
    this.findComponentInfo();
    this.findPageComponentTree();

    this.findDefaultComponent();
  },

  methods: {
    deleteTreeNodeCancle(){
      this.deleteTreeNodeDialogVisible = false;
    },
    deleteTreeNode(){
      this.getDeleteIDS(this.treeOpData);
      //表单验证后执行
      var param = {};
      param.ids = this.deleteIDS;
      param.sql = "page_component_tree.delete";
      commonExcuteRequest(window.axios, param, this.deleteTreeNodeCallBack);
    },
    deleteTreeNodeCallBack(result) {
      if (result.state == "success") {
        this.$message.success('删除成功！');
        this.deleteTreeNodeDialogVisible = false;
        this.findPageComponentTree();
      }
    },
    //遍历获取ids
    getDeleteIDS(data) {
      this.deleteIDS.push(data.id);
      if (data.children.length != 0) {
        for (let i = 0; i < data.children.length; i++) {
          this.getDeleteIDS(data.children[i]);
        }
      }
    },

    editTreeDicData(){
      let param = {};
      param.name = this.treeNodeName;
      param.id = this.treeOpData.id;
      param.sql = "page_component_tree.update";
      commonExcuteRequest(window.axios, param, this.editTreeDicDataCallBack);
    },
    editTreeDicDataCallBack(result) {
      if (result.state == "success") {
        this.$message.success('修改成功！');
        this.treeNodeName = "";
        this.treeDialogVisible = false;
        this.findPageComponentTree();
      }
    },
    addTreeDicData(){
      console.log("this.treeOpData11", this.treeOpData);
      let param = {};
      param.name = this.treeNodeName;
      param.pid = this.treeOpData.id;
      param.component_type = this.treeOpData.component_type;
      param.sql = "page_component_tree.insert";
      commonExcuteRequest(window.axios, param, this.addTreeDicDataCallBack);
    },
    addTreeDicDataCallBack(result) {
      if (result.state == "success") {
        this.$message.success('新增成功！');
        this.treeNodeName = "";
        this.treeDialogVisible = false;
        this.findPageComponentTree();
      }
    },
    treeDialogHandleClose(){

    },
    treeHandleCancle(){
      this.treeDialogVisible = false;
    },

    treeAppend(data){
      this.treeCurrentKey = "";
      this.treeNodeName = "";
      this.treeDialogVisible = true;
      this.treeDialogTitle = "新增树节点";
      this.treeEditFlag = 0;
      this.treeOpData = data;
    },
    treeEdit(data){
      this.treeCurrentKey = "";
      //console.log("data",data);
      this.treeNodeName = data.label;
      this.treeDialogVisible = true;
      this.treeDialogTitle = "修改树节点";
      this.treeEditFlag = 1;
      this.treeOpData = data;
    },
    treeRemove(data){
      this.treeCurrentKey = "";
      console.log("data", data);
      this.deleteIDS = [];
      this.deleteTreeNodeDialogVisible = true;
      this.treeOpData = data;
    },



    /**
     * 寻找默认组件供创建组件时使用
     */
    findDefaultComponent(){
      let param = {};
      param.sql = "page_component.find";
      param.component_type="echart-one-bar";
      commonSelectRequest(axios, param, this.findDefaultComponentCallBack);
    },
    findDefaultComponentCallBack(result){
      //console.log("findDefaultComponent--result",result);
      if(result.state=="success" && result.objects.length>0){
        this.defaultComponent=result.objects[0];
      }
      //console.log("findDefaultComponent--defaultComponent",this.defaultComponent);
    },

    toEditBlueScriptCode(row){
      this.$router.push({ name: 'BlueScriptName', query: { blue_script_type:row.component_type,type:"component" }})
    },
    //查找组件树
    findPageComponentTree() {
      var param = {};
      param.sql = "page_component_tree.find";
      commonSelectRequest(axios, param, this.findPageComponentTreeCallBack);
    },
    findPageComponentTreeCallBack(result) {

      this.componentInfoTreeData = getListData(result.objects,["component_type"]);
      console.log("this.componentInfoTreeData11", this.componentInfoTreeData);
      let the=this;
      this.$nextTick(() => {
        if (this.treeCurrentKey != "") {
          the.$refs.componentInfoTreeRef.setCurrentKey(this.treeCurrentKey);
        }
      });
    },
    addComponentInfo() {
      this.$refs.ComponentInfoDataFormRef.validate((valid) => {
        console.log("valid1112",valid);
        if (valid) {
          //表单验证后执行
          let param = {};
          param.sql = "page_component.add";
          param.component_type = this.ComponentInfoDataForm.component_type;
          param.component_name = this.ComponentInfoDataForm.component_name;
          param.type = "frontEndComponent";
          param.component_photo = this.ComponentInfoDataForm.component_photo;
          param.component_user = this.ComponentInfoDataForm.component_user;

          param.component_code=this.defaultComponent.component_code;
          param.component_config_str = this.defaultComponent.component_config_str;
          param.component_visualize_str = this.defaultComponent.component_visualize_str;

          param.blue_script_node_config_str = "{\r\n    shape: 'static-in-rect',\r\n    width: 150,\r\n    height: 180,\r\n    attrs: {\r\n        body: {\r\n            fill: 'rgba(40, 44, 52,0.9)',\r\n            stroke: '#d9d9d9',\r\n            strokeWidth: 1,\r\n        },\r\n        label: {\r\n            fill: 'rgba(255,255,255,0.8)', // 文字颜色\r\n            fontSize: 14, // 文字大小\r\n            refX: 0.5,\r\n            refY: 8,\r\n            textAnchor: 'middle',\r\n            textVerticalAnchor: 'top',\r\n        },\r\n    },\r\n}";
          param.blue_script_in_out_config_str = "{\r\n    in: [{\r\n        key: 'event',\r\n        label: 'event',\r\n        value: null,\r\n        type: 'event',\r\n        connected: false,\r\n        show: true\r\n    }],\r\n    out: [{\r\n        key: 'string',\r\n        label: 'value',\r\n        value: \"\",\r\n        type: 'string',\r\n        show: true,\r\n        connected: false,\r\n        connectedTargetArr: []\r\n    }],\r\n}";
          param.blue_script_visualize_config_str = "{\r\n    settings: [\r\n        \"ShowInParam\", \"ShowOutParam\"\r\n    ]\r\n}";
          param.blue_script_logic_config_str = "{\r\n    logicFun: function(paramObj) {\r\n        console.log(\"logicFun--paramObj：\", paramObj);\r\n    }\r\n}";

          commonExcuteRequest(window.axios, param, this.addComponentInfoCallBack);
        } else {
          return false;
        }
      });
    },
    addComponentInfoCallBack(result) {
      if (result.state == "success") {
        this.$message.success('插入成功！');
        this.ComponentInfoDialogVisible = false;
        this.findComponentInfo();
      }
    },
    choosePhoto(photoObj) {
      var the = this;
      console.log("photoObj",photoObj);
      var oFReader = new FileReader();
      var file = photoObj.path[0].files[0];
      oFReader.readAsDataURL(file);
      oFReader.onloadend = function (oFRevent) {
        var src = oFRevent.target.result;
        the.ComponentInfoDataForm.component_photo = src;
        photoObj.path[1].style.background = 'url(' + src + ') no-repeat center center';
        photoObj.path[1].style.backgroundSize = '189px 189px'
      }
      //console.log(file);
    },
    showDeleteComponentInfoWin(row) {
      //console.log("row",row);
      this.currentComponentInfo=row;
      this.deleteComponentInfoDialogVisible=true;
    },
    deleteComponentInfoCancle() {
      this.deleteComponentInfoDialogVisible = false;
    },
    deleteComponentInfo() {
      let param = {};
      param.sql = "page_component.delete";
      param.id = this.currentComponentInfo.id;
      commonExcuteRequest(window.axios, param, this.deleteComponentInfoCallBack);
    },
    deleteComponentInfoCallBack(result){
      if (result.state == "success") {
        this.$message.success('删除成功！');
        this.deleteComponentInfoDialogVisible = false;
        this.findComponentInfo();
      }
    },
    showEditComponentInfoWin(row){
      this.upholdFlag="edit";
      var param = {};
      param.sql = "page_component.findPhoto";
      param.component_type = row.component_type;
      commonSelectRequest(axios, param, this.findPhotoCallBack);
    },
    findPhotoCallBack(result){
      if(result.objects.length>0){
        this.ComponentInfoDataForm=result.objects[0];
        this.ComponentInfoDialogTitle='修改组件';
        this.ComponentInfoDialogVisible=true;
        var the=this;
        this.$nextTick( () => {
          //console.log("this.$refs.fileRef",the.$refs.fileRef);
          the.$refs.fileRef.style.background = 'url(' + this.ComponentInfoDataForm.component_photo + ') no-repeat center center';
          the.$refs.fileRef.style.backgroundSize = '189px 189px'
        })
      }
    },
    editComponentInfo() {
      //表单验证后执行
      let param = {};
      param.sql = "page_component.update";
      param.id = this.ComponentInfoDataForm.id;
      param.component_name = this.ComponentInfoDataForm.component_name;
      param.component_type = this.ComponentInfoDataForm.component_type;
      param.type = this.ComponentInfoDataForm.type;
      param.component_photo = this.ComponentInfoDataForm.component_photo;
      commonExcuteRequest(window.axios, param, this.editComponentInfoCallBack);
    },
    editComponentInfoCallBack(result){
      if (result.state == "success") {
        this.$message.success('修改成功！');
        this.ComponentInfoDialogVisible = false;
        this.findComponentInfo();
      }
    },
    toEditCode(row){
      //this.$router.push('/Main/ComponentUpload')
      //console.log("row:",row);
      this.$router.push({ name: 'ComponentUploadName', query: { component_type:row.component_type }})
    },
    handleCancle() {
      this.ComponentInfoDialogVisible = false;
    },
    showAddComponentInfoWin() {
      //console.log("showAddComponentInfoWin");
      //数据置空
      this.ComponentInfoDataForm.component_type = '';
      this.ComponentInfoDataForm.component_name = '';
      this.ComponentInfoDataForm.component_photo = '';
      this.ComponentInfoDataForm.type = '';
      if(typeof (this.$refs.fileRef)!="undefined"){
        this.$refs.fileRef.style.background = '';
        this.$refs.fileRef.style.backgroundSize = '189px 189px';
      }


      this.upholdFlag="add";
      this.ComponentInfoDialogTitle='新增组件';
      this.ComponentInfoDialogVisible = true;
    },
    findComponentInfo() {
      var param = {};
      param.sql = "page_component.find";
      commonSelectRequest(axios, param, this.findComponentInfoCallBack);
    },
    findComponentInfoCallBack(result) {
      this.componentData = result.objects;
    },
    //组件配置到组件树中
    componentDeploy(row) {
      console.log("componentDeploy--row",row);
      //获取当前选中树菜单
      let node = this.$refs.componentInfoTreeRef.getCurrentNode();
      console.log("node", node);
      if (node == null) {
        this.$message.error('未选中图层树菜单！');
        return;
      }
      this.treeCurrentKey = node.id;
      if (node.component_type != null && node.component_type != '') {
        this.$message.error('图层不能添加到图层！');
        return;
      }
      if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          if (row.component_type == node.children[i].component_type) {
            this.$message.error('同一个目录下不能存在两个相同图层！');
            return;
          }
        }
      }

      let param = {};
      param.name = row.component_name;
      param.pid = node.id;
      param.component_type = row.component_type;
      param.sql = "page_component_tree.insert";
      commonExcuteRequest(window.axios, param, this.componentDeployCallBack);
    },
    componentDeployCallBack(result) {
      if (result.state == "success") {
        this.$message.success('调配成功！');
        this.findPageComponentTree();
      }
    },
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

.filediv {
  width: 189px;
  height: 189px;
  display: inline-block;
  cursor: pointer;
  border: 2px dashed #fff6f7;
}

.filediv input {
  width: 100%;
  height: 100%;
  opacity: 0;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
