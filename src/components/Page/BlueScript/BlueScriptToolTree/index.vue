<template>
  <div style="height: 100%">
    <el-tree ref="blueScriptInfoTreeRef" :data="blueScriptInfoTreeData" node-key="id" :default-expand-all="false"
             :expand-on-click-node="false" :props="defaultProps" :highlight-current="true" @node-click="blueScriptTreeNodeClick"
             :default-expanded-keys="[1]"
             style="margin-left:10px;background: rgb(40, 44, 52);height: calc(100% - 38px);overflow: auto"/>
  </div>

</template>

<script>


import {commonSelectRequest} from "../../../../common/js/request.js";
import axios from "axios";
import {getListData} from "../../../../common/js/tree.js";

export default {
  props:{
  },
  data() {
    return {
      blueScriptInfoTreeData:[],
      blueScriptTreeClickCount: 0,
      defaultProps: {
        "children": 'children',
        "label": 'label'
      },

    };
  },

  components: {

  },
  mounted() {
    this.findPageBlueScriptTree();
  },
  methods: {
    //查找组件树
    findPageBlueScriptTree() {
      let param = {};
      param.sql = "page_blue_script_tools_tree.find";
      commonSelectRequest(axios, param, this.findPageBlueScriptTreeCallBack);
    },
    findPageBlueScriptTreeCallBack(result) {
      this.blueScriptInfoTreeData = getListData(result.objects,["blue_script_type"]);
      console.log("findPageBlueScriptTreeCallBack--this.blueScriptInfoTreeData", this.blueScriptInfoTreeData);
    },
    blueScriptTreeNodeClick(data, node){
      //记录点击次数
      this.blueScriptTreeClickCount++;
      //单次点击次数超过2次不作处理,直接返回,也可以拓展成多击事件
      if (this.blueScriptTreeClickCount >= 2) {
        return;
      }
      //计时器,计算300毫秒为单位,可自行修改
      this.timer = window.setTimeout(() => {
        if (this.blueScriptTreeClickCount == 1) {
          //把次数归零
          this.blueScriptTreeClickCount = 0;
          //单击事件处理
          //console.log('单击事件,可在此处理对应逻辑')
        } else if (this.blueScriptTreeClickCount > 1) {
          //把次数归零
          this.blueScriptTreeClickCount = 0;
          //双击事件
          //console.log('双击事件,可在此处理对应逻辑')
          //console.log("data:",data);
          data.type="blueScriptTool";

          this.$emit("addBlueScriptByTree",data);
          //the.$refs.blueScriptRef.addBlueScript(item);

        }
      }, 500);

    }

  }
}
</script>

<style scoped>
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