<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">输出参数</span></el-divider>
    <div v-for="(item,index) in currentBlueScript.config.in_out_config.out" :key="index">
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

        <!--输出参数的格式为array时,用表格展示数据-->
      <div v-if="item.type=='array'">
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag!=true" disabled :value="JSON.stringify(item.value)" style="width: 280px;" placeholder=""/>
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag==true" disabled :value="item.value.noSaveDescribe"  style="width: 280px;" placeholder=""/>
        <el-input v-if="typeof(item.value)=='number' || typeof(item.value)=='string'" disabled :value="item.value" style="width: 280px;" placeholder=""/>

      </div>

      <div v-if="item.type=='string'">
        <el-input v-model="item.value" style="width: 280px;" placeholder=""/>
      </div>


      <div v-if="item.show==true && item.type=='event' ">
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag!=true" disabled :value="JSON.stringify(item.value)" style="width: 280px;" placeholder=""/>
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag==true" disabled :value="item.value.noSaveDescribe" style="width: 280px;" placeholder="12"/>
        <el-input v-if="typeof(item.value)!='object'" disabled :value="item.value" style="width: 280px;" placeholder=""/>
      </div>

      <div v-if="item.show==true && item.type=='object' ">
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag!=true" disabled :value="JSON.stringify(item.value)" style="width: 280px;" placeholder=""/>
        <el-input type="textarea" v-if="typeof(item.value)=='object' && item.value!=null && item.value.noSaveFlag==true" disabled :value="item.value.noSaveDescribe" style="width: 280px;" placeholder="12"/>
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
          group: 'out',
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
      this.sqlDataResult = [];
      this.sqlDataFields = [];
      if(typeof (this.currentBlueScript.config.in_out_config.out)!="undefined"){
        for (let i = 0; i < this.currentBlueScript.config.in_out_config.out.length; i++) {
          if (this.currentBlueScript.config.in_out_config.out[i].type == "array") {
            console.log("this.currentBlueScript1111",this.currentBlueScript);
            let result = this.currentBlueScript.config.in_out_config.out[i].value;
            if(typeof(result)=="undefined"){
              result=[];
            }
            if (result.length > 0) {
              Object.keys(result[0]).map((key, item) => {
                this.sqlDataFields.push(key);
              });
            }
            this.sqlDataResult = result;
          }
        }
      }else{
        //console.log("currentBlueScript",this.currentBlueScript);
        console.error(this.currentBlueScript.name+",该蓝图无输出参数配置，请去除！");
      }

    },
  },
  mounted() {
    //this.setTableData();
    console.log("ShowOutParam--this.currentBlueScript：",this.currentBlueScript);

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