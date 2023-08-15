<template>
  <div style="width: 100%;height: 350px;overflow: auto">

    <el-tree ref="pageBlockChooseTreeRef" :data="pageBlockChooseTreeData" node-key="id" :default-expand-all="true"
             :expand-on-click-node="false" :props="defaultProps" :highlight-current="true"
             style="margin-left:10px;"/>

  </div>

</template>

<script>

import {commonSelectRequest} from "../../../../../../common/js/request";
import axios from "axios";
import {getListData} from "../../../../../../common/js/tree";
import {uuid} from "../../../../../../common/js/uuid";

export default {
  props: {

  },
  data: function () {
    return {
      defaultProps: {
        "children": 'children',
        "label": 'label'
      },
      pageBlockChooseTreeData: [],


    }
  },

  created() {

  },
  components: {},
  methods: {
    getCheckNode(){
      let nodeTemp=this.$refs.pageBlockChooseTreeRef.getCurrentNode();
      console.log("nodeTempr：",nodeTemp);
      this.$emit('getPageBlock',nodeTemp);
    },

    //查找组件树
    findPageBlockTree() {
      let param = {};
      param.sql = "page_block_tree.find";
      param.page_id = this.$route.query.page_id;
      commonSelectRequest(axios, param, this.findPageBlockTreeCallBack);
    },
    findPageBlockTreeCallBack(result) {
      console.log("findPageBlockTree--result",result);
      this.pageBlockChooseTreeData = getListData(result.objects, ["page_block_ref"]);
    }


  },
  mounted() {
    this.findPageBlockTree();
  }
}
</script>

<style scoped>

</style>