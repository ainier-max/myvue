<template>
  <div style="height:calc(100% - 60px);margin: 20px;">
    <div class="titleClass">蓝图工具</div>

    <div style="display: flex;flex-direction: row;height: calc(100% - 220px);padding:20px" >
      <div style="flex-basis:50%">
        <el-divider content-position="left"><span style="font-size: 18px">蓝图工具信息</span>
        </el-divider>
        <div style="color:red;padding-bottom: 10px">
          <el-button @click="showAddBlueScriptInfoWin" type="success">新增
          </el-button>
          <el-input v-model="filterValue" style="padding-left:20px;width:300px" placeholder="蓝图名称或蓝图ID过滤"></el-input>

        </div>
        <el-table
            :data="blueScriptData"
            style="width: 100%;height:100%">
          <el-table-column
              prop="blue_script_name"
              label="蓝图名称"
              width="220">
          </el-table-column>

          <el-table-column
              prop="blue_script_id"
              label="蓝图ID">
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="200">
            <template #default="scope">

              <el-icon size="20" color="cornflowerblue" style="cursor:pointer;">
                <Upload @click="blueScriptDeploy(scope.row)"/>
              </el-icon>

              <el-icon size="20" color="cornflowerblue" style="cursor:pointer;padding-left: 10px">
                <EditPen @click="toEditBlueScriptCode(scope.row)"/>
              </el-icon>

              <el-icon size="20" color="cornflowerblue" style="cursor:pointer;padding-left: 10px">
                <Edit @click="showEditBlueScriptInfoWin(scope.row)"/>
              </el-icon>

              <el-icon size="20" color="red" style="cursor:pointer;padding-left: 10px">
                <Delete @click="showDeleteBlueScriptInfoWin(scope.row)"/>
              </el-icon>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="flex-basis:45%;">
        <el-divider content-position="left" style="margin-left:50px;"><span style="font-size: 18px">蓝图工具树</span>
        </el-divider>

        <el-tree ref="blueScriptInfoTreeRef" :data="blueScriptInfoTreeData" node-key="id" :default-expand-all="false"
                 :expand-on-click-node="false" :props="defaultProps" :highlight-current="true" :default-expanded-keys="[1]"
                 @node-click="handleNodeClick"
                 style="margin-left:50px;height:450px;overflow-y:auto;">
          <template #default="{ node, data }">

          <span class="custom-tree-node">
            <span v-if="data.blue_script_id==null">
              <Folder style="width: 1em; height: 1em; "/>
              {{ node.label }}
            </span>
            <span v-if="data.blue_script_id!=null">
              {{ node.label }}
            </span>
            <span>
              <Plus v-if="data.blue_script_id==null"
                    style="width: 1em; height: 1em;color: blueviolet;margin-left: 8px"
                    @click="() => treeAppend(data)"></Plus>

              <Edit v-if="data.blue_script_id==null && data.id!=1"
                    style="width: 1em; height: 1em;color: blueviolet;margin-left: 8px"
                    @click="() => treeEdit(data)"></Edit>

              <Delete v-if="data.id!=1" style="width: 1em; height: 1em;color: red;margin-left: 8px"
                      @click="() => treeRemove(data)"></Delete>

            </span>
          </span>
          </template>


        </el-tree>
      </div>
    </div>

 

    <el-dialog
        :title="BlueScriptInfoDialogTitle"
        v-model="BlueScriptInfoDialogVisible"
        :close-on-click-modal="false"
        width="30%">
      <el-form :model="BlueScriptInfoDataForm" :rules="BlueScriptInfoRules" ref="BlueScriptInfoDataFormRef"
               label-width="100px">
        <el-form-item label="蓝图名称" prop="blue_script_name">
          <el-input v-model="BlueScriptInfoDataForm.blue_script_name" placeholder="蓝图名称"></el-input>
        </el-form-item>
        <el-form-item label="蓝图类型" prop="blue_script_id">
          <el-input v-model="BlueScriptInfoDataForm.blue_script_id" placeholder="蓝图类型"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button v-if="upholdFlag=='add'" type="primary" @click="addBlueScriptInfo">添 加</el-button>
        <el-button v-if="upholdFlag=='edit'" type="primary" @click="editBlueScriptInfo">修 改</el-button>
      </span>
      </template>

    </el-dialog>


    <el-dialog
        title="确认框"
        v-model="deleteBlueScriptDialogVisible"
        :close-on-click-modal="false"
        width="30%">
      将要删除<span style="color:red;font-weight: bold">({{ currentBlueScriptInfo.blue_script_name }})</span>
      <br>该操作也会把组件树中的对应组件删除，数据不可恢复，请小心操作。
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteBlueScriptInfoCancle">取 消</el-button>
        <el-button type="primary" @click="deleteBlueScriptInfo">确 定</el-button>
      </span>
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


  </div>
</template>

<script>

import {commonExcuteRequest, commonSelectRequest} from "../../../common/js/request.js";
import axios from "axios";
import {getListData} from "../../../common/js/tree.js";

export default {
  data() {
    return {
      upholdFlag: 'add',
      BlueScriptInfoDialogTitle: '新增蓝图工具',
      BlueScriptInfoDialogVisible: false,
      blueScriptData: [],
      originBlueScriptData: [],
      BlueScriptInfoDataForm: {blue_script_name: '', blue_script_id: '', component_user: ''},
      BlueScriptInfoRules: {
        blue_script_name: [
          {required: true, message: '蓝图名称不能为空', trigger: 'blur'}
        ],
        blue_script_id: [
          {required: true, message: '蓝图类型不能为空', trigger: 'blur'}
        ],
      },
      currentBlueScriptInfo: null,
      deleteBlueScriptDialogVisible: false,
      blueScriptInfoTreeData: [],
      defaultProps: {
        "children": 'children',
        "label": 'label'
      },

      treeNodeName: '',
      treeDialogVisible: false,
      treeDialogTitle: '',
      treeEditFlag: 0,
      treeOpData: {},
      deleteTreeNodeDialogVisible: false,
      deleteIDS: [],
      treeCurrentKey: '',

      filterValue:''

    };
  },
  watch: {
    //方法1
    "filterValue"(newVal, oldVal) {
      console.log('filterValue--this.originBlueScriptData', this.originBlueScriptData);
      this.filterByValue(newVal);
    }
  },
  mounted: function () {
    this.findBlueScriptInfo();
    this.findPageBlueScriptTree();
  },
  methods: {
    handleNodeClick(item, data) {
      console.log("handleNodeClick--item",item);
      if (item.blue_script_id!=null && item.blue_script_id!="") {
        this.findByBlueScriptID(item.blue_script_id);
      }
    },
    findByBlueScriptID(id) {
      this.blueScriptData = [];
      for (let i = 0; i < this.originBlueScriptData.length;i++){
        if (this.originBlueScriptData[i].blue_script_id==id) {
          this.blueScriptData.push(this.originBlueScriptData[i]);
        }
      }
    },
    filterByValue(val) {
      this.blueScriptData = [];
      for (let i = 0; i < this.originBlueScriptData.length;i++){
        if (this.originBlueScriptData[i].blue_script_name.indexOf(val)>=0 || this.originBlueScriptData[i].blue_script_id.indexOf(val)>=0) {
          this.blueScriptData.push(this.originBlueScriptData[i]);
        }
      }
    },
    blueScriptDeploy(row) {
      //获取当前选中树菜单
      let node = this.$refs.blueScriptInfoTreeRef.getCurrentNode();
      console.log("node", node);
      if (node == null) {
        this.$message.error('未选中图层树菜单！');
        return;
      }
      this.treeCurrentKey = node.id;
      if (node.blue_script_id != null) {
        this.$message.error('图层不能添加到图层！');
        return;
      }
      if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          if (row.blue_script_id == node.children[i].blue_script_id) {
            this.$message.error('同一个目录下不能存在两个相同图层！');
            return;
          }
        }
      }

      let param = {};
      param.name = row.blue_script_name;
      param.pid = node.id;
      param.blue_script_id = row.blue_script_id;
      param.sql = "page_blue_script_tools_tree.insert";
      commonExcuteRequest(window.axios, param, this.blueScriptDeployCallBack);

    },
    blueScriptDeployCallBack(result) {
      if (result.state == "success") {
        this.$message.success('调配成功！');
        this.findPageBlueScriptTree();
      }
    },

    deleteTreeNodeCancle() {
      this.deleteTreeNodeDialogVisible = false;
    },
    deleteTreeNode() {
      this.getDeleteIDS(this.treeOpData);
      //表单验证后执行
      var param = {};
      param.ids = this.deleteIDS;
      param.sql = "page_blue_script_tools_tree.delete";
      commonExcuteRequest(window.axios, param, this.deleteTreeNodeCallBack);
    },
    deleteTreeNodeCallBack(result) {
      if (result.state == "success") {
        this.$message.success('删除成功！');
        this.deleteTreeNodeDialogVisible = false;
        this.findPageBlueScriptTree();
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
    treeHandleCancle() {
      this.treeDialogVisible = false;
    },
    treeRemove(data) {
      this.treeCurrentKey = "";
      console.log("data", data);
      this.deleteIDS = [];
      this.deleteTreeNodeDialogVisible = true;
      this.treeOpData = data;
    },
    treeEdit(data) {
      this.treeCurrentKey = "";
      //console.log("data",data);
      this.treeNodeName = data.label;
      this.treeDialogVisible = true;
      this.treeDialogTitle = "修改树节点";
      this.treeEditFlag = 1;
      this.treeOpData = data;
    },
    treeAppend(data) {
      //console.log("data",data);
      this.treeCurrentKey = "";
      this.treeNodeName = "";
      this.treeDialogVisible = true;
      this.treeDialogTitle = "新增树节点";
      this.treeEditFlag = 0;
      this.treeOpData = data;
    },
    addTreeDicData() {
      console.log("this.treeOpData11", this.treeOpData);

      let param = {};
      param.name = this.treeNodeName;
      param.pid = this.treeOpData.id;
      param.blue_script_id = this.treeOpData.blue_script_id;
      param.sql = "page_blue_script_tools_tree.insert";
      commonExcuteRequest(window.axios, param, this.addTreeDicDataCallBack);
    },
    addTreeDicDataCallBack(result) {
      if (result.state == "success") {
        this.$message.success('新增成功！');
        this.treeNodeName = "";
        this.treeDialogVisible = false;
        this.findPageBlueScriptTree();
      }
    },
    editTreeDicData() {
      let param = {};
      param.name = this.treeNodeName;
      param.id = this.treeOpData.id;
      param.sql = "page_blue_script_tools_tree.update";
      commonExcuteRequest(window.axios, param, this.editTreeDicDataCallBack);
    },
    editTreeDicDataCallBack(result) {
      if (result.state == "success") {
        this.$message.success('修改成功！');
        this.treeNodeName = "";
        this.treeDialogVisible = false;
        this.findPageBlueScriptTree();
      }
    },

    treeDialogHandleClose() {

    },
    //查找组件树
    findPageBlueScriptTree() {
      let param = {};
      param.sql = "page_blue_script_tools_tree.find";
      commonSelectRequest(axios, param, this.findPageBlueScriptTreeCallBack);
    },
    findPageBlueScriptTreeCallBack(result) {
      this.blueScriptInfoTreeData = getListData(result.objects, ["blue_script_id"]);
      console.log("this.blueScriptInfoTreeData", this.blueScriptInfoTreeData);
      let the = this;
      this.$nextTick(() => {
        if (this.treeCurrentKey != "") {
          the.$refs.blueScriptInfoTreeRef.setCurrentKey(this.treeCurrentKey);
        }
      });
    },
    handleCancle() {
      this.BlueScriptInfoDialogVisible = false;
    },
    showAddBlueScriptInfoWin() {
      this.BlueScriptInfoDialogVisible = true;
    },
    toEditBlueScriptCode(row) {
      //this.$router.push('/Main/ComponentUpload')
      console.log("row:", row);
      this.$router.push({name: 'BlueScriptName', query: {blue_script_id: row.blue_script_id, type: "bluescript"}})
    },
    addBlueScriptInfo() {
      //console.log("this.$refs111",this.$refs);
      var the = this;
      this.$refs.BlueScriptInfoDataFormRef.validate((valid) => {
        console.log("valid1112", valid);
        if (valid == true) {
          //表单验证后执行
          let param = {};
          param.sql = "page_blue_script_tools.insert";
          param.blue_script_name = this.BlueScriptInfoDataForm.blue_script_name;
          param.blue_script_id = this.BlueScriptInfoDataForm.blue_script_id;
          param.component_user = window.localStorage.getItem('loginUserid');
          param.blue_script_node_config_str = "{\r\n    shape: 'static-in-rect',\r\n    width: 150,\r\n    height: 180,\r\n    attrs: {\r\n        body: {\r\n            fill: 'rgba(40, 44, 52,0.9)',\r\n            stroke: '#d9d9d9',\r\n            strokeWidth: 1,\r\n        },\r\n        label: {\r\n            fill: 'rgba(255,255,255,0.8)', // 文字颜色\r\n            fontSize: 14, // 文字大小\r\n            refX: 0.5,\r\n            refY: 8,\r\n            textAnchor: 'middle',\r\n            textVerticalAnchor: 'top',\r\n        },\r\n    },\r\n}";
          param.blue_script_in_out_config_str = "{\r\n    in: [{\r\n        key: 'event',\r\n        label: 'event',\r\n        value: null,\r\n        type: 'event',\r\n        connected: false,\r\n        show: true\r\n    }],\r\n    out: [{\r\n        key: 'string',\r\n        label: 'value',\r\n        value: null,\r\n        type: 'string',\r\n        show: true,\r\n        connected: false,\r\n        connectedTargetArr: []\r\n    }],\r\n}";
          param.blue_script_visualize_config_str = "{\r\n    describe: \"蓝图工具介绍！\",\r\n    settings: [\r\n        \"ShowInParam\", \"ShowOutParam\"\r\n    ]\r\n}";
          param.blue_script_logic_config_str = "{\r\n    logicFun: function(paramObj) {\r\n        console.log(\"logicFun--paramObj：\", paramObj);\r\n    }\r\n}";
          commonExcuteRequest(window.axios, param, the.addBlueScriptInfoCallBack);
        } else {
          return false;
        }
      });
    },
    addBlueScriptInfoCallBack(result) {
      if (result.state == "success") {
        this.$message.success('插入成功！');
        this.BlueScriptInfoDialogVisible = false;
        this.BlueScriptInfoDataForm.blue_script_name = "";
        this.BlueScriptInfoDataForm.blue_script_id = "";
        this.findBlueScriptInfo();
      }
    },

    editBlueScriptInfo() {
      //表单验证后执行
      let param = {};
      param.sql = "page_blue_script_tools.update";
      param.id = this.BlueScriptInfoDataForm.id;
      param.blue_script_name = this.BlueScriptInfoDataForm.blue_script_name;
      param.blue_script_id = this.BlueScriptInfoDataForm.blue_script_id;
      commonExcuteRequest(window.axios, param, this.editBlueScriptInfoCallBack);
    },
    editBlueScriptInfoCallBack(result) {
      if (result.state == "success") {
        this.$message.success('修改成功！');
        this.BlueScriptInfoDialogVisible = false;
        this.findBlueScriptInfo();
      }
    },

    showDeleteBlueScriptInfoWin(row) {
      //console.log("row",row);
      this.currentBlueScriptInfo = row;
      this.deleteBlueScriptDialogVisible = true;
    },
    deleteBlueScriptInfoCancle() {
      this.deleteBlueScriptDialogVisible = false;
    },
    deleteBlueScriptInfo() {
      let param = {};
      param.sql = "page_blue_script_tools.delete";
      param.blue_script_id = this.currentBlueScriptInfo.blue_script_id;
      commonExcuteRequest(window.axios, param, this.deleteBlueScriptInfoCallBack);
    },

    deleteBlueScriptInfoCallBack(result) {
      if (result.state == "success") {
        this.$message.success('删除成功！');
        this.deleteBlueScriptDialogVisible = false;
        this.findBlueScriptInfo();
        this.findPageBlueScriptTree();
      }
    },


    findBlueScriptInfo() {
      var param = {};
      param.sql = "page_blue_script_tools.find";
      commonSelectRequest(axios, param, this.findBlueScriptInfoCallBack);
    },
    findBlueScriptInfoCallBack(result) {
      this.blueScriptData = result.objects;
      this.originBlueScriptData=result.objects;
    },
    showEditBlueScriptInfoWin(row) {
      this.upholdFlag = "edit";
      var param = {};
      param.sql = "page_blue_script_tools.find";
      param.blue_script_id = row.blue_script_id;
      commonSelectRequest(axios, param, this.showEditBlueScriptInfoWinCallBack);
    },
    showEditBlueScriptInfoWinCallBack(result) {
      if (result.objects.length > 0) {
        this.BlueScriptInfoDataForm = result.objects[0];
        this.BlueScriptInfoDialogTitle = '修改组件';
        this.BlueScriptInfoDialogVisible = true;
      }
    }

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

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

::-webkit-scrollbar { /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
  border-radius: 5px;
  background: #a8a9ab;
}

::-webkit-scrollbar-track { /*滚动条里面轨道*/
  border-radius: 5px;
  background: #f0f2f5;
}
</style>
