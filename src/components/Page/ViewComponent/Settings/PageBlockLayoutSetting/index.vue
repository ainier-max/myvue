<template>
  <div style="width: 100%;height: 100%;">

    <div style="width: 100%;height: 30px;background: #000000;color:rgba(255,255,255,0.6);padding-top: 8px"
         align="center">
      布局组件配置
    </div>

    <div v-if="currentPageBlockLayout?.layout_config">
      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        布局组件Ref：
      </div>
      <el-input v-model="currentPageBlockLayout.layout_ref" disabled
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="布局组件Ref"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        布局组件名称：
      </div>
      <el-input v-model="currentPageBlockLayout.layout_name"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="布局组件名称"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        布局组件X坐标：
      </div>
      <el-input v-model="currentPageBlockLayout.layout_config.attr.xPer" @input="inputHandle($event,'x')"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="布局组件X坐标"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        布局组件Y坐标：
      </div>
      <el-input v-model="currentPageBlockLayout.layout_config.attr.yPer" @input="inputHandle($event,'y')"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="布局组件Y坐标"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        布局组件高度：<span>{{layoutComponentHegith}}px</span>
      </div>
      <el-input v-model="currentPageBlockLayout.layout_config.attr.hPer" @input="inputHandle($event,'h')"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="布局组件高度"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        布局组件宽度：<span>{{layoutComponentWidth}}px</span>
      </div>
      <el-input v-model="currentPageBlockLayout.layout_config.attr.wPer" @input="inputHandle($event,'w')"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="布局组件宽度"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        单位：
      </div>
      <el-input v-model="unit" disabled
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="单位"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        层级：
      </div>
      <el-input v-model="currentPageBlockLayout.layout_config.attr.zIndex" @input="inputHandle($event,'zIndex')"
                style="padding-top:5px;padding-left: 15px;padding-right: 15px" placeholder="布局组件层级"/>

      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        背景：
      </div>
      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 12px">
        颜色
        <el-switch
            v-model="currentPageBlockLayout.layout_config.attr.background.type"
            class="mb-2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-value="img"
            inactive-value="color"
        />
        图片
        <div></div>

        <div>
          <!--otherParam 会跟着子组件调用父组件的事件参数-->
          <ChooseImg v-if="currentPageBlockLayout.layout_config.attr.background.type=='img'" otherParam=""
                     :imgUUID="currentPageBlockLayout.layout_config.attr.background.value" @getNewImgUrl="getNewImgUrlByLayout"></ChooseImg>
          <el-color-picker v-if="currentPageBlockLayout.layout_config.attr.background.type=='color'"  v-model="currentPageBlockLayout.layout_config.attr.background.value" show-alpha />
        </div>
      </div>


      <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">
        <table>
          <tr>
            <td>
              区域分割：
            </td>
            <td style="padding-left: 5px">
              <CirclePlus style="color:#cc66cc;width: 2em; height: 2em;" @click="addSpan"/>
            </td>
          </tr>
        </table>
      </div>
      <div v-for="(item, index) in currentPageBlockLayout.layout_config.blocks_components">
        <div style="padding-left: 15px;margin-top: 10px;color:rgba(255, 255, 255, 0.5);font-size: 14px">

          <table>
            <tr>
              <td>
                区域（{{index+1}}）：
              </td>
              <td style="padding-left: 5px">
                <CircleClose style="color:red;width: 2em; height: 2em;" @click="deleteSpan(index)"/>
              </td>
            </tr>
          </table>
        </div>
        <el-input-number style="margin-top:5px;margin-left: 15px;margin-right: 15px" v-model='item.span' :min='0'
                         @change="numChange(item,index)"></el-input-number>
        <br>
        <el-button style="margin-top:5px;margin-left: 15px;" size="small" type="primary"
                   @click="choosePageBlockComponent(item,index)">前端组件
        </el-button>
        <el-button style="margin-top:5px;margin-left: 15px;" size="small" type="primary"
                   @click="chooseBuiltInComponent(item,index)">内置组件
        </el-button>
        <el-button style="margin-top:5px;margin-left: 10px;" size="small" type="primary"
                   @click="choosePageLayout(item,index)">布局组件
        </el-button>
        <el-button style="margin-top:5px;margin-left: 10px;" size="small" type="primary"
                   @click="choosePageBlock(item,index)">页面块
        </el-button>

        <br>


        <el-collapse  v-model="activeNames"  style="margin-top:5px;margin-left: 15px;margin-right: 15px">
          <el-collapse-item v-if="item?.background" title="背景" :name="index+'-background'">
              颜色
              <el-switch
                  v-model="item.background.type"
                  class="mb-2"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                  active-value="img"
                  inactive-value="color"
              />
              图片
              <div></div>

            <div>
              <!--otherParam 会跟着子组件调用父组件的事件参数-->
              <ChooseImg v-if="item.background.type=='img'" :otherParam="index"
                         :imgUUID="item.background.value"  @getNewImgUrl="getNewImgUrlByLayoutComponent"></ChooseImg>
              <el-color-picker v-if="item.background.type=='color'"  v-model="item.background.value" show-alpha />
            </div>


          </el-collapse-item>

          <el-collapse-item v-if="item?.padding" title="内边距padding" :name="item.ref+'-padding'">
            px
            <el-switch
                v-model="item.padding.unit"
                class="mb-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-value="%"
                inactive-value="px"
            />
            %
            <br>

            上：<el-input-number size="small" style="margin-top:5px;margin-left: 5px;margin-right: 5px" v-model='item.padding.top'
                               @change="paddingChange(item,index,'top')"></el-input-number>
            <br>
            右：<el-input-number size="small"  style="margin-top:5px;margin-left: 5px;margin-right: 5px" v-model='item.padding.right'
                               @change="paddingChange(item,index,'right')"></el-input-number>
            <br>
            下：<el-input-number size="small"  style="margin-top:5px;margin-left: 5px;margin-right: 5px" v-model='item.padding.bottom'
                               @change="paddingChange(item,index,'bottom')"></el-input-number>
            <br>
            左：<el-input-number size="small" style="margin-top:5px;margin-left: 5px;margin-right: 5px" v-model='item.padding.left'
                               @change="paddingChange(item,index,'left')"></el-input-number>

          </el-collapse-item>
          <el-collapse-item v-if="item?.margin" title="外边距margin" :name="item.ref+'-margin'">
            px
            <el-switch
                v-model="item.margin.unit"
                class="mb-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-value="%"
                inactive-value="px"
            />
            %
            <br>
            上：<el-input-number size="small" style="margin-top:5px;margin-left: 5px;margin-right: 5px" v-model='item.margin.top'
                               @change="marginChange(item,index,'top')"></el-input-number>
            <br>
            右：<el-input-number size="small"  style="margin-top:5px;margin-left: 5px;margin-right: 5px" v-model='item.margin.right'
                               @change="marginChange(item,index,'right')"></el-input-number>
            <br>
            下：<el-input-number size="small"  style="margin-top:5px;margin-left: 5px;margin-right: 5px" v-model='item.margin.bottom'
                               @change="marginChange(item,index,'bottom')"></el-input-number>
            <br>
            左：<el-input-number size="small" style="margin-top:5px;margin-left: 5px;margin-right: 5px" v-model='item.margin.left'
                               @change="marginChange(item,index,'left')"></el-input-number>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div style="height: 50px"></div>


    </div>


    <el-dialog
        v-model="showPageBlockComponentDialogFlag"
        title="组件选择"
        append-to-body
        :draggable="true"
        width="60%"
        top="10vh"
        style="height: 550px;"
        @opened="pageBlockComponentDialogOpenedHandle">
      <FrontEndComponentChoose ref="componentChooseRef" @getFrontEndComponent="getFrontEndComponent"></FrontEndComponentChoose>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="pageBlockComponentDialogCloseHandle">
          确 定
        </el-button>
      </span>
      </template>
    </el-dialog>

    <el-dialog
        v-model="showBuiltInComponentDialogFlag"
        title="内置组件选择"
        append-to-body
        :draggable="true"
        width="40%"
        top="10vh"
        style="height: 300px;"
        @opened="pageBlockComponentDialogOpenedHandle">

      <BuiltInComponentChoose @getBuildInComponent="getBuildInComponent"></BuiltInComponentChoose>

    </el-dialog>



    <el-dialog
        v-model="showPageBlockDialogFlag"
        title="页面块选择"
        append-to-body
        :draggable="true"
        width="60%"
        top="10vh"
        style="height: 550px;"
        @opened="pageBlockDialogOpenedHandle">

      <PageBlockChoose ref="pageBlockChooseRef" @getPageBlock="getPageBlock"></PageBlockChoose>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="pageBlockComfirm">
          确 定
        </el-button>
      </span>
      </template>
    </el-dialog>


    <el-dialog
        v-model="showPageLayoutDialogFlag"
        title="布局组件选择"
        append-to-body
        :draggable="true"
        width="60%"
        top="10vh"
        @opened="pageBlockDialogOpenedHandle">

      <PageLayoutChoose ref="pageLayoutChooseRef" @getPageLayout="getPageLayout"></PageLayoutChoose>

      <template #footer>
        <!--
      <span class="dialog-footer">
        <el-button type="primary" @click="pageLayoutComfirm">
          确 定
        </el-button>
      </span>
      -->
      </template>
    </el-dialog>


  </div>

</template>

<script>
import FrontEndComponentChoose from "./FrontEndComponentChoose/index.vue";
import BuiltInComponentChoose from "./BuiltInComponentChoose/index.vue";
import PageBlockChoose from "./PageBlockChoose/index.vue";
import PageLayoutChoose from "./PageLayoutChoose/index.vue";
import {uuid} from "../../../../../common/js/uuid";
import ChooseImg from "../../../../../common/component/ChooseImg/index.vue";

export default {
  props: {
    currentPageBlockLayout: {
      type: Object,
      default: null
    },
  },
  data: function () {
    return {
      unit: '%',
      showPageBlockComponentDialogFlag: false,
      showBuiltInComponentDialogFlag:false,
      indexFlag: 0,
      showPageBlockDialogFlag:false,
      showPageLayoutDialogFlag:false,
      activeNames:1
    }

  },
  computed: {
    "layoutComponentHegith"() {
      let layoutComponentHegithTemp=  window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.height*this.currentPageBlockLayout.layout_config.attr.hPer/100;
      return layoutComponentHegithTemp;
    },
    "layoutComponentWidth"(){
      let layoutComponentWidthTemp=  window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.width*this.currentPageBlockLayout.layout_config.attr.wPer/100;
      return layoutComponentWidthTemp;
    }
  },

  created() {

  },
  components: {
    FrontEndComponentChoose: FrontEndComponentChoose,
    PageBlockChoose:PageBlockChoose,
    PageLayoutChoose:PageLayoutChoose,
    BuiltInComponentChoose:BuiltInComponentChoose,
    ChooseImg:ChooseImg
  },
  methods: {
    getNewImgUrlByLayout(imgUUID,otherParam){
      console.log("getNewImgUrlByLayout--imgUUID,otherParam",imgUUID,otherParam);
      this.currentPageBlockLayout.layout_config.attr.background.value=imgUUID;
    },
    getNewImgUrlByLayoutComponent(imgUUID,otherParam){
      console.log("getNewImgUrlByLayoutComponent--imgUUID,otherParam",imgUUID,otherParam);
      this.currentPageBlockLayout.layout_config.blocks_components[otherParam].background.value=imgUUID;
    },

    paddingChange(item,index,type){
      console.log("paddingChange--item,index,type：",item,index,type);


    },
    marginChange(item,index,type){
      console.log("marginChange--item,index,type：",item,index,type);

    },

    inputHandle(value,type){
      console.log("currentPageBlock11",window.cbcPageInstance.data.currentPageBlock);
      console.log("event",value,type);
      if(type=="x"){
        this.currentPageBlockLayout.layout_config.attr.x=window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.width*(value)/100;
      }else if(type=="y"){
        this.currentPageBlockLayout.layout_config.attr.y=window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.height*(value)/100;
        console.log("onDrag-y布局组件Y坐标：",this.currentPageBlockLayout.layout_config.attr.y);
      }else if(type=="w"){
        this.currentPageBlockLayout.layout_config.attr.w=window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.width*(value)/100;
      }else if(type=="h"){
        this.currentPageBlockLayout.layout_config.attr.h=window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.height*(value)/100;
        console.log("onDrag-y布局组件高度1：",this.currentPageBlockLayout.layout_config.attr.h);
      }

     this.refreshLayout();
    },

    getPageBlock(pageBlockInfo){
      //console.log("pageBlockInfo",pageBlockInfo);
      this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].ref = pageBlockInfo.page_block_ref;
      this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].type = "block";
      console.log("this.currentPageBlockLayout：", this.currentPageBlockLayout);
      this.showPageBlockDialogFlag = false;
    },
    getPageLayout(type,layoutUUID){
      console.log("加入类型:",type,layoutUUID);
      console.log("getPageLayout--this.indexFlag",this.indexFlag);
      this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].ref = layoutUUID
      this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].type = "layout";
      this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].layout_type = type;
      this.showPageLayoutDialogFlag = false;
    },


    choosePageBlock(item, index){
      this.indexFlag = index;
      this.showPageBlockDialogFlag=true;
    },
    choosePageLayout(item,index){
      this.indexFlag = index;
      this.showPageLayoutDialogFlag=true;
    },
    pageBlockComfirm(){
      this.$refs.pageBlockChooseRef.getCheckNode();
    },
    pageLayoutComfirm(){

    },
    pageBlockDialogOpenedHandle(){

    },

    refreshLayout(){
      window.cbcViewDraggleResizableInstance.ctx.refreshLayout(this.currentPageBlockLayout);
    },

    addSpan(){
      //console.log("span123",this.currentPageBlockLayout.layout_config.blocks_components);
      let obj={};
      obj.span=10;
      obj.padding={};
      obj.padding.top=0;
      obj.padding.bottom=0;
      obj.padding.left=0;
      obj.padding.right=0;

      obj.margin={};
      obj.margin.top=0;
      obj.margin.bottom=0;
      obj.margin.left=0;
      obj.margin.right=0;

      obj.background={};
      obj.background.type="img";
      obj.background.value="";

      this.currentPageBlockLayout.layout_config.blocks_components.push(obj);
      this.refreshLayout();
    },
    deleteSpan(index){
      this.currentPageBlockLayout.layout_config.blocks_components.splice(index,1);
      this.refreshLayout();
    },
    numChange() {
      this.refreshLayout();
    },
    choosePageBlockComponent(item, index) {
      console.log("index111：", index);
      this.indexFlag = index;
      this.showPageBlockComponentDialogFlag = true;
    },
    chooseBuiltInComponent(item, index){
      console.log("index111：", index);
      this.indexFlag = index;
      this.showBuiltInComponentDialogFlag=true;
    },
    getBuildInComponent(param){
      console.log("setBuildInComponent--param",param);

      let componentRefTemp = this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].ref
      if (typeof (componentRefTemp) != "undefined" && componentRefTemp != "") {
        for (let i = 0; i < window.cbcPageInstance.data.pageComponents.length; i++) {
          if (window.cbcPageInstance.data.pageComponents[i].component_ref == componentRefTemp) {
            window.cbcPageInstance.data.pageComponents.splice(i, 1);
            i = i - 1;
          }
        }
      }

      console.log("setBuildInComponent--component:",this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag]);

      let component_ref="buildIncomponentRef-" + uuid();
      let type="buildInComponent";
      this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].ref =component_ref;
      this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].type = type;
      this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].name = param.type;
      console.log("setBuildInComponent--this.currentPageBlockLayout：", this.currentPageBlockLayout);

      let obj={};
      obj.component_name = param.name;
      obj.component_id=param.type;
      obj.type = type;
      obj.page_block_ref = window.cbcPageInstance.data.currentPageBlock.page_block_ref;
      obj.layout_ref = window.cbcPageInstance.data.currentPageBlockLayout.layout_ref;
      obj.page_id = this.$route.query.page_id;
      obj.component_ref = component_ref;
      obj.component_config = param.option.default.devOption;
      console.log("setBuildInComponent--obj",obj);
      window.cbcPageInstance.data.pageComponents.push(obj);
      this.showBuiltInComponentDialogFlag=false;

    },
    BuiltInComponentDialogCloseHandle(){

    },

    pageBlockComponentDialogOpenedHandle() {

    },
    pageBlockComponentDialogCloseHandle() {
      this.$refs.componentChooseRef.getCheckNode();
    },


    getFrontEndComponent(componentInfo) {
      console.log("getFrontEndComponent--componentInfo", componentInfo);
      let componentRefTemp = this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].ref
      if (typeof (componentRefTemp) != "undefined" && componentRefTemp != "") {
        for (let i = 0; i < window.cbcPageInstance.data.pageComponents.length; i++) {
          if (window.cbcPageInstance.data.pageComponents[i].component_ref == componentRefTemp) {
            window.cbcPageInstance.data.pageComponents.splice(i, 1);
            i = i - 1;
          }
        }
        //列表组件替换成新的组件
        for (let i = 0; i < window.cbcBlockTreeInstance.data.pageBlockComponents.length; i++) {
          if (window.cbcBlockTreeInstance.data.pageBlockComponents[i].component_ref == componentRefTemp) {
            window.cbcBlockTreeInstance.data.pageBlockComponents[i]=componentInfo;
          }
        }

      }
      this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].ref = componentInfo.component_ref;
      this.currentPageBlockLayout.layout_config.blocks_components[this.indexFlag].type = "frontEndComponent";
      console.log("this.currentPageBlockLayout：", this.currentPageBlockLayout);
      this.showPageBlockComponentDialogFlag = false;
    },
  },
  mounted() {
    //padding赋值
    for(let i=0;i<this.currentPageBlockLayout.layout_config.blocks_components.length;i++){
      if(typeof (this.currentPageBlockLayout.layout_config.blocks_components[i].padding)=="undefined"){
        this.currentPageBlockLayout.layout_config.blocks_components[i].padding={};
        this.currentPageBlockLayout.layout_config.blocks_components[i].padding.top=0;
        this.currentPageBlockLayout.layout_config.blocks_components[i].padding.bottom=0;
        this.currentPageBlockLayout.layout_config.blocks_components[i].padding.left=0;
        this.currentPageBlockLayout.layout_config.blocks_components[i].padding.right=0;
      }
      if(typeof (this.currentPageBlockLayout.layout_config.blocks_components[i].margin)=="undefined"){
        this.currentPageBlockLayout.layout_config.blocks_components[i].margin={};
        this.currentPageBlockLayout.layout_config.blocks_components[i].margin.top=0;
        this.currentPageBlockLayout.layout_config.blocks_components[i].margin.bottom=0;
        this.currentPageBlockLayout.layout_config.blocks_components[i].margin.left=0;
        this.currentPageBlockLayout.layout_config.blocks_components[i].margin.right=0;
      }
    }

    console.log("PageBlockLayoutSetting--this.currentPageBlockLayout：", this.currentPageBlockLayout);

    //this.layoutComponentWidth = window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.width*this.currentPageBlockLayout.layout_config.attr.wPer/100;
    //this.layoutComponentHegith = window.cbcPageInstance.data.currentPageBlock.page_block_config.attr.height*this.currentPageBlockLayout.layout_config.attr.hPer/100;

  }
}
</script>

<style scoped>
.el-collapse {
   --el-collapse-border-color: #222629;
}

:deep(.el-collapse-item__header) {
  padding-left: 10px;
  display: flex;
  align-items: center;
  height: var(--el-collapse-header-height);
  line-height: var(--el-collapse-header-height);
  background-color: #222629;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  border-bottom: 1px solid #222629;
  font-size: var(--el-collapse-header-font-size);
  font-weight: 500;
  transition: border-bottom-color var(--el-transition-duration);
  outline: 0;
}
:deep(.el-collapse-item__content) {
  padding-left: 10px;
  font-size: var(--el-collapse-content-font-size);
  color: rgba(255,255,255,0.6);
  line-height: 1.7692307692;
  background: rgb(40, 44, 52);
}


:deep(.el-input__wrapper) {
  background-color: #222629;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #222629;
  box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
}

:deep(.el-input) {
  --el-input-border-color: #5B5C5E;
}

:deep(.el-input-number__increase) {
  background: #222629;
  border-left: 1px solid #5B5C5E;
}

:deep(.el-input-number__decrease) {
  background: #222629;
  border-right: 1px solid #5B5C5E;
}
</style>