<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">输入参数</span></el-divider>
    <div v-for="(item,index) in currentBlueScript.config.in_out_config.in" :key="index">
      <div style="margin-top: 5px;color:rgba(255, 255, 255, 0.5);font-size: 14px">{{ index + 1 }}.{{
          item.label
        }}({{ item.type }})
      </div>
      <el-switch
          v-model="item.show"
          size="large"
          active-text="开"
          inactive-text="关"
          @change="handleChange($event,item)"
      />

      <div v-if="item.type=='object'">
        <table>
          <tr>
            <td>
              <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag!=true" disabled :value="JSON.stringify(item.value)" style="width: 280px;" placeholder=""/>
              <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag==true" disabled :value="item.value.noSaveDescribe" style="width: 280px;" placeholder="12"/>
              <el-input v-if="typeof(item.value)=='number' || typeof(item.value)=='string'" disabled :value="item.value" style="width: 280px;" placeholder=""/>

            </td>
          </tr>
        </table>
      </div>

      <div v-if="item.type=='boolean'">
        <table>
          <tr>
            <td>
              <el-input v-if="typeof(item.value)=='object'" disabled type="textarea" :value="JSON.stringify(item.value)" style="width: 280px;" placeholder=""/>
              <el-input v-if="typeof(item.value)!='object'" disabled :value="item.value" style="width: 280px;" placeholder=""/>
            </td>
          </tr>
        </table>
      </div>

      <div v-if="item.type=='string'">
        <table>
          <tr>
            <td>
              <el-input v-model="item.value" style="width: 280px;" placeholder=""/>
            </td>
            <td style="padding-left: 5px">
              <CircleClose style="color:red;width: 2em; height: 2em;" @click="deleteParamIn(item.key)"/>
            </td>
          </tr>
        </table>
      </div>

      <div v-if="item.type=='textarea'">
        <table>
          <tr>
            <td>
              <el-input v-model="item.value" style="width: 280px;" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" placeholder=""/>
            </td>
          </tr>
        </table>
      </div>

      <div v-if="item.type=='number'">
        <table>
          <tr>
            <td>
              <el-input v-model="item.value" style="width: 280px;" placeholder=""/>
            </td>
            <td style="padding-left: 5px">
              <CircleClose style="color:red;width: 2em; height: 2em;" @click="deleteParamIn(item.key)"/>
            </td>
          </tr>
        </table>
      </div>
      <div v-if="item.type=='array'">
        <el-input type="textarea" disabled :value="JSON.stringify(item.value)" style="width: 280px;" placeholder=""/>
        <!--
        <el-table
            :data="sqlDataResult"
            border
            stripe
            style="width: 100%;margin-top: 5px"
            id="table">
          <el-table-column
              v-for="field in sqlDataFields"
              :label="field"
              :key="field"
              :prop="field"
              :show-overflow-tooltip="true"
          >
          </el-table-column>
        </el-table>
        -->
      </div>
      <div v-if="item.type=='event'">
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag!=true" disabled :value="JSON.stringify(item.value)" style="width: 280px;" placeholder=""/>
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag==true" disabled :value="item.value.noSaveDescribe" style="width: 280px;" placeholder="12"/>
        <el-input v-if="typeof(item.value)!='object'" disabled :value="item.value" style="width: 280px;" placeholder=""/>
      </div>

      <div v-if="item.type=='function'">
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag!=true" disabled :value="JSON.stringify(item.value)" style="width: 280px;" placeholder=""/>
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag==true" disabled :value="item.value.noSaveDescribe" style="width: 280px;" placeholder="12"/>
        <el-input v-if="typeof(item.value)!='object'" disabled :value="item.value" style="width: 280px;" placeholder=""/>
      </div>

      <!--不确定输出类型-->
      <div v-if="item.show==true && item.type=='doubtful' ">
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag!=true" disabled :value="JSON.stringify(item.value)" style="width: 280px;" placeholder=""/>
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag==true" disabled :value="item.value.noSaveDescribe" style="width: 280px;" placeholder="12"/>
        <el-input v-if="typeof(item.value)=='number' || typeof(item.value)=='string'" disabled :value="item.value" style="width: 280px;" placeholder=""/>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  props: {
    currentBlueScript: {
      type: Object,
      default: {}
    },
  },
  data: function () {
    return {
      sqlDataResult: [],
      sqlDataFields: []
    }
  },

  created() {

  },
  watch: {},
  methods: {
    handleChange(event,item){
      console.log("handleChange--event",event);
      console.log("handleChange--item",item);
      if(event==false){
        this.currentBlueScript.node.removePort(item.portID);
      }else{
        this.currentBlueScript.node.addPort({
          key: item.key,
          id: item.portID,
          group: 'in',
          markup: [
            {
              tagName: 'rect',
              selector: 'rect',
            },
          ],
          attrs: {
            rect: {
              magnet: true,
              stroke: '#31d0c6',
              fill: '#ffffff',
              strokeWidth: 2,
              width: 10,
              height: 10,
              x: -5,
              y: -5,
            },
            text: {
              text: item.label, // 标签文本
              fill: 'rgba(255,255,255,0.8)',
              fontSize: 12,    // 文字大小
            },
          },
        })
      }
    },
    setTableData() {
      if(typeof (this.currentBlueScript.config.dataSet)!="undefined" && typeof (this.currentBlueScript.config.dataSet.data)!="undefined" ){
        this.sqlDataResult = this.currentBlueScript.config.dataSet.data;
        this.sqlDataFields=[];
        if(this.sqlDataResult.length>0){
          let objTemp=this.sqlDataResult[0];
          for(let key in objTemp){
            this.sqlDataFields.push(key);
          }
        }
      }
    },
    deleteParamIn(key) {
      for (let i = 0; i < this.currentBlueScript.config.in_out_config.in.length; i++) {
        if (key == this.currentBlueScript.config.in_out_config.in[i].key) {
          //删除蓝图节点端口
          console.log("this.currentBlueScript.config.in_out_config.in[i]delete;", this.currentBlueScript.config.in_out_config.in[i]);
          this.currentBlueScript.node.removePort(this.currentBlueScript.config.in_out_config.in[i].portID);
          this.currentBlueScript.config.in_out_config.in.splice(i, 1);
          i = i - 1;
        }
      }
    },
  },
  mounted() {
    console.log("ShowInParam--this.currentBlueScript:", this.currentBlueScript);
    //this.setTableData();
  }
}
</script>

<style scoped>
:deep(.el-divider__text) {
  position: absolute;
  background-color: rgb(40, 44, 52);
  padding: 0 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

:deep(.el-switch__label) {
  transition: var(--el-transition-duration-fast);
  height: 20px;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  vertical-align: middle;
  color: rgba(255, 255, 255, 0.5);
}
</style>