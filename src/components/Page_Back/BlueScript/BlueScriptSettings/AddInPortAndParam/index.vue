<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">添加输入参数</span></el-divider>
    <div style="margin-top: 5px;color:rgba(255, 255, 255, 0.5);font-size: 14px">参数字段名：</div>
    <el-input v-model="paramInValue" style="width: 150px;padding-top: 10px"
              placeholder="输入参数字段名"/><br>
    <div style="margin-top: 5px;color:rgba(255, 255, 255, 0.5);font-size: 14px">参数字段类型：</div>
    <el-select v-model="paramType" class="m-2" style="width: 150px;padding-top: 10px" placeholder="Select">
      <el-option
          v-for="item in paramTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select><br>
    <el-button type="success" size="small" @click="addParamIn" style="margin-left: 50px;margin-top:10px">增加</el-button>

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
      paramInValue: '',
      paramType:'string',
      paramTypes : [
        {
          value: 'string',
          label: 'string',
        },
        {
          value: 'number',
          label: 'number',
        },
        {
          value: 'array',
          label: 'array',
        }
      ],
    }
  },

  created() {

  },
  watch: {

  },
  methods: {
    addParamIn() {
      if(this.paramInValue==""){
        return;
      }
      let obj={};
      obj.key=this.paramInValue;
      obj.label=this.paramInValue;
      obj.type=this.paramType;
      obj.connected=false;
      obj.portID='in_port_'+window.cbcuuid();
      if(this.paramType=="string"){
        obj.value="";
      }else if(this.paramType=="number"){
        obj.value=0;
      }else if(this.paramType=="array"){
        obj.value=[];
      }
      obj.show=true;
      this.currentBlueScript.config.in_out_config.in.push(obj);
      this.paramInValue = "";
      //新增蓝图节点端口
      this.currentBlueScript.node.addPort({
        key: obj.key,
        id: obj.portID,
        group: 'in',
        attrs: {
          text: {
            text: obj.label, // 标签文本
            fill: 'rgba(255,255,255,0.8)',
            fontSize: 12,    // 文字大小
          },
        },
      })
    },
  },
  mounted() {


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

</style>