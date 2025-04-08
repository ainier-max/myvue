<template>
  <div style="width: 100%;height: 100%"  >
    <el-row style="width: 100%;height: 100%" >
      <el-col :span="6" style="width: 100%;height: 100%;border-right: 1px solid whitesmoke;overflow: auto">
        <el-tree ref="blockTreeRef" :data="pageBlockTreeData" node-key="id" :default-expand-all="false"
                 :expand-on-click-node="false" :props="defaultProps" :highlight-current="true"
                 :current-node-key="currentNodeKey"
                 :default-expanded-keys="showExpandedArray"
                 @node-click="pageBlockTreeNodeClick"
                 style="margin-left:10px;background: #282c34;">
        </el-tree>
      </el-col>

      <el-col :span="9" style="border-right: 1px solid whitesmoke">
        <div style="width: 100%"  >
          <ul style="padding-inline-start:10px;padding-top: 5px;padding-right: 5px">
            <li v-for="(item,i) in pageBlockComponents"
                style="cursor:pointer;display:inline-block;list-style:none;">
              <div style="text-align: center;" class="componentItemClass"  @contextmenu="onComponentItemContextMenu($event,item)">
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
          </ul>
        </div>
      </el-col>

      <el-col :span="9" style="width: 100%;height: 100%;">
        <div style="width: 100%;height: 100%;overflow-y: scroll;">
          <ul style="padding-inline-start:10px;padding-top: 5px;padding-right: 5px">
            <li v-for="(item,i) in pageBlueScripts"
                style="cursor:pointer;display:inline-block;list-style:none;">
              <div style="text-align: center;" class="blueScriptItemClass" @click="blueScriptActiveFun(item)"  @contextmenu="onBlueScriptItemContextMenu($event,item)">
                <div>
                  <CreditCard :ref="'setPageBlockBlueScriptColor-'+item.blue_script_ref"
                              style="width: 2em; height: 2em;color: rgba(255,255,255,0.6);"
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

  </div>
</template>

<script>



import {commonExcuteRequest, commonSelectRequest} from "../../../../common/js/request";
import axios from "axios";
import {getListData} from "../../../../common/js/tree";
import {getCurrentInstance} from "vue";

//右键菜单样式
import './index.css'

export default {
  props: {},
  data() {
    return {
      currentNodeKey:null,
      defaultProps: {
        "children": 'children',
        "label": 'label'
      },
      pageBlockTreeData: [],
      pageBlockComponents:[],
      pageBlueScripts: [],
      pageBlockData:[],
      showExpandedArray:[],
    }
  },

  created() {

  },
  watch: {},
  components: {},
  methods: {
    onComponentItemContextMenu(e, item){
      console.log("item:",item);
      console.log("x,y",e.x,e.y)
      e.preventDefault();
      let the=this;
      the.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: "添加至蓝图",
            onClick: () => {
              window.cbcBlueScriptInstance.ctx.addBlueScriptByComponent(item);
            }
          },
        ]
      });
    },
    onBlueScriptItemContextMenu(e, item) {
      let the = this;
      e.preventDefault();
      this.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: "从蓝图删除",
            onClick: () => {
              console.log("蓝图删除：", item);
              window.cbcBlueScriptInstance.ctx.deleteBlueScriptItem(item);
            }
          },
        ]
      });
    },
    blueScriptActiveFun(item) {
      //console.log("blueScriptActiveFun--item",item);
      if (item == null) {
        return;
      }
      // item 为被选中的元素体
      for (let i = 0; i < this.pageBlueScripts.length; i++) {
        if (this.pageBlueScripts[i].blue_script_ref == item.blue_script_ref) {
          this.$refs["setPageBlockBlueScriptColor-"+this.pageBlueScripts[i].blue_script_ref][0].$el.style.color = "blueviolet";
        }else{
          this.$refs["setPageBlockBlueScriptColor-"+this.pageBlueScripts[i].blue_script_ref][0].$el.style.color = "rgba(255,255,255,0.6)";
        }
      }

    },

    pageBlockTreeNodeClick(data, node) {
      console.log("data111",window.cbcPageInstance.data.pageComponents);
      this.pageBlockComponents=[];
      for(let i=0;i<window.cbcPageInstance.data.pageComponents.length;i++){
        if(window.cbcPageInstance.data.pageComponents[i].page_block_ref==data.page_block_ref){
          this.pageBlockComponents.push(window.cbcPageInstance.data.pageComponents[i]);
        }
      }
    },

    findPageBlockTree() {
      let param = {};
      param.sql = "page_block_tree.find";
      param.page_id = this.$route.query.page_id;
      commonSelectRequest(axios, param, this.findPageBlockTreeCallBack);
    },
    findPageBlockTreeCallBack(result) {
      console.log("findPageBlockTree--result",result);
      this.pageBlockData=result.objects;
      for(var i=0;i<result.objects.length;i++){
        if(result.objects[i].page_block_config_str!=null && result.objects[i].page_block_config_str!=""){
          result.objects[i].page_block_config=eval("(" + result.objects[i].page_block_config_str + ")")
        }else{
          result.objects[i].page_block_config={};
        }
        if(result.objects[i].page_block_blue_script_config_str!=null && result.objects[i].page_block_blue_script_config_str!=""){
          result.objects[i].page_block_blue_script_config=eval("(" + result.objects[i].page_block_blue_script_config_str + ")")
        }else{
          result.objects[i].page_block_blue_script_config={};
        }

        if(result.objects[i].pid==null || result.objects[i].pid==''){
          this.pageBlockTreeNodeClick(result.objects[i],null);
          this.showExpandedArray.push(result.objects[i].id);
        }
      }
      this.pageBlockTreeData = getListData(result.objects, ["page_block_ref","page_id", "page_img", "page_block_config_str", "page_block_config","page_block_blue_script_config_str","page_block_blue_script_config"]);
      console.log("this.pageBlockTreeData22", this.pageBlockTreeData);
    }

  },
  mounted() {
    this.findPageBlockTree();
    window.cbcBlueScriptBlockTreeInstance=getCurrentInstance();
  }
}
</script>

<style scoped>


.componentItemClass:hover {
  transform: scale(1.15);
  cursor: pointer;
}

.blueScriptItemClass:hover {
  background-color: rgba(0, 0, 255, 0.2);
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
