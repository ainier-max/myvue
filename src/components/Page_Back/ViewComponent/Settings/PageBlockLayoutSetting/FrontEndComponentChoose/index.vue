<template>
  <div style="width: 100%; height: 350px; overflow: auto">
    <el-tree
      ref="componentChooseTreeRef"
      :data="componentChooseTreeData"
      node-key="id"
      :default-expand-all="true"
      :expand-on-click-node="false"
      :props="defaultProps"
      :highlight-current="true"
      @node-click="pageCentreTreeNodeClick"
      style="margin-left: 10px"
    />
  </div>
</template>

<script>
import { commonSelectRequest } from "../../../../../../common/js/request";
import axios from "axios";
import { getListData } from "../../../../../../common/js/tree";
import { uuid } from "../../../../../../common/js/uuid";

export default {
  props: {},
  data: function () {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      componentChooseTreeData: [],
    };
  },

  created() {},
  components: {},
  methods: {
    getCheckNode() {
      let nodeTemp = this.$refs.componentChooseTreeRef.getCurrentNode();
      this.findPageComponentByID(nodeTemp.component_id);
    },
    findPageComponentByID(component_id) {
      if (component_id == null || component_id == "") {
        this.$message.error("当前选择不是组件！");
        return;
      }
      let param = {};
      param.sql = "page_component.find";
      param.component_id = component_id;
      console.log("findPageComponentByID--param", param);
      commonSelectRequest(axios, param, this.findPageComponentByIDCallBack);
    },
    findPageComponentByIDCallBack(result) {
      console.log("result112", result);
      if (result.objects.length > 0) {
        let obj = {};
        obj.blue_script_in_out_config_str =
          result.objects[0].blue_script_in_out_config_str;
        obj.blue_script_logic_config_str =
          result.objects[0].blue_script_logic_config_str;
        obj.blue_script_node_config_str =
          result.objects[0].blue_script_node_config_str;
        obj.blue_script_visualize_config_str =
          result.objects[0].blue_script_visualize_config_str;

        obj.component_visualize_str = result.objects[0].component_visualize_str;
        obj.component_code = result.objects[0].component_code;
        obj.component_id = result.objects[0].component_id;
        obj.component_config_str = result.objects[0].component_config_str;
        obj.component_config = eval(
          "(" + result.objects[0].component_config_str + ")"
        );
        obj.component_name = result.objects[0].component_name;
        obj.type = result.objects[0].type;
        obj.page_block_ref =
          window.cbcPageInstance.data.currentPageBlock.page_block_ref;
        obj.layout_ref =
          window.cbcPageInstance.data.currentPageBlockLayout.layout_ref;
        obj.page_id = this.$route.query.page_id;
        obj.component_ref = "frontEndComponentRef-" + "-" + uuid();

        window.cbcPageInstance.data.pageComponents.push(obj);
        this.$emit("getFrontEndComponent", obj);
      }
    },
    //查找组件树
    findPageComponentTree() {
      let param = {};
      param.sql = "page_component_tree.find";
      commonSelectRequest(axios, param, this.findPageComponentTreeCallBack);
    },
    findPageComponentTreeCallBack(result) {
      this.componentChooseTreeData = getListData(result.objects, [
        "component_id",
      ]);
    },
    pageCentreTreeNodeClick(data, node) {
      //记录点击次数
      this.pageCentreTreeClickCount++;
      //单次点击次数超过2次不作处理,直接返回,也可以拓展成多击事件
      if (this.pageCentreTreeClickCount >= 2) {
        return;
      }
      //计时器,计算300毫秒为单位,可自行修改
      this.timer = window.setTimeout(() => {
        if (this.pageCentreTreeClickCount == 1) {
          //把次数归零
          this.pageCentreTreeClickCount = 0;
          //单击事件处理
          //console.log('单击事件,可在此处理对应逻辑')
        } else if (this.pageCentreTreeClickCount > 1) {
          //把次数归零
          this.pageCentreTreeClickCount = 0;
          //双击事件
          //console.log('双击事件,可在此处理对应逻辑')
          //console.log("data11:",data);
          //this.findPageComponentByID(data.component_id);
        }
      }, 500);
    },
  },
  mounted() {
    this.findPageComponentTree();
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  background: #a8a9ab;
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 5px;
  background: #f0f2f5;
}
</style>
