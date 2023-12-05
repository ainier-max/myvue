<template>
  
  <div style="height: calc(100% - 60px); margin: 20px" >
    <div class="titleClass">打包组件</div>
    <div v-if="isView==true">
      <div><el-button @click="closeIsView">返回</el-button></div>

      <!--外部页面渲染-->
      <PackComponentRender
        style="width:500px;height:500px"
        :packComponentData="showPackComponentData"
      >
      </PackComponentRender>

      

    </div>
    <div
      v-if="isView==false"
      style="
        display: flex;
        flex-direction: row;
        height: calc(100% - 220px);
        padding: 20px;
      "
    >
      <div style="flex-basis: 50%">
        <el-divider content-position="left"
          ><span style="font-size: 18px">打包组件列表</span>
        </el-divider>

        <el-button @click="downloadProject" type="success"
          >下载打包组件代码工程
        </el-button>

        <el-table :data="packComponentArrData" style="width: 100%; height: 95%">
          <el-table-column prop="component_name" label="组件名称" width="250">
          </el-table-column>

          <el-table-column prop="component_id" label="组件ID">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-icon size="20" color="cornflowerblue" style="cursor: pointer">
                <Upload @click="packComponentDeploy(scope.row)" />
              </el-icon>

              <el-icon
                size="20"
                color="cornflowerblue"
                style="cursor: pointer; padding-left: 10px"
              >
                <Download @click="packComponentDownload(scope.row)" />
              </el-icon>

              <el-icon size="20" color="cornflowerblue" style="cursor:pointer;padding-left: 10px">
                <Edit @click="toShowPackComponent(scope.row)"/>
              </el-icon>

              <el-icon size="20" color="cornflowerblue" style="cursor:pointer;padding-left: 10px">
                  <EditPen @click="toEditBlueScriptCode(scope.row)"/>
                </el-icon>

              <el-icon
                size="20"
                color="red"
                style="cursor: pointer; padding-left: 10px"
              >
                <Delete @click="showDeletePackComponentWin(scope.row)" />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="flex-basis: 45%">
        <el-divider content-position="left" style="margin-left: 50px"
          ><span style="font-size: 18px">打包组件树</span>
        </el-divider>

        <el-tree
          ref="packComponentInfoTreeRef"
          :data="packComponentTreeData"
          node-key="id"
          :default-expand-all="false"
          :expand-on-click-node="false"
          :props="defaultProps"
          :highlight-current="true"
          :default-expanded-keys="[1]"
          @node-click="handleNodeClick"
          style="margin-left: 50px; height: 100%; overflow-y: auto"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span v-if="data.component_id == null || data.component_id == ''">
                <Folder style="width: 1em; height: 1em" />
                {{ node.label }}
              </span>
              <span v-if="data.component_id != null && data.component_id != ''">
                {{ node.label }}
              </span>
              <span>
                <Plus
                  v-if="data.component_id == null || data.component_id == ''"
                  style="
                    width: 1em;
                    height: 1em;
                    color: blueviolet;
                    margin-left: 8px;
                  "
                  @click="() => treeAppend(data)"
                ></Plus>

                <Edit
                  v-if="
                    (data.component_id == null || data.component_id == '') &&
                    data.id != 1
                  "
                  style="
                    width: 1em;
                    height: 1em;
                    color: blueviolet;
                    margin-left: 8px;
                  "
                  @click="() => treeEdit(data)"
                ></Edit>

                

                <Delete
                  v-if="data.id != 1"
                  style="width: 1em; height: 1em; color: red; margin-left: 8px"
                  @click="() => treeRemove(data)"
                ></Delete>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
  </div>

  <el-dialog
    :title="treeDialogTitle"
    v-model="treeDialogVisible"
    :close-on-click-modal="false"
    width="30%"
  >
    <el-input v-model="treeNodeName" placeholder="树节点标签"></el-input>
    <template #footer>
      <el-button @click="treeHandleCancle">取 消</el-button>
      <el-button v-if="treeEditFlag == 0" type="primary" @click="addTreeDicData"
        >确 定</el-button
      >
      <el-button
        v-if="treeEditFlag == 1"
        type="primary"
        @click="editTreeDicData"
        >确 定</el-button
      >
    </template>
  </el-dialog>

  <el-dialog
    title="确认框"
    v-model="deleteTreeNodeDialogVisible"
    :close-on-click-modal="false"
    width="30%"
  >
    将要删除<span style="color: red; font-weight: bold"
      >({{ treeOpData.label }})</span
    >与其所属的所有选项？
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteTreeNodeCancle">取 消</el-button>
        <el-button type="primary" @click="deleteTreeNode">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    title="确认框"
    v-model="deletePackComponentDialogVisible"
    :close-on-click-modal="false"
    width="30%"
  >
    将要删除<span style="color: red; font-weight: bold"
      >({{ currentPackComponent.component_name }})</span
    >
    <br />该操作也会把组件树中的对应组件删除，数据不可恢复，请小心操作。
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deletePackComponentCancle">取 消</el-button>
        <el-button type="primary" @click="deletePackComponent">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { provide, ref, nextTick, onMounted } from "vue";
import { getListData } from "@/common/js/tree.js";
import { ElMessage } from "element-plus";
import { objectToString, stringToObject } from "@/common/js/objStr.js";

import {
  commonExcuteRequest,
  commonSelectRequest,
  commonExcuteByBatchRequest,
  commonBatchSelectRequest,
  commonExcuteRequestAndOtherParam,
} from "@/common/js/request.js";

const packComponentArrData = ref([]);
let defaultProps = {
  children: "children",
  label: "label",
};

const isView=ref(false);

const packComponentDeploy = (row) => {
  //获取当前选中树菜单
  let node = packComponentInfoTreeRef.value.getCurrentNode();
  console.log("node", node);
  if (node == null) {
    ElMessage.error("未选中图层树菜单！");
    return;
  }
  treeCurrentKey.value = node.id;
  if (node.component_id != null && node.component_id != "") {
    ElMessage.error("图层不能添加到图层！");
    return;
  }
  if (node.children.length > 0) {
    for (let i = 0; i < node.children.length; i++) {
      if (row.component_id == node.children[i].component_id) {
        ElMessage.error("同一个目录下不能存在两个相同图层！");
        return;
      }
    }
  }

  let param = {};
  param.id = window.cbcuuid();
  param.name = row.component_name;
  param.pid = node.id;
  param.component_id = row.component_id;
  param.sql = "page_component_pack_tree.insert";
  commonExcuteRequest(window.axios, param, packComponentDeployCallBack);
};
const packComponentDeployCallBack = (result) => {
  if (result.state == "success") {
    ElMessage.success("调配成功！");
    findPackComponentTree();
  }
};
//删除打包数据
const currentPackComponent = ref(null);
const deletePackComponentDialogVisible = ref(false);
const showDeletePackComponentWin = (row) => {
  currentPackComponent.value = row;
  deletePackComponentDialogVisible.value = true;
};
const deletePackComponentCancle = () => {
  deletePackComponentDialogVisible.value = false;
};
const deletePackComponent = () => {
  let param = {};
  param.sql = "page_component_pack.delete";
  param.component_id = currentPackComponent.value.component_id;
  commonExcuteByBatchRequest(window.axios, param, deletePackComponentCallBack);
};

const deletePackComponentCallBack = (result) => {
  if (result.state == "success") {
    ElMessage.success("删除成功！");
    deletePackComponentDialogVisible.value = false;
    findPackComponentTree();
    findAllPackComponent();
  }
};

const showPackComponentData=ref(null);
import PackComponentRender from "@/common/component/PageLayoutRender/PackComponentRender/index.vue";
const toShowPackComponent=(row)=>{
  console.log("toShowPackComponent--row",row);
  row.config=stringToObject(row.component_config_str);
  row.ref="viewPackComponentRef";
  row.related_value=row.component_id;
  showPackComponentData.value=row;
  isView.value=true;
}
const closeIsView=()=>{
  isView.value=false;
}


//下载示例工程代码
const downloadProject = () => {
  window.open("/project/project.zip");
};
//下载工程代码
const packComponentDownload = (row) => {
  window.open("/cbc/GetPageComponentPackProject.cbc?component_id=EchartMap");
};

const findAllPackComponent = () => {
  var param = {};
  param.sql = "page_component_pack.findAll";
  commonSelectRequest(axios, param, findAllPackComponentCallBack);
};
const findAllPackComponentCallBack = (result) => {
  packComponentArrData.value = result.objects;
};
findAllPackComponent();

//打包组件树开始
const packComponentTreeData = ref([]);
const packComponentInfoTreeRef = ref(null);
const treeCurrentKey = ref("");
const treeNodeName = ref("");
const treeDialogVisible = ref(false);
const treeDialogTitle = ref("");
const treeEditFlag = ref(0);
const treeOpData = ref(null);
const deleteIDS = ref([]);
const deleteTreeNodeDialogVisible = ref(false);

//查找组件树
const findPackComponentTree = () => {
  let param = {};
  param.sql = "page_component_pack_tree.find";
  commonSelectRequest(axios, param, findPackComponentTreeCallBack);
};
const findPackComponentTreeCallBack = (result) => {
  packComponentTreeData.value = getListData(result.objects, ["component_id"]);
  console.log("packComponentTreeData", packComponentTreeData);
  nextTick(() => {
    if (treeCurrentKey.value) {
      packComponentInfoTreeRef.value.setCurrentKey(treeCurrentKey.value);
    }
  });
};
findPackComponentTree();

const treeAppend = (data) => {
  treeCurrentKey.value = "";
  treeNodeName.value = "";
  treeDialogVisible.value = true;
  treeDialogTitle.value = "新增树节点";
  treeEditFlag.value = 0;
  treeOpData.value = data;
};
const treeEdit = (data) => {
  treeCurrentKey.value = "";
  treeNodeName.value = data.label;
  treeDialogVisible.value = true;
  treeDialogTitle.value = "修改树节点";
  treeEditFlag.value = 1;
  treeOpData.value = data;
};

const treeRemove = (data) => {
  treeCurrentKey.value = "";
  deleteIDS.value = [];
  deleteTreeNodeDialogVisible.value = true;
  treeOpData.value = data;
};

const deleteTreeNodeCancle = () => {
  deleteTreeNodeDialogVisible.value = false;
};
const deleteTreeNode = () => {
  getDeleteIDS(treeOpData.value);
  //表单验证后执行
  var param = {};
  param.ids = deleteIDS.value;
  param.sql = "page_component_pack_tree.delete";
  commonExcuteRequest(window.axios, param, deleteTreeNodeCallBack);
};
const deleteTreeNodeCallBack = (result) => {
  if (result.state == "success") {
    ElMessage.success("删除成功！");
    deleteTreeNodeDialogVisible.value = false;
    findPackComponentTree();
  }
};
//遍历获取ids

const getDeleteIDS = (data) => {
  deleteIDS.value.push(data.id);
  if (data.children.length != 0) {
    for (let i = 0; i < data.children.length; i++) {
      getDeleteIDS(data.children[i]);
    }
  }
};

const editTreeDicData = () => {
  let param = {};
  param.name = treeNodeName.value;
  param.id = treeOpData.value.id;
  param.sql = "page_component_pack_tree.update";
  commonExcuteRequest(window.axios, param, editTreeDicDataCallBack);
};
const editTreeDicDataCallBack = (result) => {
  ElMessage.success("修改成功！");
  treeNodeName.value = "";
  treeDialogVisible.value = false;
  findPackComponentTree();
};

const addTreeDicData = () => {
  let param = {};
  param.name = treeNodeName.value;
  param.id = window.cbcuuid();
  param.pid = treeOpData.value.id;
  param.component_id = treeOpData.value.component_id;
  param.sql = "page_component_pack_tree.insert";
  commonExcuteRequest(axios, param, addTreeDicDataCallBack);
};
const addTreeDicDataCallBack = (result) => {
  if (result.state == "success") {
    ElMessage.success("新增成功！");
    treeNodeName.value = "";
    treeDialogVisible.value = false;
    findPackComponentTree();
  }
};
const treeHandleCancle = (item, data) => {
  treeDialogVisible.value = false;
};

const handleNodeClick = (item, data) => {};

import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const toEditBlueScriptCode=(row)=>{
  router.push({ name: 'BlueScriptName', query: { blue_script_id:row.component_id,type:"packComponent" }})
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
</style>
