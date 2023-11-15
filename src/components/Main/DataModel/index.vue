<template>
  <div style="height: calc(100% - 60px); margin: 20px">
    <div class="titleClass">数据模型</div>

    <div class="contentClass">
      <div style="flex-basis: 25%">
        <el-divider content-position="left"
          ><span style="font-size: 18px">数据模型树</span>
        </el-divider>

        <el-tree
          ref="dataModelTreeRef"
          :data="dataModelTreeData"
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
              <span
                v-if="data.data_model_id == null || data.data_model_id == ''"
              >
                <Folder style="width: 1em; height: 1em" />
                {{ node.label }}
                <span v-if="data.name_space">({{ data.name_space }})</span>
              </span>
              <span
                v-if="data.data_model_id != null && data.data_model_id != ''"
              >
                {{ node.label }}({{ data.data_model_id }})
              </span>
              <span>
                <Plus
                  v-if="data.data_model_id == null || data.data_model_id == ''"
                  style="
                    width: 1em;
                    height: 1em;
                    color: blueviolet;
                    margin-left: 8px;
                  "
                  @click="() => treeAppend(data)"
                ></Plus>

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

      <div style="flex-basis: 5%"></div>

      <div style="flex-basis: 70%; overflow: auto">
        <el-form
          v-if="
            currentDataModelTreeNodeData &&
            currentDataModelTreeNodeData.name_space &&
            !currentDataModelTreeNodeData.data_model_id
          "
          :inline="true"
          style="width: 100%; height: 100%"
          label-width="120px"
          :model="currentDataModelTreeNodeData"
          class="demo-form-inline"
        >
          <el-form-item label="名称：">
            <el-input
              @input="labelInput"
              v-model="currentDataModelTreeNodeData.label"
              placeholder="label"
            />
          </el-form-item>
          <el-form-item label="命名空间：">
            <el-input
              v-model="currentDataModelTreeNodeData.name_space"
              placeholder="name_space"
            />
          </el-form-item>

          <div align="center" style="padding-top: 10px">
            <el-button type="primary" @click="onEditNameSpace">保存</el-button>
          </div>
        </el-form>

        <el-form
          v-if="
            currentDataModelTreeNodeData &&
            currentDataModelTreeNodeData.data_model_id
          "
          :inline="true"
          style="width: 100%; height: 100%"
          label-width="120px"
          :model="currentDataModelTreeNodeData"
          class="demo-form-inline"
        >
          <el-form-item label="命名空间：">
            <el-input
              v-model="currentDataModelTreeNodeData.name_space"
              placeholder="label"
              disabled
            />
          </el-form-item>
          <el-form-item label="名称：">
            <el-input
                @input="labelInput"
              v-model="currentDataModelTreeNodeData.label"
              placeholder="label"
            />
          </el-form-item>
          <el-form-item label="模型类型： ">
            <el-select
              v-model="currentDataModelTreeNodeData.data_model_type"
              placeholder="data_model_type"
            >
              <el-option label="select" value="select" />
              <el-option label="insert" value="insert" />
              <el-option label="update" value="update" />
              <el-option label="delete" value="delete" />
            </el-select>
          </el-form-item>
          <el-form-item label="模型ID：">
            <el-input
              v-model="currentDataModelTreeNodeData.data_model_id"
              placeholder="label"
            />
          </el-form-item>
          <el-form-item
            label="开启缓存： "
            v-if="currentDataModelTreeNodeData.data_model_type=='select'"
          >
            <el-select
              v-model="currentDataModelTreeNodeData.is_cache"
              placeholder="data_model_type"
            >
              <el-option label="true" value="true" />
              <el-option label="false" value="false" />
            </el-select>
          </el-form-item>

          <div>
            <div class="leftTitle" style="padding-bottom: 10px">
              模型SQL（参考MyBatis用法）：
            </div>
            <MyMonacoEditor
              v-if="codeEditorFlag"
              style="padding-left: 40px; width: 90%; height: 250px"
              id="SQLCodeID"
              :code="currentDataModelTreeNodeData.data_model_sql"
              @update="updateSQLCodeConfig"
            ></MyMonacoEditor>

            <div
              class="leftTitle"
              style="padding-top: 10px; padding-bottom: 10px"
            >
              测试参数：
            </div>
            <MyMonacoEditor
              v-if="codeEditorFlag"
              style="padding-left: 40px; width: 90%; height: 200px"
              id="TestCodeID"
              :code="currentDataModelTreeNodeData.data_model_param"
              @update="updateTestCodeConfig"
            ></MyMonacoEditor>
          </div>

          <div align="center" style="padding-top: 10px">
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button type="success" @click="onTest">测试</el-button>
          </div>

          <div style="height: 30px"></div>
        </el-form>
      </div>
    </div>
  </div>

  <el-dialog
    title="返回结果"
    v-model="testSelectResultDialogVisible"
    :close-on-click-modal="false"
    width="60%"
  >
    <el-table
      :data="tableData"
      stripe
      style="width: 100%; height: 500px; padding-top: 20px; padding-left: 40px"
    >
      <el-table-column
        v-for="(item, i) in headerTableData"
        :prop="item"
        :label="item"
      />
    </el-table>
  </el-dialog>

  <el-dialog
    title="添加节点"
    v-model="addNameSpaceDialogVisible"
    :close-on-click-modal="false"
    width="30%"
  >
    <el-form
      :model="namespaceForm"
      label-width="120px"
      style="padding-right: 50px"
    >
      <el-form-item label="名称">
        <el-input v-model="namespaceForm.name" placeholder="name" />
      </el-form-item>
      <el-form-item label="命名空间" v-if="!currentDataModelTreeNodeData?.name_space">
        <el-input v-model="namespaceForm.name_space" placeholder="name_space" />
      </el-form-item>
      <el-form-item label="模型ID" v-if="currentDataModelTreeNodeData?.name_space">
        <el-input v-model="namespaceForm.data_model_id" placeholder="data_model_id" />
      </el-form-item>
    </el-form>
    <div align="center" style="padding-top: 10px">
      <el-button type="primary" @click="addNameSpace">保存</el-button>
    </div>
  </el-dialog>


  <el-dialog
    title="确认框"
    v-model="deleteNameSpaceDialogVisible"
    :close-on-click-modal="false"
    width="60%"
  >
    <div v-if="!currentDataModelTreeNodeData?.data_model_id">
        将要删除<span style="color:red;font-weight: bold">({{ currentDataModelTreeNodeData?.name }})</span>
        <br>该操作也会把对应的整个命名空间中的SQL进行删除，数据不可恢复，请小心操作。
    </div>

    <div v-if="currentDataModelTreeNodeData?.data_model_id">
        将要删除<span style="color:red;font-weight: bold">({{ currentDataModelTreeNodeData?.name }})</span>
        <br>数据不可恢复，请小心操作。
    </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="deleteNameSpace">确 定</el-button>
      </span>
      </template>
    
  </el-dialog>

</template>

<script setup lang="ts">
import { provide, ref, nextTick, onMounted } from "vue";
import { getListData ,findNodeById} from "@/common/js/tree.js";
import { ElMessage } from "element-plus";
import { objectToString, stringToObject } from "@/common/js/objStr.js";
import MyMonacoEditor from "@/common/component/CodeEditor/MyMonacoEditor/index.vue";

import {
  commonExcuteRequest,
  commonSelectRequest,
  commonMapperRefreshRequest,
  commonExcuteByBatchRequest,
  commonBatchSelectRequest,
  commonExcuteRequestAndOtherParam,
  commonMapperRefreshByEditNameSpace,
  mapperRefreshByDeleteNameSpace
} from "@/common/js/request.js";

let defaultProps = {
  children: "children",
  label: "label",
};
const dataModelTreeData = ref([]);
const currentDataModelTreeNodeData = ref(null);
const treeCurrentKey = ref("");
const dataModelTreeRef = ref(null);
const codeEditorFlag = ref(true);
const tableData = ref([]);
const headerTableData = ref([]);

const testSelectResultDialogVisible = ref(false);

const namespaceForm = ref({
  name: "",
  name_space: "",
  data_model_id:"",
});
const labelInput=()=>{
    let nodeTemp=findNodeById(dataModelTreeData.value,currentDataModelTreeNodeData.value.id);
    console.log("变化",nodeTemp);
    nodeTemp.label=currentDataModelTreeNodeData.value.label;
}

//查找组件树
const findDataModelTree = () => {
  let param = {};
  param.sql = "page_data_model_tree.find";
  commonSelectRequest(axios, param, findDataModelTreeCallBack);
};
const findDataModelTreeCallBack = (result) => {
  dataModelTreeData.value = getListData(result.objects, [
    "name_space",
    "data_model_id",
    "data_model_type",
    "data_model_sql",
    "data_model_param",
    "is_cache",
  ]);
  console.log("dataModelTreeData", dataModelTreeData);
  nextTick(() => {
    if (treeCurrentKey.value) {
      dataModelTreeRef.value.setCurrentKey(treeCurrentKey.value);
    }
  });
};
findDataModelTree();

const updateSQLCodeConfig = (code) => {
  //console.log("updateConfig--code", code);
  currentDataModelTreeNodeData.value.data_model_sql = code;
};

const updateTestCodeConfig = (code) => {
  //console.log("updateConfig--code", code);
  currentDataModelTreeNodeData.value.data_model_param = code;
};

const onEditNameSpace = () => {
  let param = {};
  param.name = currentDataModelTreeNodeData.value.label;
  param.old_name_space = currentDataModelTreeNodeData.value.old_name_space;
  param.name_space = currentDataModelTreeNodeData.value.name_space;
  param.id = currentDataModelTreeNodeData.value.id;
  commonMapperRefreshByEditNameSpace(axios, param, onEditNameSpaceCallBack);
};
const onEditNameSpaceCallBack = (result) => {
  if ((result.state = "success")) {
    ElMessage.success("保存成功！");
    findDataModelTree();
  }
};

const onSubmit = () => {
  let param = { ...currentDataModelTreeNodeData.value };
  param.name = currentDataModelTreeNodeData.value.label;
  commonMapperRefreshRequest(axios, param, onSubmitCallBack);
};
const onSubmitCallBack = (result) => {
  if ((result.state = "success")) {
    ElMessage.success("保存成功！");

  }
};

const onTest = () => {


  if (currentDataModelTreeNodeData.value.data_model_type == "select") {
    let param = stringToObject(
      currentDataModelTreeNodeData.value.data_model_param
    );
    param.sql =
      currentDataModelTreeNodeData.value.name_space +
      "." +
      currentDataModelTreeNodeData.value.data_model_id;
    commonSelectRequest(axios, param, onTestSelectCallBack);
  }
  if (
    currentDataModelTreeNodeData.value.data_model_type == "insert" ||
    currentDataModelTreeNodeData.value.data_model_type == "update" ||
    currentDataModelTreeNodeData.value.data_model_type == "delete"
  ) {
    let param = stringToObject(
      currentDataModelTreeNodeData.value.data_model_param
    );
    param.sql =
      currentDataModelTreeNodeData.value.name_space +
      "." +
      currentDataModelTreeNodeData.value.data_model_id;
    commonExcuteByBatchRequest(axios, param, onTestExcuteCallBack);
  }
};
const onTestExcuteCallBack = (result) => {
  console.log("onTestExcuteCallBack--result", result);
  if (result.state == "success") {
    ElMessage.success("测试执行成功！");
  }
};
const onTestSelectCallBack = (result) => {
  console.log("onTestSelectCallBack--result", result);
  if (result.objects.length > 0) {
    headerTableData.value = Object.keys(result.objects[0]);
    tableData.value = result.objects;
    testSelectResultDialogVisible.value = true;
  } else {
    ElMessage.success("未找到数据！");
  }
};

const addNameSpaceDialogVisible = ref(false);
const treeAppend = (data) => {
  console.log("treeAppend--data", data);
  if (data.name_space) {
    addNameSpaceDialogVisible.value = true;
  } else {
    addNameSpaceDialogVisible.value = true;
  }
};
const addNameSpace = () => {
  console.log("addNameSpace--namespaceForm", namespaceForm);
  let param = {};
  param.name = namespaceForm.value.name;
  if(namespaceForm.value.name_space){
    param.name_space = namespaceForm.value.name_space;
  }else{
    param.name_space = currentDataModelTreeNodeData.value.name_space;
  }
  param.id=window.cbcuuid();
  param.pid=currentDataModelTreeNodeData.value.id;
  param.data_model_id=namespaceForm.value.data_model_id;
  //console.log("传参param",param);
  param.sql="page_data_model_tree.addNameSpace";
  commonExcuteRequest(axios, param, addNameSpaceCallBack);
};
const addNameSpaceCallBack = (result) => {
  if (result.state == "success") {
    ElMessage.success("保存成功！");
    addNameSpaceDialogVisible.value = false;
    findDataModelTree();
    namespaceForm.value.name="";
    namespaceForm.value.name_space="";
    namespaceForm.value.data_model_id="";
  }
};


//删除逻辑
const deleteNameSpaceDialogVisible=ref(false);
const treeRemove = (data) => {
    deleteNameSpaceDialogVisible.value=true;
};
const deleteNameSpace=()=>{
    let param={};
    param.id=currentDataModelTreeNodeData.value.id;
    param.pid=currentDataModelTreeNodeData.value.pid;
    param.name_space=currentDataModelTreeNodeData.value.name_space;
    if(!currentDataModelTreeNodeData.value.data_model_id){
        param.deleteType="deleteNamespace";
    }else{
        param.deleteType="deleteSQL";
    }
    
    mapperRefreshByDeleteNameSpace(axios, param, deleteNameSpaceCallBack);
}
const deleteNameSpaceCallBack = (result) => {
    if (result.state == "success") {
        ElMessage.success("删除成功！");
        deleteNameSpaceDialogVisible.value = false;
        findDataModelTree();
    }
}


const handleNodeClick = (item, data) => {
  console.log("handleNodeClick--item, data", item, data);
  findByID(item.id);
  codeEditorFlag.value = false;
  tableData.value = [];
};

//查找组件树
const findByID = (id) => {
  let param = {};
  param.sql = "page_data_model_tree.findByID";
  param.id = id;
  commonSelectRequest(axios, param, findByIDCallBack);
};
const findByIDCallBack = (result) => {
  console.log("findByIDCallBack--result", result);
  currentDataModelTreeNodeData.value = result.objects[0];
  currentDataModelTreeNodeData.value.label =
    currentDataModelTreeNodeData.value.name;
  currentDataModelTreeNodeData.value.old_name_space =
    result.objects[0].name_space;
    
    //如果没有值，则附加默认值
    if(!currentDataModelTreeNodeData.value.data_model_type){
        currentDataModelTreeNodeData.value.data_model_type="select";
    }
    if(!currentDataModelTreeNodeData.value.is_cache){
        currentDataModelTreeNodeData.value.is_cache="false";
    }
    if(!currentDataModelTreeNodeData.value.data_model_param){
        currentDataModelTreeNodeData.value.data_model_param="{}";
    }
  nextTick(() => {
    codeEditorFlag.value = true;
  });
};
</script>

<style scoped>
.contentClass {
  display: flex;
  flex-direction: row;
  height: calc(100% - 40px);
  padding: 20px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.leftTitle {
  padding-left: 38px;
  margin-top: 0px;
  color: #606266;
  font-size: 14px;
}
.rightValue {
  padding-top: 5px;
  padding-left: 15px;
  padding-right: 15px;
}
.titleClass {
  padding: 8px 16px;
  background-color: #fff6f7;
  border-radius: 4px;
  border-left: 5px solid #fe6c6f;
  margin: 10px 0;
  line-height: 40px;
}
</style>
